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

    public async Task<TableDto> CreateTableAsync(ShopManagement.Application.DTOs.Table.CreateTableDto dto)
    {
        var shopId = _tenantService.GetTenantId() ?? throw new UnauthorizedAccessException("Không xác định được ShopId");
        
        var table = new Table
        {
            Id = Guid.NewGuid(),
            ShopId = shopId,
            Name = dto.Name,
            Capacity = dto.Capacity,
            Location = dto.Location,
            Status = TableStatus.Available
        };

        await _unitOfWork.Tables.AddAsync(table);
        await _unitOfWork.SaveChangesAsync();

        return new TableDto
        {
            Id = table.Id,
            Name = table.Name,
            Capacity = table.Capacity,
            Status = table.Status,
            Location = table.Location
        };
    }

    public async Task ResetTableAsync(Guid tableId)
    {
        var table = await _unitOfWork.Tables.GetByIdAsync(tableId);
        if (table != null)
        {
            table.Status = TableStatus.Available;
            await _unitOfWork.Tables.UpdateAsync(table);
            await _unitOfWork.SaveChangesAsync();
            
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

        if (table.Status != TableStatus.Available)
        {
            throw new DomainException($"Bàn {table.Name} hiện đang không rỗng (Trạng thái: {table.Status}).");
        }

        await _unitOfWork.BeginTransactionAsync();
        try
        {
            table.Status = TableStatus.InUse;
            await _unitOfWork.Tables.UpdateAsync(table);

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
            await _unitOfWork.SaveChangesAsync();
            await _unitOfWork.CommitTransactionAsync();
            
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
            order.Status = OrderStatus.Paid;
            order.CheckOutTime = DateTime.UtcNow;
            await _unitOfWork.Orders.UpdateAsync(order);

            table.Status = TableStatus.Available;
            await _unitOfWork.Tables.UpdateAsync(table);

            await _unitOfWork.SaveChangesAsync();
            await _unitOfWork.CommitTransactionAsync();

            await _notificationService.NotifyTableStatusUpdatedAsync(table.ShopId, tableId, TableStatus.Available);
        }
        catch (Exception)
        {
            await _unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }
}
