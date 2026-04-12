using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace ShopManagement.Infrastructure.Hubs;

public class ShopHub : Hub
{
    public async Task JoinShopGroup(string shopId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"Shop_{shopId}");
    }

    public async Task JoinTableGroup(string tableId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"Table_{tableId}");
    }
}
