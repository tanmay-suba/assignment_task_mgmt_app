using TaskApp.Domain.Enums;

namespace TaskApp.Application.Models;

public class TaskDto
{
    public required Guid Id { get; init; }
    public required string Title { get; init; }
    public string? Description { get; init; }
    public required global::TaskApp.Domain.Enums.TaskStatus Status { get; init; }
    public required global::TaskApp.Domain.Enums.TaskPriority Priority { get; init; }
    public DateTime? DueDate { get; init; }
    public required DateTime CreatedAt { get; init; }
    public required DateTime UpdatedAt { get; init; }
    public DateTime? CompletedAt { get; init; }
}
