using ShopManagement.Application.DTOs.Menu;
using ShopManagement.Application.DTOs.Orders;

namespace ShopManagement.Application.Interfaces;

public interface IMenuService
{
    Task<IEnumerable<CategoryDto>> GetMenuAsync();
}

public interface IOrderService
{
    Task AddItemToOrderAsync(Guid orderId, AddOrderItemRequest request);
    Task<OrderDto> GetActiveOrderAsync(Guid tableId);
    Task ApproveOrderItemAsync(Guid orderId, Guid productId);
}
