using TaskApp.Application.Models;

namespace TaskApp.Application.Services;

public interface ITaskService
{
    Task<PagedResult<TaskDto>> GetTasksAsync(TaskQueryParameters query, CancellationToken cancellationToken);
    Task<TaskDto?> CreateAsync(TaskCreateDto dto, CancellationToken cancellationToken);
    Task<TaskDto?> UpdateAsync(Guid id, TaskUpdateDto dto, CancellationToken cancellationToken);
    Task<TaskDto?> ToggleCompleteAsync(Guid id, bool isComplete, CancellationToken cancellationToken);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken);
}
