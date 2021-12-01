using System.Collections.Generic;

namespace ProjectDevs.Core.Constants
{
    public static class Database
    {
        public static readonly string Name = "ProjectDevs";

        public static class StoredProcedures
        {
            public static readonly string PD_CreateProject = "dbo.PD_CreateProject";
            public static readonly string PD_UpdateProject = "dbo.PD_UpdateProject";
            public static readonly string PD_SelectProjects = "dbo.PD_SelectProjects";
            public static readonly string PD_CreateUser = "dbo.PD_CreateUser";
            public static readonly string PD_UpdateUser = "dbo.PD_UpdateUser";
            public static readonly string PD_SelectUsers = "dbo.PD_SelectUsers";
            public static readonly string PD_CreateProjectRoleAssignment = "dbo.PD_CreateProjectRoleAssignment";
            public static readonly string PD_UpdateProjectRoleAssignment = "dbo.PD_UpdateProjectRoleAssignment";
            public static readonly string PD_DeleteProjectRoleAssignment = "dbo.PD_DeleteProjectRoleAssignment";
            public static readonly string PD_SelectRoleAssignments = "dbo.PD_SelectRoleAssignments";
            public static readonly string PD_CreateProjectStory = "dbo.PD_CreateProjectStory";
            public static readonly string PD_UpdateProjectStory = "dbo.PD_UpdateProjectStory";
            public static readonly string PD_UpdateProjectStoryOrder = "dbo.PD_UpdateProjectStoryOrder";
            public static readonly string PD_ProjectStoryCopyToNextSprint = "dbo.PD_ProjectStoryCopyToNextSprint";
            public static readonly string PD_SelectProjectStories = "dbo.PD_SelectProjectStories";
            public static readonly string PD_SelectProjectStoryStatuses = "dbo.PD_SelectProjectStoryStatuses";
            public static readonly string PD_CreateProjectStoryTask = "dbo.PD_CreateProjectStoryTask";
            public static readonly string PD_UpdateProjectStoryTask = "dbo.PD_UpdateProjectStoryTask";
            public static readonly string PD_SelectProjectStoryTasks = "dbo.PD_SelectProjectStoryTasks";
            public static readonly string PD_CreateProjectNote = "dbo.PD_CreateProjectNote";
            public static readonly string PD_UpdateProjectNote = "dbo.PD_UpdateProjectNote";
            public static readonly string PD_SelectProjectNotes = "dbo.PD_SelectProjectNotes";
            public static readonly string PD_CreateProjectFile = "dbo.PD_CreateProjectFile";
            public static readonly string PD_MoveTemporaryFile = "dbo.PD_MoveTemporaryFile";
            public static readonly string PD_UpdateProjectFile = "dbo.PD_UpdateProjectFile";
            public static readonly string PD_SelectProjectFiles = "dbo.PD_SelectProjectFiles";
            public static readonly string PD_CreateProjectMeeting = "dbo.PD_CreateProjectMeeting";
            public static readonly string PD_UpdateProjectMeeting = "dbo.PD_UpdateProjectMeeting";
            public static readonly string PD_SelectProjectMeetings = "dbo.PD_SelectProjectMeetings";
            public static readonly string PD_CreateProjectSprint = "dbo.PD_CreateProjectSprint";
            public static readonly string PD_CloseProjectSprint = "dbo.PD_CloseProjectSprint";
            public static readonly string PD_GetProjectSprintCloseReportData = "dbo.PD_GetProjectSprintCloseReportData";
            public static readonly string PD_GetProjectStoriesReportData = "dbo.PD_GetProjectStoriesReportData";
            public static readonly string PD_GetProductionReleaseReportData = "dbo.PD_GetProductionReleaseReportData";
            public static readonly string PD_UpdateProjectSprint = "dbo.PD_UpdateProjectSprint";
            public static readonly string PD_UpdateProjectSprintAdditionalDetails = "dbo.PD_UpdateProjectSprintAdditionalDetails";
            public static readonly string PD_SelectProjectSprints = "dbo.PD_SelectProjectSprints";
            public static readonly string PD_CreateProjectSprintMapping = "dbo.PD_CreateProjectSprintMapping";
            public static readonly string PD_SelectProjectSprintMapping = "dbo.PD_SelectProjectSprintMapping";
            public static readonly string PD_CreateProjectList = "dbo.PD_CreateProjectList";
            public static readonly string PD_UpdateProjectList = "dbo.PD_UpdateProjectList";
            public static readonly string PD_SelectProjectLists = "dbo.PD_SelectProjectLists";
            public static readonly string PD_SearchUsers = "dbo.PD_SearchUsers";
            public static readonly string PD_SelectProjectRoles = "dbo.PD_SelectProjectRoles";

            public static readonly string PD_My_SelectProjects = "dbo.PD_My_SelectProjects";
            public static readonly string PD_My_SelectProjectStories = "dbo.PD_My_SelectProjectStories";
            public static readonly string PD_My_SelectProjectStoryTasks = "dbo.PD_My_SelectProjectStoryTasks";
            public static readonly string PD_DeleteProjectSprintMapping = "dbo.PD_DeleteProjectSprintMapping";

            public static readonly string PD_CreateProjectTestScripts = "dbo.PD_CreateProjectTestScripts";
            public static readonly string PD_CreateProjectTestScriptAssigneeMapping = "dbo.PD_CreateProjectTestScriptAssigneeMapping";
            public static readonly string PD_UpdateProjectTestScriptAssigneeMapping = "dbo.PD_UpdateProjectTestScriptAssigneeMapping";
            public static readonly string PD_UpdateProjectTestScriptAssigneeMappingStatus = "dbo.PD_UpdateProjectTestScriptAssigneeMappingStatus";
            public static readonly string PD_AddTestScripStepNote = "dbo.PD_AddTestScripStepNote";
            public static readonly string PD_CreateProjectTestScriptSteps = "dbo.PD_CreateProjectTestScriptSteps";
            public static readonly string PD_SelectProjectTestScripts = "dbo.PD_SelectProjectTestScripts";
            public static readonly string PD_SelectProjectTestScriptAssigneeMappings = "dbo.PD_SelectProjectTestScriptAssigneeMappings";
            public static readonly string PD_SelectProjectTestScriptSteps = "dbo.PD_SelectProjectTestScriptSteps";
            public static readonly string PD_UpdateProjectTestScripts = "dbo.PD_UpdateProjectTestScripts";
            public static readonly string PD_UpdateProjectTestScriptTests = "dbo.PD_UpdateProjectTestScriptTests";
            public static readonly string PD_ApproveProjectTestScript = "dbo.PD_ApproveProjectTestScript";

            public static readonly string PD_CreateNotification = "dbo.PD_CreateNotification";
            public static readonly string PD_UpdateNotificationSeen = "dbo.PD_UpdateNotificationSeen";
            public static readonly string PD_GetNotificationCount = "dbo.PD_GetNotificationCount";
            public static readonly string PD_GetNotifications = "dbo.PD_GetNotifications";

            public static readonly string PD_SelectNotesOfProject = "dbo.PD_SelectNotesOfProject";
            public static readonly string PD_SelectFilesOfProject = "dbo.PD_SelectFilesOfProject";

            public static readonly string PD_SelectStoriesWithoutEndDate = "dbo.PD_SelectStoriesWithoutEndDate";

            public static readonly string PD_Search = "dbo.PD_Search";
            public static readonly string SelectLogs = "dbo.SelectLogs";
            public static readonly string PD_GetProjectStoriesMaxPriority = "dbo.PD_GetProjectStoriesMaxPriority";

            public static readonly string PD_GetRotaSuppData = "dbo.PD_GetRotaSuppData";
            public static readonly string PD_DashboardSummary = "dbo.PD_DashboardSummary";
        }
        public static IEnumerable<string> ProjectTypes = new List<string>
        {
            {"Product" },
            {"Program" },
            {"Initiative" }
        };
        public static IEnumerable<string> TaskTypes = new List<string>
        {
            {"Documentation" },
            {"Service Requests" },
            {"Development" }
        };
    }
}
