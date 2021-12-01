using NLog;
using ProjectDevs.Core.Constants;
using ProjectDevs.Core.Interfaces.Repositories;
using System.Linq;
using System.Net;
using System.Web.Http;

namespace ProjectDevs.Api.Controllers
{
    [RoutePrefix("api/logs")]
    public class DbLogsController : BaseApiController
    {
        private static readonly Logger _logger = LogManager.GetCurrentClassLogger();
        private readonly IRepoFactory _repoFactory;

        public DbLogsController(IRepoFactory repoFactory) => _repoFactory = repoFactory;

        [Route("")]
        public IHttpActionResult GetLogs(int pno = 1, int psize = 20)
        {
            if (base.UserRoleType?.Equals(PdConstants.DeveloperRole) == true)
            {
                var logs = _repoFactory.DbLogs.GetDbLogsByPage(pno, psize);
                if (logs?.Data?.Any() == true)
                    return Ok(logs);
                return Ok();
            }
            _logger.Warn($"Unauthorized access to logs denied. By User Name: {base.DisplayName}    Id: {base.UserId}");
            return StatusCode(HttpStatusCode.Forbidden);
        }
    }
}
