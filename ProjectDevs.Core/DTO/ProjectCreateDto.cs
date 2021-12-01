namespace ProjectDevs.Core.DTO
{
    public class ProjectCreateDto : ProjectDtoBase
    {
        public int ProjectStatusId { get; set; }

        public string ProductOwnerId { get; set; }
        public string ProjectManagerId { get; set; }
        public string LeadDeveloperId { get; set; }
        public string BusinessAnalystId { get; set; }
        public string StakeHolderIds { get; set; }

        public string ProductOwner { get; set; }
        public string ProjectManager { get; set; }
        public string LeadDeveloper { get; set; }
        public string BusinessAnalyst { get; set; }
        public string Stakeholders { get; set; }
        public int TeamID { get; set; }
    }
}
