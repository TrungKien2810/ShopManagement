using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShopManagement.Application.Interfaces;
using ShopManagement.Domain.Entities;

namespace ShopManagement.WebAPI.Controllers;

[ApiController]
[Route("api/table-areas")]
[Authorize(Policy = "RequireStaff")]
public class TableAreasController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ITenantService _tenantService;

    public TableAreasController(IUnitOfWork unitOfWork, ITenantService tenantService)
    {
        _unitOfWork = unitOfWork;
        _tenantService = tenantService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] bool activeOnly = true)
    {
        var _ = _tenantService.GetTenantId() ?? throw new UnauthorizedAccessException("ShopId not found");
        var areas = await _unitOfWork.TableAreas.GetAllAsync(activeOnly);
        return Ok(areas.Select(a => new { a.Id, a.Name, a.IsActive, a.SortOrder }));
    }

    [HttpPost]
    [Authorize(Policy = "RequireManager")]
    public async Task<IActionResult> Create([FromBody] CreateTableAreaRequest request)
    {
        var shopId = _tenantService.GetTenantId() ?? throw new UnauthorizedAccessException("ShopId not found");
        if (string.IsNullOrWhiteSpace(request.Name)) return BadRequest(new { Message = "Tên khu vực không được để trống." });

        var area = new TableArea
        {
            Id = Guid.NewGuid(),
            ShopId = shopId,
            Name = request.Name.Trim(),
            SortOrder = request.SortOrder ?? 0,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _unitOfWork.TableAreas.AddAsync(area);
        await _unitOfWork.SaveChangesAsync();

        return Ok(new { area.Id, area.Name, area.IsActive, area.SortOrder });
    }

    [HttpPut("{id}")]
    [Authorize(Policy = "RequireManager")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateTableAreaRequest request)
    {
        var shopId = _tenantService.GetTenantId() ?? throw new UnauthorizedAccessException("ShopId not found");

        var area = await _unitOfWork.TableAreas.GetByIdAsync(id);
        if (area == null) return NotFound(new { Message = "Không tìm thấy khu vực." });
        if (area.ShopId != shopId) return Forbid();

        if (request.Name != null) area.Name = request.Name.Trim();
        if (request.SortOrder.HasValue) area.SortOrder = request.SortOrder.Value;
        if (request.IsActive.HasValue) area.IsActive = request.IsActive.Value;
        area.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.TableAreas.UpdateAsync(area);
        await _unitOfWork.SaveChangesAsync();

        return Ok(new { area.Id, area.Name, area.IsActive, area.SortOrder });
    }

    [HttpDelete("{id}")]
    [Authorize(Policy = "RequireManager")]
    public async Task<IActionResult> Delete(Guid id, [FromQuery] string deleteMode = "deactivate")
    {
        var shopId = _tenantService.GetTenantId() ?? throw new UnauthorizedAccessException("ShopId not found");

        var area = await _unitOfWork.TableAreas.GetByIdAsync(id);
        if (area == null) return NotFound(new { Message = "Không tìm thấy khu vực." });
        if (area.ShopId != shopId) return Forbid();

        var tablesInArea = (await _unitOfWork.Tables.GetByAreaIdAsync(id)).ToList();

        if (deleteMode == "deleteTables")
        {
            foreach (var table in tablesInArea)
            {
                var activeOrder = await _unitOfWork.Orders.GetActiveOrderByTableIdAsync(table.Id);
                if (activeOrder != null)
                {
                    return BadRequest(new { message = "Bàn đang có đơn hàng chưa thanh toán" });
                }
            }

            foreach (var table in tablesInArea)
            {
                await _unitOfWork.Tables.HardDeleteAsync(table);
            }

            await _unitOfWork.TableAreas.HardDeleteAsync(area);
            await _unitOfWork.SaveChangesAsync();
            return NoContent();
        }

        if (deleteMode == "keepTables")
        {
            foreach (var table in tablesInArea)
            {
                table.AreaId = null;
                table.Location = "Chưa có khu vực";
                await _unitOfWork.Tables.UpdateAsync(table);
            }

            await _unitOfWork.TableAreas.HardDeleteAsync(area);
            await _unitOfWork.SaveChangesAsync();
            return NoContent();
        }

        // Default: soft deactivate area, keep tables linked
        area.IsActive = false;
        area.UpdatedAt = DateTime.UtcNow;
        await _unitOfWork.TableAreas.UpdateAsync(area);
        await _unitOfWork.SaveChangesAsync();

        return NoContent();
    }
}

public record CreateTableAreaRequest(string Name, int? SortOrder);
public record UpdateTableAreaRequest(string? Name, int? SortOrder, bool? IsActive);

