using System;

namespace ProjectDevs.Core.Models
{
    // Dashboard Summary SP Result
    public class DashboardStats
    {
        public DateTime Date { get; set; } = DateTime.Now;
        public int ActiveProjects { get; set; }
        public decimal AverageStoriesCompletedPerSprint { get; set; }
        public decimal AverageTimeToCompletionPerStory { get; set; }
        public decimal ProjectedHoursToActualHours { get; set; }
        public decimal TestScriptFirstAttemptPassRate { get; set; }
        public decimal IssuesReportedPerStory { get; set; }
    }
}
