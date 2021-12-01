using NLog;
using ProjectDevs.Business.Extensions;
using ProjectDevs.Core.Constants;
using ProjectDevs.Core.Interfaces.Repositories;
using ProjectDevs.Core.Interfaces.Services;
using System.Linq;
using System.Web.Http;

namespace ProjectDevs.Api.Controllers
{
    [RoutePrefix("api/notifications")]
    public class NotificationsController : BaseApiController
    {
        private static readonly Logger _logger = LogManager.GetCurrentClassLogger();
        private readonly IRepoFactory _repoFactory;

        private readonly ICacheService _cacheService;

        public NotificationsController(IRepoFactory repoFactory, ICacheService cacheService)
        {
            _repoFactory = repoFactory;
            _cacheService = cacheService;
        }

        [Route("count")]
        public IHttpActionResult GetUnseenNotificationsCount()
        {
            var unseenCount = _repoFactory.Notifications.GetNotificationCount(base.UserId, false);
            return Ok(unseenCount);
        }

        [Route("")]
        public IHttpActionResult GetNotifications(int pno = 1, int psize = PdConstants.DefaultPageSize)
        {
            var notifications = _repoFactory.Notifications.GetNotifications(base.UserId);

            if (notifications?.Any() == true)
            {
                var unseen = notifications.Where(n => !n.Seen);
                if (unseen?.Any() == true)
                {
                    var notificationIds = string.Join(",", unseen.Select(u => u.NotificationId));
                    _repoFactory.Notifications.UpdateNotificationSeen(notificationIds);
                }
                var paged = notifications.GetPagingModel(pno, psize);
                if (paged?.Data?.Any() == true)
                    return Ok(paged);
            }
            return Ok();
        }

    }
}
