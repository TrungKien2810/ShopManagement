using System.Text.Json;
using ShopManagement.Domain.Exceptions;

namespace ShopManagement.WebAPI.Middlewares;

public sealed class DomainExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<DomainExceptionMiddleware> _logger;

    public DomainExceptionMiddleware(RequestDelegate next, ILogger<DomainExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task Invoke(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (EntityNotFoundException ex)
        {
            if (context.Response.HasStarted) throw;

            _logger.LogInformation(ex, "Entity not found: {Message}", ex.Message);
            await WriteJsonErrorAsync(context, StatusCodes.Status404NotFound, ex.Message);
        }
        catch (DomainException ex)
        {
            if (context.Response.HasStarted) throw;

            _logger.LogInformation(ex, "Domain exception: {Message}", ex.Message);
            await WriteJsonErrorAsync(context, StatusCodes.Status400BadRequest, ex.Message);
        }
        catch (UnauthorizedAccessException ex)
        {
            if (context.Response.HasStarted) throw;

            _logger.LogInformation(ex, "Unauthorized: {Message}", ex.Message);
            await WriteJsonErrorAsync(context, StatusCodes.Status401Unauthorized, ex.Message);
        }
    }

    private static async Task WriteJsonErrorAsync(HttpContext context, int statusCode, string message)
    {
        context.Response.StatusCode = statusCode;
        context.Response.ContentType = "application/json";

        var payload = JsonSerializer.Serialize(new { error = message });
        await context.Response.WriteAsync(payload);
    }
}
