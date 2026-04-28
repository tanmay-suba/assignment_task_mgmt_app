using Microsoft.EntityFrameworkCore;
using TaskApp.Application.Abstractions;
using TaskApp.Domain.Entities;
using TaskApp.Domain.Enums;

namespace TaskApp.Infrastructure.Persistence;

public class AppDbContext : DbContext, IAppDbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<TaskItem> Tasks => Set<TaskItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<TaskItem>(builder =>
        {
            builder.HasKey(task => task.Id);
            builder.Property(task => task.Title)
                .HasMaxLength(200)
                .IsRequired();
            builder.Property(task => task.Description)
                .HasMaxLength(2000);
            builder.Property(task => task.Status)
                .HasConversion<int>();
            builder.Property(task => task.Priority)
                .HasConversion<int>();
        });
    }
}
