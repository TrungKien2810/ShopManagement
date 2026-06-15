using ShopManagement.Application.DTOs.Orders;
using ShopManagement.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace ShopManagement.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = "RequireStaff")]
public class OrderController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrderController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpGet("active/{tableId}")]
    public async Task<ActionResult<OrderDto>> GetActiveOrder(Guid tableId)
    {
        var order = await _orderService.GetActiveOrderAsync(tableId);
        return Ok(order);
    }

    [HttpPost("{orderId}/items")]
    public async Task<IActionResult> AddItem(Guid orderId, [FromBody] AddOrderItemRequest request)
    {
        await _orderService.AddItemToOrderAsync(orderId, request);
        return Ok();
    }

    [HttpPost("{orderId}/approve/{productId}")]
    public async Task<IActionResult> ApproveItem(Guid orderId, Guid productId)
    {
        await _orderService.ApproveOrderItemAsync(orderId, productId);
        return Ok();
    }

    [HttpPut("{orderId}/items/{itemId}")]
    public async Task<IActionResult> UpdateItem(Guid orderId, Guid itemId, [FromBody] UpdateOrderItemRequest request)
    {
        await _orderService.UpdateOrderItemQuantityAsync(orderId, itemId, request.Quantity);
        return Ok();
    }

    [HttpDelete("{orderId}/items/{itemId}")]
    public async Task<IActionResult> DeleteItem(Guid orderId, Guid itemId)
    {
        await _orderService.RemoveOrderItemAsync(orderId, itemId);
        return Ok();
    }
}

public class UpdateOrderItemRequest
{
    public int Quantity { get; set; }
}
