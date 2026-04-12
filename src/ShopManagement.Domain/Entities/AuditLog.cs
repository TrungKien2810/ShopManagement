using System;
using ShopManagement.Domain.Common;

namespace ShopManagement.Domain.Entities;

public class AuditLog : BaseEntity
{
    public Guid? ShopId { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string EntityName { get; set; } = string.Empty;
    public string EntityId { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty; // Create, Update, Delete
    public string OldValues { get; set; } = string.Empty;
    public string NewValues { get; set; } = string.Empty;
}
