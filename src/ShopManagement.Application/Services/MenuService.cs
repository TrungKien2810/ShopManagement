using ShopManagement.Application.DTOs.Menu;
using ShopManagement.Application.Interfaces;
using ShopManagement.Domain.Entities;
using ShopManagement.Domain.Exceptions;

namespace ShopManagement.Application.Services;

public class MenuService : IMenuService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ITenantService _tenantService;

    public MenuService(IUnitOfWork unitOfWork, ITenantService tenantService)
    {
        _unitOfWork = unitOfWork;
        _tenantService = tenantService;
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
                Description = cat.Description,
                IsActive = cat.IsActive,
                Products = products.Select(p => new ProductDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Price = p.Price,
                    ImageUrl = p.ImageUrl,
                    Description = p.Description,
                    IsAvailable = p.IsAvailable
                })
            });
        }

        return menu;
    }

    public async Task<CategoryDto> AddCategoryAsync(CreateCategoryDto request)
    {
        var shopId = _tenantService.GetTenantId();
        if (!shopId.HasValue) throw new UnauthorizedAccessException("Không xác định được ShopId");

        var category = new Category
        {
            Id = Guid.NewGuid(),
            ShopId = shopId.Value,
            Name = request.Name,
            Description = request.Description,
            IsActive = request.IsActive
        };

        await _unitOfWork.Categories.AddAsync(category);
        await _unitOfWork.SaveChangesAsync();

        return new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description,
            IsActive = category.IsActive,
            Products = new List<ProductDto>()
        };
    }

    public async Task<ProductDto> AddProductAsync(CreateProductDto request)
    {
        var shopId = _tenantService.GetTenantId();
        if (!shopId.HasValue) throw new UnauthorizedAccessException("Không xác định được ShopId");

        var category = await _unitOfWork.Categories.GetByIdAsync(request.CategoryId);
        if (category == null) throw new EntityNotFoundException("Danh mục", request.CategoryId);
        if (category.ShopId != shopId.Value) throw new DomainException("Danh mục không thuộc quán hiện tại.");

        var product = new Product
        {
            Id = Guid.NewGuid(),
            ShopId = shopId.Value,
            CategoryId = request.CategoryId,
            Name = request.Name,
            Price = request.Price,
            Description = request.Description,
            ImageUrl = request.ImageUrl,
            IsAvailable = request.IsAvailable
        };

        await _unitOfWork.Products.AddAsync(product);
        await _unitOfWork.SaveChangesAsync();

        return new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Price = product.Price,
            ImageUrl = product.ImageUrl,
            Description = product.Description,
            IsAvailable = product.IsAvailable
        };
    }

    public async Task<CategoryDto> UpdateCategoryAsync(Guid categoryId, UpdateCategoryDto request)
    {
        var shopId = _tenantService.GetTenantId();
        if (!shopId.HasValue) throw new UnauthorizedAccessException("Không xác định được ShopId");

        var category = await _unitOfWork.Categories.GetByIdAsync(categoryId);
        if (category == null) throw new EntityNotFoundException("Danh mục", categoryId);
        if (category.ShopId != shopId.Value) throw new DomainException("Danh mục không thuộc quán hiện tại.");

        if (!string.IsNullOrWhiteSpace(request.Name)) category.Name = request.Name.Trim();
        if (request.Description != null) category.Description = request.Description;
        if (request.IsActive.HasValue) category.IsActive = request.IsActive.Value;

        await _unitOfWork.Categories.UpdateAsync(category);
        await _unitOfWork.SaveChangesAsync();

        return new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description,
            IsActive = category.IsActive,
            Products = new List<ProductDto>()
        };
    }

    public async Task<ProductDto> UpdateProductAsync(Guid productId, UpdateProductDto request)
    {
        var shopId = _tenantService.GetTenantId();
        if (!shopId.HasValue) throw new UnauthorizedAccessException("Không xác định được ShopId");

        var product = await _unitOfWork.Products.GetByIdAsync(productId);
        if (product == null) throw new EntityNotFoundException("Sản phẩm", productId);
        if (product.ShopId != shopId.Value) throw new DomainException("Sản phẩm không thuộc quán hiện tại.");

        if (request.CategoryId.HasValue && request.CategoryId.Value != product.CategoryId)
        {
            var category = await _unitOfWork.Categories.GetByIdAsync(request.CategoryId.Value);
            if (category == null) throw new EntityNotFoundException("Danh mục", request.CategoryId.Value);
            if (category.ShopId != shopId.Value) throw new DomainException("Danh mục không thuộc quán hiện tại.");
            product.CategoryId = request.CategoryId.Value;
        }

        if (!string.IsNullOrWhiteSpace(request.Name)) product.Name = request.Name.Trim();
        if (request.Price.HasValue) product.Price = request.Price.Value;
        if (request.Description != null) product.Description = request.Description;
        if (request.ImageUrl != null) product.ImageUrl = request.ImageUrl;
        if (request.IsAvailable.HasValue) product.IsAvailable = request.IsAvailable.Value;

        await _unitOfWork.Products.UpdateAsync(product);
        await _unitOfWork.SaveChangesAsync();

        return new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Price = product.Price,
            ImageUrl = product.ImageUrl,
            Description = product.Description,
            IsAvailable = product.IsAvailable
        };
    }
}
