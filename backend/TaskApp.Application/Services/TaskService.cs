using Microsoft.EntityFrameworkCore;
using TaskApp.Application.Abstractions;
using TaskApp.Application.Models;
using TaskApp.Domain.Entities;
using TaskApp.Domain.Enums;

namespace TaskApp.Application.Services;

public class TaskService : ITaskService
{
    private readonly IAppDbContext _context;

    public TaskService(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<PagedResult<TaskDto>> GetTasksAsync(TaskQueryParameters query, CancellationToken cancellationToken)
    {
        var tasks = _context.Tasks.AsNoTracking();

        if (query.Status.HasValue)
        {
            tasks = tasks.Where(task => task.Status == query.Status.Value);
        }

        if (query.Priority.HasValue)
        {
            tasks = tasks.Where(task => task.Priority == query.Priority.Value);
        }

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var term = query.Search.Trim().ToLowerInvariant();
            tasks = tasks.Where(task =>
                task.Title.ToLower().Contains(term)
                || (task.Description != null && task.Description.ToLower().Contains(term)));
        }

        if (query.DueBefore.HasValue)
        {
            tasks = tasks.Where(task => task.DueDate != null && task.DueDate <= query.DueBefore.Value);
        }

        tasks = ApplySorting(tasks, query.Sort);

        var total = await tasks.CountAsync(cancellationToken);
        var page = query.Page < 1 ? 1 : query.Page;
        var pageSize = query.PageSize is < 1 or > 100 ? 20 : query.PageSize;

        var items = await tasks
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(task => ToDto(task))
            .ToListAsync(cancellationToken);

        return new PagedResult<TaskDto>
        {
            Items = items,
            Total = total
        };
    }

    public async Task<TaskDto?> CreateAsync(TaskCreateDto dto, CancellationToken cancellationToken)
    {
        var now = DateTime.UtcNow;
        var task = new TaskItem
        {
            Id = Guid.NewGuid(),
            Title = dto.Title.Trim(),
            Description = dto.Description?.Trim(),
            Priority = dto.Priority,
            Status = global::TaskApp.Domain.Enums.TaskStatus.Todo,
            DueDate = dto.DueDate,
            CreatedAt = now,
            UpdatedAt = now
        };

        _context.Tasks.Add(task);
        await _context.SaveChangesAsync(cancellationToken);

        return ToDto(task);
    }

    public async Task<TaskDto?> UpdateAsync(Guid id, TaskUpdateDto dto, CancellationToken cancellationToken)
    {
        var task = await _context.Tasks.FirstOrDefaultAsync(t => t.Id == id, cancellationToken);
        if (task == null)
        {
            return null;
        }

        task.Title = dto.Title.Trim();
        task.Description = dto.Description?.Trim();
        task.Priority = dto.Priority;
        task.Status = dto.Status;
        task.DueDate = dto.DueDate;
        task.UpdatedAt = DateTime.UtcNow;

        if (task.Status == global::TaskApp.Domain.Enums.TaskStatus.Done)
        {
            task.CompletedAt ??= DateTime.UtcNow;
        }
        else
        {
            task.CompletedAt = null;
        }

        await _context.SaveChangesAsync(cancellationToken);

        return ToDto(task);
    }

    public async Task<TaskDto?> ToggleCompleteAsync(Guid id, bool isComplete, CancellationToken cancellationToken)
    {
        var task = await _context.Tasks.FirstOrDefaultAsync(t => t.Id == id, cancellationToken);
        if (task == null)
        {
            return null;
        }

        task.Status = isComplete ? global::TaskApp.Domain.Enums.TaskStatus.Done : global::TaskApp.Domain.Enums.TaskStatus.Todo;
        task.UpdatedAt = DateTime.UtcNow;
        task.CompletedAt = isComplete ? DateTime.UtcNow : null;

        await _context.SaveChangesAsync(cancellationToken);

        return ToDto(task);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var task = await _context.Tasks.FirstOrDefaultAsync(t => t.Id == id, cancellationToken);
        if (task == null)
        {
            return false;
        }

        _context.Tasks.Remove(task);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }

    private static IQueryable<TaskItem> ApplySorting(IQueryable<TaskItem> tasks, string? sort)
    {
        return sort?.ToLowerInvariant() switch
        {
            "duedate" => tasks.OrderBy(task => task.DueDate == null).ThenBy(task => task.DueDate),
            "priority" => tasks.OrderByDescending(task => task.Priority),
            "createdat" => tasks.OrderByDescending(task => task.CreatedAt),
            _ => tasks.OrderByDescending(task => task.UpdatedAt)
        };
    }

    private static TaskDto ToDto(TaskItem task)
    {
        return new TaskDto
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            Status = task.Status,
            Priority = task.Priority,
            DueDate = task.DueDate,
            CreatedAt = task.CreatedAt,
            UpdatedAt = task.UpdatedAt,
            CompletedAt = task.CompletedAt
        };
    }
}
