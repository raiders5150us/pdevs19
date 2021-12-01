using NLog;
using ProjectDevs.Business.Extensions;
using ProjectDevs.Core.Constants;
using ProjectDevs.Core.Interfaces.Repositories;
using ProjectDevs.Core.Interfaces.Services;
using ProjectDevs.Core.Models;
using System;
using System.Linq;
using System.Web.Http;

namespace ProjectDevs.Api.Controllers
{
    [RoutePrefix("api/users")]
    public class UsersController : BaseApiController
    {
        private static readonly Logger _logger = LogManager.GetCurrentClassLogger();
        private readonly IRepoFactory _repoFactory;
        private readonly ICacheService _cacheService;

        public UsersController(IRepoFactory repoFactory, ICacheService cacheService)
        {
            _repoFactory = repoFactory;
            _cacheService = cacheService;
        }
        [Route("")]
        public IHttpActionResult GetUsers(int pno = 1, int psize = PdConstants.DefaultPageSize)
        {
            var users = _repoFactory.Users.GetUsers();
            if (users?.Any() == true)
            {
                var pagedData = users.GetPagingModel(pno, psize);
                return Ok(pagedData);
            }
            return Ok();
        }

        [Route("{userId}")]
        public IHttpActionResult GetUserById(string userId)
        {
            var user = _repoFactory.Users.GetUsers(userId)?.FirstOrDefault();
            if (user != null)
                return Ok(user);
            return NotFound();
        }

        [HttpPost]
        [Route("create")]
        public IHttpActionResult CreateUser(ProjectUser model)
        {
            if (base.IsSuperUser)
            {
                if (ModelState.IsValid)
                {
                    if (_repoFactory.Users.CreateUser(model) > 0)
                    {
                        _cacheService.PurgeUserNames();
                        return Ok();
                    }
                    return BadRequest("User could not be created.");
                }
                return BadRequest(ModelState);
            }
            return Unauthorized();
        }
        [HttpPut]
        [Route("{userId}")]
        public IHttpActionResult UpdateUser(string userId, ProjectUser model)
        {
            if (base.IsSuperUser)
            {
                if (!userId.Equals(model.UserId, StringComparison.OrdinalIgnoreCase))
                    return NotFound();
                if (ModelState.IsValid)
                {
                    _repoFactory.Users.UpdateUser(model);
                    _cacheService.PurgeUserNames();
                    return Ok();
                }
                return BadRequest(ModelState);
            }
            return Unauthorized();
        }
    }
}
