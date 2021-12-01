using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjectDevs.Core.Models
{
    [Table("ProjectRoleAssignment", Schema = "dbo")]
    public class ProjectRoleAssignment
    {
        [Key, Required]
        public int RoleId { get; set; }
        [Key, Required, MaxLength(10)]
        public string UserId { get; set; }
        [Key, Required]
        public int ProjectId { get; set; }
    }
}
