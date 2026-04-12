using System.Collections.Generic;
using ShopManagement.Application.DTOs.Tables;
using ShopManagement.Application.Interfaces;
using ShopManagement.Domain.Entities;
using ShopManagement.Domain.Enums;
using ShopManagement.Domain.Exceptions;
using Microsoft.AspNetCore.SignalR;

namespace ShopManagement.Application.Services;

public class TableService : ITableService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IShopNotificationService _notificationService;
    private readonly ITenantService _tenantService;

    public TableService(IUnitOfWork unitOfWork, IShopNotificationService notificationService, ITenantService tenantService)
    {
        _unitOfWork = unitOfWork;
        _notificationService = notificationService;
        _tenantService = tenantService;
    }

    public async Task<IEnumerable<TableDto>> GetAllTablesAsync()
    {
        var tables = await _unitOfWork.Tables.GetAllAsync();
        return tables.Select(t => new TableDto
        {
            Id = t.Id,
            Name = t.Name,
            Capacity = t.Capacity,
            Status = t.Status,
            Location = t.Location
        });
    }

    public async Task ResetTableAsync(Guid tableId)
    {
        var table = await _unitOfWork.Tables.GetByIdAsync(tableId);
        if (table != null)
        {
            table.Status = TableStatus.Available;
            await _unitOfWork.Tables.UpdateAsync(table);
            await _unitOfWork.SaveChangesAsync();
            
            // Thông báo toàn bộ Shop rằng bàn này đã trống
            await _notificationService.NotifyTableStatusUpdatedAsync(table.ShopId, tableId, TableStatus.Available);
        }
    }

    public async Task<OpenTableResponse> OpenTableAsync(Guid tableId)
    {
        var table = await _unitOfWork.Tables.GetByIdAsync(tableId);
        if (table == null)
        {
            throw new EntityNotFoundException("Bàn", tableId);
        }

        // 2. Kiểm tra trạng thái
        if (table.Status != TableStatus.Available)
        {
            throw new DomainException($"Bàn {table.Name} hiện đang không rỗng (Trạng thái: {table.Status}).");
        }

        // 3. Thực thi nghiệp vụ trong Transaction thông qua UnitOfWork
        await _unitOfWork.BeginTransactionAsync();
        try
        {
            // Cập nhật trạng thái bàn
            table.Status = TableStatus.InUse;
            await _unitOfWork.Tables.UpdateAsync(table);

            // Tạo Order mới
            var order = new Order
            {
                Id = Guid.NewGuid(),
                ShopId = table.ShopId,
                TableId = tableId,
                CheckInTime = DateTime.UtcNow,
                Status = OrderStatus.Open,
                SessionToken = Guid.NewGuid().ToString(),
                TotalAmount = 0
            };

            await _unitOfWork.Orders.AddAsync(order);
            
            // Lưu toàn bộ thay đổi
            await _unitOfWork.SaveChangesAsync();
            
            // Cam kết giao dịch
            await _unitOfWork.CommitTransactionAsync();
            
            // Thông báo cho Shop quản lý
            await _notificationService.NotifyTableStatusUpdatedAsync(table.ShopId, tableId, TableStatus.InUse);

            return new OpenTableResponse
            {
                OrderId = order.Id,
                SessionToken = order.SessionToken,
                TableName = table.Name
            };
        }
        catch (Exception)
        {
            await _unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    public async Task CheckoutAsync(Guid tableId)
    {
        var table = await _unitOfWork.Tables.GetByIdAsync(tableId);
        if (table == null) throw new EntityNotFoundException("Bàn", tableId);

        var order = await _unitOfWork.Orders.GetActiveOrderByTableIdAsync(tableId);
        if (order == null) throw new DomainException("Bàn này không có đơn hàng đang hoạt động.");

        await _unitOfWork.BeginTransactionAsync();
        try
        {
            // 1. Đóng đơn hàng
            order.Status = OrderStatus.Paid;
            order.CheckOutTime = DateTime.UtcNow;
            await _unitOfWork.Orders.UpdateAsync(order);

            // 2. Trả bàn về trạng thái Trống
            table.Status = TableStatus.Available;
            await _unitOfWork.Tables.UpdateAsync(table);

            await _unitOfWork.SaveChangesAsync();
            await _unitOfWork.CommitTransactionAsync();

            // 3. Thông báo Real-time
            await _notificationService.NotifyTableStatusUpdatedAsync(table.ShopId, tableId, TableStatus.Available);
        }
        catch (Exception)
        {
            await _unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }
}
