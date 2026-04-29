# 📘 Hướng Dẫn Toàn Diện Backend C# .NET 8 (Upload Avatar & Đổi Mật Khẩu)

Tài liệu này không chỉ cung cấp mã nguồn (code) mà còn **giải thích tường tận lộ trình** từ lúc khởi tạo project, phân tầng Clean Architecture, cho đến khi tích hợp thành công Cloudinary để xử lý ảnh. Hãy đọc từ trên xuống dưới để nắm vững tư duy thiết kế.

---

## 1. Khởi tạo Project & Cài đặt (Nếu làm từ đầu)

Giả sử bạn bắt đầu một dự án mới hoàn toàn với **Clean Architecture**, bạn sẽ cần chia nhỏ dự án thành nhiều tầng (Layers). 

### A. Các lệnh .NET CLI cơ bản
Mở Terminal ở thư mục gốc và chạy các lệnh sau (trong dự án của bạn thì các thư mục này đã có sẵn `ShopManagement.WebAPI`, `ShopManagement.Application`, v.v.):

```bash
# Tạo solution rỗng
dotnet new sln -n ShopManagement

# Tạo tầng API (Nơi tiếp nhận Request từ Frontend)
dotnet new webapi -n ShopManagement.WebAPI

# Tạo tầng Application (Nơi chứa DTOs, Business Logic, Interfaces)
dotnet new classlib -n ShopManagement.Application

# Tạo tầng Infrastructure (Nơi kết nối với dịch vụ bên ngoài như Cloudinary, Database)
dotnet new classlib -n ShopManagement.Infrastructure

# Gom tất cả vào Solution
dotnet sln add src/ShopManagement.WebAPI/ShopManagement.WebAPI.csproj
# ... (add tương tự cho các project khác)
```

**Giải thích:** Clean Architecture giúp tách biệt rõ ràng. Tầng `WebAPI` không được phép tự xử lý ảnh lằng nhằng, nó chỉ nhận lệnh rồi đẩy xuống `Application`. Tầng `Application` không biết cụ thể Cloudinary là gì, nó chỉ định nghĩa "Tôi cần 1 cái interface `IPhotoService`". Thằng `Infrastructure` sẽ là kẻ đứng ra implement cụ thể thao tác gọi Cloudinary API.

### B. Cài đặt NuGet Packages
Di chuyển vào thư mục `Infrastructure` để cài thư viện cấu hình Cloudinary:

```bash
cd src/ShopManagement.Infrastructure
dotnet add package CloudinaryDotNet
```

---

## 2. Cấu hình Nhận diện (Cloudinary Settings)

Hệ thống cần biết bạn là ai để cho phép đẩy ảnh lên Cloud.

### Bước 1: Khai báo ở `appsettings.Development.json` (thuộc tầng WebAPI)
```json
{
  "Cloudinary": {
    "CloudName": "Tên_trạm_mây_của_bạn",
    "ApiKey": "Mã_số_API",
    "ApiSecret": "Mật_khẩu_bí_mật"
  }
}
```

### Bước 2: Tạo Class Map Config (thuộc tầng Application/Infrastructure)
Để code C# đọc được cục JSON trên một cách an toàn (Strongly-typed), tạo một class:
```csharp
// Thuộc: ShopManagement.Infrastructure/Settings/CloudinarySettings.cs
public class CloudinarySettings
{
    public string CloudName { get; set; } = string.Empty;
    public string ApiKey { get; set; } = string.Empty;
    public string ApiSecret { get; set; } = string.Empty;
}
```

Và khai báo ở `Program.cs` (WebAPI):
```csharp
builder.Services.Configure<CloudinarySettings>(builder.Configuration.GetSection("Cloudinary"));
```

---

## 3. Khai báo DTOs & Interfaces (Tầng Application)

Mọi thứ liên quan đến Input/Output đều nằm ở tầng lõi.

### A. Tạo DTOs
```csharp
using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

// 1. DTO cho Avatar (Sử dụng IFormFile để đón cục file nhị phân từ Frontend)
public class UpdateAvatarDto
{
    [Required(ErrorMessage = "Vui lòng đính kèm file ảnh")]
    public IFormFile File { get; set; } = null!;
}

// 2. DTO cho Mật Khẩu
public class UpdatePasswordDto
{
    [Required]
    public string OldPassword { get; set; } = string.Empty;
    
    [Required]
    [MinLength(6, ErrorMessage = "Mật khẩu tối thiểu 6 ký tự")]
    public string NewPassword { get; set; } = string.Empty;
}
```

### B. Tạo Interface
Giao ước giữa các tầng:
```csharp
// Thư mục: Application/Interfaces/IPhotoService.cs
public interface IPhotoService
{
    // Nhận vào IFormFile File, trả ra URL của ảnh sau khi đẩy lên Cloud
    Task<string?> AddPhotoAsync(IFormFile file); 
}
```

---

## 4. Thực thi Logic (Tầng Infrastructure)

Dưới đây là phần việc Nặng nhất: Code xử lý file!

```csharp
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

// Thư mục: Infrastructure/Services/PhotoService.cs
public class PhotoService : IPhotoService
{
    private readonly Cloudinary _cloudinary;

    // Dùng Dependency Injection để hút cái AppSettings vào đây
    public PhotoService(IOptions<CloudinarySettings> config)
    {
        var acc = new Account(
            config.Value.CloudName,
            config.Value.ApiKey,
            config.Value.ApiSecret
        );

        _cloudinary = new Cloudinary(acc);
    }

    public async Task<string?> AddPhotoAsync(IFormFile file)
    {
        // 1. Kiểm tra File rỗng
        if (file.Length == 0) return null;

        // 2. Chuyển File thành luồng (Stream)
        using var stream = file.OpenReadStream();

        // 3. Chuẩn bị hàng hóa để ship lên Cloudinary
        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(file.FileName, stream),
            // (Tuỳ chọn) Resize luôn ảnh về ô vuông cho Avatar nhẹ gọn, cắt vào chính giữa khuôn mặt
            Transformation = new Transformation().Height(500).Width(500).Crop("fill").Gravity("face")
        };

        // 4. Nhấn nút Tải Lên 🚀
        var uploadResult = await _cloudinary.UploadAsync(uploadParams);

        // 5. Nếu Cloudinary báo lỗi
        if (uploadResult.Error != null)
        {
            throw new Exception(uploadResult.Error.Message);
        }

        // 6. Thành công! Trả về cái Link Internet an toàn
        return uploadResult.SecureUrl.ToString();
    }
}
```

> **Lưu ý:** Sau khi viết class này, bạn phải nhớ vào `Program.cs` để đăng ký: 
> `builder.Services.AddScoped<IPhotoService, PhotoService>();`

---

## 5. Tiếp Khách ở Controller (Tầng WebAPI)

Đây là nơi hứng chịu API Call từ Frontend React mà tôi đã viết (`/api/auth/profile/avatar`).

```csharp
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ShopManagement.Infrastructure.Identity;
using ShopManagement.Application.DTOs.AccountDropDown;
using ShopManagement.Application.Interfaces;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Linq;

namespace ShopManagement.WebAPI.Controllers;

[Authorize]
[ApiController]
[Route("api/auth/profile")]
public class ProfileController : ControllerBase
{
    private readonly IPhotoService _photoService;
    private readonly UserManager<ApplicationUser> _userManager;

    public ProfileController(IPhotoService photoService, UserManager<ApplicationUser> userManager)
    {
        _photoService = photoService;
        _userManager = userManager;
    }

    /// <summary>
    /// [PUT] Xử lý upload và lưu AvatarUrl vào cơ sở dữ liệu
    /// </summary>
    [HttpPut("avatar")]
    public async Task<IActionResult> UpdateAvatar([FromForm] UpdateAvatarDto request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return NotFound(new { message = "Không tìm thấy người dùng" });

        // 1. Gọi Infrastructure Service đẩy ảnh lên mây Cloudinary
        var cloudLink = await _photoService.AddphotoAsync(request.File);
        if (cloudLink == null) return BadRequest(new { message = "Lỗi khi upload ảnh lên hệ thống" });

        // 2. Lưu cloudLink vào database Identity
        user.AvatarUrl = cloudLink;
        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded) return BadRequest(new { message = "Lỗi khi lưu thông tin vào DB" });

        // 3. Phản hồi cho Frontend
        return Ok(new { 
            message = "Cập nhật avatar thành công",
            avatarUrl = cloudLink 
        });
    }

    /// <summary>
    /// [PUT] Logic đổi mật khẩu sử dụng Identity UserManager
    /// </summary>
    [HttpPut("password")]
    public async Task<IActionResult> UpdatePassword([FromBody] UpdatePasswordDto request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return NotFound(new { message = "Không tìm thấy người dùng" });

        var result = await _userManager.ChangePasswordAsync(user, request.OldPassword, request.NewPassword);

        if (!result.Succeeded)
        {
            return BadRequest(new { 
                message = "Đổi mật khẩu thất bại", 
                errors = result.Errors.Select(e => e.Description) 
            });
        }

        return Ok(new { message = "Đổi mật khẩu thành công" });
    }
}
```

### Tổng kết Luồng chạy thực tế:
1. Bạn chọn file `.png` trên giao diện, bấm "Lưu Avatar".
2. React gói file vào `FormData` gửi qua HTTP PUT.
3. Chạm tới `ProfileController` -> `UpdateAvatar`. C# tự động bóc tách `IFormFile`.
4. `PhotoService` cầm file ném sang máy chủ của hãng Cloudinary, bóp viền, resize dung lượng siêu nhẹ, rồi xin cái đường URL.
5. C# lưu cái đường URL bé tí bằng text vào SQL Database. Trả URL đấy về cho mồm React ngậm lấy.
6. React cầm cái URL đấy ném vào thẻ `<img>` và chớp mắt cái, Avatar đã hiện lên khắp mọi nơi bạn đi đến!
