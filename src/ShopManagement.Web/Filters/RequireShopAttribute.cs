using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace ShopManagement.Web.Filters;

/// <summary>
/// Ensures a shop is selected (session "ShopId") before an action runs.
/// If none is selected, redirects to the shop picker with a friendly message
/// instead of letting the tenant lookup throw a 500.
/// </summary>
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = false)]
public sealed class RequireShopAttribute : ActionFilterAttribute
{
    public override void OnActionExecuting(ActionExecutingContext context)
    {
        var shopId = context.HttpContext.Session.GetString("ShopId");
        if (string.IsNullOrEmpty(shopId))
        {
            if (context.Controller is Controller controller)
                controller.TempData["Warning"] = "Vui lòng chọn quán để tiếp tục.";

            context.Result = new RedirectToActionResult("Index", "Shop", null);
            return;
        }

        base.OnActionExecuting(context);
    }
}
