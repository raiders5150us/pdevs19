using ProjectDevs.Core.Models;
using System.Collections.Generic;
using System.Data;

namespace ProjectDevs.Core.Interfaces.Repositories
{
    public interface IUserRepo
    {
        int CreateUser(ProjectUser user, IDbTransaction transaction = null);
        int UpdateUser(ProjectUser user, IDbTransaction transaction = null);
        IEnumerable<ProjectUser> GetUsers(string userId = null, short? isDeveloper = null);
        IEnumerable<ProjectUser> SearchUsers(string searchTerm = null);
    }
}
