using System;
using Microsoft.EntityFrameworkCore;
using ShopManagement.Application.Interfaces;
using ShopManagement.Domain.Entities;
using ShopManagement.Infrastructure.Data;

namespace ShopManagement.Infrastructure.Repositories;

public class TableRepository : ITableRepository
{
    private readonly AppDbContext _context;

    public TableRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Table>> GetAllAsync(Guid? branchId = null)
    {
        var query = _context.Tables.Include(t => t.Area).AsQueryable();
        if (branchId.HasValue)
        {
            query = query.Where(t => t.BranchId == branchId.Value);
        }

        return await query.ToListAsync();
    }

    public async Task<IEnumerable<Table>> GetByAreaIdAsync(Guid areaId)
    {
        return await _context.Tables
            .Where(t => t.AreaId == areaId)
            .ToListAsync();
    }

    public async Task<Table?> GetByIdAsync(Guid id)
    {
        // Use LINQ so EF Core global query filters (ShopId) are applied.
        return await _context.Tables.FirstOrDefaultAsync(t => t.Id == id);
    }

    public async Task<Table> AddAsync(Table table)
    {
        await _context.Tables.AddAsync(table);
        return table;
    }

    public async Task UpdateAsync(Table table)
    {
        _context.Entry(table).State = EntityState.Modified;
        await Task.CompletedTask;
    }

    public async Task DeleteAsync(Guid id)
    {
        // Respect query filters; tables from other shops should not be touched.
        var table = await _context.Tables.FirstOrDefaultAsync(t => t.Id == id);
        if (table != null)
        {
            // Soft-delete: mark as deleted and set DeletedAt
            table.IsDeleted = true;
            table.DeletedAt = DateTime.UtcNow;
            _context.Tables.Update(table);
        }
    }

    public async Task HardDeleteAsync(Table table)
    {
        _context.Tables.Remove(table);
        await Task.CompletedTask;
    }
}
