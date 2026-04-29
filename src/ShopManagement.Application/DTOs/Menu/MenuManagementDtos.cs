using System.ComponentModel.DataAnnotations;

namespace ShopManagement.Application.DTOs.Menu;

public class CreateCategoryDto
{
    [Required(ErrorMessage = "Tên danh mục là bắt buộc")]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;
}

public class CreateProductDto
{
    [Required(ErrorMessage = "Tên món ăn là bắt buộc")]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Range(0, 100000000, ErrorMessage = "Giá phải lớn hơn hoặc bằng 0")]
    public decimal Price { get; set; }
    
    public string? Description { get; set; }
    public Guid CategoryId { get; set; }
    public string? ImageUrl { get; set; }
    public bool IsAvailable { get; set; } = true;
}

public class UpdateCategoryDto
{
    [MaxLength(100)]
    public string? Name { get; set; }
    public string? Description { get; set; }
    public bool? IsActive { get; set; }
}

public class UpdateProductDto
{
    [MaxLength(200)]
    public string? Name { get; set; }

    [Range(0, 100000000, ErrorMessage = "Giá phải lớn hơn hoặc bằng 0")]
    public decimal? Price { get; set; }

    public string? Description { get; set; }
    public Guid? CategoryId { get; set; }
    public string? ImageUrl { get; set; }
    public bool? IsAvailable { get; set; }
}
