using ShopManagement.Domain.Entities;

namespace ShopManagement.Application.Interfaces;

public interface ITableRepository
{
    Task<IEnumerable<Table>> GetAllAsync();
    Task<Table?> GetByIdAsync(Guid id);
    Task<Table> AddAsync(Table table);
    Task UpdateAsync(Table table);
    Task DeleteAsync(Guid id);
}
