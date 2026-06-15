using ShopManagement.Application.DTOs.Menu;
using ShopManagement.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace ShopManagement.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = "RequireStaff")]
public class MenuItemsController : ControllerBase
{
    private readonly IMenuService _menuService;

    public MenuItemsController(IMenuService menuService)
    {
        _menuService = menuService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProductDto>>> Get([FromQuery] Guid? branchId = null)
    {
        var result = await _menuService.GetMenuItemsAsync(branchId);
        return Ok(result);
    }

    [HttpGet("combined/{branchId}")]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetCombined(Guid branchId)
    {
        var result = await _menuService.GetCombinedMenuItemsAsync(branchId);
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Policy = "RequireManager")]
    public async Task<ActionResult<ProductDto>> Post([FromBody] CreateProductDto request)
    {
        var result = await _menuService.AddProductAsync(request);
        return CreatedAtAction(nameof(Get), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    [Authorize(Policy = "RequireManager")]
    public async Task<ActionResult<ProductDto>> Put(Guid id, [FromBody] UpdateProductDto request)
    {
        var result = await _menuService.UpdateProductAsync(id, request);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    [Authorize(Policy = "RequireManager")]
    public async Task<IActionResult> Delete(Guid id, [FromQuery] bool force = false)
    {
        if (force)
            await _menuService.ForceDeleteProductAsync(id);
        else
            await _menuService.DeleteProductAsync(id);

        return NoContent();
    }
}
