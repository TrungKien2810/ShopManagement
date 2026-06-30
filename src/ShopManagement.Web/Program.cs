using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using ShopManagement.Application.Interfaces;
using ShopManagement.Application.Services;
using ShopManagement.Domain.Entities;
using ShopManagement.Infrastructure.Authorization;
using ShopManagement.Infrastructure.Data;
using ShopManagement.Infrastructure.Hubs;
using ShopManagement.Infrastructure.Identity;
using ShopManagement.Infrastructure.Repositories;
using ShopManagement.Infrastructure.Services;
using ShopManagement.Infrastructure.Settings;

var builder = WebApplication.CreateBuilder(args);

// 1. Database
builder.Services.AddDbContext<AppDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    options.UseSqlServer(connectionString);
});

// 2. Unit of Work
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

// 3. Application services
builder.Services.AddScoped<IPhotoService, PhotoService>();
builder.Services.AddScoped<ITableService, TableService>();
builder.Services.AddScoped<IMenuService, MenuService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IPaymentService, PaymentService>();
builder.Services.AddScoped<IReportService, ReportService>();
builder.Services.AddScoped<ITenantService, TenantService>();
builder.Services.AddScoped<IShopNotificationService, ShopNotificationService>();
builder.Services.AddHttpContextAccessor();

// 4. Identity + Cookie Auth (server-rendered MVC, no JWT needed)
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.Password.RequireDigit = false;
    options.Password.RequiredLength = 4;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireLowercase = false;
})
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

builder.Services.ConfigureApplicationCookie(options =>
{
    options.LoginPath = "/Account/Login";
    options.LogoutPath = "/Account/Logout";
    options.AccessDeniedPath = "/Account/AccessDenied";
    options.ExpireTimeSpan = TimeSpan.FromDays(14);
    options.SlidingExpiration = true;
});

builder.Services.AddScoped<IAuthorizationHandler, ShopRoleHandler>();
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("RequireOwner", policy => policy.Requirements.Add(new ShopRoleRequirement(ShopRole.Owner)));
    options.AddPolicy("RequireManager", policy => policy.Requirements.Add(new ShopRoleRequirement(ShopRole.Manager)));
    options.AddPolicy("RequireStaff", policy => policy.Requirements.Add(new ShopRoleRequirement(ShopRole.Staff)));
});

// 5. Session (stores currently-selected ShopId/BranchId for tenant switching)
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromHours(8);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

// 6. MVC + SignalR (require auth by default; [AllowAnonymous] opts out per action)
builder.Services.AddControllersWithViews(options =>
{
    options.Filters.Add(new Microsoft.AspNetCore.Mvc.Authorization.AuthorizeFilter());
});
builder.Services.AddSignalR();

// 7. Cloudinary
builder.Services.Configure<CloudinarySettings>(builder.Configuration.GetSection("Cloudinary"));

var app = builder.Build();

// Migration & Seed Data
try
{
    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;
        var context = services.GetRequiredService<AppDbContext>();

        Console.WriteLine("[STARTUP] Starting Database Initialization...");

        await context.Database.MigrateAsync();
        Console.WriteLine("[STARTUP] Migrations applied successfully.");

        var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
        Console.WriteLine("[STARTUP] Starting Seed...");
        await ShopManagement.Infrastructure.Seed.DbInitializer.SeedAsync(context, userManager, roleManager);
        Console.WriteLine("[STARTUP] Seeding completed.");
    }
}
catch (Exception ex)
{
    Console.WriteLine($"[CRITICAL STARTUP ERROR]: {ex.Message}");
    if (ex.InnerException != null) Console.WriteLine($"[INNER]: {ex.InnerException.Message}");
}

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
}

app.UseStaticFiles(new StaticFileOptions
{
    OnPrepareResponse = ctx =>
    {
        if (ctx.File.Name.StartsWith("stitch-", StringComparison.OrdinalIgnoreCase))
            ctx.Context.Response.StatusCode = 404;
    }
});
app.UseRouting();

app.UseSession();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.MapHub<ShopHub>("/hubs/shop");

app.Run();
