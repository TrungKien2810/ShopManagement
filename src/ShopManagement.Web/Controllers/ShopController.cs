using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopManagement.Domain.Entities;
using ShopManagement.Infrastructure.Data;
using ShopManagement.Infrastructure.Identity;
using ShopManagement.Web.Filters;
using ShopManagement.Web.Models;

namespace ShopManagement.Web.Controllers;

public class ShopController : Controller
{
    private readonly AppDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public ShopController(AppDbContext context, UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    private string CurrentUserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    public async Task<IActionResult> Index()
    {
        var currentShopId = HttpContext.Session.GetString("ShopId");

        var shops = await _context.ShopMembers
            .Where(m => m.UserId == CurrentUserId)
            .Select(m => new ShopListItemViewModel
            {
                Id = m.Shop.Id,
                Name = m.Shop.Name,
                Role = m.Role
            })
            .ToListAsync();

        foreach (var shop in shops)
            shop.IsCurrent = currentShopId == shop.Id.ToString();

        return View(shops);
    }

    [HttpGet]
    public IActionResult Create() => View(new CreateShopViewModel());

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(CreateShopViewModel model)
    {
        if (!ModelState.IsValid) return View(model);

        var shop = new Shop
        {
            Name = model.Name,
            Address = model.Address,
            Phone = model.PhoneNumber,
            OwnerId = CurrentUserId
        };
        _context.Shops.Add(shop);

        var member = new ShopMember
        {
            Shop = shop,
            UserId = CurrentUserId,
            Role = ShopRole.Owner
        };
        _context.ShopMembers.Add(member);

        await _context.SaveChangesAsync();

        HttpContext.Session.SetString("ShopId", shop.Id.ToString());
        HttpContext.Session.Remove("BranchId");

        return RedirectToAction("Create", "Branch");
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Select(Guid id)
    {
        var isMember = await _context.ShopMembers.AnyAsync(m => m.ShopId == id && m.UserId == CurrentUserId);
        if (!isMember) return Forbid();

        HttpContext.Session.SetString("ShopId", id.ToString());

        var branches = await _context.Branches.Where(b => b.ShopId == id).Select(b => b.Id).ToListAsync();
        if (branches.Count == 1)
        {
            HttpContext.Session.SetString("BranchId", branches[0].ToString());
            return RedirectToAction("Index", "Home");
        }

        HttpContext.Session.Remove("BranchId");
        return RedirectToAction("Index", "Branch");
    }

    [RequireShop]
    public async Task<IActionResult> Settings()
    {
        var shopId = GetCurrentShopIdOrThrow();

        var currentMember = await _context.ShopMembers.FirstOrDefaultAsync(m => m.ShopId == shopId && m.UserId == CurrentUserId);
        if (currentMember == null) return Forbid();

        var shop = await _context.Shops.FirstAsync(s => s.Id == shopId);

        var members = await _context.ShopMembers
            .Where(m => m.ShopId == shopId)
            .Join(_context.Users, m => m.UserId, u => u.Id, (m, u) => new ShopMemberViewModel
            {
                UserId = u.Id,
                Username = u.UserName ?? "",
                Role = m.Role,
                JoinedAt = m.JoinedAt
            })
            .ToListAsync();

        return View(new ShopSettingsViewModel
        {
            ShopId = shopId,
            ShopName = shop.Name,
            Address = shop.Address,
            Phone = shop.Phone,
            CurrentUserRole = currentMember.Role,
            Members = members
        });
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    [RequireShop]
    public async Task<IActionResult> Invite(InviteMemberViewModel model)
    {
        var shopId = GetCurrentShopIdOrThrow();

        var currentMember = await _context.ShopMembers.FirstOrDefaultAsync(m => m.ShopId == shopId && m.UserId == CurrentUserId);
        if (currentMember == null || (currentMember.Role != ShopRole.Owner && currentMember.Role != ShopRole.Manager))
            return Forbid();

        var targetUser = await _userManager.FindByNameAsync(model.Username);
        if (targetUser == null)
        {
            TempData["Error"] = "Không tìm thấy người dùng.";
            return RedirectToAction("Settings");
        }

        if (await _context.ShopMembers.AnyAsync(m => m.ShopId == shopId && m.UserId == targetUser.Id))
        {
            TempData["Error"] = "Người dùng đã là thành viên của quán.";
            return RedirectToAction("Settings");
        }

        _context.ShopMembers.Add(new ShopMember { ShopId = shopId, UserId = targetUser.Id, Role = model.Role });
        await _context.SaveChangesAsync();

        TempData["Success"] = $"Đã mời {model.Username} vào quán!";
        return RedirectToAction("Settings");
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    [RequireShop]
    public async Task<IActionResult> UpdateMemberRole(string userId, ShopRole role)
    {
        var shopId = GetCurrentShopIdOrThrow();

        var currentMember = await _context.ShopMembers.FirstOrDefaultAsync(m => m.ShopId == shopId && m.UserId == CurrentUserId);
        if (currentMember == null || (currentMember.Role != ShopRole.Owner && currentMember.Role != ShopRole.Manager))
            return Forbid();

        var targetMember = await _context.ShopMembers.FirstOrDefaultAsync(m => m.ShopId == shopId && m.UserId == userId);
        if (targetMember == null) return NotFound();

        if (currentMember.Role == ShopRole.Manager && (targetMember.Role == ShopRole.Owner || role == ShopRole.Owner))
            return Forbid();

        if (targetMember.Role == ShopRole.Owner && role != ShopRole.Owner)
        {
            var ownerCount = await _context.ShopMembers.CountAsync(m => m.ShopId == shopId && m.Role == ShopRole.Owner);
            if (ownerCount <= 1)
            {
                TempData["Error"] = "Không thể hạ quyền Owner cuối cùng của quán.";
                return RedirectToAction("Settings");
            }
        }

        targetMember.Role = role;
        targetMember.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        TempData["Success"] = "Cập nhật vai trò thành công.";
        return RedirectToAction("Settings");
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    [RequireShop]
    public async Task<IActionResult> RemoveMember(string userId)
    {
        var shopId = GetCurrentShopIdOrThrow();

        var currentMember = await _context.ShopMembers.FirstOrDefaultAsync(m => m.ShopId == shopId && m.UserId == CurrentUserId);
        if (currentMember == null || (currentMember.Role != ShopRole.Owner && currentMember.Role != ShopRole.Manager))
            return Forbid();

        var targetMember = await _context.ShopMembers.FirstOrDefaultAsync(m => m.ShopId == shopId && m.UserId == userId);
        if (targetMember == null) return NotFound();

        if (currentMember.Role == ShopRole.Manager && targetMember.Role == ShopRole.Owner) return Forbid();

        if (targetMember.Role == ShopRole.Owner)
        {
            var ownerCount = await _context.ShopMembers.CountAsync(m => m.ShopId == shopId && m.Role == ShopRole.Owner);
            if (ownerCount <= 1)
            {
                TempData["Error"] = "Không thể xóa Owner cuối cùng của quán.";
                return RedirectToAction("Settings");
            }
        }

        _context.ShopMembers.Remove(targetMember);
        await _context.SaveChangesAsync();

        TempData["Success"] = "Đã xóa thành viên.";
        return RedirectToAction("Settings");
    }

    private Guid GetCurrentShopIdOrThrow()
    {
        var raw = HttpContext.Session.GetString("ShopId");
        if (Guid.TryParse(raw, out var id)) return id;
        throw new InvalidOperationException("Chưa chọn quán.");
    }
}
