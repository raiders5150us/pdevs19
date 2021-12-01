using ProjectDevs.Core.DTO;
using ProjectDevs.Core.Models;
using System;
using System.Collections.Generic;
using System.Data;

namespace ProjectDevs.Core.Interfaces.Repositories
{
    public interface ITestScriptRepo
    {
        int? CreateTestScript(TestScript testScript, IDbTransaction transaction = null);
        int UpdateTestScript(TestScript testScript, IDbTransaction transaction = null);
        IEnumerable<TestScriptSpResult> GetTestScripts(int? storyId = null, int? testScriptId = null, string teamIds = null);
        IEnumerable<ProjectTestScriptsAssigneeMapping> GetTestScriptAssigneeMappings(int? testScriptId = null);

        int? CreateTestScriptStep(TestScriptStep testScriptStep, IDbTransaction transaction = null);
        int UpdateTestScriptStep(TestScriptStep testScriptStep, IDbTransaction transaction = null);
        IEnumerable<TestScriptStep> GetTestScriptSteps(int testScriptId, int? stepId = null);

        int? AddTestScriptStepNote(TestScriptStepNoteAddDto testScriptStepNote,IDbTransaction transaction = null);

        int ApproveTestScript(int testScriptId, int passStatusId, string lastModifiedBy, DateTime lastModifiedOn, IDbTransaction transaction = null);
        int? CreateTestScriptAssigneeMapping(int testScriptId,string userId, int passStatusId,string userType, IDbTransaction transaction = null);
        int? UpdateTestScriptAssigneeMapping(int testScriptId, string userId, string userType, IDbTransaction transaction = null);
        int? TestScriptAssigneeMappingStatusUpdate(int testScriptId, string userId, int statusId, string userType, IDbTransaction transaction = null);
    }
}
