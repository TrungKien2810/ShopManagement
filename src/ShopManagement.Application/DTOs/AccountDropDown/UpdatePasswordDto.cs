using System.ComponentModel.DataAnnotations;

namespace ShopManagement.Application.DTOs.AccountDropDown;

public class UpdatePasswordDto
{
    [Required]
    public string OldPassword { get; set; } = string.Empty;

    [Required]
    [MinLength(6, ErrorMessage = "Mật khẩu tối thiểu 6 ký tự")]
    public string NewPassword { get; set; } = string.Empty;
}
