using System;
using System.Collections.Generic;

namespace ProjectDevs.Core.DTO
{
    public class ProjectDto
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
        public int ProjectStatusId { get; set; }

        public string ProductOwnerId { get; set; }
        public string ProjectManagerId { get; set; }
        public string LeadDeveloperId { get; set; }
        public string BusinessAnalystId { get; set; }
        public IEnumerable<string> StakeHolderIds { get; set; }

        public string ProjectStatus { get; set; }
        public string ProductOwner { get; set; }
        public string ProjectManager { get; set; }
        public string LeadDeveloper { get; set; }
        public string BusinessAnalyst { get; set; }

        public int TeamID { get; set; }
        public string TeamName { get; set; }
        public string ProjectAbbreviation { get; set; }
        public int? NextNumber { get; set; }

        public IEnumerable<string> Stakeholders { get; set; }

        public IDictionary<string, string> StakeholderIdNames { get; set; }
    }
}
