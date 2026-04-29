using ShopManagement.Domain.Common;

namespace ShopManagement.Domain.Entities;

public class Area : BaseEntity
{
    public Guid ShopId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }

    // Navigation properties
    public virtual Shop Shop { get; set; } = null!;
    public virtual ICollection<Table> Tables { get; set; } = new List<Table>();
}
