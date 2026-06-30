using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopManagement.Application.Interfaces;
using ShopManagement.Infrastructure.Data;
using ShopManagement.Infrastructure.Identity;
using ShopManagement.Web.Models;

namespace ShopManagement.Web.Controllers;

public class AccountController : Controller
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly AppDbContext _context;
    private readonly IPhotoService _photoService;

    public AccountController(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        AppDbContext context,
        IPhotoService photoService)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _context = context;
        _photoService = photoService;
    }

    [AllowAnonymous]
    [HttpGet]
    public IActionResult Login(string? returnUrl = null)
    {
        if (User.Identity?.IsAuthenticated == true)
            return RedirectToAction("Index", "Home");

        return View(new LoginViewModel { ReturnUrl = returnUrl });
    }

    [AllowAnonymous]
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Login(LoginViewModel model)
    {
        if (!ModelState.IsValid) return View(model);

        var user = await _userManager.FindByNameAsync(model.Username);
        if (user == null)
        {
            ModelState.AddModelError(string.Empty, "Sai tài khoản hoặc mật khẩu.");
            return View(model);
        }

        var result = await _signInManager.PasswordSignInAsync(user, model.Password, isPersistent: model.RememberMe, lockoutOnFailure: false);
        if (!result.Succeeded)
        {
            ModelState.AddModelError(string.Empty, "Sai tài khoản hoặc mật khẩu.");
            return View(model);
        }

        await EstablishTenantSessionAsync(user.Id);

        if (!string.IsNullOrEmpty(model.ReturnUrl) && Url.IsLocalUrl(model.ReturnUrl))
            return Redirect(model.ReturnUrl);

        return RedirectToAction("Index", "Home");
    }

    [AllowAnonymous]
    [HttpGet]
    public IActionResult Register()
    {
        if (User.Identity?.IsAuthenticated == true)
            return RedirectToAction("Index", "Home");

        return View(new RegisterViewModel());
    }

    [AllowAnonymous]
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Register(RegisterViewModel model)
    {
        if (!ModelState.IsValid) return View(model);

        var user = new ApplicationUser
        {
            UserName = model.Username,
            Email = model.Email,
            FullName = model.FullName
        };

        var result = await _userManager.CreateAsync(user, model.Password);
        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
                ModelState.AddModelError(string.Empty, error.Description);
            return View(model);
        }

        await _signInManager.SignInAsync(user, isPersistent: true);

        return RedirectToAction("Index", "Shop");
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Logout()
    {
        await _signInManager.SignOutAsync();
        HttpContext.Session.Clear();
        return RedirectToAction("Login");
    }

    [HttpGet]
    public IActionResult AccessDenied()
    {
        // A missing shop selection (not a real permission failure) trips the
        // role policies because the tenant can't be resolved. Send the user to
        // pick a shop instead of showing a misleading "access denied" page.
        if (string.IsNullOrEmpty(HttpContext.Session.GetString("ShopId")))
        {
            TempData["Warning"] = "Vui lòng chọn quán để tiếp tục.";
            return RedirectToAction("Index", "Shop");
        }

        return View();
    }

    [HttpGet]
    public async Task<IActionResult> Profile()
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null) return RedirectToAction("Login");

        return View(new ProfileViewModel
        {
            FullName = user.FullName,
            Email = user.Email,
            Username = user.UserName,
            AvatarUrl = user.AvatarUrl
        });
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> UpdateAvatar(IFormFile? avatarFile)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null) return RedirectToAction("Login");

        if (avatarFile != null)
        {
            var url = await _photoService.AddphotoAsync(avatarFile);
            if (url != null)
            {
                user.AvatarUrl = url;
                await _userManager.UpdateAsync(user);
                TempData["Success"] = "Cập nhật avatar thành công.";
            }
            else
            {
                TempData["Error"] = "Lỗi khi upload ảnh.";
            }
        }

        return RedirectToAction("Profile");
    }

    [HttpGet]
    public IActionResult ChangePassword() => View(new ChangePasswordViewModel());

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> ChangePassword(ChangePasswordViewModel model)
    {
        if (!ModelState.IsValid) return View(model);

        var user = await _userManager.GetUserAsync(User);
        if (user == null) return RedirectToAction("Login");

        var result = await _userManager.ChangePasswordAsync(user, model.OldPassword, model.NewPassword);
        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
                ModelState.AddModelError(string.Empty, error.Description);
            return View(model);
        }

        TempData["Success"] = "Đổi mật khẩu thành công.";
        return RedirectToAction("Profile");
    }

    private async Task EstablishTenantSessionAsync(string userId)
    {
        var memberships = await _context.ShopMembers
            .Where(m => m.UserId == userId)
            .Select(m => new { m.ShopId })
            .ToListAsync();

        if (memberships.Count == 1)
        {
            var shopId = memberships[0].ShopId;
            HttpContext.Session.SetString("ShopId", shopId.ToString());

            var branches = await _context.Branches
                .Where(b => b.ShopId == shopId)
                .Select(b => b.Id)
                .ToListAsync();

            if (branches.Count == 1)
            {
                HttpContext.Session.SetString("BranchId", branches[0].ToString());
            }
        }
    }
}
