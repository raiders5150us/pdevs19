using NLog;
using ProjectDevs.Business.Extensions;
using ProjectDevs.Core.Constants;
using ProjectDevs.Core.Interfaces.Repositories;
using ProjectDevs.Core.Interfaces.Services;
using System.Linq;
using System.Web.Http;

namespace ProjectDevs.Api.Controllers
{
    [RoutePrefix("api/search")]
    public class SearchController : BaseApiController
    {
        private static readonly Logger _logger = LogManager.GetCurrentClassLogger();
        private readonly IRepoFactory _repoFactory;
        private readonly ICacheService _cacheService;

        public SearchController(IRepoFactory repoFactory, ICacheService cacheService)
        {
            _repoFactory = repoFactory;
            _cacheService = cacheService;
        }
        [HttpGet, Route("")]
        public IHttpActionResult Search(string q, int pno = 1, int psize = PdConstants.DefaultPageSize)
        {
            if (string.IsNullOrWhiteSpace(q))
                return BadRequest("Search term is required");
            q = q.Trim();
            if (q.Length < 3)
                return BadRequest("At-least 3 characters required in search term.");
            var results = _repoFactory.Searchs.GetSearchResults(q);
            if (results?.Any() == true)
            {
                var paged = results.GetPagingModel(pno, psize);
                if (paged.Data?.Any() == true)
                {
                    paged.Data.ToList().ForEach(r => r.ProjectName = _cacheService.GetProjectName(r.ProjectId ?? 0));
                    return Ok(paged);
                }
            }
            return Ok();
        }
    }
}
