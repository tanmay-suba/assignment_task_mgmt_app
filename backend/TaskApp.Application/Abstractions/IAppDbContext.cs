using Microsoft.EntityFrameworkCore;
using TaskApp.Domain.Entities;

namespace TaskApp.Application.Abstractions;

public interface IAppDbContext
{
    DbSet<TaskItem> Tasks { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
