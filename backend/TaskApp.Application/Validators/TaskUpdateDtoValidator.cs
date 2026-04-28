using FluentValidation;
using TaskApp.Application.Models;

namespace TaskApp.Application.Validators;

public class TaskUpdateDtoValidator : AbstractValidator<TaskUpdateDto>
{
    public TaskUpdateDtoValidator()
    {
        RuleFor(task => task.Title)
            .NotEmpty()
            .MaximumLength(200);

        RuleFor(task => task.Description)
            .MaximumLength(2000);
    }
}
