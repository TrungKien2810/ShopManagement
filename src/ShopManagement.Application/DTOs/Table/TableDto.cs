namespace ShopManagement.Application.DTOs.Table;

public class TableDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public Guid AreaId { get; set; }
    public string AreaName { get; set; } = string.Empty;
    public string Status { get; set; } = "Available";
    public int Capacity { get; set; }
}
