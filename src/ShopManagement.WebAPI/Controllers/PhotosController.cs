using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ShopManagement.Application.Interfaces;

namespace ShopManagement.WebAPI.Controllers;

[Authorize(Policy = "RequireManager")]
[ApiController]
[Route("api/[controller]")]
public class PhotosController : ControllerBase
{
    private readonly IPhotoService _photoService;

    public PhotosController(IPhotoService photoService)
    {
        _photoService = photoService;
    }

    [HttpPost]
    public async Task<IActionResult> Upload([FromForm] IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest(new { message = "File upload không hợp lệ" });
        }

        var url = await _photoService.AddphotoAsync(file);
        if (url == null)
        {
            return BadRequest(new { message = "Lỗi khi upload ảnh" });
        }

        return Ok(new { url });
    }
}
