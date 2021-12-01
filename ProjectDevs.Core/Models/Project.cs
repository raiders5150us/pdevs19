using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjectDevs.Core.Models
{
    [Table("Projects", Schema = "dbo")]
    public class Project
    {
        [Key, Required]
        public int ProjectId { get; set; }
        [Required, MaxLength(100)]
        public string ProjectName { get; set; }
        [Required, MaxLength(100)]
        public string ProjectType { get; set; }
        [Required]
        public int ProjectStatus { get; set; }
        [MaxLength(100)]
        public string MeetingSchedule { get; set; }
        public DateTime? RequestDate { get; set; }
        public DateTime? RequestedByDate { get; set; }
        public DateTime? CompletedDate { get; set; }
        public DateTime? StartDate { get; set; }
        public int? PriorityRanking { get; set; }

        [Required]
        public int TeamID { get; set; }

        public string ProjectAbbreviation { get; set; }
        public int? NextNumber { get; set; }

        public object GetCreateSpParams() =>
            new { ProjectName, ProjectType, ProjectStatus, MeetingSchedule, RequestDate, RequestedByDate, CompletedDate, PriorityRanking, StartDate,TeamID };
        public object GetUpdateSpParams() =>
            new { ProjectId,ProjectName, ProjectType, ProjectStatus, MeetingSchedule, RequestDate, RequestedByDate, CompletedDate, PriorityRanking, StartDate, TeamID };
    }
}
