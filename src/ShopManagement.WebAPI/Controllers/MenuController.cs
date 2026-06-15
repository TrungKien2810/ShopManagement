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

    // Đọc menu công khai (dùng cho trang QR / thực đơn khách xem).
    // CRUD danh mục & sản phẩm được xử lý bởi CategoriesController và MenuItemsController.
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<CategoryDto>>> GetMenu()
    {
        var menu = await _menuService.GetMenuAsync();
        return Ok(menu);
    }
}
