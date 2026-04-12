using ShopManagement.Domain.Common;
using ShopManagement.Domain.Enums;

namespace ShopManagement.Domain.Entities;

public class Table : BaseEntity
{
    public Guid ShopId { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Capacity { get; set; }
    public TableStatus Status { get; set; } = TableStatus.Available;
    public string Location { get; set; } = string.Empty;

    // Navigation properties
    public virtual Shop Shop { get; set; } = null!;
}
