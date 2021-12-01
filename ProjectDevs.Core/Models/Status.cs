using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjectDevs.Core.Models
{
    [Table("ProjectLists", Schema = "dbo")]
    public class Status
    {
        [Key, Required]
        public int StatusId { get; set; }
        [Required, MaxLength(50)]
        public string StatusName { get; set; }
        [Required]
        public short ListId { get; set; }
        [Required, MaxLength(50)]
        public string ListItemText { get; set; }
        [Required]
        public short OrderBy { get; set; }
        [Required]
        public short IsActive { get; set; }

        public object GetCreateSpParams() =>
            new { StatusName, ListId, ListItemText, OrderBy, IsActive };
    }
}
