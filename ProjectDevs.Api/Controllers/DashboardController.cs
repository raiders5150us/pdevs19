using iTextSharp.text;
using iTextSharp.text.html.simpleparser;
using iTextSharp.text.pdf;
using ProjectDevs.Core.Interfaces.Repositories;
using System;
using System.IO;
using System.Text;
using System.Web.Http;

namespace ProjectDevs.Api.Controllers
{
    [RoutePrefix("api/dashboard")]
    public class DashboardController : BaseApiController
    {
        private readonly IRepoFactory _repoFactory;

        public DashboardController(IRepoFactory repoFactory)
        {
            _repoFactory = repoFactory;
        }
        [Route("summary")]
        public IHttpActionResult GetSummary()
        {
            var summary = _repoFactory.Dashboard.GetDashboardSummary();
            return Ok(summary);
        }
    }
}
