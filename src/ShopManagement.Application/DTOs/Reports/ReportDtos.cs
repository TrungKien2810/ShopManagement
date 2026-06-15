namespace ShopManagement.Application.DTOs.Reports;

public class RevenueSummaryDto
{
    public decimal TodayRevenue { get; set; }
    public int TodayOrderCount { get; set; }
    public decimal WeekRevenue { get; set; }
    public int WeekOrderCount { get; set; }
    public decimal AverageOrderValue { get; set; }
    public List<DailyRevenueDto> DailySeries { get; set; } = new();
}

public class DailyRevenueDto
{
    /// <summary>Ngày (theo giờ địa phương VN), định dạng yyyy-MM-dd.</summary>
    public string Date { get; set; } = string.Empty;
    public decimal Revenue { get; set; }
    public int OrderCount { get; set; }
}
