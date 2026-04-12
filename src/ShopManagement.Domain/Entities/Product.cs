using ShopManagement.Domain.Common;

namespace ShopManagement.Domain.Entities;

public class Product : BaseEntity
{
    public Guid ShopId { get; set; }
    public Guid CategoryId { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public bool IsAvailable { get; set; } = true;

    // Navigation properties
    public virtual Shop Shop { get; set; } = null!;
    public virtual Category Category { get; set; } = null!;
}
