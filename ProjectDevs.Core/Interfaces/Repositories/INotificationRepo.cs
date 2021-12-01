using ProjectDevs.Core.Models;
using System.Collections.Generic;
using System.Data;

namespace ProjectDevs.Core.Interfaces.Repositories
{
    public interface INotificationRepo
    {
        int UpdateNotificationSeen(string notificationIds, IDbTransaction transaction = null);
        int GetNotificationCount(string userId, bool seen = false);
        IEnumerable<ProjectNotification> GetNotifications(string userId);
        int CreateNotifications(List<ProjectNotification> notifications, IDbTransaction transaction = null);
    }
}
