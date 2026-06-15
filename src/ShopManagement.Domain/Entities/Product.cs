using ShopManagement.Domain.Common;
using System;

namespace ShopManagement.Domain.Entities;

public class Product : BaseEntity
{
    public Guid ShopId { get; set; }
    public Guid? BranchId { get; set; } // If null, this is a global menu item for the shop
    public Guid CategoryId { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public bool IsAvailable { get; set; } = true;

    // Soft-delete
    public bool IsDeleted { get; set; } = false;
    public DateTime? DeletedAt { get; set; }

    // Navigation properties
    public virtual Shop Shop { get; set; } = null!;
    public virtual Branch? Branch { get; set; }
    public virtual Category Category { get; set; } = null!;
}
