using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShopManagement.Application.Interfaces;
using ShopManagement.Domain.Entities;
using ShopManagement.Infrastructure.Data;
using ShopManagement.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

namespace ShopManagement.WebAPI.Controllers;

[Authorize]
[ApiController]
[Route("api/shop")]
public class ShopController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public ShopController(AppDbContext context, UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    [HttpPost]
    public async Task<IActionResult> CreateShop([FromBody] CreateShopRequest request)
    {
        try 
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) 
            {
                Console.WriteLine("[CREATE SHOP] Unauthorized: No NameIdentifier claim found.");
                return Unauthorized();
            }

            // DIAGNOSTIC: Check if user exists in DB
            var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
            var totalUsers = await _context.Users.CountAsync();
            var diagnosticLog = $"[DIAGNOSTIC {DateTime.Now}]\n" +
                                $"UserId from Token: {userId}\n" +
                                $"User exists in DB: {userExists}\n" +
                                $"Total users in DB: {totalUsers}\n" +
                                "========================================\n";
            await System.IO.File.AppendAllTextAsync("diagnostic_log.txt", diagnosticLog);

            if (!userExists)
            {
                return BadRequest(new { Message = $"User ID '{userId}' không tồn tại. DB hiện có {totalUsers} users. Vui lòng logout và đăng ký lại." });
            }

            Console.WriteLine($"[CREATE SHOP] Creating shop '{request.Name}' for user {userId}");

            var shop = new Shop
            {
                Name = request.Name,
                Address = request.Address,
                Phone = request.PhoneNumber,
                OwnerId = userId
            };

            _context.Shops.Add(shop);
            
            // Add owner as a member with Owner role
            var member = new ShopMember
            {
                Shop = shop,
                UserId = userId,
                Role = ShopRole.Owner
            };
            _context.ShopMembers.Add(member);

            await _context.SaveChangesAsync();
            Console.WriteLine($"[CREATE SHOP] Success! ShopId: {shop.Id}");
            return Ok(new { Id = shop.Id, Message = "Tạo quán thành công!" });
        }
        catch (Exception ex)
        {
            Console.WriteLine("========================================");
            Console.WriteLine($"[CREATE SHOP ERROR] {DateTime.Now}");
            Console.WriteLine($"Message: {ex.Message}");
            Console.WriteLine($"Stack Trace: {ex.StackTrace}");
            if (ex.InnerException != null)
            {
                Console.WriteLine($"Inner Message: {ex.InnerException.Message}");
                Console.WriteLine($"Inner Stack Trace: {ex.InnerException.StackTrace}");
            }
            Console.WriteLine("========================================");
            return StatusCode(500, new { Message = "Lỗi hệ thống: " + ex.Message, Detail = ex.InnerException?.Message });
        }
    }

    [HttpPost("{shopId}/invite")]
    public async Task<IActionResult> InviteMember(Guid shopId, [FromBody] InviteRequest request)
    {
        // Only owner/manager can invite (Simple check for now)
        var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var isAuthorized = await _context.ShopMembers.AnyAsync(m => 
            m.ShopId == shopId && m.UserId == currentUserId && (m.Role == ShopRole.Owner || m.Role == ShopRole.Manager));
        
        if (!isAuthorized) return Forbid();

        var targetUser = await _userManager.FindByNameAsync(request.Username);
        if (targetUser == null) return NotFound("Không tìm thấy người dùng.");

        if (await _context.ShopMembers.AnyAsync(m => m.ShopId == shopId && m.UserId == targetUser.Id))
            return BadRequest("Người dùng đã là thành viên của quán.");

        var member = new ShopMember
        {
            ShopId = shopId,
            UserId = targetUser.Id,
            Role = request.Role
        };

        _context.ShopMembers.Add(member);
        await _context.SaveChangesAsync();

        return Ok(new { Message = $"Đã mời {request.Username} vào quán!" });
    }

    [HttpGet("{shopId}/members")]
    public async Task<IActionResult> GetMembers(Guid shopId)
    {
        var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var isAuthorized = await _context.ShopMembers.AnyAsync(m => m.ShopId == shopId && m.UserId == currentUserId);
        if (!isAuthorized) return Forbid();

        var members = await _context.ShopMembers
            .Where(m => m.ShopId == shopId)
            // JOIN với bảng Users để lấy tên (do UserManager khó Map thẳng trong LINQ)
            .Join(_context.Users, 
                  m => m.UserId, 
                  u => u.Id, 
                  (m, u) => new { UserId = u.Id, Username = u.UserName, Role = m.Role, JoinedAt = m.JoinedAt })
            .ToListAsync();

        return Ok(members);
    }

    [HttpPut("{shopId}/members/{userId}/role")]
    public async Task<IActionResult> UpdateMemberRole(Guid shopId, string userId, [FromBody] UpdateMemberRoleRequest request)
    {
        var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        var currentMember = await _context.ShopMembers.FirstOrDefaultAsync(m => m.ShopId == shopId && m.UserId == currentUserId);
        if (currentMember == null) return Forbid();
        if (currentMember.Role != ShopRole.Owner && currentMember.Role != ShopRole.Manager) return Forbid();

        var targetMember = await _context.ShopMembers.FirstOrDefaultAsync(m => m.ShopId == shopId && m.UserId == userId);
        if (targetMember == null) return NotFound(new { Message = "Không tìm thấy thành viên." });

        if (currentMember.Role == ShopRole.Manager)
        {
            if (targetMember.Role == ShopRole.Owner) return Forbid();
            if (request.Role == ShopRole.Owner) return Forbid();
        }

        if (targetMember.Role == ShopRole.Owner && request.Role != ShopRole.Owner)
        {
            var ownerCount = await _context.ShopMembers.CountAsync(m => m.ShopId == shopId && m.Role == ShopRole.Owner);
            if (ownerCount <= 1) return BadRequest(new { Message = "Không thể hạ quyền Owner cuối cùng của quán." });
        }

        targetMember.Role = request.Role;
        targetMember.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(new { Message = "Cập nhật vai trò thành công." });
    }

    [HttpDelete("{shopId}/members/{userId}")]
    public async Task<IActionResult> RemoveMember(Guid shopId, string userId)
    {
        var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        var currentMember = await _context.ShopMembers.FirstOrDefaultAsync(m => m.ShopId == shopId && m.UserId == currentUserId);
        if (currentMember == null) return Forbid();
        if (currentMember.Role != ShopRole.Owner && currentMember.Role != ShopRole.Manager) return Forbid();

        var targetMember = await _context.ShopMembers.FirstOrDefaultAsync(m => m.ShopId == shopId && m.UserId == userId);
        if (targetMember == null) return NotFound(new { Message = "Không tìm thấy thành viên." });

        if (currentMember.Role == ShopRole.Manager && targetMember.Role == ShopRole.Owner) return Forbid();

        if (targetMember.Role == ShopRole.Owner)
        {
            var ownerCount = await _context.ShopMembers.CountAsync(m => m.ShopId == shopId && m.Role == ShopRole.Owner);
            if (ownerCount <= 1) return BadRequest(new { Message = "Không thể xóa Owner cuối cùng của quán." });
        }

        _context.ShopMembers.Remove(targetMember);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpGet("my-shops")]
    public async Task<IActionResult> GetMyShops()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var shops = await _context.ShopMembers
            .Where(m => m.UserId == userId)
            .Select(m => new { m.Shop.Id, m.Shop.Name, m.Role })
            .ToListAsync();

        return Ok(shops);
    }
}

public record CreateShopRequest(string Name, string? Address, string? PhoneNumber, string? Description);
public record InviteRequest(string Username, ShopRole Role);
public record UpdateMemberRoleRequest(ShopRole Role);
