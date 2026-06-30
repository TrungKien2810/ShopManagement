using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ShopManagement.Application.DTOs.Table;
using ShopManagement.Application.Interfaces;
using ShopManagement.Domain.Entities;
using ShopManagement.Web.Models;

namespace ShopManagement.Web.Controllers;

[Authorize(Policy = "RequireStaff")]
public class TableController : Controller
{
    private readonly ITableService _tableService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ITenantService _tenantService;

    public TableController(ITableService tableService, IUnitOfWork unitOfWork, ITenantService tenantService)
    {
        _tableService = tableService;
        _unitOfWork = unitOfWork;
        _tenantService = tenantService;
    }

    public async Task<IActionResult> Index()
    {
        var tables = (await _tableService.GetAllTablesAsync(_tenantService.GetBranchId())).ToList();
        var areas = (await _unitOfWork.TableAreas.GetAllAsync(activeOnly: true)).ToList();

        var groups = tables
            .GroupBy(t => t.AreaId)
            .Select(g => new TableAreaGroupViewModel
            {
                AreaId = g.Key,
                AreaName = g.Key.HasValue ? (areas.FirstOrDefault(a => a.Id == g.Key)?.Name ?? "Khu vực") : "Chưa phân khu vực",
                Tables = g.OrderBy(t => t.Name).ToList()
            })
            .OrderBy(g => g.AreaName)
            .ToList();

        var board = new TableBoardViewModel
        {
            Groups = groups,
            Areas = areas.Select(a => new TableAreaOption { Id = a.Id, Name = a.Name, IsActive = a.IsActive, SortOrder = a.SortOrder }).ToList()
        };

        return View(board);
    }

    [HttpGet]
    public async Task<IActionResult> Create()
    {
        var areas = await _unitOfWork.TableAreas.GetAllAsync(activeOnly: true);
        return View(new TableFormViewModel
        {
            AreaOptions = areas.Select(a => new TableAreaOption { Id = a.Id, Name = a.Name }).ToList()
        });
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(TableFormViewModel model)
    {
        if (!ModelState.IsValid)
        {
            var areas = await _unitOfWork.TableAreas.GetAllAsync(activeOnly: true);
            model.AreaOptions = areas.Select(a => new TableAreaOption { Id = a.Id, Name = a.Name }).ToList();
            return View(model);
        }

        await _tableService.CreateTableAsync(new CreateTableDto
        {
            Name = model.Name,
            Capacity = model.Capacity,
            Location = model.Location ?? string.Empty,
            AreaId = model.AreaId,
            BranchId = _tenantService.GetBranchId()
        });

        return RedirectToAction("Index");
    }

    [HttpGet]
    public async Task<IActionResult> Edit(Guid id)
    {
        var table = (await _tableService.GetAllTablesAsync(_tenantService.GetBranchId()))
            .FirstOrDefault(t => t.Id == id);
        if (table == null) return NotFound();

        var areas = await _unitOfWork.TableAreas.GetAllAsync(activeOnly: true);
        return View(new TableFormViewModel
        {
            Id = table.Id,
            Name = table.Name,
            Capacity = table.Capacity,
            Location = table.Location,
            AreaId = table.AreaId,
            AreaOptions = areas.Select(a => new TableAreaOption { Id = a.Id, Name = a.Name }).ToList()
        });
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(TableFormViewModel model)
    {
        if (model.Id == null) return BadRequest();

        if (!ModelState.IsValid)
        {
            var areas = await _unitOfWork.TableAreas.GetAllAsync(activeOnly: true);
            model.AreaOptions = areas.Select(a => new TableAreaOption { Id = a.Id, Name = a.Name }).ToList();
            return View(model);
        }

        await _tableService.UpdateTableAsync(model.Id.Value, new CreateTableDto
        {
            Name = model.Name,
            Capacity = model.Capacity,
            Location = model.Location ?? string.Empty,
            AreaId = model.AreaId,
            BranchId = _tenantService.GetBranchId()
        });

        return RedirectToAction("Index");
    }

    [HttpGet]
    public async Task<IActionResult> GetDetails(Guid id)
    {
        var table = (await _tableService.GetAllTablesAsync(_tenantService.GetBranchId()))
            .FirstOrDefault(t => t.Id == id);
        if (table == null) return NotFound();

        var activeOrder = await _unitOfWork.Orders.GetActiveOrderByTableIdAsync(id);
        
        object? orderData = null;
        if (activeOrder != null)
        {
            orderData = new
            {
                Id = activeOrder.Id,
                Status = activeOrder.Status.ToString(),
                TotalAmount = activeOrder.TotalAmount,
                CheckInTime = activeOrder.CheckInTime.AddHours(7).ToString("HH:mm dd/MM/yyyy"),
                Items = activeOrder.OrderItems.Select(i => new
                {
                    ProductName = i.Product?.Name ?? "Sản phẩm",
                    Quantity = i.Quantity,
                    UnitPrice = i.UnitPrice,
                    Status = i.Status.ToString(),
                    Total = i.UnitPrice * i.Quantity
                })
            };
        }

        return Json(new
        {
            Id = table.Id,
            Name = table.Name,
            Capacity = table.Capacity,
            Location = table.Location,
            Status = table.Status.ToString(),
            ActiveOrder = orderData
        });
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _tableService.DeleteTableAsync(id);
        return RedirectToAction("Index");
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Reset(Guid id)
    {
        await _tableService.ResetTableAsync(id);
        return RedirectToAction("Index");
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Open(Guid id)
    {
        try
        {
            var result = await _tableService.OpenTableAsync(id);
            return RedirectToAction("Index", "Order", new { tableId = id });
        }
        catch (Exception ex)
        {
            TempData["Error"] = ex.Message;
            return RedirectToAction("Index");
        }
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Transfer(Guid fromId, Guid toId)
    {
        try
        {
            await _tableService.TransferTableAsync(fromId, toId);
        }
        catch (Exception ex)
        {
            TempData["Error"] = ex.Message;
        }
        return RedirectToAction("Index");
    }

    // ── Table Areas ──
    [HttpGet]
    public async Task<IActionResult> Areas()
    {
        var areas = await _unitOfWork.TableAreas.GetAllAsync(activeOnly: false);
        return View(areas.Select(a => new TableAreaOption { Id = a.Id, Name = a.Name, IsActive = a.IsActive, SortOrder = a.SortOrder }).ToList());
    }

    [HttpPost]
    [Authorize(Policy = "RequireManager")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> CreateArea(TableAreaFormViewModel model)
    {
        if (string.IsNullOrWhiteSpace(model.Name))
        {
            TempData["Error"] = "Tên khu vực không được để trống.";
            return RedirectToAction("Areas");
        }

        var shopId = _tenantService.GetTenantId() ?? throw new UnauthorizedAccessException("ShopId not found");
        await _unitOfWork.TableAreas.AddAsync(new TableArea
        {
            Id = Guid.NewGuid(),
            ShopId = shopId,
            Name = model.Name.Trim(),
            SortOrder = model.SortOrder ?? 0,
            IsActive = true
        });
        await _unitOfWork.SaveChangesAsync();

        return RedirectToAction("Areas");
    }

    [HttpPost]
    [Authorize(Policy = "RequireManager")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> ToggleArea(Guid id)
    {
        var area = await _unitOfWork.TableAreas.GetByIdAsync(id);
        if (area == null) return NotFound();

        area.IsActive = !area.IsActive;
        await _unitOfWork.TableAreas.UpdateAsync(area);
        await _unitOfWork.SaveChangesAsync();

        return RedirectToAction("Areas");
    }

    [HttpPost]
    [Authorize(Policy = "RequireManager")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteArea(Guid id, string deleteMode = "deactivate")
    {
        var area = await _unitOfWork.TableAreas.GetByIdAsync(id);
        if (area == null) return NotFound();

        var tablesInArea = (await _unitOfWork.Tables.GetByAreaIdAsync(id)).ToList();

        if (deleteMode == "deleteTables")
        {
            foreach (var table in tablesInArea)
            {
                var activeOrder = await _unitOfWork.Orders.GetActiveOrderByTableIdAsync(table.Id);
                if (activeOrder != null)
                {
                    TempData["Error"] = "Bàn đang có đơn hàng chưa thanh toán, không thể xóa khu vực.";
                    return RedirectToAction("Areas");
                }
            }

            foreach (var table in tablesInArea)
                await _unitOfWork.Tables.HardDeleteAsync(table);

            await _unitOfWork.TableAreas.HardDeleteAsync(area);
        }
        else if (deleteMode == "keepTables")
        {
            foreach (var table in tablesInArea)
            {
                table.AreaId = null;
                table.Location = "Chưa có khu vực";
                await _unitOfWork.Tables.UpdateAsync(table);
            }

            await _unitOfWork.TableAreas.HardDeleteAsync(area);
        }
        else
        {
            area.IsActive = false;
            await _unitOfWork.TableAreas.UpdateAsync(area);
        }

        await _unitOfWork.SaveChangesAsync();
        return RedirectToAction("Areas");
    }
}
