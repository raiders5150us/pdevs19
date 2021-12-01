using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectDevs.Core.DTO
{
    public class SprintDto
    {
        public int SprintId { get; set; }       
        public string SprintName { get; set; }       
        public DateTime StartDate { get; set; }       
        public DateTime EndDate { get; set; }
        public int TeamID { get; set; }
        public int TotalStories { get; set; }
        public int CompletedStories { get; set; }
        public string TeamName { get; set; }
        public string ChangeNumber { get; set; }
        public string SprintRetrospective { get; set; }
        public bool IsClosed { get; set; }
        public DateTime? DateClosed { get; set; }
        public decimal PercentageComplete => CompletedStories > 0 ? decimal.Round((CompletedStories / (decimal)TotalStories) * 100, 2) : 0;
    }
}
