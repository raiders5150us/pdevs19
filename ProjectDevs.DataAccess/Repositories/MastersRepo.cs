using ProjectDevs.Core.Constants;
using ProjectDevs.Core.Interfaces.Repositories;
using ProjectDevs.Core.Models;
using ProjectDevs.DataAccess.Extensions;
using System.Collections.Generic;
using System.Data;
using System.Linq;

namespace ProjectDevs.DataAccess.Repositories
{
    public class MastersRepo : IMastersRepo
    {
        private readonly IDbConnection _connection;

        public MastersRepo(IDbConnection connection) => _connection = connection;

        public int? CreateStatus(Status status, IDbTransaction transaction = null) =>
            _connection.QueryStoredProcedure<int?>(Database.StoredProcedures.PD_CreateProjectList, status.GetCreateSpParams(), transaction)
            ?.FirstOrDefault();

        public int UpdateStatus(Status status, IDbTransaction transaction = null) =>
            _connection.ExecuteStoredProcedure(Database.StoredProcedures.PD_UpdateProjectList, status, transaction);

        public IEnumerable<Status> GetStatuses(string statusName) =>
            _connection.QueryStoredProcedure<Status>(Database.StoredProcedures.PD_SelectProjectLists, new { statusName })
                ?.ToList();

        public IEnumerable<ProjectRole> GetRoles() =>
            _connection.QueryStoredProcedure<ProjectRole>(Database.StoredProcedures.PD_SelectProjectRoles)
                ?.ToList();
    }
}
