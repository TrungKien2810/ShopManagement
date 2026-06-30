using System.ComponentModel.DataAnnotations;

namespace ShopManagement.Web.Models;

public class BranchListItemViewModel
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Address { get; set; }
    public string? Phone { get; set; }
    public bool IsCurrent { get; set; }
}

public class CreateBranchViewModel
{
    [Required(ErrorMessage = "Vui lòng nhập tên chi nhánh")]
    [Display(Name = "Tên chi nhánh")]
    public string Name { get; set; } = string.Empty;

    [Display(Name = "Địa chỉ")]
    public string? Address { get; set; }

    [Display(Name = "Số điện thoại")]
    public string? Phone { get; set; }
}
