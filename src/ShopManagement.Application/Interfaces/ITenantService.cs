namespace ShopManagement.Application.Interfaces;

public interface ITenantService
{
    Guid? GetTenantId();
    Guid? GetBranchId();
}
