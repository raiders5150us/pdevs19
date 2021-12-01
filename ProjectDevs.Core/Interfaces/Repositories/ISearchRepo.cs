using ProjectDevs.Core.Models;
using System.Collections.Generic;

namespace ProjectDevs.Core.Interfaces.Repositories
{
    public interface ISearchRepo
    {
        IEnumerable<SearchModel> GetSearchResults(string query);
    }
}
