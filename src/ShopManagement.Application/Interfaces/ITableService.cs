using ShopManagement.Application.DTOs.Tables;

namespace ShopManagement.Application.Interfaces;

public interface ITableService
{
    Task<IEnumerable<TableDto>> GetAllTablesAsync();
    Task ResetTableAsync(Guid tableId);
    Task<OpenTableResponse> OpenTableAsync(Guid tableId);
    Task CheckoutAsync(Guid tableId);
}
