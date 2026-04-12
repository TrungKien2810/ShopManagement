using ShopManagement.Domain.Entities;

namespace ShopManagement.Application.Interfaces;

public interface IOrderRepository
{
    Task<Order?> GetByIdAsync(Guid id);
    Task<Order?> GetActiveOrderByTableIdAsync(Guid tableId);
    Task AddAsync(Order order);
    Task UpdateAsync(Order order);
    Task AddOrderItemAsync(OrderItem item);
}
