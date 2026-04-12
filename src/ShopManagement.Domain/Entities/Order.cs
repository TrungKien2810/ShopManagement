using ShopManagement.Domain.Common;
using ShopManagement.Domain.Enums;

namespace ShopManagement.Domain.Entities;

public class Order : BaseEntity
{
    public Guid ShopId { get; set; }
    public Guid TableId { get; set; }
    public DateTime CheckInTime { get; set; } = DateTime.UtcNow;
    public DateTime? CheckOutTime { get; set; }
    public decimal TotalAmount { get; set; }
    public OrderStatus Status { get; set; } = OrderStatus.Open;
    public string? Note { get; set; }
    public string SessionToken { get; set; } = string.Empty;

    // Navigation properties
    public virtual Shop Shop { get; set; } = null!;
    public virtual Table Table { get; set; } = null!;
    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

    // Domain Logic
    public void CalculateTotal()
    {
        TotalAmount = OrderItems
            .Where(oi => oi.Status != OrderItemStatus.Cancelled)
            .Sum(oi => oi.UnitPrice * oi.Quantity);
    }
}
