using ShopManagement.Domain.Common;

namespace ShopManagement.Domain.Entities;

public class Branch : BaseEntity
{
    public Guid ShopId { get; set; }
    public virtual Shop Shop { get; set; } = null!;
    
    public string Name { get; set; } = string.Empty;
    public string? Address { get; set; }
    public string? Phone { get; set; }

    public virtual ICollection<Table> Tables { get; set; } = new List<Table>();
    public virtual ICollection<Product> SpecificProducts { get; set; } = new List<Product>();
    public virtual ICollection<Category> Categories { get; set; } = new List<Category>();
    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
}
