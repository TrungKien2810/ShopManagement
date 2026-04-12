using ShopManagement.Domain.Common;
using ShopManagement.Domain.Enums;

namespace ShopManagement.Domain.Entities;

public class OrderItem : BaseEntity
{
    public Guid ShopId { get; set; }
    public Guid OrderId { get; set; }
    public Guid ProductId { get; set; }
    public decimal UnitPrice { get; set; }
    public int Quantity { get; set; }
    public OrderItemStatus Status { get; set; } = OrderItemStatus.Pending;
    public string? Note { get; set; }
    public string? IdempotencyKey { get; set; }
    public DateTime OrderedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual Shop Shop { get; set; } = null!;
    public virtual Order Order { get; set; } = null!;
    public virtual Product Product { get; set; } = null!;
}
