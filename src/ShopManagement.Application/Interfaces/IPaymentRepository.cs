using ShopManagement.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ShopManagement.Application.Interfaces;

public interface IPaymentRepository
{
    Task AddAsync(Payment payment);
    Task<IEnumerable<Payment>> GetByOrderIdAsync(Guid orderId);
}
