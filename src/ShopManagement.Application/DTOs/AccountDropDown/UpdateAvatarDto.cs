using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace ShopManagement.Application.DTOs.AccountDropDown;

public class UpdateAvatarDto{
  [Required(ErrorMessage = "Vui lòng đính kèm file ảnh của bạn")]
  public IFormFile File {get; set; } = null; 
}