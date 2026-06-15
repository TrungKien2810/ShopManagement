using ShopManagement.Domain.Common;
using System;

namespace ShopManagement.Domain.Entities;

public class TableArea : BaseEntity
{
    public Guid ShopId { get; set; }
    public string Name { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public int SortOrder { get; set; } = 0;

    // Soft-delete
    public bool IsDeleted { get; set; } = false;
    public DateTime? DeletedAt { get; set; }

    public virtual Shop Shop { get; set; } = null!;
    public virtual ICollection<Table> Tables { get; set; } = new List<Table>();
}

