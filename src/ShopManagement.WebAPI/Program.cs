using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using ShopManagement.Application.Interfaces;
using ShopManagement.Application.Services;
using ShopManagement.Domain.Entities;
using ShopManagement.Infrastructure.Data;
using ShopManagement.Infrastructure.Identity;
using ShopManagement.Infrastructure.Repositories;
using ShopManagement.Infrastructure.Services;
using ShopManagement.Infrastructure.Hubs;
using Microsoft.AspNetCore.Authorization;
using ShopManagement.Infrastructure.Authorization;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Data.SqlClient;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// 1. Đăng ký Database Context
builder.Services.AddDbContext<AppDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    options.UseSqlServer(connectionString);
});

// 2. Đăng ký Unit of Work & Repositories
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

// 3. Đăng ký Services (Application Layer)
builder.Services.AddScoped<ITableService, TableService>();
builder.Services.AddScoped<IMenuService, MenuService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<ITenantService, TenantService>();
builder.Services.AddScoped<IShopNotificationService, ShopNotificationService>();
builder.Services.AddHttpContextAccessor();

// Identity & Auth
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

var jwtKey = builder.Configuration["Jwt:Key"] ?? "ZoOS_SuperSecretKey_SaaS_2026_MVP_kingqn132!";
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"] ?? "ZoOS-API",
        ValidAudience = builder.Configuration["Jwt:Audience"] ?? "ZoOS-Client",
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
    };
});

builder.Services.AddScoped<IAuthorizationHandler, ShopRoleHandler>();
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("RequireOwner", policy => policy.Requirements.Add(new ShopRoleRequirement(ShopRole.Owner)));
    options.AddPolicy("RequireManager", policy => policy.Requirements.Add(new ShopRoleRequirement(ShopRole.Manager)));
    options.AddPolicy("RequireStaff", policy => policy.Requirements.Add(new ShopRoleRequirement(ShopRole.Staff)));
});

// 4. Cấu hình CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:5174")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddSignalR();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo 
    { 
        Title = "ZôOS ShopManagement API", 
        Version = "v1",
        Description = "Hệ thống quản lý nhà hàng thông minh ZôOS"
    });
});

var app = builder.Build();

// Migration & Seed Data
try 
{
    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;
        var context = services.GetRequiredService<ShopManagement.Infrastructure.Data.AppDbContext>();
        
        Console.WriteLine("[STARTUP] Starting Database Initialization...");
        
        var connectionString = context.Database.GetDbConnection().ConnectionString;
        Console.WriteLine($"[DIAGNOSTIC] Connection String: {connectionString}");

        // CÁCH MỚI: Ép buộc tạo bảng nếu DB đã tồn tại nhưng trống
        var databaseCreator = context.Database.GetService<IRelationalDatabaseCreator>();
        if (!await databaseCreator.ExistsAsync()) await databaseCreator.CreateAsync();
        try 
        {
            await databaseCreator.CreateTablesAsync();
            Console.WriteLine("[STARTUP] Schema created successfully.");
        }
        catch (SqlException)
        {
            Console.WriteLine("[STARTUP] Schema already exists.");
        }

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

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowReactApp");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapHub<ShopHub>("/hubs/shop").RequireCors("AllowReactApp");
app.MapGet("/", () => Results.Redirect("/swagger"));

app.Run();
