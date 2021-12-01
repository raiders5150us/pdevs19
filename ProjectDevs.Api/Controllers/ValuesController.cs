using ProjectDevs.Core.Interfaces.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ProjectDevs.Api.Controllers
{
    public class ValuesController : ApiController
    {
        private readonly IRepoFactory _repoFactory;

        public ValuesController(IRepoFactory repoFactory)
        {
            var p = repoFactory.Projects.GetProjects(null);
            _repoFactory = repoFactory;
        }
        // GET api/values
        public IEnumerable<string> Get()
        {
            var s = _repoFactory.Masters.GetStatuses("Project");
            return s.Select(t => t.ListItemText);
        }

        // GET api/values/5
        public string Get(int id)
        {
            return "value";
        }

        // POST api/values
        public void Post([FromBody]string value)
        {
        }

        // PUT api/values/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        public void Delete(int id)
        {
        }
    }
}
