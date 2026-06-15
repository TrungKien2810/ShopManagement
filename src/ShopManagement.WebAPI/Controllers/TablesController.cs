using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using ShopManagement.Application.DTOs.Tables;
using ShopManagement.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace ShopManagement.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = "RequireStaff")]
public class TablesController : ControllerBase
{
    private readonly ITableService _tableService;

    public TablesController(ITableService tableService)
    {
        _tableService = tableService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TableDto>>> Get([FromQuery] Guid? branchId = null)
    {
        var result = await _tableService.GetAllTablesAsync(branchId);
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<TableDto>> CreateTable([FromBody] ShopManagement.Application.DTOs.Table.CreateTableDto request)
    {
        var result = await _tableService.CreateTableAsync(request);
        return CreatedAtAction(nameof(Get), new { id = result.Id }, result);
    }

    [HttpPost("{id}/reset")]
    public async Task<IActionResult> Reset(Guid id)
    {
        await _tableService.ResetTableAsync(id);
        return Ok();
    }

    [HttpPost("{id}/open")]
    public async Task<ActionResult<OpenTableResponse>> OpenTable(Guid id)
    {
        try
        {
            var result = await _tableService.OpenTableAsync(id);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("{id}/transfer/{toId}")]
    public async Task<ActionResult<TransferTableResponse>> TransferTable(Guid id, Guid toId)
    {
        try
        {
            var result = await _tableService.TransferTableAsync(id, toId);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<TableDto>> UpdateTable(Guid id, [FromBody] ShopManagement.Application.DTOs.Table.CreateTableDto request)
    {
        var result = await _tableService.UpdateTableAsync(id, request);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTable(Guid id)
    {
        await _tableService.DeleteTableAsync(id);
        return NoContent();
    }
}
