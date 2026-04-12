using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ShopManagement.Application.Interfaces;
using ShopManagement.Domain.Entities;
using ShopManagement.Infrastructure.Identity;

namespace ShopManagement.Infrastructure.Data;

public class AppDbContext : IdentityDbContext<ApplicationUser>
{
    private readonly ITenantService? _tenantService;

    public AppDbContext(DbContextOptions<AppDbContext> options, ITenantService? tenantService = null) : base(options)
    {
        _tenantService = tenantService;
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.ConfigureWarnings(warnings => warnings.Ignore(Microsoft.EntityFrameworkCore.Diagnostics.RelationalEventId.PendingModelChangesWarning));
    }

    public DbSet<Shop> Shops { get; set; } = null!;
    public DbSet<ShopMember> ShopMembers { get; set; } = null!;
    public DbSet<Category> Categories { get; set; } = null!;
    public DbSet<Product> Products { get; set; } = null!;
    public DbSet<Table> Tables { get; set; } = null!;
    public DbSet<Order> Orders { get; set; } = null!;
    public DbSet<OrderItem> OrderItems { get; set; } = null!;
    public DbSet<AuditLog> AuditLogs { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // 1. Cấu hình Category
        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
        });

        // 2. Cấu hình Product
        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Price).HasColumnType("decimal(18,2)");

            entity.HasOne(p => p.Category)
                  .WithMany(c => c.Products)
                  .HasForeignKey(p => p.CategoryId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // 3. Cấu hình Table
        modelBuilder.Entity<Table>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Location).HasMaxLength(100);
        });

        // 4. Cấu hình Order
        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.TotalAmount).HasColumnType("decimal(18,2)");

            entity.HasOne(o => o.Table)
                  .WithMany()
                  .HasForeignKey(o => o.TableId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // 5. Cấu hình OrderItem
        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.UnitPrice).HasColumnType("decimal(18,2)");

            entity.HasOne(oi => oi.Order)
                  .WithMany(o => o.OrderItems)
                  .HasForeignKey(oi => oi.OrderId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(oi => oi.Product)
                  .WithMany()
                  .HasForeignKey(oi => oi.ProductId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(oi => new { oi.ShopId, oi.IdempotencyKey })
                  .HasFilter("[IdempotencyKey] IS NOT NULL")
                  .IsUnique();
        });

        // 6. Cấu hình Shop
        modelBuilder.Entity<Shop>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.OwnerId).IsRequired();
        });

        // 7. Cấu hình ShopMember
        modelBuilder.Entity<ShopMember>(entity =>
        {
            entity.HasKey(e => e.Id);
            
            entity.HasOne(sm => sm.Shop)
                  .WithMany(s => s.Members)
                  .HasForeignKey(sm => sm.ShopId)
                  .OnDelete(DeleteBehavior.Cascade);

            // Cấu hình mối quan hệ với Identity User (thông qua UserId)
            entity.HasOne<ApplicationUser>()
                  .WithMany(u => u.ShopMemberships)
                  .HasForeignKey(sm => sm.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // 8. Liên kết các thực thể với Shop (Multi-tenancy)
        modelBuilder.Entity<Category>().HasOne(x => x.Shop).WithMany(x => x.Categories).HasForeignKey(x => x.ShopId).OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<Product>().HasOne(x => x.Shop).WithMany(x => x.Products).HasForeignKey(x => x.ShopId).OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<Table>().HasOne(x => x.Shop).WithMany(x => x.Tables).HasForeignKey(x => x.ShopId).OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<Order>().HasOne(x => x.Shop).WithMany().HasForeignKey(x => x.ShopId).OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<OrderItem>().HasOne(x => x.Shop).WithMany().HasForeignKey(x => x.ShopId).OnDelete(DeleteBehavior.Restrict);

        // 9. Global Query Filters for Multi-tenancy
        if (_tenantService != null)
        {
            var shopId = _tenantService.GetTenantId();
            if (shopId.HasValue)
            {
                modelBuilder.Entity<Category>().HasQueryFilter(x => x.ShopId == shopId.Value);
                modelBuilder.Entity<Product>().HasQueryFilter(x => x.ShopId == shopId.Value);
                modelBuilder.Entity<Table>().HasQueryFilter(x => x.ShopId == shopId.Value);
                modelBuilder.Entity<Order>().HasQueryFilter(x => x.ShopId == shopId.Value);
                modelBuilder.Entity<OrderItem>().HasQueryFilter(x => x.ShopId == shopId.Value);
            }
        }

        // 10. Audit Log config
        modelBuilder.Entity<AuditLog>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.UserId).IsRequired();
        });
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        // Tạm thời vô hiệu hóa Audit Log để debug lỗi 500 khi tạo quán
        // await OnBeforeSaveChanges();
        return await base.SaveChangesAsync(cancellationToken);
    }

    private async Task OnBeforeSaveChanges()
    {
        try 
        {
            ChangeTracker.DetectChanges();
            var auditEntries = new List<AuditLog>();
            var tenantId = _tenantService?.GetTenantId();
            
            // Giả sử lấy UserId từ ITenantService hoặc hằng số nếu chưa login
            var userId = "SYSTEM"; 

            foreach (var entry in ChangeTracker.Entries())
            {
                if (entry.Entity is AuditLog || entry.State == EntityState.Detached || entry.State == EntityState.Unchanged)
                    continue;

                var auditLog = new AuditLog
                {
                    Id = Guid.NewGuid(),
                    ShopId = tenantId,
                    UserId = userId,
                    EntityName = entry.Entity.GetType().Name,
                    EntityId = "N/A",
                    Action = entry.State.ToString(),
                    CreatedAt = DateTime.UtcNow,
                    OldValues = "{}",
                    NewValues = "{}"
                };

                // Tránh Serialize trực tiếp ToObject() vì có thể gây vòng lặp hoặc lỗi định dạng
                // Chỉ log tên các field thay đổi cơ bản
                if (entry.State == EntityState.Added)
                {
                    auditLog.NewValues = "New entity created";
                }
                else if (entry.State == EntityState.Modified)
                {
                    auditLog.OldValues = "Entity modified";
                }

                auditEntries.Add(auditLog);
            }

            if (auditEntries.Any())
            {
                AuditLogs.AddRange(auditEntries);
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[AUDIT ERROR]: {ex.Message}");
        }
    }
}
