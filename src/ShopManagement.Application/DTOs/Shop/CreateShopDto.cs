namespace ShopManagement.Application.DTOs.Shop;

/// <summary>
/// DTO dùng để hứng dữ liệu khi tạo mới quán nhậu.
/// Chỉ chứa các thông tin tối thiểu cần thiết.
/// </summary>
public class CreateShopDto
{
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
}
