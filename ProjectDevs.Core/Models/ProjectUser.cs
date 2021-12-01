using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjectDevs.Core.Models
{
    [Table("ProjectUsers", Schema = "dbo")]
    public class ProjectUser
    {
        [Key, Required, MaxLength(10)]
        public string UserId { get; set; }
        [Required, MaxLength(50)]
        public string FirstName { get; set; }
        [Required, MaxLength(100)]
        public string LastName { get; set; }
        [MaxLength(10)]
        public string ManagerId { get; set; }
        [Required]
        public short IsDeveloper { get; set; }
        [Required]
        public short IsActive { get; set; }
        [Required]
        public short IsSuperUser { get; set; }

        [NotMapped]
        public string FullName => $"{FirstName} {LastName}".Trim();

        public object GetSpParameters() =>
            new { UserId, FirstName, LastName, ManagerId, IsDeveloper, IsActive, IsSuperUser };
    }
}
