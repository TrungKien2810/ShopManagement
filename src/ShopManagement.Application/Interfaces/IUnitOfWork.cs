namespace ShopManagement.Application.Interfaces;

public interface IUnitOfWork : IDisposable
{
    ITableRepository Tables { get; }
    IOrderRepository Orders { get; }
    IProductRepository Products { get; }
    ICategoryRepository Categories { get; }
    Task<int> SaveChangesAsync();
    Task BeginTransactionAsync();
    Task CommitTransactionAsync();
    Task RollbackTransactionAsync();
}
