using System;

namespace ProjectDevs.Core.Models
{
    public class ProjectNotification
    {
        public int NotificationId { get; set; }
        public string UserId { get; set; }
        public string Text { get; set; }
        public string Hyperlink { get; set; }
        public bool Seen { get; set; }
        public DateTime CreatedOn { get; set; }
    }
}
