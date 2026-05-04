using Microsoft.EntityFrameworkCore;
using ShopManagement.Application.Interfaces;
using ShopManagement.Domain.Entities;
using ShopManagement.Infrastructure.Data;

namespace ShopManagement.Infrastructure.Repositories;

public class TableAreaRepository : ITableAreaRepository
{
    private readonly AppDbContext _context;

    public TableAreaRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<TableArea>> GetAllAsync(bool activeOnly = true)
    {
        var query = _context.TableAreas.AsQueryable();
        if (activeOnly) query = query.Where(a => a.IsActive);

        return await query
            .OrderBy(a => a.SortOrder)
            .ThenBy(a => a.Name)
            .ToListAsync();
    }

    public async Task<TableArea?> GetByIdAsync(Guid id)
    {
        return await _context.TableAreas.FirstOrDefaultAsync(a => a.Id == id);
    }

    public async Task AddAsync(TableArea area)
    {
        await _context.TableAreas.AddAsync(area);
    }

    public async Task UpdateAsync(TableArea area)
    {
        _context.TableAreas.Update(area);
        await Task.CompletedTask;
    }

    public async Task DeleteAsync(TableArea area)
    {
        _context.TableAreas.Remove(area);
        await Task.CompletedTask;
    }
}

