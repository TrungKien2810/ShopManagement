using Microsoft.AspNetCore.Identity;
using ShopManagement.Domain.Entities;

namespace ShopManagement.Infrastructure.Identity;

public class ApplicationUser : IdentityUser
{
    public string FullName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public virtual ICollection<ShopMember> ShopMemberships { get; set; } = new List<ShopMember>();
}
