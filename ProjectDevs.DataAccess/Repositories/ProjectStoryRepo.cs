using ProjectDevs.Core.Constants;
using ProjectDevs.Core.Interfaces.Repositories;
using ProjectDevs.Core.Models;
using ProjectDevs.DataAccess.Extensions;
using System.Collections.Generic;
using System.Data;
using System.Linq;

namespace ProjectDevs.DataAccess.Repositories
{
    public class ProjectStoryRepo : IProjectStoryRepo
    {
        private readonly IDbConnection _connection;

        public ProjectStoryRepo(IDbConnection connection) => _connection = connection;

        public int? CreateProjectStory(UserStory story, IDbTransaction transaction = null) =>
             _connection.QueryStoredProcedure<int>(Database.StoredProcedures.PD_CreateProjectStory, story.GetCreateSpParams(), transaction)
            ?.FirstOrDefault();

        public int UpdateProjectStory(UserStory story, IDbTransaction transaction = null) =>
             _connection.ExecuteStoredProcedure(Database.StoredProcedures.PD_UpdateProjectStory, story.GetUpdateSpParams(), transaction);


        public IEnumerable<UserStory> GetProjectStories(int? projectId = null, string requesterId = null, string assignedToUserId = null,string teamIds = null) =>
            _connection.QueryStoredProcedure<UserStory>(Database.StoredProcedures.PD_SelectProjectStories, new { projectId, requesterId, assignedToUserId, teamIds })
                ?.ToList();
        public IEnumerable<Status> GetProjectStoriesStatuses(int? projectId = null) =>
            _connection.QueryStoredProcedure<Status>(Database.StoredProcedures.PD_SelectProjectStoryStatuses, new { projectId })
                ?.ToList();
        public IEnumerable<UserStory> GetMyStories(string userId) =>
           _connection.QueryStoredProcedure<UserStory>(Database.StoredProcedures.PD_My_SelectProjectStories, new { userId })
               ?.ToList();


        public IEnumerable<StoriesWithoutEndDate> GetStoriesWithoutEndDate() =>
             _connection.QueryStoredProcedure<StoriesWithoutEndDate>(Database.StoredProcedures.PD_SelectStoriesWithoutEndDate)
                ?.ToList();

        public int UpdateProjectStoryOrder(int storyId, int order, IDbTransaction transaction = null) =>
             _connection.ExecuteStoredProcedure(Database.StoredProcedures.PD_UpdateProjectStoryOrder, new { StoryId=storyId, PriorityRanking= order }, transaction);


        public int ProjectStoryCopyToNextSprint(int projectId, int sprintId, int storyId, IDbTransaction transaction = null) =>
             _connection.ExecuteStoredProcedure(Database.StoredProcedures.PD_ProjectStoryCopyToNextSprint, new { projectId , sprintId, storyId }, transaction);
    }
}
