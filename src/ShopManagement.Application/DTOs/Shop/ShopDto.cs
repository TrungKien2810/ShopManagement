namespace ShopManagement.Application.DTOs.Shop;

/// <summary>
/// DTO dùng để trả thông tin quán nhậu về cho giao diện.
/// Đã được lược bỏ các thuộc tính phức tạp như Tables, Products để tránh lỗi vòng lặp.
/// </summary>
public class ShopDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
