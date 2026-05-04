namespace ShopManagement.Application.DTOs.Tables;

public class TransferTableResponse
{
    public Guid OrderId { get; set; }
    public Guid FromTableId { get; set; }
    public Guid ToTableId { get; set; }
    public string ToTableName { get; set; } = string.Empty;
}

