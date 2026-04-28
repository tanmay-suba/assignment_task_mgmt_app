using TaskApp.Domain.Enums;

namespace TaskApp.Application.Models;

public class TaskCreateDto
{
    public required string Title { get; init; }
    public string? Description { get; init; }
    public TaskPriority Priority { get; init; } = TaskPriority.Medium;
    public DateTime? DueDate { get; init; }
}
