using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopManagement.Domain.Entities;
using ShopManagement.Infrastructure.Data;
using System.Security.Claims;

namespace ShopManagement.WebAPI.Controllers;

[Authorize]
[ApiController]
[Route("api/shop/{shopId}/branches")]
public class BranchController : ControllerBase
{
    private readonly AppDbContext _context;

    public BranchController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetBranches(Guid shopId)
    {
        var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        // Check if user is a member of the shop
        var isMember = await _context.ShopMembers.AnyAsync(m => m.ShopId == shopId && m.UserId == currentUserId);
        if (!isMember) return Forbid();

        var branches = await _context.Branches
            .Where(b => b.ShopId == shopId)
            .Select(b => new { b.Id, b.Name, b.Address, b.Phone })
            .ToListAsync();

        return Ok(branches);
    }

    [HttpPost]
    public async Task<IActionResult> CreateBranch(Guid shopId, [FromBody] CreateBranchRequest request)
    {
        var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        // Ensure user is Owner or Manager of the shop
        var member = await _context.ShopMembers.FirstOrDefaultAsync(m => m.ShopId == shopId && m.UserId == currentUserId);
        if (member == null || (member.Role != ShopRole.Owner && member.Role != ShopRole.Manager)) 
            return Forbid();

        var branch = new Branch
        {
            ShopId = shopId,
            Name = request.Name,
            Address = request.Address,
            Phone = request.Phone
        };

        _context.Branches.Add(branch);
        await _context.SaveChangesAsync();

        return Ok(new { branch.Id, branch.Name, branch.Address, branch.Phone, Message = "Tạo cơ sở thành công!" });
    }
}

public record CreateBranchRequest(string Name, string? Address, string? Phone);
