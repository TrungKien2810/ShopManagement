using ShopManagement.Domain.Common;
using System;

namespace ShopManagement.Domain.Entities;

public class Category : BaseEntity
{
    public Guid ShopId { get; set; }
    public Guid? BranchId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;

    // Soft-delete
    public bool IsDeleted { get; set; } = false;
    public DateTime? DeletedAt { get; set; }

    // Navigation properties
    public virtual Shop Shop { get; set; } = null!;
    public virtual Branch? Branch { get; set; }
    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
}
