using ShopManagement.Application.DTOs.Tables;

namespace ShopManagement.Application.Interfaces;

public interface ITableService
{
    Task<IEnumerable<TableDto>> GetAllTablesAsync();
    Task<TableDto> CreateTableAsync(ShopManagement.Application.DTOs.Table.CreateTableDto request);
    Task ResetTableAsync(Guid tableId);
    Task<OpenTableResponse> OpenTableAsync(Guid tableId);
    Task CheckoutAsync(Guid tableId);
    Task<TransferTableResponse> TransferTableAsync(Guid fromTableId, Guid toTableId);
}
