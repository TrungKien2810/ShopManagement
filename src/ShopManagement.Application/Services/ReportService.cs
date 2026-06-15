using ShopManagement.Application.DTOs.Reports;
using ShopManagement.Application.Interfaces;

namespace ShopManagement.Application.Services;

public class ReportService : IReportService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ITenantService _tenantService;

    // Quán hoạt động theo giờ Việt Nam (UTC+7); dữ liệu lưu ở UTC nên cần lệch múi giờ
    // để gom nhóm "ngày" cho đúng với ngày làm việc thực tế của quán.
    private static readonly TimeSpan VnOffset = TimeSpan.FromHours(7);
    private const int WindowDays = 7;

    public ReportService(IUnitOfWork unitOfWork, ITenantService tenantService)
    {
        _unitOfWork = unitOfWork;
        _tenantService = tenantService;
    }

    public async Task<RevenueSummaryDto> GetRevenueSummaryAsync()
    {
        var shopId = _tenantService.GetTenantId() ?? throw new UnauthorizedAccessException("ShopId not found");
        var branchId = _tenantService.GetBranchId();

        var nowVn = DateTime.UtcNow + VnOffset;
        var todayVn = nowVn.Date;
        var windowStartVn = todayVn.AddDays(-(WindowDays - 1));

        // Chuyển khoảng thời gian VN về UTC để truy vấn (toUtc loại trừ, đến hết ngày hôm nay)
        var fromUtc = windowStartVn - VnOffset;
        var toUtc = todayVn.AddDays(1) - VnOffset;

        var orders = await _unitOfWork.Orders.GetPaidOrdersAsync(shopId, branchId, fromUtc, toUtc);

        // Gom doanh thu theo ngày VN
        var byDay = orders
            .GroupBy(o => (o.CheckOutTime!.Value + VnOffset).Date)
            .ToDictionary(g => g.Key, g => (Revenue: g.Sum(o => o.TotalAmount), Count: g.Count()));

        var dailySeries = new List<DailyRevenueDto>();
        for (var day = windowStartVn; day <= todayVn; day = day.AddDays(1))
        {
            byDay.TryGetValue(day, out var bucket);
            dailySeries.Add(new DailyRevenueDto
            {
                Date = day.ToString("yyyy-MM-dd"),
                Revenue = bucket.Revenue,
                OrderCount = bucket.Count
            });
        }

        byDay.TryGetValue(todayVn, out var today);
        var weekRevenue = orders.Sum(o => o.TotalAmount);
        var weekCount = orders.Count;

        return new RevenueSummaryDto
        {
            TodayRevenue = today.Revenue,
            TodayOrderCount = today.Count,
            WeekRevenue = weekRevenue,
            WeekOrderCount = weekCount,
            AverageOrderValue = weekCount > 0 ? Math.Round(weekRevenue / weekCount, 0) : 0,
            DailySeries = dailySeries
        };
    }
}
