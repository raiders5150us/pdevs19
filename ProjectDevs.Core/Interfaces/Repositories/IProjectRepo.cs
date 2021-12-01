using ProjectDevs.Core.Models;
using System.Collections.Generic;
using System.Data;

namespace ProjectDevs.Core.Interfaces.Repositories
{
    public interface IProjectRepo
    {
        int? CreateProject(Project project, IDbTransaction transaction = null);
        int UpdateProject(Project project, IDbTransaction transaction = null);
        IEnumerable<Project> GetProjects(int? projectId = null);
        IEnumerable<Project> GetMyProjects(string userId);

        int DeleteProjectRoleAssignment(int projectId, IDbTransaction transaction = null);
        int CreateProjectRoleAssignment(ProjectRoleAssignment projectRole, IDbTransaction transaction = null);
        int CreateProjectRoleAssignments(IEnumerable<ProjectRoleAssignment> projectRoles, IDbTransaction transaction = null);
        IEnumerable<ProjectRoleAssignment> ProjectRoleAssignment(int? projectId = null, string userId = null, int? roleId = null);

        int GetProjectStoriesMaxPriority(int projectId);
    }
}
