using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShopManagement.Application.Interfaces;

namespace ShopManagement.Web.Controllers;

[Authorize(Policy = "RequireManager")]
public class ReportController : Controller
{
    private readonly IReportService _reportService;

    public ReportController(IReportService reportService)
    {
        _reportService = reportService;
    }

    public async Task<IActionResult> Index()
    {
        var summary = await _reportService.GetRevenueSummaryAsync();
        return View(summary);
    }
}
