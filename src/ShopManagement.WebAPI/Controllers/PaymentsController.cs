using ShopManagement.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ShopManagement.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = "RequireStaff")]
public class PaymentsController : ControllerBase
{
    private readonly IPaymentService _paymentService;

    public PaymentsController(IPaymentService paymentService)
    {
        _paymentService = paymentService;
    }

    [HttpPost]
    public async Task<ActionResult<PaymentDto>> Post([FromBody] CreatePaymentDto request)
    {
        var result = await _paymentService.CreatePaymentAsync(request);
        return Ok(result);
    }

    [HttpGet("order/{orderId}")]
    public async Task<ActionResult<IEnumerable<PaymentDto>>> GetHistory(Guid orderId)
    {
        var result = await _paymentService.GetPaymentHistoryAsync(orderId);
        return Ok(result);
    }
}
