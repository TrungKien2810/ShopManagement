using ShopManagement.Application.DTOs.Reports;
using ShopManagement.Domain.Entities;

namespace ShopManagement.Web.Models;

public class HomeDashboardViewModel
{
    public bool HasShop { get; set; }
    public RevenueSummaryDto? Revenue { get; set; }
    public List<Order> RecentOrders { get; set; } = new();
    public List<BestSellerDto> BestSellers { get; set; } = new();
}

public class BestSellerDto
{
    public string Name { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal TotalAmount { get; set; }
}
