using ProjectDevs.Core.Constants;
using ProjectDevs.Core.Interfaces.Repositories;
using ProjectDevs.Core.Models;
using ProjectDevs.DataAccess.Extensions;
using System.Collections.Generic;
using System.Data;
using System.Linq;

namespace ProjectDevs.DataAccess.Repositories
{
    public class FilesRepo : IFilesRepo
    {
        private readonly IDbConnection _connection;

        public FilesRepo(IDbConnection connection) => _connection = connection;

        public int? CreateFile(ProjectFile file, IDbTransaction transaction = null) =>
             _connection.QueryStoredProcedure<int>(Database.StoredProcedures.PD_CreateProjectFile, file.GetCreateSpParams(), transaction)
            ?.FirstOrDefault();
        public int? MoveTemporaryFile(string tempId, int fileTypeId, int associatedRecordId, IDbTransaction transaction = null) =>
             _connection.QueryStoredProcedure<int>(Database.StoredProcedures.PD_MoveTemporaryFile, new { tempId, fileTypeId, associatedRecordId }, transaction)
            ?.FirstOrDefault();

        public int UpdateFile(ProjectFile file, IDbTransaction transaction = null) =>
             _connection.ExecuteStoredProcedure(Database.StoredProcedures.PD_UpdateProjectFile, file.GetUpdateSpParams(), transaction);

        public IEnumerable<ProjectFile> GetFiles(int? fileId = null, int? fileTypeId = null, int? associatedRecordId = null, string userId = null) =>
            _connection.QueryStoredProcedure<ProjectFile>(Database.StoredProcedures.PD_SelectProjectFiles, new { fileId, fileTypeId, associatedRecordId, userId })
                ?.ToList();

        public IEnumerable<ProjectFile> GetFilesOfProject(int projectId, string userId = null, string teamId = null) =>
            _connection.QueryStoredProcedure<ProjectFile>(Database.StoredProcedures.PD_SelectFilesOfProject, new { projectId, userId, teamId })
                ?.ToList();
    }
}
