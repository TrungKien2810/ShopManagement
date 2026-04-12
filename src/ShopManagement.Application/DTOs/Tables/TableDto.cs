using ShopManagement.Domain.Enums;

namespace ShopManagement.Application.DTOs.Tables;

/// <summary>
/// Đại diện cho thông tin tóm tắt của một bàn trong hệ thống.
/// </summary>
public class TableDto
{
    /// <summary>
    /// Mã định danh duy nhất của bàn.
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Tên bàn (Ví dụ: Bàn 01, VIP 1).
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Sức chứa tối đa của bàn.
    /// </summary>
    public int Capacity { get; set; }

    /// <summary>
    /// Trạng thái hiện tại của bàn.
    /// </summary>
    public TableStatus Status { get; set; }

    /// <summary>
    /// Vị trí của bàn (Ví dụ: Tầng 1, Sân vườn).
    /// </summary>
    public string Location { get; set; } = string.Empty;
}
