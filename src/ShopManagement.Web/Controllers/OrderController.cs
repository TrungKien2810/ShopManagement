using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShopManagement.Application.DTOs.Orders;
using ShopManagement.Application.Interfaces;
using ShopManagement.Domain.Exceptions;
using ShopManagement.Web.Models;

namespace ShopManagement.Web.Controllers;

[Authorize(Policy = "RequireStaff")]
public class OrderController : Controller
{
    private readonly IOrderService _orderService;
    private readonly IMenuService _menuService;
    private readonly IUnitOfWork _unitOfWork;

    public OrderController(IOrderService orderService, IMenuService menuService, IUnitOfWork unitOfWork)
    {
        _orderService = orderService;
        _menuService = menuService;
        _unitOfWork = unitOfWork;
    }

    public async Task<IActionResult> Index(Guid? tableId)
    {
        if (tableId == null)
        {
            return RedirectToAction("Index", "Table");
        }

        try
        {
            var order = await _orderService.GetActiveOrderAsync(tableId.Value);
            var table = await _unitOfWork.Tables.GetByIdAsync(tableId.Value);
            var categories = await _menuService.GetMenuAsync();

            return View(new OrderPageViewModel
            {
                TableId = tableId.Value,
                TableName = table?.Name ?? "Bàn",
                Order = order,
                Categories = categories
            });
        }
        catch (EntityNotFoundException)
        {
            TempData["Error"] = "Bàn này chưa có đơn hàng đang mở.";
            return RedirectToAction("Index", "Table");
        }
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> AddItem(Guid orderId, Guid tableId, Guid productId, int quantity, string? note)
    {
        try
        {
            await _orderService.AddItemToOrderAsync(orderId, new AddOrderItemRequest
            {
                ProductId = productId,
                Quantity = quantity,
                Note = note,
                IdempotencyKey = Guid.NewGuid().ToString()
            });
        }
        catch (Exception ex) when (ex is DomainException or EntityNotFoundException)
        {
            TempData["Error"] = ex.Message;
        }

        return RedirectToAction("Index", new { tableId });
    }

    [HttpPost]
    [Authorize(Policy = "RequireManager")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Approve(Guid orderId, Guid tableId, Guid productId)
    {
        try
        {
            await _orderService.ApproveOrderItemAsync(orderId, productId);
        }
        catch (Exception ex) when (ex is DomainException or EntityNotFoundException)
        {
            TempData["Error"] = ex.Message;
        }

        return RedirectToAction("Index", new { tableId });
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> UpdateItem(Guid orderId, Guid tableId, Guid itemId, int quantity)
    {
        try
        {
            await _orderService.UpdateOrderItemQuantityAsync(orderId, itemId, quantity);
        }
        catch (Exception ex) when (ex is DomainException or EntityNotFoundException)
        {
            TempData["Error"] = ex.Message;
        }

        return RedirectToAction("Index", new { tableId });
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteItem(Guid orderId, Guid tableId, Guid itemId)
    {
        try
        {
            await _orderService.RemoveOrderItemAsync(orderId, itemId);
        }
        catch (Exception ex) when (ex is DomainException or EntityNotFoundException)
        {
            TempData["Error"] = ex.Message;
        }

        return RedirectToAction("Index", new { tableId });
    }
}
