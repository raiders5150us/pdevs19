namespace ProjectDevs.Web.Models
{
    public class PartialModel
    {
        public int ProjectId { get; set; }
        public int StoryId { get; set; }
        public int TaskId { get; set; }
        public int TestScriptId { get; set; }
        public int TestScriptStepId { get; set; }
        public int MeetingId { get; set; }
        public int FileId { get; set; }
        public int NoteId { get; set; }
        public int UserId { get; set; }
        public int SprintId { get; set; }

        public string TempGuid { get; set; }

        public int RecordId { get; set; }
        public int FileType { get; set; }
        public int NoteType { get; set; }

        public bool IsMyPage { get; set; }
        public bool IsListPage { get; set; }

        public bool IsEditEnabled { get; set; }
        public string IdPrefix { get; set; } = "";
    }
}