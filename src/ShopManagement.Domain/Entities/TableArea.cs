using ShopManagement.Domain.Common;

namespace ShopManagement.Domain.Entities;

public class TableArea : BaseEntity
{
    public Guid ShopId { get; set; }
    public string Name { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public int SortOrder { get; set; } = 0;

    public virtual Shop Shop { get; set; } = null!;
    public virtual ICollection<Table> Tables { get; set; } = new List<Table>();
}

