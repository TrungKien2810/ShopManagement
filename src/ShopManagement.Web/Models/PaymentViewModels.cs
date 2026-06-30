using ShopManagement.Application.Interfaces;

namespace ShopManagement.Web.Models;

public class CheckoutViewModel
{
    public Guid OrderId { get; set; }
    public Guid TableId { get; set; }
    public string TableName { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public IEnumerable<CheckoutItemViewModel> Items { get; set; } = [];
}

public class CheckoutItemViewModel
{
    public string ProductName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal LineTotal => UnitPrice * Quantity;
}

public class PaymentReceiptViewModel
{
    public PaymentDto Payment { get; set; } = null!;
    public string TableName { get; set; } = string.Empty;
}
