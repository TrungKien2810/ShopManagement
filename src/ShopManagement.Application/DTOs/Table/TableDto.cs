namespace ShopManagement.Application.DTOs.Table;

public class TableDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Area { get; set; } = string.Empty;
    public string Status { get; set; } = "Available";
    public int Capacity { get; set; }
    public Guid ShopId { get; set; }
}
