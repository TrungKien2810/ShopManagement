using ShopManagement.Domain.Common;

namespace ShopManagement.Domain.Entities;

public class Shop : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Address { get; set; }
    public string? Phone { get; set; }
    public string OwnerId { get; set; } = string.Empty;
    
    // Navigation properties
    public virtual ICollection<Table> Tables { get; set; } = new List<Table>();
    public virtual ICollection<ShopMember> Members { get; set; } = new List<ShopMember>();
    public virtual ICollection<Category> Categories { get; set; } = new List<Category>();
    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
}
