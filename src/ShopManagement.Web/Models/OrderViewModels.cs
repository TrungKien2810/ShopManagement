using ShopManagement.Application.DTOs.Menu;
using ShopManagement.Application.DTOs.Orders;

namespace ShopManagement.Web.Models;

public class OrderPageViewModel
{
    public Guid TableId { get; set; }
    public string TableName { get; set; } = string.Empty;
    public OrderDto Order { get; set; } = new();
    public IEnumerable<CategoryDto> Categories { get; set; } = [];
}
