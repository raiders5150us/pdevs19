using ProjectDevs.Core.Constants;
using ProjectDevs.Core.Interfaces.Repositories;
using ProjectDevs.Core.Models;
using ProjectDevs.DataAccess.Extensions;
using System.Collections.Generic;
using System.Data;
using System.Linq;

namespace ProjectDevs.DataAccess.Repositories
{
    public class ProjectRepo : IProjectRepo
    {
        private readonly IDbConnection _connection;

        public ProjectRepo(IDbConnection connection) => _connection = connection;

        public int? CreateProject(Project project, IDbTransaction transaction = null) =>
            _connection.QueryStoredProcedure<int>(Database.StoredProcedures.PD_CreateProject, project.GetCreateSpParams(), transaction)
                ?.FirstOrDefault(); // Newly inserted ProjectId

        public int UpdateProject(Project project, IDbTransaction transaction = null) =>
            _connection.ExecuteStoredProcedure(Database.StoredProcedures.PD_UpdateProject, project.GetUpdateSpParams(), transaction);

        public IEnumerable<Project> GetProjects(int? projectId) =>
           _connection.QueryStoredProcedure<Project>(Database.StoredProcedures.PD_SelectProjects, new { projectId })
               ?.ToList();

        public int CreateProjectRoleAssignment(ProjectRoleAssignment projectRole, IDbTransaction transaction = null) =>
            _connection.ExecuteStoredProcedure(Database.StoredProcedures.PD_CreateProjectRoleAssignment, projectRole, transaction);

        public int DeleteProjectRoleAssignment(int projectId, IDbTransaction transaction = null) =>
            _connection.ExecuteStoredProcedure(Database.StoredProcedures.PD_DeleteProjectRoleAssignment, new { projectId }, transaction);

        public int CreateProjectRoleAssignments(IEnumerable<ProjectRoleAssignment> projectRoles, IDbTransaction transaction = null)
        {
            int recordsAffected = 0;
            foreach (var item in projectRoles)
            {
                recordsAffected += this.CreateProjectRoleAssignment(item, transaction);
            }
            return recordsAffected;
        }

        public IEnumerable<ProjectRoleAssignment> ProjectRoleAssignment(int? projectId = null, string userId = null, int? roleId = null) =>
            _connection.QueryStoredProcedure<ProjectRoleAssignment>(Database.StoredProcedures.PD_SelectRoleAssignments, new { roleId, userId, projectId })
                ?.ToList();

        public IEnumerable<Project> GetMyProjects(string userId) =>
           _connection.QueryStoredProcedure<Project>(Database.StoredProcedures.PD_My_SelectProjects, new { userId })
               ?.ToList();

        public int GetProjectStoriesMaxPriority(int projectId) =>
            _connection.QueryStoredProcedureScalar<int>(Database.StoredProcedures.PD_GetProjectStoriesMaxPriority, new { projectId });
    }
}
