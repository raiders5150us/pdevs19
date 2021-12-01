using ProjectDevs.Core.Constants;
using ProjectDevs.Core.Interfaces.Repositories;
using ProjectDevs.Core.Models;
using ProjectDevs.DataAccess.Extensions;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;

namespace ProjectDevs.DataAccess.Repositories
{
    public class NotificationRepo : INotificationRepo
    {
        private readonly IDbConnection _connection;

        public NotificationRepo(IDbConnection connection) => _connection = connection;

        public int UpdateNotificationSeen(string notificationIds, IDbTransaction transaction = null) =>
            _connection.ExecuteStoredProcedure(Database.StoredProcedures.PD_UpdateNotificationSeen, new { notificationIds }, transaction);

        public int GetNotificationCount(string userId, bool seen = false) =>
            _connection.QueryStoredProcedureFirstOrDefault<int>(Database.StoredProcedures.PD_GetNotificationCount, new { userId, seen });

        public IEnumerable<ProjectNotification> GetNotifications(string userId) =>
             _connection.QueryStoredProcedure<ProjectNotification>(Database.StoredProcedures.PD_GetNotifications, new { userId })
                ?.ToList();

        public int CreateNotifications(List<ProjectNotification> notifications, IDbTransaction transaction = null)
        {
            var columns = new List<DataColumn> {
                new DataColumn("UserId", typeof(string))
                {
                    MaxLength = 10,
                    AllowDBNull=false
                },
                new DataColumn("Text", typeof(string))
                {
                    MaxLength = 250,
                    AllowDBNull = false
                },
                    new DataColumn("Hyperlink", typeof(string))
                {
                    MaxLength = 180,
                    AllowDBNull = true
                },
                    new DataColumn("Seen", typeof(bool))
                {
                    AllowDBNull = false
                }, new DataColumn("CreatedOn", typeof(DateTime))
                {
                    AllowDBNull = false
                }
            };

            using (var dt = new DataTable())
            {
                var now = DateTime.Now;
                dt.Columns.AddRange(columns.ToArray());
                notifications.ForEach(n =>
                {
                    var dr = dt.NewRow();
                    dr["UserId"] = n.UserId;
                    dr["Text"] = n.Text;
                    dr["Hyperlink"] = n.Hyperlink;
                    dr["Seen"] = false;
                    dr["CreatedOn"] = now;

                    dt.Rows.Add(dr);
                });
                return _connection.ExecuteStoredProcedure(Database.StoredProcedures.PD_CreateNotification, new { data = dt }, transaction);
            }
        }
    }
}
