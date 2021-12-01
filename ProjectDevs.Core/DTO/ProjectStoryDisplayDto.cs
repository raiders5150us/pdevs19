using System;
using System.Collections.Generic;

namespace ProjectDevs.Core.DTO
{
    public class ProjectStoryDisplayDto
    {
        public int StoryId { get; set; }
        public string F1 { get; set; }
        public string F2 { get; set; }
        public string F3 { get; set; }
        public string AcceptanceCriteria { get; set; }
        public DateTime? RequestDate { get; set; }

        public DateTime? RequesterTargetDate { get; set; }
        public DateTime? GroomingCompleteDate { get; set; }
        public DateTime? ProdTargetDate { get; set; }

        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string Environment { get; set; }
        public int? PriorityRanking { get; set; }
        public int ProjectId { get; set; }
        public int? StoryTypeId { get; set; }

        public int StoryStatusId { get; set; }
        public string RequesterId { get; set; }
        public string AssigneeId { get; set; }

        public string ProjectName { get; set; }
        public string StoryStatusName { get; set; }
        public string RequesterName { get; set; }
        public string AssigneeName { get; set; }
        public string StoryTypeName { get; set; }
        public string StoryName { get; set; }
        public float? ProjectedHours { get; set; }
        public float? ActualHours { get; set; }
        public List<string> Notes { get; set; }
        public IDictionary<int, string> SprintIdNames { get; set; }
    }
}
