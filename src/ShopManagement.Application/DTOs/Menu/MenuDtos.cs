namespace ShopManagement.Application.DTOs.Menu;

public class CategoryDto
{
    public Guid Id { get; set; }
    public Guid ShopId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsActive { get; set; }
    public Guid? BranchId { get; set; }
    public IEnumerable<ProductDto> Products { get; set; } = [];
}

public class ProductDto
{
    public Guid Id { get; set; }
    public Guid ShopId { get; set; }
    public Guid CategoryId { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string? ImageUrl { get; set; }
    public string? Description { get; set; }
    public bool IsAvailable { get; set; }
    public Guid? BranchId { get; set; }
}
