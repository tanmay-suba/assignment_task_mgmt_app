using Microsoft.AspNetCore.Mvc;
using TaskApp.Application.Models;
using TaskApp.Application.Services;

namespace TaskApp.Api.Controllers;

[ApiController]
[Route("api/tasks")]
public class TasksController : ControllerBase
{
    private readonly ITaskService _taskService;

    public TasksController(ITaskService taskService)
    {
        _taskService = taskService;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResult<TaskDto>>> GetTasks(
        [FromQuery] TaskQueryParameters query,
        CancellationToken cancellationToken)
    {
        var result = await _taskService.GetTasksAsync(query, cancellationToken);
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<TaskDto>> CreateTask(
        [FromBody] TaskCreateDto dto,
        CancellationToken cancellationToken)
    {
        var created = await _taskService.CreateAsync(dto, cancellationToken);
        return Ok(created);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<TaskDto>> UpdateTask(
        [FromRoute] Guid id,
        [FromBody] TaskUpdateDto dto,
        CancellationToken cancellationToken)
    {
        var updated = await _taskService.UpdateAsync(id, dto, cancellationToken);
        if (updated == null)
        {
            return NotFound();
        }

        return Ok(updated);
    }

    [HttpPatch("{id:guid}/complete")]
    public async Task<ActionResult<TaskDto>> ToggleComplete(
        [FromRoute] Guid id,
        [FromBody] ToggleCompleteRequest request,
        CancellationToken cancellationToken)
    {
        var updated = await _taskService.ToggleCompleteAsync(id, request.IsComplete, cancellationToken);
        if (updated == null)
        {
            return NotFound();
        }

        return Ok(updated);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteTask(
        [FromRoute] Guid id,
        CancellationToken cancellationToken)
    {
        var removed = await _taskService.DeleteAsync(id, cancellationToken);
        if (!removed)
        {
            return NotFound();
        }

        return NoContent();
    }

    public sealed class ToggleCompleteRequest
    {
        public required bool IsComplete { get; init; }
    }
}
