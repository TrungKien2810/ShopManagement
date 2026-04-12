using ShopManagement.Application.DTOs.Menu;
using ShopManagement.Application.Interfaces;
using ShopManagement.Domain.Entities;

namespace ShopManagement.Application.Services;

public class MenuService : IMenuService
{
    private readonly IUnitOfWork _unitOfWork;

    public MenuService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<IEnumerable<CategoryDto>> GetMenuAsync()
    {
        var categories = await _unitOfWork.Categories.GetAllAsync();
        var menu = new List<CategoryDto>();

        foreach (var cat in categories)
        {
            var products = await _unitOfWork.Products.GetByCategoryIdAsync(cat.Id);
            menu.Add(new CategoryDto
            {
                Id = cat.Id,
                Name = cat.Name,
                Products = products.Select(p => new ProductDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Price = p.Price,
                    ImageUrl = p.ImageUrl,
                    Description = p.Description
                })
            });
        }

        return menu;
    }
}
