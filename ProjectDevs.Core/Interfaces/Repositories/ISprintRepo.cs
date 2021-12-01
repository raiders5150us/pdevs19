using ProjectDevs.Core.Models;
using System;
using System.Collections.Generic;
using System.Data;

namespace ProjectDevs.Core.Interfaces.Repositories
{
    public interface ISprintRepo
    {
        int? CreateSprint(Sprint sprint, IDbTransaction transaction = null);
        int UpdateSprint(Sprint sprint, IDbTransaction transaction = null, bool editAdditionalDetails = false);
        int? CloseSprint(int sprintId, IDbTransaction transaction = null);
        IEnumerable<SprintResult> GetSprints(int? sprintId = null);
        IEnumerable<ProjectSprintCloseResult> GetProjectSprintCloseReportData(int? sprintId = null);
        IEnumerable<ProjectStoriesReportDataResult> GetProjectStoriesReportData();
        IEnumerable<ProductionReleaseReportDataResult> GetProductionReleaseReportData(DateTime StartDate, DateTime EndDate);
        int AddStoryToSprint(int sprintId, int projectStoryId, IDbTransaction transaction = null);
        IEnumerable<SprintStory> GetStorySprintMappings(int? sprintId = null, int? projectStoryId = null);
        int DeleteStorySprintMapping(int projectStoryId, IDbTransaction transaction = null);
    }
}
