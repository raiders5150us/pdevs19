using ProjectDevs.Core.Constants;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Web.Http;

namespace ProjectDevs.Api.Controllers
{
    [Authorize]
    public class BaseApiController : ApiController
    {
        public BaseApiController()
        {
        }
        private IEnumerable<Claim> _claims = null;
        private string _userId = null;

        protected IEnumerable<Claim> Claims => _claims?.Any() == true ? _claims : (_claims = new ClaimsIdentity(User.Identity)?.Claims);
        protected string UserId => _userId ?? (_userId = Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);
        protected string DisplayName => Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name).Value;
        protected string UserRoleType => Claims.FirstOrDefault(c => c.Type == PdClaims.RoleType)?.Value;
        protected bool IsSuperUser => Claims.FirstOrDefault(c => c.Type == PdClaims.IsSuperUser)?.Value == PdConstants.TrueStr;
    }
}
