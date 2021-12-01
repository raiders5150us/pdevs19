using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjectDevs.Core.Models
{
    [Table("ProjectStoryTasks", Schema = "dbo")]
    public class StoryTask
    {
        [Key, Required]
        public int TaskId { get; set; }
        [Required]
        public int StoryId { get; set; }
        [Required]
        public int TaskStatus { get; set; }
        [Required, MaxLength(100)]
        public string TaskName { get; set; }
        [MaxLength(1000)]
        public string TaskDescription { get; set; }
        [MaxLength(20)]
        public string TaskType { get; set; }
        [MaxLength(10)]
        public string AssignedToUserId { get; set; }
        public float? ProjectedHours { get; set; }
        public float? ActualHours { get; set; }

        public float? HoursWorked { get; set; }
        [MaxLength(20)]
        public string TicketNumber { get; set; }
        public int? Changeset { get; set; }

        [NotMapped]
        public int ProjectId { get; set; }
        [NotMapped]
        public string TaskStatusName { get; set; }
        [NotMapped]
        public string AssigneeName { get; set; }

        public string LOB { get; set; }

        public object GetCreateSpParams() =>
            new { StoryId, TaskStatus, TaskName, TaskDescription, TaskType, AssignedToUserId, ProjectedHours, ActualHours, TicketNumber, Changeset, HoursWorked,LOB };
        public object GetUpdateSpParams() =>
            new { TaskId, StoryId, TaskStatus, TaskName, TaskDescription, TaskType, AssignedToUserId, ProjectedHours, ActualHours, TicketNumber, Changeset, HoursWorked,LOB };
    }
}
