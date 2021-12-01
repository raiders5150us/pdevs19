using ProjectDevs.Core.Constants;
using ProjectDevs.Core.DTO;
using ProjectDevs.Core.Interfaces.Repositories;
using ProjectDevs.Core.Models;
using ProjectDevs.DataAccess.Extensions;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;

namespace ProjectDevs.DataAccess.Repositories
{
    public class TestScriptRepo : ITestScriptRepo
    {
        private readonly IDbConnection _connection;

        public TestScriptRepo(IDbConnection connection) => _connection = connection;

        public int? CreateTestScript(TestScript testScript, IDbTransaction transaction = null) =>
            _connection.QueryStoredProcedureFirstOrDefault<int>(Database.StoredProcedures.PD_CreateProjectTestScripts, testScript.GetCreateSpParams(), transaction);

        public int? CreateTestScriptAssigneeMapping(int testScriptId, string userId, int passStatusId, string userType, IDbTransaction transaction = null) =>
            _connection.QueryStoredProcedureFirstOrDefault<int>(Database.StoredProcedures.PD_CreateProjectTestScriptAssigneeMapping, new { testScriptId, userId, TestScriptStatus = passStatusId, userType }, transaction);
        public IEnumerable<TestScriptSpResult> GetTestScripts(int? storyId = null, int? testScriptId = null, string teamIds = null) =>
            _connection.QueryStoredProcedure<TestScriptSpResult>(Database.StoredProcedures.PD_SelectProjectTestScripts, new { storyId, testScriptId, teamIds })
                ?.ToList();

        public IEnumerable<ProjectTestScriptsAssigneeMapping> GetTestScriptAssigneeMappings(int? testScriptId = null) =>
            _connection.QueryStoredProcedure<ProjectTestScriptsAssigneeMapping>(Database.StoredProcedures.PD_SelectProjectTestScriptAssigneeMappings,
                new { testScriptId })?.ToList();

        public int UpdateTestScript(TestScript testScript, IDbTransaction transaction = null) =>
             _connection.ExecuteStoredProcedure(Database.StoredProcedures.PD_UpdateProjectTestScripts, testScript.GetUpdateSpParams(), transaction);

        public int? UpdateTestScriptAssigneeMapping(int testScriptId, string userId, string userType, IDbTransaction transaction = null) =>
            _connection.ExecuteStoredProcedure(Database.StoredProcedures.PD_UpdateProjectTestScriptAssigneeMapping, new { testScriptId, userId, userType }, transaction);

        public int? CreateTestScriptStep(TestScriptStep testScriptStep, IDbTransaction transaction = null) =>
            _connection.QueryStoredProcedureFirstOrDefault<int>(Database.StoredProcedures.PD_CreateProjectTestScriptSteps, testScriptStep.GetCreateSpParams(), transaction);

        public IEnumerable<TestScriptStep> GetTestScriptSteps(int testScriptId, int? stepId = null) =>
            _connection.QueryStoredProcedure<TestScriptStep>(Database.StoredProcedures.PD_SelectProjectTestScriptSteps, new { testScriptId, stepId })
                ?.ToList();

        public int UpdateTestScriptStep(TestScriptStep testScriptStep, IDbTransaction transaction = null) =>
             _connection.ExecuteStoredProcedure(Database.StoredProcedures.PD_UpdateProjectTestScriptTests, testScriptStep.GetUpdateSpParams(), transaction);

        public int ApproveTestScript(int testScriptId, int passStatusId, string lastModifiedBy, DateTime lastModifiedOn, IDbTransaction transaction = null) =>
            _connection.ExecuteStoredProcedure(Database.StoredProcedures.PD_ApproveProjectTestScript, new { testScriptId, testScriptStatus = passStatusId, lastModifiedBy, lastModifiedOn }, transaction);


        public int? TestScriptAssigneeMappingStatusUpdate(int testScriptId, string userId, int statusId, string userType, IDbTransaction transaction = null) =>
            _connection.QueryStoredProcedureFirstOrDefault<int>(Database.StoredProcedures.PD_UpdateProjectTestScriptAssigneeMappingStatus, new { testScriptId, TestScriptStatus = statusId, userId, userType }, transaction);

        public int? AddTestScriptStepNote(TestScriptStepNoteAddDto testScriptStepNote, IDbTransaction transaction = null) =>
            _connection.QueryStoredProcedureFirstOrDefault<int>(Database.StoredProcedures.PD_AddTestScripStepNote, testScriptStepNote, transaction);
    }
}
