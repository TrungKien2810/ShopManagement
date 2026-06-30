using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopManagement.Infrastructure.Data;
using ShopManagement.Web.Models;

namespace ShopManagement.Web.ViewComponents;

/// <summary>
/// Renders the currently-selected shop / branch in the sidebar so users always
/// know which tenant context they are acting in.
/// </summary>
public class CurrentTenantViewComponent : ViewComponent
{
    private readonly AppDbContext _context;

    public CurrentTenantViewComponent(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IViewComponentResult> InvokeAsync()
    {
        var vm = new CurrentTenantViewModel();

        if (Guid.TryParse(HttpContext.Session.GetString("ShopId"), out var shopId))
        {
            vm.ShopName = await _context.Shops
                .Where(s => s.Id == shopId)
                .Select(s => s.Name)
                .FirstOrDefaultAsync();
        }

        if (Guid.TryParse(HttpContext.Session.GetString("BranchId"), out var branchId))
        {
            vm.BranchName = await _context.Branches
                .Where(b => b.Id == branchId)
                .Select(b => b.Name)
                .FirstOrDefaultAsync();
        }

        return View(vm);
    }
}
