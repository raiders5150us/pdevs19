using Dapper;
using ProjectDevs.Core.Interfaces.Repositories;
using ProjectDevs.Core.Models;
using System.Data;

namespace ProjectDevs.DataAccess.Repositories
{
    public class DbLogRepo : IDbLogRepo
    {
        private readonly IDbConnection _connection;

        public DbLogRepo(IDbConnection connection) => _connection = connection;

        public PagingModel<DbLog> GetDbLogsByPage(int pno = 1, int psize = 20)
        {
            var resultsGrid = _connection.QueryMultiple(Core.Constants.Database.StoredProcedures.SelectLogs, new { pno, psize }, commandType: CommandType.StoredProcedure);
            var logs = resultsGrid.Read<DbLog>();
            var totalCount = resultsGrid.ReadFirst<int>();
            var model = new PagingModel<DbLog>(logs, totalCount, pno, psize);
            return model;
        }
    }
}
