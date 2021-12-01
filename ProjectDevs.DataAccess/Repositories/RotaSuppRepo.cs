using ProjectDevs.Core.Constants;
using ProjectDevs.Core.Interfaces.Repositories;
using ProjectDevs.Core.Models;
using ProjectDevs.DataAccess.Extensions;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectDevs.DataAccess.Repositories
{
    public class RotaSuppRepo: IRotaSuppRepo
    {
        private readonly IDbConnection _connection;

        public RotaSuppRepo(IDbConnection connection)
        {
            _connection = connection;
        }

        public IEnumerable<RotaSuppData> GetRotaSuppData()
        {
            return _connection.QueryStoredProcedure<RotaSuppData>(Database.StoredProcedures.PD_GetRotaSuppData)
               ?.ToList();
        }
    }
}
