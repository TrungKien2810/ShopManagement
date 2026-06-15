using Microsoft.EntityFrameworkCore;
using ShopManagement.Application.Interfaces;
using ShopManagement.Domain.Entities;
using ShopManagement.Infrastructure.Data;

namespace ShopManagement.Infrastructure.Repositories;

public class OrderRepository : IOrderRepository
{
    private readonly AppDbContext _context;

    public OrderRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Order?> GetByIdAsync(Guid id)
    {
        return await _context.Orders
            .Include(o => o.Table)
            .Include(o => o.OrderItems)
            .FirstOrDefaultAsync(o => o.Id == id);
    }

    public async Task<Order?> GetActiveOrderByTableIdAsync(Guid tableId)
    {
        return await _context.Orders
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
            .OrderByDescending(o => o.CheckInTime)
            .FirstOrDefaultAsync(o => o.TableId == tableId && o.Status == ShopManagement.Domain.Enums.OrderStatus.Open);
    }

    public async Task AddAsync(Order order)
    {
        await _context.Orders.AddAsync(order);
    }

    public async Task UpdateAsync(Order order)
    {
        _context.Entry(order).State = EntityState.Modified;
        await Task.CompletedTask;
    }

    public async Task AddOrderItemAsync(OrderItem item)
    {
        await _context.OrderItems.AddAsync(item);
    }

    public async Task RemoveOrderItemAsync(OrderItem item)
    {
        _context.OrderItems.Remove(item);
        await Task.CompletedTask;
    }

    public async Task<bool> ExistsOrderItemForProductAsync(Guid productId)
    {
        return await _context.OrderItems.AnyAsync(oi => oi.ProductId == productId);
    }

    public async Task<List<Order>> GetPaidOrdersAsync(Guid shopId, Guid? branchId, DateTime fromUtc, DateTime toUtc)
    {
        var query = _context.Orders
            .AsNoTracking()
            .Where(o => o.ShopId == shopId
                        && o.Status == ShopManagement.Domain.Enums.OrderStatus.Paid
                        && o.CheckOutTime != null
                        && o.CheckOutTime >= fromUtc
                        && o.CheckOutTime < toUtc);

        if (branchId.HasValue)
        {
            query = query.Where(o => o.BranchId == branchId.Value);
        }

        return await query.ToListAsync();
    }
}
