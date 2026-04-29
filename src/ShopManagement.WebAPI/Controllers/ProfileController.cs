using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ShopManagement.Infrastructure.Identity;
using ShopManagement.Application.DTOs.AccountDropDown;
using ShopManagement.Application.Interfaces;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Linq;

namespace ShopManagement.WebAPI.Controllers;

[Authorize]
[ApiController]
[Route("api/auth/profile")]
public class ProfileController : ControllerBase
{
    private readonly IPhotoService _photoService;
    private readonly UserManager<ApplicationUser> _userManager;

    public ProfileController(IPhotoService photoService, UserManager<ApplicationUser> userManager)
    {
        _photoService = photoService;
        _userManager = userManager;
    }

    [HttpPut("avatar")]
    public async Task<IActionResult> UpdateAvatar([FromForm] UpdateAvatarDto request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return NotFound(new { message = "Không tìm thấy người dùng" });

        var cloudLink = await _photoService.AddphotoAsync(request.File);
        if (cloudLink == null) return BadRequest(new {
            message = "Lỗi khi upload ảnh lên hệ thống"
        });

        user.AvatarUrl = cloudLink;
        var result = await _userManager.UpdateAsync(user);

        if (!result.Succeeded) return BadRequest(new { message = "Không thể cập nhật ảnh đại diện vào cơ sở dữ liệu" });

        return Ok(new {
            message = "Cập nhật avatar thành công",
            avatarUrl = cloudLink
        });
    }

    [HttpPut("password")]
    public async Task<IActionResult> UpdatePassword([FromBody] UpdatePasswordDto request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return NotFound(new { message = "Không tìm thấy người dùng" });

        var result = await _userManager.ChangePasswordAsync(user, request.OldPassword, request.NewPassword);

        if (!result.Succeeded)
        {
            return BadRequest(new { 
                message = "Đổi mật khẩu thất bại", 
                errors = result.Errors.Select(e => e.Description) 
            });
        }

        return Ok(new { message = "Đổi mật khẩu thành công" });
    }
}