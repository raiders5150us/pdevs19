namespace ProjectDevs.Core.Models
{
    /// <summary>
    /// Result of SP dbo.PD_Search
    /// </summary>
    public class SearchModel
    {
        public int? ProjectId { get; set; }
        public string ProjectName { get; set; }
        public string MeetingSchedule { get; set; }
        public bool IsProject { get; set; }

        public int? StoryId { get; set; }
        public string F1 { get; set; }
        public string F2 { get; set; }
        public string F3 { get; set; }
        public string AcceptanceCriteria { get; set; }
        public bool IsStory { get; set; }

        public int? TaskId { get; set; }
        public string TaskName { get; set; }
        public string TaskDescription { get; set; }
        public string TicketNumber { get; set; }
        public bool IsTask { get; set; }

        public int? NoteId { get; set; }
        public string Note { get; set; }
        public bool IsNote { get; set; }

        public int? MeetingId { get; set; }
        public string Purpose { get; set; }
        public string MeetingTime { get; set; }
        public bool IsMeeting { get; set; }

        public int? FileId { get; set; }
        public string FileName { get; set; }
        public string FileLocation { get; set; }
        public bool IsFile { get; set; }

        public int TestScriptId { get; set; }
        public bool IsTestScript { get; set; }
    }
}

