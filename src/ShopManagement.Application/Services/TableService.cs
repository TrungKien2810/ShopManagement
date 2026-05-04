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
        var shopId = _tenantService.GetTenantId() ?? throw new UnauthorizedAccessException("ShopId not found");

        Guid? areaId = null;
        var location = dto.Location;

        if (dto.AreaId.HasValue)
        {
            var area = await _unitOfWork.TableAreas.GetByIdAsync(dto.AreaId.Value);
            if (area == null) throw new EntityNotFoundException("Table area", dto.AreaId.Value);
            if (area.ShopId != shopId) throw new DomainException("Table area does not belong to current shop.");

            areaId = area.Id;
            location = area.Name;
        }

        var table = new Table
        {
            Id = Guid.NewGuid(),
            ShopId = shopId,
            Name = dto.Name,
            Capacity = dto.Capacity,
            Location = location,
            AreaId = areaId,
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
            order.CalculateTotal();
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

    public async Task<TransferTableResponse> TransferTableAsync(Guid fromTableId, Guid toTableId)
    {
        if (fromTableId == toTableId) throw new DomainException("Bàn đích phải khác bàn nguồn.");

        var fromTable = await _unitOfWork.Tables.GetByIdAsync(fromTableId);
        if (fromTable == null) throw new EntityNotFoundException("Bàn", fromTableId);

        var toTable = await _unitOfWork.Tables.GetByIdAsync(toTableId);
        if (toTable == null) throw new EntityNotFoundException("Bàn", toTableId);

        if (fromTable.ShopId != toTable.ShopId) throw new DomainException("Không thể đổi bàn qua quán khác.");
        if (fromTable.Status != TableStatus.InUse) throw new DomainException("Bàn nguồn không ở trạng thái đang phục vụ.");
        if (toTable.Status != TableStatus.Available) throw new DomainException($"Bàn {toTable.Name} hiện đang không rỗng.");

        var order = await _unitOfWork.Orders.GetActiveOrderByTableIdAsync(fromTableId);
        if (order == null) throw new DomainException("Bàn nguồn không có đơn hàng đang hoạt động.");

        var destinationOrder = await _unitOfWork.Orders.GetActiveOrderByTableIdAsync(toTableId);
        if (destinationOrder != null) throw new DomainException("Bàn đích đang có đơn hàng hoạt động.");

        await _unitOfWork.BeginTransactionAsync();
        try
        {
            // 1. Move the order to the new table
            order.TableId = toTableId;
            order.Table = null!; // Clear navigation to avoid conflict
            await _unitOfWork.Orders.UpdateAsync(order);

            // 2. Reset old table status
            fromTable.Status = TableStatus.Available;
            await _unitOfWork.Tables.UpdateAsync(fromTable);

            // 3. Set new table status
            toTable.Status = TableStatus.InUse;
            await _unitOfWork.Tables.UpdateAsync(toTable);

            // 4. Save and Commit
            await _unitOfWork.SaveChangesAsync();
            await _unitOfWork.CommitTransactionAsync();

            await _notificationService.NotifyTableStatusUpdatedAsync(fromTable.ShopId, fromTableId, TableStatus.Available);
            await _notificationService.NotifyTableStatusUpdatedAsync(toTable.ShopId, toTableId, TableStatus.InUse);

            return new TransferTableResponse
            {
                OrderId = order.Id,
                FromTableId = fromTableId,
                ToTableId = toTableId,
                ToTableName = toTable.Name
            };
        }
        catch (Exception)
        {
            await _unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }
}
