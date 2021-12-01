using ProjectDevs.Core.Constants;
using ProjectDevs.Core.Interfaces.Repositories;
using ProjectDevs.Core.Models;
using ProjectDevs.DataAccess.Extensions;
using System.Collections.Generic;
using System.Data;
using System.Linq;

namespace ProjectDevs.DataAccess.Repositories
{
    public class StoryTaskRepo : IStoryTaskRepo
    {
        private readonly IDbConnection _connection;

        public StoryTaskRepo(IDbConnection connection) => _connection = connection;

        public int? CreateStoryTask(StoryTask task, IDbTransaction transaction = null) =>
            _connection.QueryStoredProcedure<int>(Database.StoredProcedures.PD_CreateProjectStoryTask, task.GetCreateSpParams(), transaction)
                ?.FirstOrDefault();

        public int UpdateStoryTask(StoryTask task, IDbTransaction transaction = null) =>
            _connection.ExecuteStoredProcedure(Database.StoredProcedures.PD_UpdateProjectStoryTask, task.GetUpdateSpParams(), transaction);

        public IEnumerable<StoryTask> GetStoryTasks(int? taskId = null, int? storyId = null, string assignedToUserId = null,string teamId=null) =>
            _connection.QueryStoredProcedure<StoryTask>(Database.StoredProcedures.PD_SelectProjectStoryTasks, new { taskId, storyId, assignedToUserId, teamId })
                ?.ToList();

        public IEnumerable<StoryTask> GetMyTasks(string assignedToUserID, int? taskId = null, int? storyId = null, string teamId = null) =>
            _connection.QueryStoredProcedure<StoryTask>(Database.StoredProcedures.PD_My_SelectProjectStoryTasks, new { taskId, storyId, assignedToUserID, teamId })
                ?.ToList();
    }
}


