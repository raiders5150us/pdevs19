using ProjectDevs.Core.Constants;
using ProjectDevs.Core.Interfaces.Repositories;
using ProjectDevs.Core.Models;
using ProjectDevs.DataAccess.Extensions;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;

namespace ProjectDevs.DataAccess.Repositories
{
    public class SprintRepo : ISprintRepo
    {
        private readonly IDbConnection _connection;

        public SprintRepo(IDbConnection connection) => _connection = connection;

        public int AddStoryToSprint(int sprintId, int projectStoryId, IDbTransaction transaction = null) =>
            _connection.ExecuteStoredProcedure(Database.StoredProcedures.PD_CreateProjectSprintMapping, new { sprintId, projectStoryId }, transaction);

        public int? CreateSprint(Sprint sprint, IDbTransaction transaction = null) =>
            _connection.QueryStoredProcedure<int>(Database.StoredProcedures.PD_CreateProjectSprint, sprint.GetCreateSpParams(), transaction)
                ?.FirstOrDefault();

        public int UpdateSprint(Sprint sprint, IDbTransaction transaction = null, bool editAdditionalDetails = false)
        {
            if (editAdditionalDetails)
            {
                return _connection.ExecuteStoredProcedure(Database.StoredProcedures.PD_UpdateProjectSprintAdditionalDetails, sprint.GetUpdateSpParamsWithAddnlDetails(), transaction);
            }
            else
            {
                return _connection.ExecuteStoredProcedure(Database.StoredProcedures.PD_UpdateProjectSprint, sprint.GetUpdateSpParams(), transaction);
            }
        }
        public int? CloseSprint(int sprintId, IDbTransaction transaction = null) =>
            _connection.QueryStoredProcedure<int>(Database.StoredProcedures.PD_CloseProjectSprint, new { sprintId }, transaction)
                ?.FirstOrDefault();

        public IEnumerable<SprintResult> GetSprints(int? sprintId = null) =>
             _connection.QueryStoredProcedure<SprintResult>(Database.StoredProcedures.PD_SelectProjectSprints, new { sprintId })
                ?.ToList();

        public IEnumerable<ProjectSprintCloseResult> GetProjectSprintCloseReportData(int? sprintId = null) =>
             _connection.QueryStoredProcedure<ProjectSprintCloseResult>(Database.StoredProcedures.PD_GetProjectSprintCloseReportData, new { sprintId })
                ?.ToList();
        public IEnumerable<ProjectStoriesReportDataResult> GetProjectStoriesReportData() =>
             _connection.QueryStoredProcedure<ProjectStoriesReportDataResult>(Database.StoredProcedures.PD_GetProjectStoriesReportData)
                ?.ToList();

        public IEnumerable<ProductionReleaseReportDataResult> GetProductionReleaseReportData(DateTime StartDate, DateTime EndDate) =>
             _connection.QueryStoredProcedure<ProductionReleaseReportDataResult>(Database.StoredProcedures.PD_GetProductionReleaseReportData, new { StartDate, EndDate })
                ?.ToList();
        public IEnumerable<SprintStory> GetStorySprintMappings(int? sprintId = null, int? projectStoryId = null) =>
             _connection.QueryStoredProcedure<SprintStory>(Database.StoredProcedures.PD_SelectProjectSprintMapping, new { sprintId, projectStoryId })
                ?.ToList();

        public int DeleteStorySprintMapping(int projectStoryId, IDbTransaction transaction = null) =>
            _connection.ExecuteStoredProcedure(Database.StoredProcedures.PD_DeleteProjectSprintMapping, new { projectStoryId }, transaction);
    }
}
