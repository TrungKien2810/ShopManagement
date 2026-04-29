using ShopManagement.Application.DTOs.Menu;
using ShopManagement.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace ShopManagement.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = "RequireStaff")]
public class MenuController : ControllerBase
{
    private readonly IMenuService _menuService;

    public MenuController(IMenuService menuService)
    {
        _menuService = menuService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CategoryDto>>> GetMenu()
    {
        var menu = await _menuService.GetMenuAsync();
        return Ok(menu);
    }

    [HttpPost("categories")]
    [Authorize(Policy = "RequireManager")]
    public async Task<ActionResult<CategoryDto>> CreateCategory([FromBody] CreateCategoryDto request)
    {
        var result = await _menuService.AddCategoryAsync(request);
        return Ok(result);
    }

    [HttpPut("categories/{id}")]
    [Authorize(Policy = "RequireManager")]
    public async Task<ActionResult<CategoryDto>> UpdateCategory(Guid id, [FromBody] UpdateCategoryDto request)
    {
        var result = await _menuService.UpdateCategoryAsync(id, request);
        return Ok(result);
    }

    [HttpPost("products")]
    [Authorize(Policy = "RequireManager")]
    public async Task<ActionResult<ProductDto>> CreateProduct([FromBody] CreateProductDto request)
    {
        var result = await _menuService.AddProductAsync(request);
        return Ok(result);
    }

    [HttpPut("products/{id}")]
    [Authorize(Policy = "RequireManager")]
    public async Task<ActionResult<ProductDto>> UpdateProduct(Guid id, [FromBody] UpdateProductDto request)
    {
        var result = await _menuService.UpdateProductAsync(id, request);
        return Ok(result);
    }
}
