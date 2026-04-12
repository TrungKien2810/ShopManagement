namespace ShopManagement.Application.DTOs.Tables;

public class OpenTableResponse
{
    public Guid OrderId { get; set; }
    public string SessionToken { get; set; } = string.Empty;
    public string TableName { get; set; } = string.Empty;
}
