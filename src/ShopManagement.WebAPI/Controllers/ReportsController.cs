using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShopManagement.Application.DTOs.Reports;
using ShopManagement.Application.Interfaces;

namespace ShopManagement.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = "RequireStaff")]
public class ReportsController : ControllerBase
{
    private readonly IReportService _reportService;

    public ReportsController(IReportService reportService)
    {
        _reportService = reportService;
    }

    [HttpGet("revenue")]
    public async Task<ActionResult<RevenueSummaryDto>> GetRevenueSummary()
    {
        var result = await _reportService.GetRevenueSummaryAsync();
        return Ok(result);
    }
}
