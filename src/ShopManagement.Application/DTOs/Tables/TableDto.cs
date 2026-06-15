using ShopManagement.Domain.Enums;

namespace ShopManagement.Application.DTOs.Tables;

/// <summary>
/// Đại diện cho thông tin tóm tắt của một bàn trong hệ thống.
/// </summary>
public class TableDto
{
    public Guid Id { get; set; }
    public Guid? BranchId { get; set; }
    public Guid? AreaId { get; set; }
    public string? AreaName { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Capacity { get; set; }
    public TableStatus Status { get; set; }
    public string Location { get; set; } = string.Empty;
    public string TableNumber => Name;
    public int Seats => Capacity;
    public bool IsOccupied => Status == TableStatus.InUse;
}
