using ShopManagement.Application.DTOs.Menu;
using ShopManagement.Application.DTOs.Orders;

namespace ShopManagement.Application.Interfaces;

public interface IMenuService
{
    Task<IEnumerable<CategoryDto>> GetMenuAsync();
    Task<CategoryDto> AddCategoryAsync(CreateCategoryDto request);
    Task<ProductDto> AddProductAsync(CreateProductDto request);
    Task<CategoryDto> UpdateCategoryAsync(Guid categoryId, UpdateCategoryDto request);
    Task<ProductDto> UpdateProductAsync(Guid productId, UpdateProductDto request);
    Task ArchiveCategoryAsync(Guid categoryId);
    Task ArchiveProductAsync(Guid productId);
}

public interface IOrderService
{
    Task AddItemToOrderAsync(Guid orderId, AddOrderItemRequest request);
    Task<OrderDto> GetActiveOrderAsync(Guid tableId);
    Task ApproveOrderItemAsync(Guid orderId, Guid productId);
}
