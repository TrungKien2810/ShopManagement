using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopManagement.Domain.Entities;
using ShopManagement.Infrastructure.Data;
using ShopManagement.Web.Filters;
using ShopManagement.Web.Models;

namespace ShopManagement.Web.Controllers;

[RequireShop]
public class BranchController : Controller
{
    private readonly AppDbContext _context;

    public BranchController(AppDbContext context)
    {
        _context = context;
    }

    private string CurrentUserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    public async Task<IActionResult> Index()
    {
        var shopId = GetCurrentShopIdOrThrow();
        var currentBranchId = HttpContext.Session.GetString("BranchId");

        var branches = await _context.Branches
            .Where(b => b.ShopId == shopId)
            .Select(b => new BranchListItemViewModel
            {
                Id = b.Id,
                Name = b.Name,
                Address = b.Address,
                Phone = b.Phone
            })
            .ToListAsync();

        foreach (var b in branches)
            b.IsCurrent = currentBranchId == b.Id.ToString();

        return View(branches);
    }

    [HttpGet]
    public IActionResult Create() => View(new CreateBranchViewModel());

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(CreateBranchViewModel model)
    {
        if (!ModelState.IsValid) return View(model);

        var shopId = GetCurrentShopIdOrThrow();

        var member = await _context.ShopMembers.FirstOrDefaultAsync(m => m.ShopId == shopId && m.UserId == CurrentUserId);
        if (member == null || (member.Role != ShopRole.Owner && member.Role != ShopRole.Manager))
            return Forbid();

        var branch = new Branch
        {
            ShopId = shopId,
            Name = model.Name,
            Address = model.Address,
            Phone = model.Phone
        };
        _context.Branches.Add(branch);
        await _context.SaveChangesAsync();

        HttpContext.Session.SetString("BranchId", branch.Id.ToString());
        return RedirectToAction("Index", "Home");
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Select(Guid id)
    {
        var shopId = GetCurrentShopIdOrThrow();
        var belongs = await _context.Branches.AnyAsync(b => b.Id == id && b.ShopId == shopId);
        if (!belongs) return Forbid();

        HttpContext.Session.SetString("BranchId", id.ToString());
        return RedirectToAction("Index", "Home");
    }

    private Guid GetCurrentShopIdOrThrow()
    {
        var raw = HttpContext.Session.GetString("ShopId");
        if (Guid.TryParse(raw, out var id)) return id;
        throw new InvalidOperationException("Chưa chọn quán.");
    }
}
