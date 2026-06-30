using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopManagement.Application.Interfaces;
using ShopManagement.Domain.Enums;
using ShopManagement.Infrastructure.Data;
using ShopManagement.Web.Models;

namespace ShopManagement.Web.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;
    private readonly ITenantService _tenantService;
    private readonly IReportService _reportService;
    private readonly AppDbContext _context;

    public HomeController(
        ILogger<HomeController> logger, 
        ITenantService tenantService, 
        IReportService reportService,
        AppDbContext context)
    {
        _logger = logger;
        _tenantService = tenantService;
        _reportService = reportService;
        _context = context;
    }

    public async Task<IActionResult> Index()
    {
        var vm = new HomeDashboardViewModel { HasShop = _tenantService.GetTenantId().HasValue };

        if (vm.HasShop)
        {
            vm.Revenue = await _reportService.GetRevenueSummaryAsync();
            
            vm.RecentOrders = await _context.Orders
                .Include(o => o.Table)
                .OrderByDescending(o => o.CreatedAt)
                .Take(5)
                .ToListAsync();

            vm.BestSellers = await _context.OrderItems
                .Where(oi => oi.Order.Status == OrderStatus.Paid)
                .GroupBy(oi => oi.Product.Name)
                .Select(g => new BestSellerDto
                {
                    Name = g.Key,
                    Quantity = g.Sum(oi => oi.Quantity),
                    TotalAmount = g.Sum(oi => oi.Quantity * oi.UnitPrice)
                })
                .OrderByDescending(b => b.Quantity)
                .Take(5)
                .ToListAsync();
        }

        return View(vm);
    }

    public IActionResult Privacy()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
