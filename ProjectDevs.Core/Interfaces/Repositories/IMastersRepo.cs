using ProjectDevs.Core.Models;
using System.Collections.Generic;
using System.Data;

namespace ProjectDevs.Core.Interfaces.Repositories
{
    public interface IMastersRepo
    {
        int? CreateStatus(Status status, IDbTransaction transaction = null);
        int UpdateStatus(Status status, IDbTransaction transaction = null);
        IEnumerable<Status> GetStatuses(string statusName);
        IEnumerable<ProjectRole> GetRoles();
    }
}
