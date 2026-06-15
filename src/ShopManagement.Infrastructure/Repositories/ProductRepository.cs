using System;
using ShopManagement.Application.Interfaces;
using ShopManagement.Domain.Entities;
using ShopManagement.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ShopManagement.Infrastructure.Repositories;

public class ProductRepository : IProductRepository
{
    private readonly AppDbContext _context;

    public ProductRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Product>> GetAllAsync()
    {
        return await _context.Products.Include(p => p.Category).ToListAsync();
    }

    public async Task<IEnumerable<Product>> GetGlobalAsync()
    {
        return await _context.Products
            .Where(p => p.BranchId == null)
            .Include(p => p.Category)
            .ToListAsync();
    }

    public async Task<IEnumerable<Product>> GetByBranchIdAsync(Guid branchId)
    {
        return await _context.Products
            .Where(p => p.BranchId == branchId)
            .Include(p => p.Category)
            .ToListAsync();
    }

    public async Task<IEnumerable<Product>> GetCombinedByBranchIdAsync(Guid branchId)
    {
        return await _context.Products
            .Where(p => p.BranchId == null || p.BranchId == branchId)
            .Include(p => p.Category)
            .ToListAsync();
    }

    public async Task<IEnumerable<Product>> GetByCategoryIdAsync(Guid categoryId)
    {
        return await _context.Products.Where(p => p.CategoryId == categoryId).ToListAsync();
    }

    public async Task<IEnumerable<Product>> GetByCategoryIdsAsync(IEnumerable<Guid> categoryIds)
    {
        var ids = categoryIds.Distinct().ToList();
        if (ids.Count == 0) return Array.Empty<Product>();

        return await _context.Products.Where(p => ids.Contains(p.CategoryId)).ToListAsync();
    }

    public async Task<Product?> GetByIdAsync(Guid id)
    {
        // Use LINQ so EF Core global query filters (ShopId) are applied.
        return await _context.Products.FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task AddAsync(Product product)
    {
        await _context.Products.AddAsync(product);
    }

    public async Task UpdateAsync(Product product)
    {
        _context.Products.Update(product);
        await Task.CompletedTask;
    }

    public async Task DeleteAsync(Product product)
    {
        // Soft-delete: mark as deleted and set DeletedAt
        product.IsDeleted = true;
        product.DeletedAt = DateTime.UtcNow;
        _context.Products.Update(product);
        await Task.CompletedTask;
    }

    public async Task RemoveAsync(Product product)
    {
        _context.Products.Remove(product);
        await Task.CompletedTask;
    }
}
