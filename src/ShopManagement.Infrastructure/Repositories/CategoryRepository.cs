using System;
using ShopManagement.Application.Interfaces;
using ShopManagement.Domain.Entities;
using ShopManagement.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ShopManagement.Infrastructure.Repositories;

public class CategoryRepository : ICategoryRepository
{
    private readonly AppDbContext _context;

    public CategoryRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Category>> GetAllAsync()
    {
        return await _context.Categories.ToListAsync();
    }

    public async Task<IEnumerable<Category>> GetCombinedByBranchIdAsync(Guid branchId)
    {
        return await _context.Categories
            .Where(c => c.BranchId == null || c.BranchId == branchId)
            .ToListAsync();
    }

    public async Task<Category?> GetByIdAsync(Guid id)
    {
        // Use LINQ so EF Core global query filters (ShopId) are applied.
        return await _context.Categories.FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task AddAsync(Category category)
    {
        await _context.Categories.AddAsync(category);
    }

    public async Task UpdateAsync(Category category)
    {
        _context.Categories.Update(category);
        await Task.CompletedTask;
    }

    public async Task DeleteAsync(Category category)
    {
        // Soft-delete: mark as deleted and set DeletedAt
        category.IsDeleted = true;
        category.DeletedAt = DateTime.UtcNow;
        _context.Categories.Update(category);
        await Task.CompletedTask;
    }

    public async Task RemoveAsync(Category category)
    {
        _context.Categories.Remove(category);
        await Task.CompletedTask;
    }
}
