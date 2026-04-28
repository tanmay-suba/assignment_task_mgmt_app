using Microsoft.EntityFrameworkCore;
using TaskApp.Domain.Entities;
using TaskApp.Domain.Enums;

namespace TaskApp.Infrastructure.Persistence;

public static class AppDbSeeder
{
    public static async Task SeedAsync(AppDbContext context, CancellationToken cancellationToken = default)
    {
        if (await context.Tasks.AnyAsync(cancellationToken))
        {
            return;
        }

        var now = DateTime.UtcNow;
        var tasks = new List<TaskItem>
        {
            new()
            {
                Id = Guid.Parse("d1a1d7a2-1db8-4b34-9a6d-712db2bff7f1"),
                Title = "Draft onboarding flow",
                Description = "Sketch the first-time experience and empty states.",
                Status = global::TaskApp.Domain.Enums.TaskStatus.Todo,
                Priority = TaskPriority.High,
                DueDate = now.AddDays(3),
                CreatedAt = now.AddDays(-2),
                UpdatedAt = now.AddDays(-2)
            },
            new()
            {
                Id = Guid.Parse("c4a0b2c6-0f0b-4f5a-8e2a-7b0fd0b2f01a"),
                Title = "Implement filters",
                Description = "Status and priority chips with API-driven filtering.",
                Status = global::TaskApp.Domain.Enums.TaskStatus.InProgress,
                Priority = TaskPriority.Medium,
                DueDate = now.AddDays(5),
                CreatedAt = now.AddDays(-4),
                UpdatedAt = now.AddDays(-1)
            },
            new()
            {
                Id = Guid.Parse("8c1f6f6b-e7b7-4a5f-88a3-1e2a2e78d9f3"),
                Title = "Polish task list UI",
                Description = "Add skeleton loaders and empty state illustration.",
                Status = global::TaskApp.Domain.Enums.TaskStatus.Todo,
                Priority = TaskPriority.Low,
                DueDate = now.AddDays(7),
                CreatedAt = now.AddDays(-3),
                UpdatedAt = now.AddDays(-3)
            },
            new()
            {
                Id = Guid.Parse("ad9a7d4d-1c4f-48e9-96b5-57b2c6456f11"),
                Title = "Fix overdue reporting",
                Description = "Ensure overdue tasks show warning badge.",
                Status = global::TaskApp.Domain.Enums.TaskStatus.Done,
                Priority = TaskPriority.High,
                DueDate = now.AddDays(-1),
                CreatedAt = now.AddDays(-7),
                UpdatedAt = now.AddDays(-1),
                CompletedAt = now.AddDays(-1)
            },
            new()
            {
                Id = Guid.Parse("f4db1f4e-7a02-48fb-8d38-2f4b9d03f8cc"),
                Title = "Write README draft",
                Description = "Capture decisions and setup steps.",
                Status = global::TaskApp.Domain.Enums.TaskStatus.Todo,
                Priority = TaskPriority.Medium,
                CreatedAt = now.AddDays(-1),
                UpdatedAt = now.AddDays(-1)
            },
            new()
            {
                Id = Guid.Parse("5f24a819-9f5c-4dfc-8628-91fe6e2f2e5c"),
                Title = "QA keyboard shortcuts",
                Description = "Verify n, /, Enter, and Esc behaviors.",
                Status = global::TaskApp.Domain.Enums.TaskStatus.InProgress,
                Priority = TaskPriority.Medium,
                DueDate = now.AddDays(1),
                CreatedAt = now.AddDays(-2),
                UpdatedAt = now
            }
        };

        context.Tasks.AddRange(tasks);
        await context.SaveChangesAsync(cancellationToken);
    }
}
