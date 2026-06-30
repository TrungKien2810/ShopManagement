using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShopManagement.Application.Interfaces;
using ShopManagement.Domain.Exceptions;
using ShopManagement.Web.Models;

namespace ShopManagement.Web.Controllers;

[Authorize(Policy = "RequireStaff")]
public class PaymentController : Controller
{
    private readonly IPaymentService _paymentService;
    private readonly IUnitOfWork _unitOfWork;

    public PaymentController(IPaymentService paymentService, IUnitOfWork unitOfWork)
    {
        _paymentService = paymentService;
        _unitOfWork = unitOfWork;
    }

    public async Task<IActionResult> Checkout(Guid orderId)
    {
        var order = await _unitOfWork.Orders.GetByIdAsync(orderId);
        if (order == null) return NotFound();

        order.CalculateTotal();
        var table = await _unitOfWork.Tables.GetByIdAsync(order.TableId);

        return View(new CheckoutViewModel
        {
            OrderId = order.Id,
            TableId = order.TableId,
            TableName = table?.Name ?? "Bàn",
            TotalAmount = order.TotalAmount,
            Items = order.OrderItems
                .Where(oi => oi.Status != Domain.Enums.OrderItemStatus.Cancelled)
                .Select(oi => new CheckoutItemViewModel
                {
                    ProductName = oi.Product?.Name ?? "Sản phẩm",
                    Quantity = oi.Quantity,
                    UnitPrice = oi.UnitPrice
                })
        });
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Confirm(Guid orderId, string method = "Cash")
    {
        try
        {
            var payment = await _paymentService.CreatePaymentAsync(new CreatePaymentDto
            {
                OrderId = orderId,
                Method = method
            });

            return RedirectToAction("Receipt", new { orderId });
        }
        catch (Exception ex) when (ex is DomainException or EntityNotFoundException)
        {
            TempData["Error"] = ex.Message;
            return RedirectToAction("Checkout", new { orderId });
        }
    }

    public async Task<IActionResult> Receipt(Guid orderId)
    {
        var payment = (await _unitOfWork.Payments.GetByOrderIdAsync(orderId))
            .OrderByDescending(p => p.CreatedAt)
            .FirstOrDefault();
        if (payment == null) return NotFound();

        var order = await _unitOfWork.Orders.GetByIdAsync(payment.OrderId);
        var table = order != null ? await _unitOfWork.Tables.GetByIdAsync(order.TableId) : null;

        return View(new PaymentReceiptViewModel
        {
            Payment = new PaymentDto
            {
                Id = payment.Id,
                OrderId = payment.OrderId,
                Amount = payment.Amount,
                Method = payment.Method,
                CreatedAt = payment.CreatedAt,
                Status = payment.Status
            },
            TableName = table?.Name ?? "Bàn"
        });
    }
}
