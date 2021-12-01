using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjectDevs.Core.Models
{
    /// <summary>
    /// SP [dbo].[PD_SelectStoriesWithoutEndDate] Result
    /// </summary>
    public class StoriesWithoutEndDate
    {
        public int StoryId { get; set; }
        public string StoryName { get; set; }
        public int ProjectId { get; set; }
        public int StoryStatus { get; set; }
        public string   StoryStatusName { get; set; }
        public string F1 { get; set; }
        public string F2 { get; set; }
        public string F3 { get; set; }
        public string AcceptanceCriteria { get; set; }
        public string RequesterId { get; set; }
        public DateTime? RequestDate { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string AssignedToUserId { get; set; }
        [NotMapped]
        public string AssignedToUserName { get; set; }
        public string Environment { get; set; }
        public int? PriorityRanking { get; set; }
        public int? StoryTypeId { get; set; }
        public string ProjectName { get; set; }
        public int? ProjectPriorityRanking { get; set; }

        public float? ProjectedHours { get; set; }
        public float? ActualHours { get; set; }

        public int? TeamId { get; set; }
    }
}
