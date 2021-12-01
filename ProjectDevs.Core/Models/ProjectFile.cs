using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjectDevs.Core.Models
{
    [Table("ProjectFiles", Schema = "dbo")]
    public class ProjectFile
    {
        [Key, Required]
        public int FileId { get; set; }
        [Required]
        public int FileTypeId { get; set; }
        [Required]
        public int AssociatedRecordId { get; set; }
        [Required, MaxLength(500)]
        public string FileName { get; set; }
        [Required, MaxLength(500)]
        public string FileLocation { get; set; }

        [Required, MaxLength(10)]
        public string CreatedByUserId { get; set; }
        [Required]
        public DateTime CreatedOn { get; set; }

        public string TempId { get; set; }
        public object GetCreateSpParams() =>
            new { FileTypeId, AssociatedRecordId, FileName, FileLocation, UserId = CreatedByUserId, CreatedOn = DateTime.Now, TempId = TempId };
        public object GetUpdateSpParams() =>
            new { FileId, FileTypeId, AssociatedRecordId, FileName, FileLocation, UserId = CreatedByUserId, CreatedOn = DateTime.Now };
    }
}
