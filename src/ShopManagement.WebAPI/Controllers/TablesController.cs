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
    public async Task<ActionResult<IEnumerable<TableDto>>> Get()
    {
        var result = await _tableService.GetAllTablesAsync();
        return Ok(result);
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

    [HttpPost("{id}/checkout")]
    public async Task<IActionResult> Checkout(Guid id)
    {
        try
        {
            await _tableService.CheckoutAsync(id);
            return Ok(new { message = "Thanh toán thành công." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
