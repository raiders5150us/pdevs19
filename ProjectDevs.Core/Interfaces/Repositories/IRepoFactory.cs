using System;
using System.Data;

namespace ProjectDevs.Core.Interfaces.Repositories
{
    public interface IRepoFactory: IDisposable
    {
        IDashboardRepo Dashboard { get; }
        IMastersRepo Masters { get; }
        IProjectRepo Projects { get; }
        IFilesRepo Files { get; }
        INotesRepo Notes { get; }
        IProjectMeetingRepo ProjectMeetings { get; }
        IProjectStoryRepo ProjectStories { get; }
        ISprintRepo Sprints { get; }
        IStoryTaskRepo StoryTasks { get; }
        IUserRepo Users { get; }
        ITestScriptRepo TestScripts { get; }
        INotificationRepo Notifications { get; }
        ISearchRepo Searchs { get; }
        IRotaSuppRepo RotaSupp { get; }

        IDbLogRepo DbLogs { get; }

        void OpenConnection();
        void CloseConnection();

        IDbTransaction BeginTransaction();
        IDbTransaction GetTransaction();

        void CommitTransaction();
        void RollbackTransaction();
    }
}
