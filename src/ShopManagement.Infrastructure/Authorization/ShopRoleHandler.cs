using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using ShopManagement.Application.Interfaces;
using ShopManagement.Domain.Entities;
using ShopManagement.Infrastructure.Data;
using System.Security.Claims;

namespace ShopManagement.Infrastructure.Authorization;

public class ShopRoleHandler : AuthorizationHandler<ShopRoleRequirement>
{
    private readonly ITenantService _tenantService;
    private readonly AppDbContext _context;

    public ShopRoleHandler(ITenantService tenantService, AppDbContext context)
    {
        _tenantService = tenantService;
        _context = context;
    }

    protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, ShopRoleRequirement requirement)
    {
        var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
        var shopId = _tenantService.GetTenantId();

        if (string.IsNullOrEmpty(userId) || !shopId.HasValue)
        {
            return;
        }

        var shopMember = await _context.Set<ShopMember>()
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(sm => sm.ShopId == shopId.Value && sm.UserId == userId);

        if (shopMember != null)
        {
            // Enum values: Owner = 0, Manager = 1, Staff = 2
            // Lower int value means higher privilege.
            if ((int)shopMember.Role <= (int)requirement.RequiredRole)
            {
                context.Succeed(requirement);
            }
        }
    }
}
