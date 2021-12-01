using System;

namespace ProjectDevs.Core.DTO
{
    public abstract class ProjectDtoBase
    {
        public int ProjectId { get; set; }
        public string ProjectName { get; set; }
        public string ProjectType { get; set; }
        public string MeetingSchedule { get; set; }
        public DateTime? RequestDate { get; set; }
        public DateTime? RequestedByDate { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? CompletedDate { get; set; }
        public int? PriorityRanking { get; set; }

        public string ProjectStatus { get; set; }
    }
}
