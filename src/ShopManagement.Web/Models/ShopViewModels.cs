using System.ComponentModel.DataAnnotations;
using ShopManagement.Domain.Entities;

namespace ShopManagement.Web.Models;

public class ShopListItemViewModel
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public ShopRole Role { get; set; }
    public bool IsCurrent { get; set; }
}

public class CreateShopViewModel
{
    [Required(ErrorMessage = "Vui lòng nhập tên quán")]
    [Display(Name = "Tên quán")]
    public string Name { get; set; } = string.Empty;

    [Display(Name = "Địa chỉ")]
    public string? Address { get; set; }

    [Display(Name = "Số điện thoại")]
    public string? PhoneNumber { get; set; }
}

public class ShopMemberViewModel
{
    public string UserId { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public ShopRole Role { get; set; }
    public DateTime JoinedAt { get; set; }
}

public class ShopSettingsViewModel
{
    public Guid ShopId { get; set; }
    public string ShopName { get; set; } = string.Empty;
    public string? Address { get; set; }
    public string? Phone { get; set; }
    public ShopRole CurrentUserRole { get; set; }
    public List<ShopMemberViewModel> Members { get; set; } = new();
}

public class InviteMemberViewModel
{
    [Required(ErrorMessage = "Vui lòng nhập tên đăng nhập")]
    [Display(Name = "Tên đăng nhập")]
    public string Username { get; set; } = string.Empty;

    [Display(Name = "Vai trò")]
    public ShopRole Role { get; set; } = ShopRole.Staff;
}
