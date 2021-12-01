using ProjectDevs.Core.Models;
using System.Collections.Generic;
using System.Data;

namespace ProjectDevs.Core.Interfaces.Repositories
{
    public interface IFilesRepo
    {
        int? CreateFile(ProjectFile file, IDbTransaction transaction = null);
        int? MoveTemporaryFile(string tempId, int fileTypeId, int associatedRecordId, IDbTransaction transaction = null);
        int UpdateFile(ProjectFile file, IDbTransaction transaction = null);
        IEnumerable<ProjectFile> GetFiles(int? fileId = null, int? fileTypeId = null, int? associatedRecordId = null, string userId = null);
        IEnumerable<ProjectFile> GetFilesOfProject(int projectId, string userId = null, string teamId = null);
    }
}
