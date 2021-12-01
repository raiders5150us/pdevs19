using ProjectDevs.Core.Constants;
using ProjectDevs.Core.Interfaces.Repositories;
using ProjectDevs.Core.Models;
using ProjectDevs.DataAccess.Extensions;
using System.Collections.Generic;
using System.Data;
using System.Linq;

namespace ProjectDevs.DataAccess.Repositories
{
    public class UserRepo : IUserRepo
    {
        private readonly IDbConnection _connection;

        public UserRepo(IDbConnection connection) => _connection = connection;

        public int CreateUser(ProjectUser user, IDbTransaction transaction = null) =>
            _connection.ExecuteStoredProcedure(Database.StoredProcedures.PD_CreateUser, user.GetSpParameters(), transaction);

        public int UpdateUser(ProjectUser user, IDbTransaction transaction = null) =>
            _connection.ExecuteStoredProcedure(Database.StoredProcedures.PD_UpdateUser, user.GetSpParameters(), transaction);

        public IEnumerable<ProjectUser> GetUsers(string userId = null, short? isDeveloper = null) =>
            _connection.QueryStoredProcedure<ProjectUser>(Database.StoredProcedures.PD_SelectUsers, new { userId, isDeveloper })
                ?.ToList();

        public IEnumerable<ProjectUser> SearchUsers(string searchTerm = null) =>
            _connection.QueryStoredProcedure<ProjectUser>(Database.StoredProcedures.PD_SearchUsers, new { searchTerm })
                ?.ToList();
    }
}
