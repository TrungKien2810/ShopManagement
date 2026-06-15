using ShopManagement.Application.DTOs.Menu;
using ShopManagement.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace ShopManagement.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = "RequireStaff")]
public class CategoriesController : ControllerBase
{
    private readonly IMenuService _menuService;

    public CategoriesController(IMenuService menuService)
    {
        _menuService = menuService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CategoryDto>>> Get(
        [FromQuery] Guid? shopId = null,
        [FromQuery] Guid? branchId = null)
    {
        var result = await _menuService.GetCategoriesAsync(branchId);
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Policy = "RequireManager")]
    public async Task<ActionResult<CategoryDto>> Post([FromBody] CreateCategoryDto request)
    {
        var result = await _menuService.AddCategoryAsync(request);
        return CreatedAtAction(nameof(Get), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    [Authorize(Policy = "RequireManager")]
    public async Task<ActionResult<CategoryDto>> Put(Guid id, [FromBody] UpdateCategoryDto request)
    {
        var result = await _menuService.UpdateCategoryAsync(id, request);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    [Authorize(Policy = "RequireManager")]
    public async Task<IActionResult> Delete(Guid id, [FromQuery] bool force = false)
    {
        if (force)
            await _menuService.ForceDeleteCategoryAsync(id);
        else
            await _menuService.DeleteCategoryAsync(id);

        return NoContent();
    }
}
