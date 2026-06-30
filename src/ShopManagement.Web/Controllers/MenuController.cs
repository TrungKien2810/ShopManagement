using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShopManagement.Application.DTOs.Menu;
using ShopManagement.Application.Interfaces;
using ShopManagement.Web.Models;

namespace ShopManagement.Web.Controllers;

[Authorize(Policy = "RequireStaff")]
public class MenuController : Controller
{
    private readonly IMenuService _menuService;
    private readonly IPhotoService _photoService;

    public MenuController(IMenuService menuService, IPhotoService photoService)
    {
        _menuService = menuService;
        _photoService = photoService;
    }

    public async Task<IActionResult> Index()
    {
        var categories = await _menuService.GetMenuAsync();
        return View(categories);
    }

    [HttpGet]
    [Authorize(Policy = "RequireManager")]
    public IActionResult CreateCategory() => View(new CategoryFormViewModel());

    [HttpPost]
    [Authorize(Policy = "RequireManager")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> CreateCategory(CategoryFormViewModel model)
    {
        if (!ModelState.IsValid) return View(model);

        await _menuService.AddCategoryAsync(new CreateCategoryDto
        {
            Name = model.Name,
            Description = model.Description
        });

        return RedirectToAction("Index");
    }

    [HttpGet]
    [Authorize(Policy = "RequireManager")]
    public async Task<IActionResult> EditCategory(Guid id)
    {
        var category = (await _menuService.GetCategoriesAsync()).FirstOrDefault(c => c.Id == id);
        if (category == null) return NotFound();

        return View(new CategoryFormViewModel { Id = category.Id, Name = category.Name, Description = category.Description });
    }

    [HttpPost]
    [Authorize(Policy = "RequireManager")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> EditCategory(CategoryFormViewModel model)
    {
        if (model.Id == null) return BadRequest();
        if (!ModelState.IsValid) return View(model);

        await _menuService.UpdateCategoryAsync(model.Id.Value, new UpdateCategoryDto
        {
            Name = model.Name,
            Description = model.Description
        });

        return RedirectToAction("Index");
    }

    [HttpPost]
    [Authorize(Policy = "RequireManager")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteCategory(Guid id)
    {
        try
        {
            await _menuService.DeleteCategoryAsync(id);
        }
        catch (Exception ex)
        {
            TempData["Error"] = ex.Message;
        }
        return RedirectToAction("Index");
    }

    [HttpGet]
    [Authorize(Policy = "RequireManager")]
    public async Task<IActionResult> CreateProduct()
    {
        var categories = await _menuService.GetCategoriesAsync();
        return View(new ProductFormViewModel
        {
            CategoryOptions = categories.Select(c => new CategoryOption { Id = c.Id, Name = c.Name }).ToList()
        });
    }

    [HttpPost]
    [Authorize(Policy = "RequireManager")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> CreateProduct(ProductFormViewModel model)
    {
        if (!ModelState.IsValid)
        {
            var categories = await _menuService.GetCategoriesAsync();
            model.CategoryOptions = categories.Select(c => new CategoryOption { Id = c.Id, Name = c.Name }).ToList();
            return View(model);
        }

        string? imageUrl = null;
        if (model.ImageFile != null)
        {
            imageUrl = await _photoService.AddphotoAsync(model.ImageFile);
        }

        await _menuService.AddProductAsync(new CreateProductDto
        {
            Name = model.Name,
            Price = model.Price,
            Description = model.Description,
            CategoryId = model.CategoryId,
            ImageUrl = imageUrl,
            IsAvailable = model.IsAvailable
        });

        return RedirectToAction("Index");
    }

    [HttpGet]
    [Authorize(Policy = "RequireManager")]
    public async Task<IActionResult> EditProduct(Guid id)
    {
        var product = (await _menuService.GetMenuItemsAsync()).FirstOrDefault(p => p.Id == id);
        if (product == null) return NotFound();

        var categories = await _menuService.GetCategoriesAsync();
        return View(new ProductFormViewModel
        {
            Id = product.Id,
            Name = product.Name,
            Price = product.Price,
            Description = product.Description,
            CategoryId = product.CategoryId,
            ExistingImageUrl = product.ImageUrl,
            IsAvailable = product.IsAvailable,
            CategoryOptions = categories.Select(c => new CategoryOption { Id = c.Id, Name = c.Name }).ToList()
        });
    }

    [HttpPost]
    [Authorize(Policy = "RequireManager")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> EditProduct(ProductFormViewModel model)
    {
        if (model.Id == null) return BadRequest();

        if (!ModelState.IsValid)
        {
            var categories = await _menuService.GetCategoriesAsync();
            model.CategoryOptions = categories.Select(c => new CategoryOption { Id = c.Id, Name = c.Name }).ToList();
            return View(model);
        }

        string? imageUrl = model.ExistingImageUrl;
        if (model.ImageFile != null)
        {
            imageUrl = await _photoService.AddphotoAsync(model.ImageFile);
        }

        await _menuService.UpdateProductAsync(model.Id.Value, new UpdateProductDto
        {
            Name = model.Name,
            Price = model.Price,
            Description = model.Description,
            CategoryId = model.CategoryId,
            ImageUrl = imageUrl,
            IsAvailable = model.IsAvailable
        });

        return RedirectToAction("Index");
    }

    [HttpPost]
    [Authorize(Policy = "RequireManager")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteProduct(Guid id)
    {
        try
        {
            await _menuService.DeleteProductAsync(id);
        }
        catch (Exception ex)
        {
            TempData["Error"] = ex.Message;
        }
        return RedirectToAction("Index");
    }

    [HttpPost]
    [Authorize(Policy = "RequireManager")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> ToggleAvailability(Guid id)
    {
        var product = (await _menuService.GetMenuItemsAsync()).FirstOrDefault(p => p.Id == id);
        if (product == null) return NotFound();

        await _menuService.UpdateProductAsync(id, new UpdateProductDto { IsAvailable = !product.IsAvailable });
        return RedirectToAction("Index");
    }
}
