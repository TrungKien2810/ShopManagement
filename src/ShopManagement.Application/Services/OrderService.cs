using Microsoft.AspNetCore.SignalR;
using ShopManagement.Application.DTOs.Orders;
using ShopManagement.Application.Interfaces;
using ShopManagement.Domain.Entities;
using ShopManagement.Domain.Enums;
using ShopManagement.Domain.Exceptions;

namespace ShopManagement.Application.Services;

public class OrderService : IOrderService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IShopNotificationService _notificationService;
    private readonly ITenantService _tenantService;

    public OrderService(IUnitOfWork unitOfWork, IShopNotificationService notificationService, ITenantService tenantService)
    {
        _unitOfWork = unitOfWork;
        _notificationService = notificationService;
        _tenantService = tenantService;
    }

    public async Task AddItemToOrderAsync(Guid orderId, AddOrderItemRequest request)
    {
        var order = await _unitOfWork.Orders.GetByIdAsync(orderId);
        if (order == null) throw new EntityNotFoundException("Đơn hàng", orderId);

        var product = await _unitOfWork.Products.GetByIdAsync(request.ProductId);
        if (product == null) throw new EntityNotFoundException("Sản phẩm", request.ProductId);

        // Idempotency: Kiểm tra nếu Key đã tồn tại (Chống bấm đúp)
        if (!string.IsNullOrEmpty(request.IdempotencyKey))
        {
            var alreadyExists = order.OrderItems.Any(oi => oi.IdempotencyKey == request.IdempotencyKey);
            if (alreadyExists) return; // Đã xử lý rồi, trả về thành công
        }

        // Rule Engine: Luồng Xanh / Luồng Đỏ
        var lineTotal = product.Price * request.Quantity;
        var status = OrderItemStatus.Pending; // Mặc định là Luồng Xanh (tự duyệt)

        if (lineTotal > 500000 || request.Quantity > 20)
        {
            status = OrderItemStatus.NeedsApproval; // Luồng Đỏ
        }

        var orderItem = new OrderItem
        {
            Id = Guid.NewGuid(),
            ShopId = order.ShopId,
            OrderId = orderId,
            ProductId = request.ProductId,
            Quantity = request.Quantity,
            UnitPrice = product.Price,
            Status = status,
            Note = request.Note,
            IdempotencyKey = request.IdempotencyKey
        };

        await _unitOfWork.BeginTransactionAsync();
        try {
            await _unitOfWork.Orders.AddOrderItemAsync(orderItem);
            order.CalculateTotal();
            await _unitOfWork.Orders.UpdateAsync(order);
            await _unitOfWork.SaveChangesAsync();
            await _unitOfWork.CommitTransactionAsync();
            
            // Thông báo Real-time cho Shop/Table cụ thể
            if (status == OrderItemStatus.NeedsApproval)
            {
                // Thông báo cho Quản lý Shop (Luồng Đỏ)
                await _notificationService.SendAlertAsync(order.ShopId, $"Bàn {order.TableId} gọi số lượng lớn món {product.Name}!");
            }
            else
            {
                // Thông báo cập nhật bàn (Luồng Xanh)
                await _notificationService.NotifyOrderUpdatedAsync(order.TableId, orderId);
            }
        } catch {
            await _unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    public async Task<OrderDto> GetActiveOrderAsync(Guid tableId)
    {
        var order = await _unitOfWork.Orders.GetActiveOrderByTableIdAsync(tableId);
        if (order == null) throw new EntityNotFoundException("Đơn hàng đang hoạt động", tableId);

        return new OrderDto
        {
            Id = order.Id,
            TableId = order.TableId,
            TotalAmount = order.TotalAmount,
            Status = order.Status,
            Items = order.OrderItems.Select(oi => new OrderItemDto
            {
                ProductId = oi.ProductId,
                ProductName = oi.Product?.Name ?? "Sản phẩm",
                Quantity = oi.Quantity,
                UnitPrice = oi.UnitPrice,
                Status = oi.Status
            })
        };
    }

    public async Task ApproveOrderItemAsync(Guid orderId, Guid productId)
    {
        var order = await _unitOfWork.Orders.GetByIdAsync(orderId);
        if (order == null) throw new EntityNotFoundException("Đơn hàng", orderId);

        var item = order.OrderItems.FirstOrDefault(oi => oi.ProductId == productId && oi.Status == OrderItemStatus.NeedsApproval);
        if (item == null) throw new DomainException("Không tìm thấy món cần duyệt.");

        item.Status = OrderItemStatus.Pending; // Chuyển sang Pending (đã duyệt, chờ chế biến)
        
        await _unitOfWork.Orders.UpdateAsync(order);
        await _unitOfWork.SaveChangesAsync();

        // Thông báo cho Bàn rằng món đã được duyệt
        await _notificationService.NotifyOrderUpdatedAsync(order.TableId, orderId);
    }
}
