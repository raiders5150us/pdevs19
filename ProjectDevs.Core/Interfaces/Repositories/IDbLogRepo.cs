using ProjectDevs.Core.Models;

namespace ProjectDevs.Core.Interfaces.Repositories
{
    public interface IDbLogRepo
    {
        PagingModel<DbLog> GetDbLogsByPage(int pno = 1, int psize = 20);
    }
}
