using ShopManagement.Domain.Entities;

namespace ShopManagement.Application.Interfaces;

public interface IProductRepository
{
    Task<IEnumerable<Product>> GetAllAsync();
    Task<IEnumerable<Product>> GetByCategoryIdAsync(Guid categoryId);
    Task<IEnumerable<Product>> GetByCategoryIdsAsync(IEnumerable<Guid> categoryIds);
    Task<Product?> GetByIdAsync(Guid id);
    Task AddAsync(Product product);
    Task UpdateAsync(Product product);
    Task DeleteAsync(Product product);
}

public interface ICategoryRepository
{
    Task<IEnumerable<Category>> GetAllAsync();
    Task<Category?> GetByIdAsync(Guid id);
    Task AddAsync(Category category);
    Task UpdateAsync(Category category);
    Task DeleteAsync(Category category);
}
