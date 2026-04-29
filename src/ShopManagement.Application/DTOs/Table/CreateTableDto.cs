namespace ShopManagement.Application.DTOs.Table;

public class CreateTableDto
{
    public string Name { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public int Capacity { get; set; }
}
