using ProjectDevs.Core.Constants;
using ProjectDevs.Core.Interfaces.Repositories;
using ProjectDevs.Core.Models;
using ProjectDevs.DataAccess.Extensions;
using System.Collections.Generic;
using System.Data;
using System.Linq;

namespace ProjectDevs.DataAccess.Repositories
{
    public class SearchRepo : ISearchRepo
    {
        private readonly IDbConnection _connection;

        public SearchRepo(IDbConnection connection) => _connection = connection;
        public IEnumerable<SearchModel> GetSearchResults(string query) =>
            _connection.QueryStoredProcedure<SearchModel>(Database.StoredProcedures.PD_Search, new { Term = query })
                ?.ToList();
    }
}
