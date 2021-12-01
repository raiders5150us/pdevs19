using System.Collections.Generic;

namespace ProjectDevs.Core.Interfaces.Services
{
    public interface ICacheService
    {
        IReadOnlyDictionary<string, string> UserNames { get; }
        IReadOnlyDictionary<int, string> ProjectNames { get; }
        IReadOnlyDictionary<int, string> ProjectStatusNames { get; }
        IReadOnlyDictionary<int, string> TeamNames { get; }
        IReadOnlyDictionary<int, string> StoryStatusNames { get; }
        IReadOnlyDictionary<int, string> TaskStatusNames { get; }
        IReadOnlyDictionary<int, string> TaskLOBNames { get; }
        IReadOnlyDictionary<int, string> TestScriptStatusNames { get; }
        IReadOnlyDictionary<int, string> TestScriptStepsStatusNames { get; }
        IReadOnlyDictionary<int, string> SprintNames { get; }
        IReadOnlyDictionary<int, string> StoryTypes { get; }
        IReadOnlyDictionary<int, string> ReportTypes { get; }

        void PurgeUserNames();
        void PurgeProjectNames();
        void PurgeSprintNames();
        void PurgeStatuses();
        void PurgeCache();

        string GetUserName(string userId);
        string GetProjectName(int projectId);
        string GetProjectStatusName(int statusId);
        string GetProjectTeamName(int statusId);
        string GetStoryStatusName(int statusId);
        string GetTaskStatusName(int statusId);
        string GetTestScriptStatusName(int statusId);
        string GetSprintName(int sprintId);
        string GetStoryTypeName(int storyTypeId);
    }
}
