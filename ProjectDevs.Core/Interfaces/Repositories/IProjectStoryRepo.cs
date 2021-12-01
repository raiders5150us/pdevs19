using ProjectDevs.Core.Models;
using System.Collections.Generic;
using System.Data;

namespace ProjectDevs.Core.Interfaces.Repositories
{
    public interface IProjectStoryRepo
    {
        int? CreateProjectStory(UserStory story, IDbTransaction transaction = null);
        int UpdateProjectStory(UserStory story, IDbTransaction transaction = null);
        int UpdateProjectStoryOrder(int storyId,int order, IDbTransaction transaction = null);
        int ProjectStoryCopyToNextSprint(int projectId, int sprintId, int storyId, IDbTransaction transaction = null);
        IEnumerable<UserStory> GetProjectStories(int? projectId = null, string requesterId = null, string assignedToUserId = null, string teamIds = null);
        IEnumerable<Status> GetProjectStoriesStatuses(int? projectId = null);
        IEnumerable<UserStory> GetMyStories(string userId);

        IEnumerable<StoriesWithoutEndDate> GetStoriesWithoutEndDate();
    }
}
