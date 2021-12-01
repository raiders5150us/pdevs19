using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjectDevs.Core.Models
{
    [Table("ProjectSprintMapping", Schema = "dbo")]
    public class ProjectSprintMapping
    {
        [Key, Required]
        public int SprintId { get; set; }
        [Key, Required]
        public int ProjectStoryId { get; set; }
    }
}
