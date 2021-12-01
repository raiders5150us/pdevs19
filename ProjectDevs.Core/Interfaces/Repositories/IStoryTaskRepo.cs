using ProjectDevs.Core.Models;
using System.Collections.Generic;
using System.Data;

namespace ProjectDevs.Core.Interfaces.Repositories
{
    public interface IStoryTaskRepo
    {
        int? CreateStoryTask(StoryTask task, IDbTransaction transaction = null);
        int UpdateStoryTask(StoryTask task, IDbTransaction transaction = null);
        IEnumerable<StoryTask> GetStoryTasks(int? taskId = null, int? storyId = null, string assignedToUserId = null, string teamId = null);

        IEnumerable<StoryTask> GetMyTasks(string assignedToUserID, int? taskId = null, int? storyId = null, string teamId = null);
    }
}
