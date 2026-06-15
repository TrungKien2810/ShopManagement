using ShopManagement.Application.DTOs.Menu;
using ShopManagement.Application.DTOs.Orders;
using ShopManagement.Application.DTOs.Reports;

namespace ShopManagement.Application.Interfaces;

public interface IMenuService
{
    Task<IEnumerable<CategoryDto>> GetMenuAsync();
    Task<IEnumerable<CategoryDto>> GetCategoriesAsync(Guid? branchId = null);
    Task<IEnumerable<ProductDto>> GetMenuItemsAsync(Guid? branchId = null);
    Task<IEnumerable<ProductDto>> GetCombinedMenuItemsAsync(Guid branchId);
    Task<CategoryDto> AddCategoryAsync(CreateCategoryDto request);
    Task<ProductDto> AddProductAsync(CreateProductDto request);
    Task<CategoryDto> UpdateCategoryAsync(Guid categoryId, UpdateCategoryDto request);
    Task<ProductDto> UpdateProductAsync(Guid productId, UpdateProductDto request);
    Task<CategoryDto> DeleteCategoryAsync(Guid categoryId);
    Task<ProductDto> DeleteProductAsync(Guid productId);
    Task ForceDeleteCategoryAsync(Guid categoryId);
    Task ForceDeleteProductAsync(Guid productId);
    Task ArchiveCategoryAsync(Guid categoryId);
    Task ArchiveProductAsync(Guid productId);
}

public interface IOrderService
{
    Task AddItemToOrderAsync(Guid orderId, AddOrderItemRequest request);
    Task<OrderDto> GetActiveOrderAsync(Guid tableId);
    Task ApproveOrderItemAsync(Guid orderId, Guid productId);
    Task UpdateOrderItemQuantityAsync(Guid orderId, Guid itemId, int quantity);
    Task RemoveOrderItemAsync(Guid orderId, Guid itemId);
}

public interface IReportService
{
    Task<RevenueSummaryDto> GetRevenueSummaryAsync();
}
