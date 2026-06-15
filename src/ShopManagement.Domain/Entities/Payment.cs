using ShopManagement.Domain.Common;
using System;

namespace ShopManagement.Domain.Entities;

public class Payment : BaseEntity
{
    public Guid ShopId { get; set; }
    public Guid OrderId { get; set; }
    public decimal Amount { get; set; }
    public string Method { get; set; } = "Cash";
    public string Status { get; set; } = "Completed";

    // Navigation properties
    public virtual Shop Shop { get; set; } = null!;
    public virtual Order Order { get; set; } = null!;
}
