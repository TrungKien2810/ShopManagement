using ShopManagement.Application.DTOs.Orders;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ShopManagement.Application.Interfaces;

public interface IPaymentService
{
    Task<PaymentDto> CreatePaymentAsync(CreatePaymentDto request);
    Task<IEnumerable<PaymentDto>> GetPaymentHistoryAsync(Guid orderId);
}

public class CreatePaymentDto
{
    public Guid OrderId { get; set; }
    public decimal Amount { get; set; }
    public string Method { get; set; } = "Cash";
}

public class PaymentDto
{
    public Guid Id { get; set; }
    public Guid OrderId { get; set; }
    public decimal Amount { get; set; }
    public string Method { get; set; } = "Cash";
    public DateTime CreatedAt { get; set; }
    public string Status { get; set; } = "Completed";
}
