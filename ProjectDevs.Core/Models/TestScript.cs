using System;
using System.ComponentModel.DataAnnotations;

namespace ProjectDevs.Core.Models
{
    public class TestScript
    {
        [Key]
        public int TestScriptId { get; set; }
        public int StoryId { get; set; }
        public int TestScriptStatus { get; set; }
        [MaxLength(10)]
        public string CreatedByUserId { get; set; }
        public DateTime? RequestDate { get; set; }

        [MaxLength(10)]
        public string AssignedToDeveloperId { get; set; }

        [MaxLength(10)]
        public string AssignedToDevManagerId { get; set; }

        [MaxLength(10)]
        public string AssignedToBusinessAnalystId { get; set; }

        [MaxLength(10)]
        public string AssignedToBusinessStakeholderId { get; set; }


        public DateTime? RequestedByDate { get; set; }

        [MaxLength(10)]
        public string LastModifiedBy { get; set; }
        public DateTime? LastModifiedOn { get; set; }

        public object GetCreateSpParams() => new { StoryId, TestScriptStatus, CreatedByUserId, RequestDate, RequestedByDate };
        public object GetUpdateSpParams() => new { TestScriptId, StoryId, TestScriptStatus, CreatedByUserId, RequestDate, RequestedByDate, LastModifiedBy, LastModifiedOn };
    }

    public class ProjectTestScriptsAssigneeMapping
    {
        [Key]
        public int Id { get; set; }
        public int TestScriptId { get; set; }

        [MaxLength(10)]
        public string AssignedToUserId { get; set; }
        public int TestScriptStatus { get; set; }
        public string UserType { get; set; }
    }

    public class ProjectTestScriptsAssigneeMappingDto : ProjectTestScriptsAssigneeMapping
    {
        public string FullName { get; set; }
    }

    public class TestScriptDto : TestScript
    {
        public string StoryF1 { get; set; }
        public string StoryF2 { get; set; }
        public string StoryF3 { get; set; }

        public string TestScriptStatusName { get; set; }

        public string CreatedByUserName { get; set; }
        //public string AssignedToUserName { get; set; }
        public string DeveloperName { get; set; }
        public string DevManagerName { get; set; }
        public string BusinessAnalystName { get; set; }
        public string BusinessStakeholderName { get; set; }
        public int ProjectId { get; set; }
        public string ProjectName { get; set; }
        public string LastModifiedByName { get; set; }

        public ProjectTestScriptsAssigneeMappingDto[] AssigneeMappings { get; set; }
        public string StoryName { get; set; }
    }

    public class TestScriptSpResult
    {
        public int TestScriptId { get; set; }
        public int StoryId { get; set; }
        public int TestScriptStatus { get; set; }
        public string CreatedByUserId { get; set; }
        public DateTime? RequestDate { get; set; }
        public string DeveloperId { get; set; }
        public string DevManagerId { get; set; }
        public string BusinessAnalystId { get; set; }
        public string BusinessStakeholderId { get; set; }

        public string DeveloperName { get; set; }
        public string DevManagerName { get; set; }
        public string BusinessAnalystName { get; set; }
        public string BusinessStakeholderName { get; set; }


        public DateTime? RequestedByDate { get; set; }

        public string F1 { get; set; }
        public string F2 { get; set; }
        public string F3 { get; set; }

        public int ProjectId { get; set; }

        public string LastModifiedBy { get; set; }
        public DateTime? LastModifiedOn { get; set; }

        public string StoryName { get; set; }
    }
}

