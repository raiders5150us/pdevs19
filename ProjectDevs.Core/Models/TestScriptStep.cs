using System.ComponentModel.DataAnnotations;

namespace ProjectDevs.Core.Models
{
    public class TestScriptStep
    {
        [Key]
        public int StepId { get; set; }
        public int TestScriptId { get; set; }
        public int StepNumber { get; set; }
        [Required, MaxLength(500)]
        public string Action { get; set; }
        [Required, MaxLength(500)]
        public string ExpectedResults { get; set; }
        //[Required, MaxLength(1000)]
        public string Notes { get; set; }
        public int? TestScriptStatus { get; set; }

        public int? DeveloperStepStatusId { get; set; }
        public int? DevMgrStepStatusId { get; set; }

        public int? BizAnalystStepStatusId { get; set; }

        public int? BizRequesterStepStatusId { get; set; }

        public object GetCreateSpParams() => new { TestScriptId, StepNumber, Action, ExpectedResults, Notes,DeveloperStepStatusId,DevMgrStepStatusId,BizAnalystStepStatusId,BizRequesterStepStatusId };
        public object GetUpdateSpParams() => new { StepId, TestScriptId, StepNumber, Action, ExpectedResults, Notes, DeveloperStepStatusId, DevMgrStepStatusId, BizAnalystStepStatusId, BizRequesterStepStatusId };
    }

    public class TestScriptStepDto : TestScriptStep
    {
        public string TestScriptStatusName { get; set; }
    }
}
