using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace ShopManagement.Application.Interfaces;

public interface IPhotoService{
  Task<string?> AddphotoAsync(IFormFile file);
}