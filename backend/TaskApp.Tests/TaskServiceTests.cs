using Microsoft.EntityFrameworkCore;
using TaskApp.Application.Models;
using TaskApp.Application.Services;
using TaskApp.Domain.Enums;
using TaskApp.Infrastructure.Persistence;

namespace TaskApp.Tests;

public class TaskServiceTests
{
    [Fact]
    public async Task CreateAsync_PersistsTask()
    {
        await using var context = BuildContext();
        var service = new TaskService(context);

        var result = await service.CreateAsync(new TaskCreateDto
        {
            Title = "Ship demo",
            Description = "Prep the demo data",
            Priority = TaskPriority.High
        }, CancellationToken.None);

        Assert.NotNull(result);
        Assert.Equal(global::TaskApp.Domain.Enums.TaskStatus.Todo, result!.Status);
        Assert.Equal(1, await context.Tasks.CountAsync());
    }

    [Fact]
    public async Task ToggleCompleteAsync_SetsDoneStatus()
    {
        await using var context = BuildContext();
        var service = new TaskService(context);

        var created = await service.CreateAsync(new TaskCreateDto
        {
            Title = "Check shortcuts",
            Priority = TaskPriority.Medium
        }, CancellationToken.None);

        var updated = await service.ToggleCompleteAsync(created!.Id, true, CancellationToken.None);

        Assert.NotNull(updated);
        Assert.Equal(global::TaskApp.Domain.Enums.TaskStatus.Done, updated!.Status);
        Assert.NotNull(updated.CompletedAt);
    }

    private static AppDbContext BuildContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new AppDbContext(options);
    }
}
