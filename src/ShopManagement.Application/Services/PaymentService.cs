using ShopManagement.Application.Interfaces;
using ShopManagement.Domain.Entities;
using ShopManagement.Domain.Exceptions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ShopManagement.Application.Services;

public class PaymentService : IPaymentService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ITenantService _tenantService;

    public PaymentService(IUnitOfWork unitOfWork, ITenantService tenantService)
    {
        _unitOfWork = unitOfWork;
        _tenantService = tenantService;
    }

    public async Task<PaymentDto> CreatePaymentAsync(CreatePaymentDto request)
    {
        var shopId = _tenantService.GetTenantId() ?? throw new UnauthorizedAccessException("ShopId not found");
        var order = await _unitOfWork.Orders.GetByIdAsync(request.OrderId);
        if (order == null) throw new EntityNotFoundException("Đơn hàng", request.OrderId);
        if (order.ShopId != shopId) throw new DomainException("Đơn hàng không thuộc quán hiện tại.");
        if (order.Status == Domain.Enums.OrderStatus.Paid) throw new DomainException("Đơn hàng đã được thanh toán.");

        // Tổng tiền do server quyết định (authoritative) — tránh lỗi sai lệch do client gửi số tiền cũ.
        order.CalculateTotal();
        var amount = order.TotalAmount;

        var table = await _unitOfWork.Tables.GetByIdAsync(order.TableId);
        if (table == null) throw new EntityNotFoundException("Bàn", order.TableId);

        var payment = new Payment
        {
            Id = Guid.NewGuid(),
            ShopId = shopId,
            OrderId = request.OrderId,
            Amount = amount,
            Method = string.IsNullOrWhiteSpace(request.Method) ? "Cash" : request.Method,
            Status = "Completed"
        };

        await _unitOfWork.BeginTransactionAsync();
        try
        {
            await _unitOfWork.Payments.AddAsync(payment);

            order.Status = Domain.Enums.OrderStatus.Paid;
            order.CheckOutTime = DateTime.UtcNow;
            await _unitOfWork.Orders.UpdateAsync(order);

            table.Status = Domain.Enums.TableStatus.Available;
            await _unitOfWork.Tables.UpdateAsync(table);

            await _unitOfWork.SaveChangesAsync();
            await _unitOfWork.CommitTransactionAsync();
        }
        catch
        {
            await _unitOfWork.RollbackTransactionAsync();
            throw;
        }

        return new PaymentDto
        {
            Id = payment.Id,
            OrderId = payment.OrderId,
            Amount = payment.Amount,
            Method = payment.Method,
            CreatedAt = payment.CreatedAt,
            Status = payment.Status
        };
    }

    public async Task<IEnumerable<PaymentDto>> GetPaymentHistoryAsync(Guid orderId)
    {
        var payments = await _unitOfWork.Payments.GetByOrderIdAsync(orderId);
        return payments.Select(p => new PaymentDto
        {
            Id = p.Id,
            OrderId = p.OrderId,
            Amount = p.Amount,
            Method = p.Method,
            CreatedAt = p.CreatedAt,
            Status = p.Status
        });
    }
}
