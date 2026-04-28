using TaskApp.Domain.Enums;

namespace TaskApp.Application.Models;

public class TaskUpdateDto
{
    public required string Title { get; init; }
    public string? Description { get; init; }
    public required global::TaskApp.Domain.Enums.TaskStatus Status { get; init; }
    public required global::TaskApp.Domain.Enums.TaskPriority Priority { get; init; }
    public DateTime? DueDate { get; init; }
}
