using NLog;
using ProjectDevs.Business.Extensions;
using ProjectDevs.Core.Constants;
using ProjectDevs.Core.Enumerations;
using ProjectDevs.Core.Interfaces.Repositories;
using ProjectDevs.Core.Interfaces.Services;
using ProjectDevs.Core.Models;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace ProjectDevs.Api.Controllers
{
    [RoutePrefix("api/notes/type/{noteType}")]
    public class NotesController : BaseApiController
    {
        private static readonly Logger _logger = LogManager.GetCurrentClassLogger();
        private readonly IRepoFactory _repoFactory;
        private readonly ICacheService _cacheService;

        public NotesController(IRepoFactory repoFactory, ICacheService cacheService)
        {
            _repoFactory = repoFactory;
            _cacheService = cacheService;
        }

        [Route("")]
        public IHttpActionResult GetNotes(int noteType, int pno = 1, int psize = PdConstants.DefaultPageSize)
        {
            int? noteTypeId = null;
            if (noteType > 0)
                noteTypeId = noteType;
            var notes = _repoFactory.Notes.GetNotes(noteTypeId: noteTypeId);
            return GetNotesPaging(notes, pno, psize);

        }
        [Route("my")]
        public IHttpActionResult GetMyNotes(int noteType, int pno = 1, int psize = PdConstants.DefaultPageSize)
        {
            int? noteTypeId = null;
            if (noteType > 0)
                noteTypeId = noteType;

            var notes = _repoFactory.Notes.GetNotes(noteTypeId: noteTypeId, userId: base.UserId);
            return GetNotesPaging(notes, pno, psize);

        }
        [Route("~/api/notes/project-notes")]
        public IHttpActionResult GetProjectNotes(int projectId,string teamId, int pno = 1, int psize = PdConstants.DefaultPageSize)
        {
            var notes = _repoFactory.Notes.GetNotesOfProject(projectId, null,teamId);
            return GetNotesPaging(notes, pno, psize);
        }
        [Route("~/api/notes/my-project-notes")]
        public IHttpActionResult GetMyProjectNotes(int projectId, int pno = 1, int psize = PdConstants.DefaultPageSize)
        {
            var notes = _repoFactory.Notes.GetNotesOfProject(projectId, base.UserId);
            return GetNotesPaging(notes, pno, psize);
        }
        private IHttpActionResult GetNotesPaging(IEnumerable<ProjectNote> notes, int pno, int psize)
        {
            if (notes?.Any() == true)
            {
                var paged = notes.GetPagingModel(pno, psize);
                if (paged?.Data?.Any() == true)
                {
                    paged.Data = paged.Data.Select(n => new ProjectNote
                    {
                        NoteId = n.NoteId,
                        Note = n.Note,
                        NoteTypeId = n.NoteTypeId,
                        ParentId = n.ParentId,
                        CreatedOn = n.CreatedOn,
                        CreatedByUser = _cacheService.GetUserName(n.CreatedByUserId),
                        ModifiedOn = n.ModifiedOn,
                        CreatedByUserId = n.CreatedByUserId
                    });
                    return Ok(paged);
                }
            }
            return Ok();
        }
        [Route("of/{recordId}")]
        public IHttpActionResult GetNotesOfRecord(NoteType noteType, int recordId, int pno = 1, int psize = PdConstants.DefaultPageSize)
        {
            var notes = _repoFactory.Notes.GetNotes(noteTypeId: (int)noteType, parentId: recordId);
            if (notes?.Any() == true)
            {
                var paged = notes.GetPaged(pno, psize);
                var pagedDisplay = paged?.Select(n => new ProjectNote
                {
                    NoteId = n.NoteId,
                    Note = n.Note,
                    NoteTypeId = n.NoteTypeId,
                    ParentId = n.ParentId,
                    CreatedOn = n.CreatedOn,
                    CreatedByUser = _cacheService.GetUserName(n.CreatedByUserId),
                    ModifiedOn = n.ModifiedOn,
                    CreatedByUserId = n.CreatedByUserId
                });
                var pagingData = new PagingModel<ProjectNote>(pagedDisplay, notes.Count(), pno, psize);
                if (pagingData.Data?.Any() == true)
                    return Ok(pagingData);
            }
            return Ok();

        }

        [Route("of/{recordId}/note/{noteId}")]
        public IHttpActionResult GetNoteById(NoteType noteType, int recordId, int noteId)
        {
            var note = _repoFactory.Notes.GetNotes(noteId: noteId, noteTypeId: (int)noteType, parentId: recordId)?.FirstOrDefault();
            if (note != null)
            {
                note.CreatedByUser = _cacheService.GetUserName(note.CreatedByUserId);
                return Ok(note);
            }
            return NotFound();
        }

        [HttpPost]
        [Route("of/{recordId}")]
        public IHttpActionResult AddNotesToRecord(NoteType noteType, int recordId, NoteModel model)
        {
            if (string.IsNullOrWhiteSpace(model.Note))
                return BadRequest("Note text is required.");

            var projectNote = new ProjectNote
            {
                NoteTypeId = (int)noteType,
                Note = model.Note,
                ParentId = recordId,
                CreatedByUserId = base.UserId
            };
            var newNoteId = _repoFactory.Notes.CreateNote(projectNote);
            if (newNoteId.HasValue)
            {
                projectNote.NoteId = newNoteId.Value;
                return Created($"/api/notes/type/{(int)noteType}/of/{recordId}/note/{newNoteId}", projectNote);
            }
            return BadRequest("Note could not be saved.");
        }

        [HttpPut]
        [Route("of/{recordId}/note/{noteId}")]
        public IHttpActionResult UpdateNote(NoteType noteType, int recordId, int noteId, NoteModel model)
        {
            if (string.IsNullOrWhiteSpace(model.Note))
                return BadRequest("Note text is required.");
            var dbNote = _repoFactory.Notes.GetNotes(noteId: noteId, noteTypeId: (int)noteType, parentId: recordId)?.FirstOrDefault();
            if (dbNote != null)
            {
                dbNote.Note = model.Note;
                _repoFactory.Notes.UpdateNote(dbNote);
                return Ok();
            }
            return NotFound();
        }

    }
}
