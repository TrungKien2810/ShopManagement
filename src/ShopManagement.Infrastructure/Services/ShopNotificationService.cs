using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using ShopManagement.Application.Interfaces;
using ShopManagement.Domain.Enums;
using ShopManagement.Infrastructure.Hubs;

namespace ShopManagement.Infrastructure.Services;

public class ShopNotificationService : IShopNotificationService
{
    private readonly IHubContext<ShopHub> _hubContext;

    public ShopNotificationService(IHubContext<ShopHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public async Task NotifyTableStatusUpdatedAsync(Guid shopId, Guid tableId, TableStatus status)
    {
        await _hubContext.Clients.Group($"Shop_{shopId}").SendAsync("TableStatusUpdated", tableId, status);
    }

    public async Task NotifyOrderUpdatedAsync(Guid tableId, Guid orderId)
    {
        await _hubContext.Clients.Group($"Table_{tableId}").SendAsync("OrderUpdated", orderId);
    }

    public async Task SendAlertAsync(Guid shopId, string message)
    {
        await _hubContext.Clients.Group($"Shop_{shopId}").SendAsync("ReceiveAlert", message);
    }
}
