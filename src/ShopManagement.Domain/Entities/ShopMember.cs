using ShopManagement.Domain.Common;

namespace ShopManagement.Domain.Entities;

public class ShopMember : BaseEntity
{
    public Guid ShopId { get; set; }
    public string UserId { get; set; } = string.Empty;
    public ShopRole Role { get; set; }
    public DateTime JoinedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual Shop Shop { get; set; } = null!;
}

public enum ShopRole
{
    Owner,
    Manager,
    Staff
}
