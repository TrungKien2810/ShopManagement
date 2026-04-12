using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ShopManagement.Infrastructure.Identity;
using ShopManagement.Domain.Entities;
using ShopManagement.Infrastructure.Data;

namespace ShopManagement.Infrastructure.Seed;

public static class DbInitializer
{
    public static async Task SeedAsync(AppDbContext context, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
    {
        try
        {
            // 1. Seed Roles
            var roles = new[] { "Admin", "Staff" };
            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole(role));
                }
            }

            // 2. Seed Admin User
            var adminEmail = "admin@zoos.vn";
            var adminUser = await userManager.FindByEmailAsync(adminEmail);
            if (adminUser == null)
            {
                adminUser = new ApplicationUser
                {
                    UserName = adminEmail,
                    Email = adminEmail,
                    FullName = "ZôOS Admin",
                    EmailConfirmed = true
                };
                var result = await userManager.CreateAsync(adminUser, "Zoos@12345");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(adminUser, "Admin");
                }
            }

            // 3. Seed Shop
            var shopId = Guid.Parse("11111111-1111-1111-1111-111111111111");
            var shop = await context.Shops.FindAsync(shopId);
            if (shop == null)
            {
                shop = new Shop
                {
                    Id = shopId,
                    Name = "Quán Nhậu Tình Anh Em",
                    Address = "123 Đường Láng, Hà Nội",
                    OwnerId = adminUser.Id
                };
                await context.Shops.AddAsync(shop);
                await context.SaveChangesAsync();

                // 4. Seed Tables
                var tables = new List<Table>
                {
                    new Table { Id = Guid.NewGuid(), ShopId = shop.Id, Name = "Bàn 01", Capacity = 4, Location = "Khu A" },
                    new Table { Id = Guid.NewGuid(), ShopId = shop.Id, Name = "Bàn 02", Capacity = 6, Location = "Khu A" },
                    new Table { Id = Guid.NewGuid(), ShopId = shop.Id, Name = "Bàn 03", Capacity = 10, Location = "VIP-01" },
                    new Table { Id = Guid.NewGuid(), ShopId = shop.Id, Name = "Bàn 04", Capacity = 4, Location = "Khu B" }
                };
                await context.Tables.AddRangeAsync(tables);
                await context.SaveChangesAsync();
            }

            // 5. Seed Categories & Products
            if (!await context.Categories.AnyAsync())
            {
                var categories = new List<Category>
                {
                    new Category { Id = Guid.NewGuid(), ShopId = shopId, Name = "Món Khai Vị" },
                    new Category { Id = Guid.NewGuid(), ShopId = shopId, Name = "Món Chính" },
                    new Category { Id = Guid.NewGuid(), ShopId = shopId, Name = "Đồ Uống" }
                };
                await context.Categories.AddRangeAsync(categories);

                var products = new List<Product>
                {
                    new Product { Id = Guid.NewGuid(), ShopId = shopId, CategoryId = categories[0].Id, Name = "Đậu Phộng Rang Muối", Price = 25000, Description = "Món nhắm kinh điển" },
                    new Product { Id = Guid.NewGuid(), ShopId = shopId, CategoryId = categories[1].Id, Name = "Lẩu Thái Hải Sản", Price = 299000 },
                    new Product { Id = Guid.NewGuid(), ShopId = shopId, CategoryId = categories[2].Id, Name = "Bia Tiger (Lon)", Price = 22000 }
                };
                await context.Products.AddRangeAsync(products);
                await context.SaveChangesAsync();
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[SEED ERROR]: {ex.Message}");
            if (ex.InnerException != null) Console.WriteLine($"[INNER]: {ex.InnerException.Message}");
            throw;
        }
    }
}
