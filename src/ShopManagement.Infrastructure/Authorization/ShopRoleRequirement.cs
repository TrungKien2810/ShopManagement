using Microsoft.AspNetCore.Authorization;
using ShopManagement.Domain.Entities;

namespace ShopManagement.Infrastructure.Authorization;

public class ShopRoleRequirement : IAuthorizationRequirement
{
    public ShopRole RequiredRole { get; }

    public ShopRoleRequirement(ShopRole requiredRole)
    {
        RequiredRole = requiredRole;
    }
}
