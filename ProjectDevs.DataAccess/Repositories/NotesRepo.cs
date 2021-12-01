using ProjectDevs.Core.Constants;
using ProjectDevs.Core.Interfaces.Repositories;
using ProjectDevs.Core.Models;
using ProjectDevs.DataAccess.Extensions;
using System.Collections.Generic;
using System.Data;
using System.Linq;

namespace ProjectDevs.DataAccess.Repositories
{
    public class NotesRepo : INotesRepo
    {
        private readonly IDbConnection _connection;

        public NotesRepo(IDbConnection connection) => _connection = connection;

        public int? CreateNote(ProjectNote note, IDbTransaction transaction = null) =>
             _connection.QueryStoredProcedure<int>(Database.StoredProcedures.PD_CreateProjectNote, note.GetCreateSpParams(), transaction)
            ?.FirstOrDefault();

        public int UpdateNote(ProjectNote note, IDbTransaction transaction = null) =>
             _connection.ExecuteStoredProcedure(Database.StoredProcedures.PD_UpdateProjectNote, note.GetUpdateSpParams(), transaction);

        public IEnumerable<ProjectNote> GetNotes(int? noteId = null, int? noteTypeId = null, int? parentId = null, string userId = null) =>
            _connection.QueryStoredProcedure<ProjectNote>(Database.StoredProcedures.PD_SelectProjectNotes, new { noteId, noteTypeId, parentId, userId })
                ?.ToList();

        public IEnumerable<ProjectNote> GetNotesOfProject(int projectId, string userId = null,string teamId = null) =>
             _connection.QueryStoredProcedure<ProjectNote>(Database.StoredProcedures.PD_SelectNotesOfProject, new { projectId, userId, teamId })
                ?.ToList();
    }
}
