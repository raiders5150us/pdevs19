using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjectDevs.Core.Models
{
    public class ProjectMeetingBase
    {
        public int MeetingId { get; set; }
        public string Purpose { get; set; }
        public DateTime? MeetingDate { get; set; }
        public string MeetingTime { get; set; }
    }
    public class ProjectMeetingDisplay : ProjectMeetingBase
    {
        public string ProjectName { get; set; }
        public string Attendees { get; set; }
        public string CreatedByUserName { get; set; }
    }
    public class ProjectMeetingCreate : ProjectMeetingBase
    {
        public int ProjectId { get; set; }
        public string AttendeeIds { get; set; }
        public string CreatedByUserId { get; set; }
    }
    public class ProjectMeetingDto
    {
        public int MeetingId { get; set; }
        public string Purpose { get; set; }
        public DateTime? MeetingDate { get; set; }
        public string MeetingTime { get; set; }

        public int ProjectId { get; set; }
        public IEnumerable<string> AttendeeIds { get; set; }
        public string CreatedByUserId { get; set; }

        public string ProjectName { get; set; }
        public IEnumerable<string> AttendeeNames { get; set; }
        public string CreatedByUserName { get; set; }

        public IDictionary<string, string> AttendeeIdNames { get; set; }
    }
    [Table("ProjectMeetings", Schema = "dbo")]
    public class ProjectMeeting
    {
        [Key, Required]
        public int MeetingId { get; set; }
        [Required]
        public int ProjectId { get; set; }
        [Required, MaxLength(10), JsonIgnore]
        public string CreatedByUserId { get; set; }
        [MaxLength(1000)]
        public string Attendees { get; set; }
        [MaxLength(200)]
        public string Purpose { get; set; }
        public DateTime? MeetingDate { get; set; }
        [MaxLength(20)]
        public string MeetingTime { get; set; }

        [NotMapped, JsonIgnore]
        public IEnumerable<string> AttendeeIdsList => Attendees?.Split(',');

        public object GetCreateSpParams() =>
            new { ProjectId, CreatedByUserId, Attendees, Purpose, MeetingDate, MeetingTime };

        public object GetUpdateSpParams() =>
            new { MeetingId, ProjectId, Attendees, Purpose, MeetingDate, MeetingTime };
    }
}
