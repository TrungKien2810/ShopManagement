using ShopManagement.Domain.Common;
using ShopManagement.Domain.Enums;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShopManagement.Domain.Entities;

public class Table : BaseEntity
{
    public Guid ShopId { get; set; }
    public Guid? BranchId { get; set; } // Make it nullable for now to avoid migration breaks on existing data
    public string Name { get; set; } = string.Empty;
    public int Capacity { get; set; }
    public TableStatus Status { get; set; } = TableStatus.Available;
    public string Location { get; set; } = string.Empty;
    public Guid? AreaId { get; set; }

    // Navigation properties
    public virtual Shop Shop { get; set; } = null!;
    public virtual Branch? Branch { get; set; }
    public virtual TableArea? Area { get; set; }

    // Soft-delete
    public bool IsDeleted { get; set; } = false;
    public DateTime? DeletedAt { get; set; }

    [NotMapped]
    public string TableNumber
    {
        get => Name;
        set => Name = value;
    }

    [NotMapped]
    public int Seats
    {
        get => Capacity;
        set => Capacity = value;
    }

    [NotMapped]
    public bool IsOccupied => Status == TableStatus.InUse;
}
