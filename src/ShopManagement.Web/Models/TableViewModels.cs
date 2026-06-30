using System.ComponentModel.DataAnnotations;
using ShopManagement.Application.DTOs.Tables;

namespace ShopManagement.Web.Models;

public class TableAreaGroupViewModel
{
    public Guid? AreaId { get; set; }
    public string AreaName { get; set; } = "Chưa phân khu vực";
    public List<TableDto> Tables { get; set; } = new();
}

public class TableBoardViewModel
{
    public List<TableAreaGroupViewModel> Groups { get; set; } = new();
    public List<TableAreaOption> Areas { get; set; } = new();
}

public class TableAreaOption
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public int SortOrder { get; set; }
}

public class TableFormViewModel
{
    public Guid? Id { get; set; }

    [Required(ErrorMessage = "Vui lòng nhập tên bàn")]
    [Display(Name = "Tên bàn")]
    public string Name { get; set; } = string.Empty;

    [Range(1, 100, ErrorMessage = "Sức chứa phải lớn hơn 0")]
    [Display(Name = "Số ghế")]
    public int Capacity { get; set; } = 4;

    [Display(Name = "Vị trí")]
    public string? Location { get; set; }

    [Display(Name = "Khu vực")]
    public Guid? AreaId { get; set; }

    public List<TableAreaOption> AreaOptions { get; set; } = new();
}

public class TableAreaFormViewModel
{
    [Required(ErrorMessage = "Vui lòng nhập tên khu vực")]
    [Display(Name = "Tên khu vực")]
    public string Name { get; set; } = string.Empty;

    [Display(Name = "Thứ tự")]
    public int? SortOrder { get; set; }
}
