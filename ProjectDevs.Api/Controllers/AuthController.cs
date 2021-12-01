using NLog;
using ProjectDevs.Core.Constants;
using ProjectDevs.Core.Interfaces.Repositories;
using ProjectDevs.Core.Models;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Web.Http;

namespace ProjectDevs.Api.Controllers
{
    public class AuthController : ApiController
    {
        private readonly List<ProjectUser> _users;
        private static readonly Logger _logger = LogManager.GetCurrentClassLogger();
        private readonly IRepoFactory _repoFactory;

        public AuthController(IRepoFactory repoFactory)
        {
            _repoFactory = repoFactory;

            _users = _repoFactory.Users
                .GetUsers()
                ?.ToList();
        }
        [Route("api/authenticate/{userId}")]
        [AllowAnonymous]
        [HttpPost]
        public IHttpActionResult Authenticate(string userId)
        {
            _logger.Debug($"Authenticate userId: {userId}");
            var _user = _users.Where(a => a.UserId.ToLower() == userId.ToLower()).FirstOrDefault();

            if (_user != null)
            {
                
                _logger.Debug($"User found in the dictionary. UserId:{_user.UserId} Name: {_user.FullName}");
                var claims = new List<Claim>()
                        {
                            new Claim(ClaimTypes.Name,_user.FullName),
                            new Claim(ClaimTypes.NameIdentifier, _user.UserId),
                            new Claim(PdClaims.RoleType, _user.IsDeveloper==1? PdConstants.DeveloperRole:PdConstants.UserRole)
                        };
                if (_user.IsSuperUser == 1)
                    claims.Add(new Claim(PdClaims.IsSuperUser, PdConstants.TrueStr));

                var tokenModel = JwtHandler.GenerateJwt(claims);
                var r = new UserTokenModel(tokenModel, _user);
                return Ok(r);
            }
            return BadRequest();
        }
    }
}
