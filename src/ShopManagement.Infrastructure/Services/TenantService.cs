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

        // Fallback to HTTP Headers (Frontend passes ShopId in intercepted request)
        if (context != null && context.Request.Headers.TryGetValue("ShopId", out var headerShopId))
        {
             if (Guid.TryParse(headerShopId.ToString(), out var headerTenantId))
             {
                 return headerTenantId;
             }
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

        return null;
    }
}
