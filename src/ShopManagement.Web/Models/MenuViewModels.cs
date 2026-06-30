using System.ComponentModel.DataAnnotations;

namespace ShopManagement.Web.Models;

public class CategoryFormViewModel
{
    public Guid? Id { get; set; }

    [Required(ErrorMessage = "Vui lòng nhập tên danh mục")]
    [Display(Name = "Tên danh mục")]
    public string Name { get; set; } = string.Empty;

    [Display(Name = "Mô tả")]
    public string? Description { get; set; }
}

public class ProductFormViewModel
{
    public Guid? Id { get; set; }

    [Required(ErrorMessage = "Vui lòng nhập tên món")]
    [Display(Name = "Tên món")]
    public string Name { get; set; } = string.Empty;

    [Range(0, 100000000, ErrorMessage = "Giá phải lớn hơn hoặc bằng 0")]
    [Display(Name = "Giá (VND)")]
    public decimal Price { get; set; }

    [Display(Name = "Mô tả")]
    public string? Description { get; set; }

    [Required(ErrorMessage = "Vui lòng chọn danh mục")]
    [Display(Name = "Danh mục")]
    public Guid CategoryId { get; set; }

    [Display(Name = "Ảnh món")]
    public IFormFile? ImageFile { get; set; }

    public string? ExistingImageUrl { get; set; }

    [Display(Name = "Còn bán")]
    public bool IsAvailable { get; set; } = true;

    public List<CategoryOption> CategoryOptions { get; set; } = new();
}

public class CategoryOption
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
}
