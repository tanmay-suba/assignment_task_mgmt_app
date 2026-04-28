using TaskApp.Domain.Enums;

namespace TaskApp.Application.Models;

public class TaskQueryParameters
{
    public global::TaskApp.Domain.Enums.TaskStatus? Status { get; init; }
    public global::TaskApp.Domain.Enums.TaskPriority? Priority { get; init; }
    public string? Search { get; init; }
    public DateTime? DueBefore { get; init; }
    public string? Sort { get; init; }
    public int Page { get; init; } = 1;
    public int PageSize { get; init; } = 20;
}
