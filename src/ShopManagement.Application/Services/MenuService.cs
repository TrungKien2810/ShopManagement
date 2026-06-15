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
        var branchId = _tenantService.GetBranchId();
        var categories = (branchId.HasValue
                ? await _unitOfWork.Categories.GetCombinedByBranchIdAsync(branchId.Value)
                : await _unitOfWork.Categories.GetAllAsync())
            .Where(c => !branchId.HasValue ? c.BranchId == null : true)
            .ToList();

        if (categories.Count == 0) return Array.Empty<CategoryDto>();

        var products = branchId.HasValue
            ? await _unitOfWork.Products.GetCombinedByBranchIdAsync(branchId.Value)
            : await _unitOfWork.Products.GetGlobalAsync();

        var productsByCategoryId = products
            .GroupBy(p => p.CategoryId)
            .ToDictionary(g => g.Key, g => g.Select(MapProduct).ToList());

        return categories.Select(category => new CategoryDto
        {
            Id = category.Id,
            ShopId = category.ShopId,
            Name = category.Name,
            Description = category.Description,
            IsActive = category.IsActive,
            BranchId = category.BranchId,
            Products = productsByCategoryId.TryGetValue(category.Id, out var list)
                ? list
                : []
        });
    }

    public async Task<IEnumerable<CategoryDto>> GetCategoriesAsync(Guid? branchId = null)
    {
        var categories = branchId.HasValue
            ? await _unitOfWork.Categories.GetCombinedByBranchIdAsync(branchId.Value)
            : (await _unitOfWork.Categories.GetAllAsync()).Where(c => c.BranchId == null);

        return categories.Select(c => new CategoryDto
        {
            Id = c.Id,
            ShopId = c.ShopId,
            Name = c.Name,
            Description = c.Description,
            IsActive = c.IsActive,
            BranchId = c.BranchId,
            Products = []
        });
    }

    public async Task<IEnumerable<ProductDto>> GetMenuItemsAsync(Guid? branchId = null)
    {
        var products = branchId.HasValue
            ? await _unitOfWork.Products.GetCombinedByBranchIdAsync(branchId.Value)
            : await _unitOfWork.Products.GetGlobalAsync();

        return products.Select(MapProduct);
    }

    public async Task<IEnumerable<ProductDto>> GetCombinedMenuItemsAsync(Guid branchId)
    {
        var products = await _unitOfWork.Products.GetCombinedByBranchIdAsync(branchId);
        return products.Select(MapProduct);
    }

    public async Task<CategoryDto> AddCategoryAsync(CreateCategoryDto request)
    {
        var shopId = _tenantService.GetTenantId() ?? throw new UnauthorizedAccessException("Không xác định được ShopId");
        if (request.ShopId != Guid.Empty && request.ShopId != shopId)
        {
            throw new DomainException("ShopId không khớp với tenant hiện tại.");
        }

        var category = new Category
        {
            Id = Guid.NewGuid(),
            ShopId = shopId,
            BranchId = request.BranchId,
            Name = request.Name.Trim(),
            Description = request.Description,
            IsActive = request.IsActive
        };

        await _unitOfWork.Categories.AddAsync(category);
        await _unitOfWork.SaveChangesAsync();
        return MapCategory(category);
    }

    public async Task<ProductDto> AddProductAsync(CreateProductDto request)
    {
        var shopId = _tenantService.GetTenantId() ?? throw new UnauthorizedAccessException("Không xác định được ShopId");
        if (request.ShopId != Guid.Empty && request.ShopId != shopId)
        {
            throw new DomainException("ShopId không khớp với tenant hiện tại.");
        }

        var category = await _unitOfWork.Categories.GetByIdAsync(request.CategoryId);
        if (category == null) throw new EntityNotFoundException("Danh mục", request.CategoryId);
        if (category.ShopId != shopId) throw new DomainException("Danh mục không thuộc quán hiện tại.");

        var product = new Product
        {
            Id = Guid.NewGuid(),
            ShopId = shopId,
            BranchId = request.BranchId,
            CategoryId = request.CategoryId,
            Name = request.Name.Trim(),
            Price = request.Price,
            Description = request.Description,
            ImageUrl = request.ImageUrl,
            IsAvailable = request.IsAvailable
        };

        await _unitOfWork.Products.AddAsync(product);
        await _unitOfWork.SaveChangesAsync();
        return MapProduct(product);
    }

    public async Task<CategoryDto> UpdateCategoryAsync(Guid categoryId, UpdateCategoryDto request)
    {
        var shopId = _tenantService.GetTenantId() ?? throw new UnauthorizedAccessException("Không xác định được ShopId");
        var category = await _unitOfWork.Categories.GetByIdAsync(categoryId);
        if (category == null) throw new EntityNotFoundException("Danh mục", categoryId);
        if (category.ShopId != shopId) throw new DomainException("Danh mục không thuộc quán hiện tại.");

        if (!string.IsNullOrWhiteSpace(request.Name)) category.Name = request.Name.Trim();
        if (request.Description != null) category.Description = request.Description;
        if (request.IsActive.HasValue) category.IsActive = request.IsActive.Value;
        category.BranchId = request.BranchId;

        await _unitOfWork.Categories.UpdateAsync(category);
        await _unitOfWork.SaveChangesAsync();
        return MapCategory(category);
    }

    public async Task<ProductDto> UpdateProductAsync(Guid productId, UpdateProductDto request)
    {
        var shopId = _tenantService.GetTenantId() ?? throw new UnauthorizedAccessException("Không xác định được ShopId");
        var product = await _unitOfWork.Products.GetByIdAsync(productId);
        if (product == null) throw new EntityNotFoundException("Sản phẩm", productId);
        if (product.ShopId != shopId) throw new DomainException("Sản phẩm không thuộc quán hiện tại.");

        if (request.CategoryId.HasValue && request.CategoryId.Value != product.CategoryId)
        {
            var category = await _unitOfWork.Categories.GetByIdAsync(request.CategoryId.Value);
            if (category == null) throw new EntityNotFoundException("Danh mục", request.CategoryId.Value);
            if (category.ShopId != shopId) throw new DomainException("Danh mục không thuộc quán hiện tại.");
            product.CategoryId = request.CategoryId.Value;
        }

        if (!string.IsNullOrWhiteSpace(request.Name)) product.Name = request.Name.Trim();
        if (request.Price.HasValue) product.Price = request.Price.Value;
        if (request.Description != null) product.Description = request.Description;
        if (request.ImageUrl != null) product.ImageUrl = request.ImageUrl;
        if (request.IsAvailable.HasValue) product.IsAvailable = request.IsAvailable.Value;
        product.BranchId = request.BranchId;

        await _unitOfWork.Products.UpdateAsync(product);
        await _unitOfWork.SaveChangesAsync();
        return MapProduct(product);
    }

    public async Task<CategoryDto> DeleteCategoryAsync(Guid categoryId)
    {
        var shopId = _tenantService.GetTenantId() ?? throw new UnauthorizedAccessException("Không xác định được ShopId");
        var category = await _unitOfWork.Categories.GetByIdAsync(categoryId);
        if (category == null) throw new EntityNotFoundException("Danh mục", categoryId);
        if (category.ShopId != shopId) throw new DomainException("Danh mục không thuộc quán hiện tại.");

        var products = await _unitOfWork.Products.GetByCategoryIdAsync(categoryId);
        if (products.Any())
        {
            throw new DomainException("Danh mục còn món, không thể xóa.");
        }

        await _unitOfWork.Categories.RemoveAsync(category);
        await _unitOfWork.SaveChangesAsync();
        return MapCategory(category);
    }

    public async Task<ProductDto> DeleteProductAsync(Guid productId)
    {
        return await ForceDeleteProductInternalAsync(productId);
    }

    public async Task ArchiveCategoryAsync(Guid categoryId)
    {
        var shopId = _tenantService.GetTenantId() ?? throw new UnauthorizedAccessException("Không xác định được ShopId");
        var category = await _unitOfWork.Categories.GetByIdAsync(categoryId);
        if (category == null) throw new EntityNotFoundException("Danh mục", categoryId);
        if (category.ShopId != shopId) throw new DomainException("Danh mục không thuộc quán hiện tại.");

        category.IsActive = false;
        await _unitOfWork.Categories.UpdateAsync(category);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task ArchiveProductAsync(Guid productId)
    {
        var shopId = _tenantService.GetTenantId() ?? throw new UnauthorizedAccessException("Không xác định được ShopId");
        var product = await _unitOfWork.Products.GetByIdAsync(productId);
        if (product == null) throw new EntityNotFoundException("Sản phẩm", productId);
        if (product.ShopId != shopId) throw new DomainException("Sản phẩm không thuộc quán hiện tại.");

        product.IsAvailable = false;
        await _unitOfWork.Products.UpdateAsync(product);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task ForceDeleteProductAsync(Guid productId)
    {
        await ForceDeleteProductInternalAsync(productId);
    }

    public async Task ForceDeleteCategoryAsync(Guid categoryId)
    {
        await ForceDeleteCategoryInternalAsync(categoryId);
    }

    private async Task<ProductDto> ForceDeleteProductInternalAsync(Guid productId)
    {
        var shopId = _tenantService.GetTenantId() ?? throw new UnauthorizedAccessException("Không xác định được ShopId");
        var product = await _unitOfWork.Products.GetByIdAsync(productId);
        if (product == null) throw new EntityNotFoundException("Sản phẩm", productId);
        if (product.ShopId != shopId) throw new DomainException("Sản phẩm không thuộc quán hiện tại.");

        var hasOrderItems = await _unitOfWork.Orders.ExistsOrderItemForProductAsync(productId);
        if (hasOrderItems) throw new DomainException("Món đã xuất hiện trong order, không thể xóa.");

        await _unitOfWork.Products.RemoveAsync(product);
        await _unitOfWork.SaveChangesAsync();
        return MapProduct(product);
    }

    private async Task<CategoryDto> ForceDeleteCategoryInternalAsync(Guid categoryId)
    {
        var shopId = _tenantService.GetTenantId() ?? throw new UnauthorizedAccessException("Không xác định được ShopId");
        var category = await _unitOfWork.Categories.GetByIdAsync(categoryId);
        if (category == null) throw new EntityNotFoundException("Danh mục", categoryId);
        if (category.ShopId != shopId) throw new DomainException("Danh mục không thuộc quán hiện tại.");

        var products = await _unitOfWork.Products.GetByCategoryIdAsync(categoryId);
        foreach (var product in products)
        {
            var hasOrderItems = await _unitOfWork.Orders.ExistsOrderItemForProductAsync(product.Id);
            if (hasOrderItems)
            {
                throw new DomainException($"Danh mục chứa món '{product.Name}' đã xuất hiện trong order, không thể xóa.");
            }
        }

        foreach (var product in products)
        {
            await _unitOfWork.Products.RemoveAsync(product);
        }

        await _unitOfWork.Categories.RemoveAsync(category);
        await _unitOfWork.SaveChangesAsync();
        return MapCategory(category);
    }

    private static CategoryDto MapCategory(Category category)
    {
        return new CategoryDto
        {
            Id = category.Id,
            ShopId = category.ShopId,
            Name = category.Name,
            Description = category.Description,
            IsActive = category.IsActive,
            BranchId = category.BranchId,
            Products = []
        };
    }

    private static ProductDto MapProduct(Product product)
    {
        return new ProductDto
        {
            Id = product.Id,
            ShopId = product.ShopId,
            CategoryId = product.CategoryId,
            Name = product.Name,
            Price = product.Price,
            ImageUrl = product.ImageUrl,
            Description = product.Description,
            IsAvailable = product.IsAvailable,
            BranchId = product.BranchId
        };
    }
}
