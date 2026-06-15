using ShopManagement.Domain.Entities;

namespace ShopManagement.Application.Interfaces;

public interface ITableAreaRepository
{
    Task<IEnumerable<TableArea>> GetAllAsync(bool activeOnly = true);
    Task<TableArea?> GetByIdAsync(Guid id);
    Task AddAsync(TableArea area);
    Task UpdateAsync(TableArea area);
    Task DeleteAsync(TableArea area);
    Task HardDeleteAsync(TableArea area);
}

