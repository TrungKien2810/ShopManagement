namespace ShopManagement.Application.DTOs.Table;

public class CreateTableDto
{
    public string Name { get; set; } = string.Empty;
    public Guid? BranchId { get; set; }
    public string Location { get; set; } = string.Empty;
    public Guid? AreaId { get; set; }
    public int Capacity { get; set; }
}
