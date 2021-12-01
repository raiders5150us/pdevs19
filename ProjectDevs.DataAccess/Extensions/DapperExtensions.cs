using Dapper;
using System.Collections.Generic;
using System.Data;
using static Dapper.SqlMapper;

namespace ProjectDevs.DataAccess.Extensions
{
    public static class DapperExtensions
    {
        public static IEnumerable<dynamic> QueryStoredProcedure(this IDbConnection cnn, string spName, object param = null, IDbTransaction transaction = null, bool buffered = true, int? commandTimeout = null, CommandType? commandType = null) =>
            cnn.Query(spName, param, transaction, buffered, commandTimeout, CommandType.StoredProcedure);

        public static IEnumerable<T> QueryStoredProcedure<T>(this IDbConnection cnn, string spName, object param = null, IDbTransaction transaction = null, bool buffered = true, int? commandTimeout = null, CommandType? commandType = null) =>
            cnn.Query<T>(spName, param, transaction, buffered, commandTimeout, CommandType.StoredProcedure);

        public static GridReader QueryStoredProcedureMultipleResults(this IDbConnection cnn, string spName, object param = null, IDbTransaction transaction = null, int? commandTimeout = null, CommandType? commandType = null) =>
            cnn.QueryMultiple(spName, param, transaction, commandTimeout, CommandType.StoredProcedure);

        public static T QueryStoredProcedureFirstOrDefault<T>(this IDbConnection cnn, string spName, object param = null, IDbTransaction transaction = null, bool buffered = true, int? commandTimeout = null, CommandType? commandType = null) =>
            cnn.QueryFirstOrDefault<T>(spName, param, transaction, commandTimeout, CommandType.StoredProcedure);

        public static int ExecuteStoredProcedure(this IDbConnection cnn, string spName, object param = null, IDbTransaction transaction = null, int? commandTimeout = null, CommandType? commandType = null) =>
            cnn.Execute(spName, param, transaction, commandTimeout, CommandType.StoredProcedure);

        public static T QueryStoredProcedureScalar<T>(this IDbConnection cnn, string spName, object param = null, IDbTransaction transaction = null, int? commandTimeout = null, CommandType? commandType = null) =>
            cnn.ExecuteScalar<T>(spName, param, transaction, commandTimeout, CommandType.StoredProcedure);
    }
}
