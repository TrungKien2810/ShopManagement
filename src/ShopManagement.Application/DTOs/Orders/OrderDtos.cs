using ShopManagement.Domain.Enums;

namespace ShopManagement.Application.DTOs.Orders;

public class OrderDto
{
    public Guid Id { get; set; }
    public Guid TableId { get; set; }
    public decimal TotalAmount { get; set; }
    public OrderStatus Status { get; set; }
    public IEnumerable<OrderItemDto> Items { get; set; } = [];
}

public class OrderItemDto
{
    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public OrderItemStatus Status { get; set; }
}

public class AddOrderItemRequest
{
    public Guid ProductId { get; set; }
    public int Quantity { get; set; }
    public string? Note { get; set; }
    public string? IdempotencyKey { get; set; }
}
