using Moq;
using ShopManagement.Application.Interfaces;
using ShopManagement.Application.Services;
using ShopManagement.Domain.Entities;
using ShopManagement.Domain.Enums;
using ShopManagement.Domain.Exceptions;
using Xunit;

namespace ShopManagement.Tests.UnitTests;

public class TableServiceTests
{
    private readonly Mock<IUnitOfWork> _mockUnitOfWork;
    private readonly Mock<ITableRepository> _mockTableRepo;
    private readonly Mock<IOrderRepository> _mockOrderRepo;
    private readonly Mock<IShopNotificationService> _mockNotificationService;
    private readonly Mock<ITenantService> _mockTenantService;
    private readonly TableService _tableService;

    public TableServiceTests()
    {
        _mockUnitOfWork = new Mock<IUnitOfWork>();
        _mockTableRepo = new Mock<ITableRepository>();
        _mockOrderRepo = new Mock<IOrderRepository>();
        _mockNotificationService = new Mock<IShopNotificationService>();
        _mockTenantService = new Mock<ITenantService>();

        _mockTenantService.Setup(t => t.GetTenantId()).Returns(Guid.NewGuid());
        
        _tableService = new TableService(_mockUnitOfWork.Object, _mockNotificationService.Object, _mockTenantService.Object);

        // Setup repository properties
        _mockUnitOfWork.Setup(u => u.Tables).Returns(_mockTableRepo.Object);
        _mockUnitOfWork.Setup(u => u.Orders).Returns(_mockOrderRepo.Object);

        // Setup Task returning methods to avoid NullReferenceException when awaited
        _mockUnitOfWork.Setup(u => u.BeginTransactionAsync()).Returns(Task.CompletedTask);
        _mockUnitOfWork.Setup(u => u.CommitTransactionAsync()).Returns(Task.CompletedTask);
        _mockUnitOfWork.Setup(u => u.RollbackTransactionAsync()).Returns(Task.CompletedTask);
        _mockUnitOfWork.Setup(u => u.SaveChangesAsync()).Returns(Task.FromResult(0));
    }

    [Fact]
    public async Task OpenTableAsync_ShouldReturnSuccess_WhenTableIsAvailable()
    {
        // Arrange
        var tableId = Guid.NewGuid();
        var table = new Table 
        { 
            Id = tableId, 
            Name = "Bàn 1", 
            Status = TableStatus.Available 
        };

        _mockUnitOfWork.Setup(u => u.Tables.GetByIdAsync(tableId))
            .ReturnsAsync(table);

        // Act
        var result = await _tableService.OpenTableAsync(tableId);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Bàn 1", result.TableName);
        Assert.Equal(TableStatus.InUse, table.Status);
        
        _mockUnitOfWork.Verify(u => u.BeginTransactionAsync(), Times.Once);
        _mockUnitOfWork.Verify(u => u.SaveChangesAsync(), Times.Once);
        _mockUnitOfWork.Verify(u => u.CommitTransactionAsync(), Times.Once);
    }

    [Fact]
    public async Task OpenTableAsync_ShouldThrowDomainException_WhenTableIsInUse()
    {
        // Arrange
        var tableId = Guid.NewGuid();
        var table = new Table 
        { 
            Id = tableId, 
            Name = "Bàn 1", 
            Status = TableStatus.InUse 
        };

        _mockUnitOfWork.Setup(u => u.Tables.GetByIdAsync(tableId))
            .ReturnsAsync(table);

        // Act & Assert
        await Assert.ThrowsAsync<DomainException>(() => 
            _tableService.OpenTableAsync(tableId));
    }

    [Fact]
    public async Task OpenTableAsync_ShouldThrowEntityNotFoundException_WhenTableDoesNotExist()
    {
        // Arrange
        var tableId = Guid.NewGuid();
        _mockTableRepo.Setup(u => u.GetByIdAsync(tableId))
            .ReturnsAsync((Table?)null);

        // Act & Assert
        await Assert.ThrowsAsync<EntityNotFoundException>(() => 
            _tableService.OpenTableAsync(tableId));
    }
}
