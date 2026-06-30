using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using ShopManagement.Application.Interfaces;

namespace ShopManagement.Infrastructure.Services;

public class TenantService : ITenantService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public TenantService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public Guid? GetTenantId()
    {
        var context = _httpContextAccessor.HttpContext;
        var tenantIdClaim = context?.User?.FindFirst("ShopId")?.Value;

        if (Guid.TryParse(tenantIdClaim, out var tenantId))
        {
            return tenantId;
        }

        // Fallback to HTTP Headers (legacy SPA clients that intercept requests)
        if (context != null && context.Request.Headers.TryGetValue("ShopId", out var headerShopId))
        {
             if (Guid.TryParse(headerShopId.ToString(), out var headerTenantId))
             {
                 return headerTenantId;
             }
        }

        // Fallback to Session (MVC cookie-auth flow: shop chosen via ShopController.Select)
        var sessionShopId = context?.Session?.GetString("ShopId");
        if (Guid.TryParse(sessionShopId, out var sessionTenantId))
        {
            return sessionTenantId;
        }

        return null;
    }

    public Guid? GetBranchId()
    {
        var context = _httpContextAccessor.HttpContext;

        // Try getting from headers
        if (context != null && context.Request.Headers.TryGetValue("BranchId", out var headerBranchId))
        {
            if (Guid.TryParse(headerBranchId.ToString(), out var parsedBranchId))
            {
                return parsedBranchId;
            }
        }

        // Fallback to Session (MVC cookie-auth flow: branch chosen via BranchController.Select)
        var sessionBranchId = context?.Session?.GetString("BranchId");
        if (Guid.TryParse(sessionBranchId, out var parsedSessionBranchId))
        {
            return parsedSessionBranchId;
        }

        return null;
    }
}
