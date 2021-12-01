using ProjectDevs.Core.Models;
using System.Collections.Generic;
using System.Data;

namespace ProjectDevs.Core.Interfaces.Repositories
{
    public interface INotesRepo
    {
        int? CreateNote(ProjectNote note, IDbTransaction transaction = null);
        int UpdateNote(ProjectNote note, IDbTransaction transaction = null);
        IEnumerable<ProjectNote> GetNotes(int? noteId = null, int? noteTypeId = null, int? parentId=null, string userId = null);
        IEnumerable<ProjectNote> GetNotesOfProject(int projectId, string userId = null, string teamId = null);        
    }
}
