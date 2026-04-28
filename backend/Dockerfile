FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY backend/TaskApp.slnx ./
COPY backend/TaskApp.Api/TaskApp.Api.csproj backend/TaskApp.Api/
COPY backend/TaskApp.Domain/TaskApp.Domain.csproj backend/TaskApp.Domain/
COPY backend/TaskApp.Application/TaskApp.Application.csproj backend/TaskApp.Application/
COPY backend/TaskApp.Infrastructure/TaskApp.Infrastructure.csproj backend/TaskApp.Infrastructure/
COPY backend/TaskApp.Tests/TaskApp.Tests.csproj backend/TaskApp.Tests/

RUN dotnet restore backend/TaskApp.Api/TaskApp.Api.csproj

COPY backend/. ./backend/

WORKDIR /src/backend/TaskApp.Api
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
ENV ASPNETCORE_URLS=http://+:5000
EXPOSE 5000
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "TaskApp.Api.dll"]
