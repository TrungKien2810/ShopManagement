using System;
using System.Threading.Tasks;
using ShopManagement.Domain.Enums;

namespace ShopManagement.Application.Interfaces;

public interface IShopNotificationService
{
    Task NotifyTableStatusUpdatedAsync(Guid shopId, Guid tableId, TableStatus status);
    Task NotifyOrderUpdatedAsync(Guid tableId, Guid orderId);
    Task SendAlertAsync(Guid shopId, string message);
}
