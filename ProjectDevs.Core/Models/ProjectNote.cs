using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjectDevs.Core.Models
{
    [Table("ProjectNotes", Schema = "dbo")]
    public class ProjectNote
    {
        [Key, Required]
        public int NoteId { get; set; }
        [Required]
        public int NoteTypeId { get; set; }
        [Required]
        public int ParentId { get; set; }
        [Required]
        public string Note { get; set; }
        [Required, MaxLength(10)]
        public string CreatedByUserId { get; set; }
        [NotMapped]
        public string CreatedByUser { get; set; }
        [Required]
        public DateTime CreatedOn { get; set; }
        public DateTime? ModifiedOn { get; set; }

        public object GetCreateSpParams() =>
            new { NoteTypeId, ParentId, Note, UserId = CreatedByUserId, CreatedOn = DateTime.Now, ModifiedOn };
        public object GetUpdateSpParams() =>
            new { NoteId, NoteTypeId, ParentId, Note, UserId = CreatedByUserId, CreatedOn = DateTime.Now, ModifiedOn = DateTime.Now };
    }
}
