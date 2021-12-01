using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjectDevs.Core.Models
{
    [Table("ProjectRoles", Schema = "dbo")]
    public class ProjectRole
    {
        [Key, Required]
        public int RoleId { get; set; }
        [Required, MaxLength(50)]
        public string RoleName { get; set; }
    }
}
