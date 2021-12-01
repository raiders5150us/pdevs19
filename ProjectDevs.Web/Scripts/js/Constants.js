/// <reference path="Models.ts" />
var Constants = /** @class */ (function () {
    function Constants() {
    }
    Constants.TokenName = 'pd.tk';
    Constants.UserData = 'pd.ud';
    Constants.ThemeCookieName = 'pd.theme';
    Constants.TokenExpiryMiliseconds = 8 * 60 * 60 * 1000; // 8 Hrs
    Constants.DefaultPageSize = 12;
    Constants.NestedDefaultPageSize = 5;
    Constants.NestedAllPageSize = 100;
    Constants.TeamSelectionCookieName = "SelectedTeams";
    return Constants;
}());
var NoteType;
(function (NoteType) {
    NoteType[NoteType["Projects"] = 1] = "Projects";
    NoteType[NoteType["UserStories"] = 2] = "UserStories";
    NoteType[NoteType["Tasks"] = 3] = "Tasks";
    NoteType[NoteType["Meetings"] = 4] = "Meetings";
})(NoteType || (NoteType = {}));
var FileType;
(function (FileType) {
    FileType[FileType["Projects"] = 1] = "Projects";
    FileType[FileType["UserStories"] = 2] = "UserStories";
    FileType[FileType["Tasks"] = 3] = "Tasks";
    FileType[FileType["Sprints"] = 5] = "Sprints";
    FileType[FileType["TestScripts"] = 6] = "TestScripts";
})(FileType || (FileType = {}));
var SearchResultType;
(function (SearchResultType) {
    SearchResultType[SearchResultType["All"] = 0] = "All";
    SearchResultType[SearchResultType["Project"] = 1] = "Project";
    SearchResultType[SearchResultType["Story"] = 2] = "Story";
    SearchResultType[SearchResultType["Task"] = 3] = "Task";
    SearchResultType[SearchResultType["Meeting"] = 4] = "Meeting";
    SearchResultType[SearchResultType["File"] = 5] = "File";
    SearchResultType[SearchResultType["Note"] = 6] = "Note";
    SearchResultType[SearchResultType["TestScript"] = 7] = "TestScript";
})(SearchResultType || (SearchResultType = {}));
var WebUrl;
(function (WebUrl) {
    WebUrl["Login"] = "/Login";
    WebUrl["Dashboard"] = "/Dashboard";
    WebUrl["Projects"] = "/Projects";
    WebUrl["UserStories"] = "/User-Stories";
    WebUrl["StoryTasks"] = "/Story-Tasks";
    WebUrl["Sprints"] = "/Sprints";
    WebUrl["Meetings"] = "/Meetings";
    WebUrl["Notes"] = "/Notes";
    WebUrl["Files"] = "/Files";
    WebUrl["Users"] = "/Users";
    WebUrl["MyProjects"] = "/My/Projects";
    WebUrl["MyUserStories"] = "/My/User-Stories";
    WebUrl["MyStoryTasks"] = "/My/Story-Tasks";
    WebUrl["MyMeetings"] = "/My/Meetings";
    WebUrl["MyNotes"] = "/My/Notes";
    WebUrl["MyFiles"] = "/My/Files";
})(WebUrl || (WebUrl = {}));
var ReportTypes;
(function (ReportTypes) {
    ReportTypes[ReportTypes["SprintCloseStoryHours"] = 0] = "SprintCloseStoryHours";
    ReportTypes[ReportTypes["ProductionSupport"] = 1] = "ProductionSupport";
    ReportTypes[ReportTypes["ProductionRelease"] = 2] = "ProductionRelease";
})(ReportTypes || (ReportTypes = {}));
var ApiUrl;
(function (ApiUrl) {
    ApiUrl["Domain"] = "https://localhost:44301/";
    ApiUrl["BaseUrl"] = "https://localhost:44301/api";
    ApiUrl["AuthUrl"] = "authenticate";
    ApiUrl["DashboardSummary"] = "dashboard/summary";
    ApiUrl["Projects"] = "projects/list";
    ApiUrl["MyProjects"] = "projects/my";
    ApiUrl["ProjectDetail"] = "projects/[PROJECT_ID]";
    ApiUrl["ProjectCreate"] = "projects/create";
    ApiUrl["ProjectUpdate"] = "projects/[PROJECT_ID]";
    ApiUrl["ProjectStatus"] = "projects/master/status";
    ApiUrl["Team"] = "projects/master/team";
    ApiUrl["ProjectsDdl"] = "projects/ddl";
    ApiUrl["ProjectStoriesMaxRank"] = "projects/[PROJECT_ID]/stories-max-rank";
    ApiUrl["ProjectMeetings"] = "projects/[PROJECT_ID]/meetings";
    ApiUrl["MyMeetings"] = "projects/[PROJECT_ID]/meetings/my";
    ApiUrl["ProjectMeetingDetail"] = "projects/[PROJECT_ID]/meetings/[MEETING_ID]";
    ApiUrl["ProjectMeetingCreate"] = "projects/[PROJECT_ID]/meetings/create";
    ApiUrl["ProjectMeetingUpdate"] = "projects/[PROJECT_ID]/meetings/[MEETING_ID]";
    ApiUrl["ProjectStories"] = "[PROJECT_ID]/projectstories";
    ApiUrl["MyStories"] = "[PROJECT_ID]/projectstories/my";
    ApiUrl["ProjectStoriyDetail"] = "[PROJECT_ID]/projectstories/[STORY_ID]";
    ApiUrl["ProjectStoryCreate"] = "[PROJECT_ID]/projectstories/create";
    ApiUrl["ProjectStoryQuickCreate"] = "[PROJECT_ID]/projectstories/create_quick/[Temp_Guid]";
    ApiUrl["ProjectStoryUpdate"] = "[PROJECT_ID]/projectstories/[STORY_ID]";
    ApiUrl["ProjectStoryCopyToNextSprint"] = "[PROJECT_ID]/projectstories/[STORY_ID]/projectstorycopytonextsprint/[SPRINT_ID]";
    ApiUrl["ProjectStoryBulkOrderUpdate"] = "[PROJECT_ID]/projectstories/projectstorybulkorderupdate";
    ApiUrl["ProjectStoriesStatus"] = "[PROJECT_ID]/projectstories/master/status";
    ApiUrl["ProjectStoriesTypes"] = "[PROJECT_ID]/projectstories/master/types";
    ApiUrl["ProjectStoriesDdl"] = "[PROJECT_ID]/projectstories/ddl/[STATUS_IDS]";
    ApiUrl["ProjectStoriesWithoutEndDate"] = "stories-without-enddate";
    ApiUrl["StoryTasks"] = "storytasks/[STORY_ID]";
    ApiUrl["MyTasks"] = "storytasks/[STORY_ID]/my";
    ApiUrl["StoryTaskDetail"] = "storytasks/[STORY_ID]/task/[TASK_ID]";
    ApiUrl["StoryTaskCreate"] = "storytasks/[STORY_ID]/task/create";
    ApiUrl["StoryTaskUpdate"] = "storytasks/[STORY_ID]/task/[TASK_ID]";
    ApiUrl["StoryTasksStatus"] = "storytasks/[STORY_ID]/master/status";
    ApiUrl["StoryTaskLOB"] = "storytasks/[STORY_ID]/master/lob";
    ApiUrl["Sprints"] = "sprints";
    ApiUrl["SprintDetail"] = "sprints/[SPRINT_ID]";
    ApiUrl["SprintCreate"] = "sprints/create";
    ApiUrl["SprintUpdate"] = "sprints/[SPRINT_ID]";
    ApiUrl["SprintClose"] = "sprints/[SPRINT_ID]/close";
    ApiUrl["SprintsDdl"] = "sprints/ddl/[TEAM_ID]";
    ApiUrl["SprintStories"] = "sprints/[SPRINT_ID]/projectstories";
    ApiUrl["SprintAddStories"] = "sprints/[SPRINT_ID]/addstories";
    ApiUrl["Notes"] = "notes/type/[NOTE_TYPE]";
    ApiUrl["MyNotes"] = "notes/type/[NOTE_TYPE]/my";
    ApiUrl["NotesOfRecord"] = "notes/type/[NOTE_TYPE]/of/[RECORD_ID]";
    ApiUrl["NotesOfRecordCreate"] = "notes/type/[NOTE_TYPE]/of/[RECORD_ID]";
    ApiUrl["NoteDetail"] = "notes/type/[NOTE_TYPE]/of/[RECORD_ID]/note/[NOTE_ID]";
    ApiUrl["NoteUpdate"] = "notes/type/[NOTE_TYPE]/of/[RECORD_ID]/note/[NOTE_ID]";
    ApiUrl["Files"] = "files/type/[FILE_TYPE]";
    ApiUrl["MyFiles"] = "files/type/[FILE_TYPE]/my";
    ApiUrl["FilesOfRecord"] = "files/type/[FILE_TYPE]/of/[RECORD_ID]";
    ApiUrl["FilesOfRecordCreate"] = "files/type/[FILE_TYPE]/of/[RECORD_ID]";
    ApiUrl["FileDetail"] = "files/type/[FILE_TYPE]/of/[RECORD_ID]/file/[FILE_ID]";
    ApiUrl["FileUpdate"] = "files/type/[FILE_TYPE]/of/[RECORD_ID]/file/[FILE_ID]";
    ApiUrl["FileNameUpdate"] = "files/type/[FILE_TYPE]/of/[RECORD_ID]/file/[FILE_ID]";
    ApiUrl["Users"] = "users";
    ApiUrl["UserDetail"] = "users/[USER_ID]";
    ApiUrl["UserCreate"] = "users/create";
    ApiUrl["UserUpdate"] = "users/[USER_ID]";
    ApiUrl["TestScripts"] = "test-scripts";
    ApiUrl["TestScriptDetail"] = "test-scripts/[TEST_SCRIPT_ID]";
    ApiUrl["TestScriptCreate"] = "test-scripts/create";
    ApiUrl["TestScriptUpdate"] = "test-scripts/[TEST_SCRIPT_ID]";
    ApiUrl["TestScriptExport"] = "test-scripts/exporttestscriptdetail/[TEST_SCRIPT_ID]";
    ApiUrl["TestScriptExportDownload"] = "test-scripts/downloadtestscriptpdf/[FILE_NAME]";
    ApiUrl["TestScriptSteps"] = "test-scripts/[TEST_SCRIPT_ID]/steps";
    ApiUrl["TestScriptStepDetail"] = "test-scripts/[TEST_SCRIPT_ID]/steps/[STEP_ID]";
    ApiUrl["TestScriptStepUpdateAssigneeStatus"] = "test-scripts/updateassigneestatus";
    ApiUrl["TestScriptStepCreate"] = "test-scripts/[TEST_SCRIPT_ID]/steps/create";
    ApiUrl["TestScriptStepUpdate"] = "test-scripts/[TEST_SCRIPT_ID]/steps/[STEP_ID]";
    ApiUrl["TestScriptBulkStepUpdate"] = "test-scripts/[TEST_SCRIPT_ID]/steps_bulk";
    ApiUrl["TestScriptStepNoteAdd"] = "test-scripts/steps/addnote";
    ApiUrl["TestScriptStatus"] = "test-scripts/master/status";
    ApiUrl["TestScriptStepsStatus"] = "test-scripts/master/status_steps";
    ApiUrl["Notifications"] = "notifications";
    ApiUrl["NotificationsCount"] = "notifications/count";
    ApiUrl["ProjectFiles"] = "files/project-files";
    ApiUrl["MyProjectFiles"] = "files/my-project-files";
    ApiUrl["ProjectNotes"] = "notes/project-notes";
    ApiUrl["MyProjectNotes"] = "notes/project-notes";
    ApiUrl["SearchResults"] = "search";
    ApiUrl["Logs"] = "logs";
    ApiUrl["RotaSupp"] = "rota-supp/list";
    ApiUrl["ReportTypes"] = "reports/master/types";
    ApiUrl["ReportData"] = "reports/reportdata/[REPORT_ID]/[SPRINT_ID]/[START_DATE]/[END_DATE]";
    ApiUrl["ExportReportData"] = "reports/exportreportdata/[REPORT_ID]/[SPRINT_ID]/[START_DATE]/[END_DATE]";
    ApiUrl["DownloadReport"] = "reports/downloadreport/[FILE_NAME]";
})(ApiUrl || (ApiUrl = {}));
var ApiUrlPlaceholder;
(function (ApiUrlPlaceholder) {
    ApiUrlPlaceholder["ProjectId"] = "[PROJECT_ID]";
    ApiUrlPlaceholder["MeetingId"] = "[MEETING_ID]";
    ApiUrlPlaceholder["StoryId"] = "[STORY_ID]";
    ApiUrlPlaceholder["TempGuid"] = "[Temp_Guid]";
    ApiUrlPlaceholder["TaskId"] = "[TASK_ID]";
    ApiUrlPlaceholder["SprintId"] = "[SPRINT_ID]";
    ApiUrlPlaceholder["NoteType"] = "[NOTE_TYPE]";
    ApiUrlPlaceholder["RecordId"] = "[RECORD_ID]";
    ApiUrlPlaceholder["NoteId"] = "[NOTE_ID]";
    ApiUrlPlaceholder["FileType"] = "[FILE_TYPE]";
    ApiUrlPlaceholder["FileId"] = "[FILE_ID]";
    ApiUrlPlaceholder["UserId"] = "[USER_ID]";
    ApiUrlPlaceholder["TestScriptId"] = "[TEST_SCRIPT_ID]";
    ApiUrlPlaceholder["StepId"] = "[STEP_ID]";
    ApiUrlPlaceholder["StatusIds"] = "[STATUS_IDS]";
    ApiUrlPlaceholder["ReportId"] = "[REPORT_ID]";
    ApiUrlPlaceholder["TeamId"] = "[TEAM_ID]";
    ApiUrlPlaceholder["FileName"] = "[FILE_NAME]";
    ApiUrlPlaceholder["StartDate"] = "[START_DATE]";
    ApiUrlPlaceholder["EndDate"] = "[END_DATE]";
})(ApiUrlPlaceholder || (ApiUrlPlaceholder = {}));
var UrlHelper = /** @class */ (function () {
    function UrlHelper() {
    }
    UrlHelper.GetProjectsUrl = function (apiUrlEnum, projectId) {
        return apiUrlEnum.replace(ApiUrlPlaceholder.ProjectId, "" + projectId);
    };
    UrlHelper.GetMeetingsUrl = function (apiUrlEnum, projectId, meetingId) {
        return apiUrlEnum.replace(ApiUrlPlaceholder.ProjectId, "" + projectId)
            .replace(ApiUrlPlaceholder.MeetingId, "" + meetingId);
    };
    UrlHelper.GetProjectStoriesUrl = function (apiUrlEnum, projectId, storyId, statusIds, tempGuid) {
        if (statusIds === void 0) { statusIds = ""; }
        if (tempGuid === void 0) { tempGuid = ""; }
        return apiUrlEnum.replace(ApiUrlPlaceholder.ProjectId, "" + projectId)
            .replace(ApiUrlPlaceholder.StoryId, "" + storyId)
            .replace(ApiUrlPlaceholder.StatusIds, "" + statusIds)
            .replace(ApiUrlPlaceholder.TempGuid, "" + tempGuid);
    };
    UrlHelper.GetProjectStoryCopyToNextSprintUrl = function (apiUrlEnum, projectId, storyId, sprintId) {
        return apiUrlEnum.replace(ApiUrlPlaceholder.ProjectId, "" + projectId)
            .replace(ApiUrlPlaceholder.StoryId, "" + storyId)
            .replace(ApiUrlPlaceholder.SprintId, "" + sprintId);
    };
    UrlHelper.GetProjectStoriesOrderUpdateUrl = function (apiUrlEnum, projectId) {
        return apiUrlEnum.replace(ApiUrlPlaceholder.ProjectId, "" + projectId);
    };
    UrlHelper.GetStoryTasksUrl = function (apiUrlEnum, storyId, taskId) {
        return apiUrlEnum.replace(ApiUrlPlaceholder.StoryId, "" + storyId)
            .replace(ApiUrlPlaceholder.TaskId, "" + taskId);
    };
    UrlHelper.GetSprintsUrl = function (apiUrlEnum, sprintId) {
        return apiUrlEnum.replace(ApiUrlPlaceholder.SprintId, "" + sprintId);
    };
    UrlHelper.GetSprintsUrlWithTeamId = function (apiUrlEnum, teamId) {
        return apiUrlEnum.replace(ApiUrlPlaceholder.TeamId, "" + teamId);
    };
    UrlHelper.GetNotesUrl = function (apiUrlEnum, noteType, recordId, noteId) {
        return apiUrlEnum.replace(ApiUrlPlaceholder.NoteType, "" + noteType)
            .replace(ApiUrlPlaceholder.RecordId, "" + recordId)
            .replace(ApiUrlPlaceholder.NoteId, "" + noteId);
    };
    UrlHelper.GetFilesUrl = function (apiUrlEnum, fileType, recordId, fileId) {
        return apiUrlEnum.replace(ApiUrlPlaceholder.FileType, "" + fileType)
            .replace(ApiUrlPlaceholder.RecordId, "" + recordId)
            .replace(ApiUrlPlaceholder.FileId, "" + fileId);
    };
    UrlHelper.GetUsersUrl = function (apiUrlEnum, userId) {
        return apiUrlEnum.replace(ApiUrlPlaceholder.UserId, "" + userId);
    };
    UrlHelper.GetTestScriptsUrl = function (apiUrlEnum, testScriptId, stepId) {
        if (testScriptId === void 0) { testScriptId = 0; }
        if (stepId === void 0) { stepId = 0; }
        return apiUrlEnum.replace(ApiUrlPlaceholder.TestScriptId, "" + testScriptId)
            .replace(ApiUrlPlaceholder.StepId, "" + stepId);
    };
    UrlHelper.GetTestScriptsExportUrl = function (apiUrlEnum, testScriptId) {
        if (testScriptId === void 0) { testScriptId = 0; }
        return apiUrlEnum.replace(ApiUrlPlaceholder.TestScriptId, "" + testScriptId);
    };
    UrlHelper.GetTestScriptsExportDownloadUrl = function (apiUrlEnum, filename) {
        return apiUrlEnum.replace(ApiUrlPlaceholder.FileName, "" + filename);
    };
    UrlHelper.GetTestScriptsBulkUpdateUrl = function (apiUrlEnum, testScriptId) {
        if (testScriptId === void 0) { testScriptId = 0; }
        return apiUrlEnum.replace(ApiUrlPlaceholder.TestScriptId, "" + testScriptId);
    };
    UrlHelper.GetSprintCloseStoryHoursReportDataUrl = function (apiUrlEnum, reportId, sprintId, startDate, endDate) {
        if (sprintId === void 0) { sprintId = null; }
        if (startDate === void 0) { startDate = null; }
        if (endDate === void 0) { endDate = null; }
        return apiUrlEnum
            .replace(ApiUrlPlaceholder.ReportId, "" + reportId)
            .replace(ApiUrlPlaceholder.SprintId, "" + sprintId)
            .replace(ApiUrlPlaceholder.StartDate, "" + startDate)
            .replace(ApiUrlPlaceholder.EndDate, "" + endDate);
    };
    UrlHelper.GetProductionSupportReportDataUrl = function (apiUrlEnum, reportId, sprintId) {
        if (sprintId === void 0) { sprintId = null; }
        return apiUrlEnum
            .replace(ApiUrlPlaceholder.ReportId, "" + reportId)
            .replace(ApiUrlPlaceholder.SprintId, "" + sprintId);
    };
    UrlHelper.GetReportDownloadUrl = function (apiUrlEnum, fileName) {
        return apiUrlEnum
            .replace(ApiUrlPlaceholder.FileName, "" + fileName);
    };
    return UrlHelper;
}());
//# sourceMappingURL=Constants.js.map