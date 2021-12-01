using NLog;
using ProjectDevs.Business.Extensions;
using ProjectDevs.Core.Constants;
using ProjectDevs.Core.DTO;
using ProjectDevs.Core.Enumerations;
using ProjectDevs.Core.Interfaces.Repositories;
using ProjectDevs.Core.Interfaces.Services;
using ProjectDevs.Core.Models;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace ProjectDevs.Api.Controllers
{
    [RoutePrefix("api/rota-supp")]
    public class RotaSuppController : BaseApiController
    {
        private static readonly Logger _logger = LogManager.GetCurrentClassLogger();
        private readonly IRepoFactory _repoFactory;

        public RotaSuppController(IRepoFactory repoFactory)
        {
            _repoFactory = repoFactory;
        }

        [Route("list")]
        public IHttpActionResult GetRotaSuppData()
        {
            var data = _repoFactory.RotaSupp.GetRotaSuppData();
            var dtoData = data.Select(p => ConvertToDisplayDto(p)).ToList();
            return Ok(dtoData);
        }        

        private RotaSuppDto ConvertToDisplayDto(RotaSuppData p)
        {
            var dto = new RotaSuppDto
            {
                Desc = p.UserName,
                Start_Date = string.Format("{0:yyyy-MM-dd}", p.Date),
                End_Date = string.Format("{0:yyyy-MM-dd}", p.Date),
                Sr = p.Id,
                Title = p.UserName
            };
            return dto;
        }



    }
}