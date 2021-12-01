using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjectDevs.Core.Models
{
    [Table("ProjectStories", Schema = "dbo")]
    public class UserStory
    {
        [Key, Required]
        public int StoryId { get; set; }
        [Required]
        public int ProjectId { get; set; }
        [Required]
        public int StoryStatus { get; set; }
        [Required, MaxLength(50)]
        public string F1 { get; set; }
        [Required, MaxLength(300)]
        public string F2 { get; set; }
        [Required, MaxLength(300)]
        public string F3 { get; set; }
        [Required, MaxLength(1000)]
        public string AcceptanceCriteria { get; set; }
        [Required, MaxLength(10)]
        public string RequesterId { get; set; }
        public DateTime? RequestDate { get; set; }

        public DateTime? RequesterTargetDate { get; set; }
        public DateTime? GroomingCompleteDate { get; set; }
        public DateTime? ProdTargetDate { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        [MaxLength(10)]
        public string AssignedToUserId { get; set; }
        [MaxLength(3)]
        public string Environment { get; set; }
        public int? PriorityRanking { get; set; }
        public int? StoryTypeId { get; set; }

        [Required,MaxLength(10)]
        public string StoryName { get; set; }

        [NotMapped]
        public float? ProjectedHours { get; set; }
        [NotMapped]
        public float? ActualHours { get; set; }

        [NotMapped]
        public string SprintIds { get; set; }

        public object GetCreateSpParams() =>
            new { ProjectId, StoryStatus, F1, F2, F3, AcceptanceCriteria, RequesterId, RequestDate,RequesterTargetDate, GroomingCompleteDate, ProdTargetDate, StartDate, EndDate, AssignedToUserId, Environment, PriorityRanking, StoryTypeId,StoryName };

        public object GetUpdateSpParams() =>
            new { StoryId, ProjectId, StoryStatus, F1, F2, F3, AcceptanceCriteria, RequesterId, RequestDate, RequesterTargetDate, GroomingCompleteDate, ProdTargetDate, StartDate, EndDate, AssignedToUserId, Environment, PriorityRanking, StoryTypeId, StoryName };
    }
}
