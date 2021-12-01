/// <reference path="Models.ts" />

class Constants {
    static readonly TokenName = 'pd.tk';
    static readonly UserData = 'pd.ud';
    static readonly ThemeCookieName = 'pd.theme';
    static readonly TokenExpiryMiliseconds = 8 * 60 * 60 * 1000; // 8 Hrs
    static readonly DefaultPageSize = 12;
    static readonly NestedDefaultPageSize = 5;
    static readonly NestedAllPageSize = 100;
    static readonly TeamSelectionCookieName = "SelectedTeams";
}

enum NoteType {
    Projects = 1,
    UserStories = 2,
    Tasks = 3,
    Meetings = 4
}

enum FileType {
    Projects = 1,
    UserStories = 2,
    Tasks = 3,
    Sprints = 5,
    TestScripts = 6
}

enum SearchResultType {
    All,
    Project,
    Story,
    Task,
    Meeting,
    File,
    Note,
    TestScript
}

enum WebUrl {
    Login = '/Login',
    Dashboard = '/Dashboard',
    Projects = '/Projects',
    UserStories = '/User-Stories',
    StoryTasks = '/Story-Tasks',
    Sprints = '/Sprints',
    Meetings = '/Meetings',
    Notes = '/Notes',
    Files = '/Files',
    Users = '/Users',
    MyProjects = '/My/Projects',
    MyUserStories = '/My/User-Stories',
    MyStoryTasks = '/My/Story-Tasks',
    MyMeetings = '/My/Meetings',
    MyNotes = '/My/Notes',
    MyFiles = '/My/Files',
}
enum ReportTypes {
    SprintCloseStoryHours,
    ProductionSupport,
    ProductionRelease
}

enum ApiUrl {
    Domain = 'https://localhost:44301/',
    BaseUrl = 'https://localhost:44301/api',
    AuthUrl = 'authenticate',

    DashboardSummary = 'dashboard/summary',
    Projects = 'projects/list',
    MyProjects = 'projects/my',
    ProjectDetail = 'projects/[PROJECT_ID]',
    ProjectCreate = 'projects/create',
    ProjectUpdate = 'projects/[PROJECT_ID]',
    ProjectStatus = 'projects/master/status',
    Team = 'projects/master/team',
    ProjectsDdl = 'projects/ddl',
    ProjectStoriesMaxRank = 'projects/[PROJECT_ID]/stories-max-rank',

    ProjectMeetings = 'projects/[PROJECT_ID]/meetings',
    MyMeetings = 'projects/[PROJECT_ID]/meetings/my',
    ProjectMeetingDetail = 'projects/[PROJECT_ID]/meetings/[MEETING_ID]',
    ProjectMeetingCreate = 'projects/[PROJECT_ID]/meetings/create',
    ProjectMeetingUpdate = 'projects/[PROJECT_ID]/meetings/[MEETING_ID]',

    ProjectStories = '[PROJECT_ID]/projectstories',
    MyStories = '[PROJECT_ID]/projectstories/my',
    ProjectStoriyDetail = '[PROJECT_ID]/projectstories/[STORY_ID]',
    ProjectStoryCreate = '[PROJECT_ID]/projectstories/create',
    ProjectStoryQuickCreate = '[PROJECT_ID]/projectstories/create_quick/[Temp_Guid]',
    ProjectStoryUpdate = '[PROJECT_ID]/projectstories/[STORY_ID]',
    ProjectStoryCopyToNextSprint = '[PROJECT_ID]/projectstories/[STORY_ID]/projectstorycopytonextsprint/[SPRINT_ID]',
    ProjectStoryBulkOrderUpdate = '[PROJECT_ID]/projectstories/projectstorybulkorderupdate',
    ProjectStoriesStatus = '[PROJECT_ID]/projectstories/master/status',    
    ProjectStoriesTypes = '[PROJECT_ID]/projectstories/master/types',
    ProjectStoriesDdl = '[PROJECT_ID]/projectstories/ddl/[STATUS_IDS]',
    ProjectStoriesWithoutEndDate = 'stories-without-enddate',

    StoryTasks = 'storytasks/[STORY_ID]',
    MyTasks = 'storytasks/[STORY_ID]/my',
    StoryTaskDetail = 'storytasks/[STORY_ID]/task/[TASK_ID]',
    StoryTaskCreate = 'storytasks/[STORY_ID]/task/create',
    StoryTaskUpdate = 'storytasks/[STORY_ID]/task/[TASK_ID]',
    StoryTasksStatus = 'storytasks/[STORY_ID]/master/status',
    StoryTaskLOB = 'storytasks/[STORY_ID]/master/lob',

    Sprints = 'sprints',
    SprintDetail = 'sprints/[SPRINT_ID]',
    SprintCreate = 'sprints/create',
    SprintUpdate = 'sprints/[SPRINT_ID]',
    SprintClose = 'sprints/[SPRINT_ID]/close',
    SprintsDdl = 'sprints/ddl/[TEAM_ID]',

    SprintStories = 'sprints/[SPRINT_ID]/projectstories',
    SprintAddStories = 'sprints/[SPRINT_ID]/addstories',

    Notes = 'notes/type/[NOTE_TYPE]',
    MyNotes = 'notes/type/[NOTE_TYPE]/my',
    NotesOfRecord = 'notes/type/[NOTE_TYPE]/of/[RECORD_ID]',
    NotesOfRecordCreate = 'notes/type/[NOTE_TYPE]/of/[RECORD_ID]',
    NoteDetail = 'notes/type/[NOTE_TYPE]/of/[RECORD_ID]/note/[NOTE_ID]',
    NoteUpdate = 'notes/type/[NOTE_TYPE]/of/[RECORD_ID]/note/[NOTE_ID]',

    Files = 'files/type/[FILE_TYPE]',
    MyFiles = 'files/type/[FILE_TYPE]/my',
    FilesOfRecord = 'files/type/[FILE_TYPE]/of/[RECORD_ID]',
    FilesOfRecordCreate = 'files/type/[FILE_TYPE]/of/[RECORD_ID]',
    FileDetail = 'files/type/[FILE_TYPE]/of/[RECORD_ID]/file/[FILE_ID]',
    FileUpdate = 'files/type/[FILE_TYPE]/of/[RECORD_ID]/file/[FILE_ID]',
    FileNameUpdate = 'files/type/[FILE_TYPE]/of/[RECORD_ID]/file/[FILE_ID]',

    Users = 'users',
    UserDetail = 'users/[USER_ID]',
    UserCreate = 'users/create',
    UserUpdate = 'users/[USER_ID]',

    TestScripts = 'test-scripts',
    TestScriptDetail = 'test-scripts/[TEST_SCRIPT_ID]',
    TestScriptCreate = 'test-scripts/create',
    TestScriptUpdate = 'test-scripts/[TEST_SCRIPT_ID]',
    TestScriptExport = 'test-scripts/exporttestscriptdetail/[TEST_SCRIPT_ID]',
    TestScriptExportDownload = 'test-scripts/downloadtestscriptpdf/[FILE_NAME]',

    TestScriptSteps = 'test-scripts/[TEST_SCRIPT_ID]/steps',
    TestScriptStepDetail = 'test-scripts/[TEST_SCRIPT_ID]/steps/[STEP_ID]',
    TestScriptStepUpdateAssigneeStatus = 'test-scripts/updateassigneestatus',

    TestScriptStepCreate = 'test-scripts/[TEST_SCRIPT_ID]/steps/create',
    TestScriptStepUpdate = 'test-scripts/[TEST_SCRIPT_ID]/steps/[STEP_ID]',
    TestScriptBulkStepUpdate = 'test-scripts/[TEST_SCRIPT_ID]/steps_bulk',
    TestScriptStepNoteAdd = 'test-scripts/steps/addnote',
    TestScriptStatus = 'test-scripts/master/status',
    TestScriptStepsStatus = 'test-scripts/master/status_steps',

    Notifications = 'notifications',
    NotificationsCount = 'notifications/count',

    ProjectFiles = 'files/project-files',
    MyProjectFiles = 'files/my-project-files',

    ProjectNotes = 'notes/project-notes',
    MyProjectNotes = 'notes/project-notes',

    SearchResults = 'search',
    Logs = 'logs',

    RotaSupp = 'rota-supp/list',

    ReportTypes = 'reports/master/types',
    ReportData = 'reports/reportdata/[REPORT_ID]/[SPRINT_ID]/[START_DATE]/[END_DATE]',
    ExportReportData = 'reports/exportreportdata/[REPORT_ID]/[SPRINT_ID]/[START_DATE]/[END_DATE]',

    DownloadReport = 'reports/downloadreport/[FILE_NAME]'
}

enum ApiUrlPlaceholder {
    ProjectId = '[PROJECT_ID]',
    MeetingId = '[MEETING_ID]',
    StoryId = '[STORY_ID]',
    TempGuid = '[Temp_Guid]',
    TaskId = '[TASK_ID]',
    SprintId = '[SPRINT_ID]',
    NoteType = '[NOTE_TYPE]',
    RecordId = '[RECORD_ID]',
    NoteId = '[NOTE_ID]',
    FileType = '[FILE_TYPE]',
    FileId = '[FILE_ID]',
    UserId = '[USER_ID]',
    TestScriptId = '[TEST_SCRIPT_ID]',
    StepId = '[STEP_ID]',
    StatusIds = '[STATUS_IDS]',
    ReportId = '[REPORT_ID]',
    TeamId = '[TEAM_ID]',
    FileName = '[FILE_NAME]',
    StartDate = '[START_DATE]',
    EndDate = '[END_DATE]'
}

class UrlHelper {
    static GetProjectsUrl(apiUrlEnum: ApiUrl, projectId: number) {
        return apiUrlEnum.replace(ApiUrlPlaceholder.ProjectId, `${projectId}`);
    }
    static GetMeetingsUrl(apiUrlEnum: ApiUrl, projectId: number, meetingId: number) {
        return apiUrlEnum.replace(ApiUrlPlaceholder.ProjectId, `${projectId}`)
            .replace(ApiUrlPlaceholder.MeetingId, `${meetingId}`);
    }
    static GetProjectStoriesUrl(apiUrlEnum: ApiUrl, projectId: number, storyId: number, statusIds: string = "", tempGuid: string = "") {
        return apiUrlEnum.replace(ApiUrlPlaceholder.ProjectId, `${projectId}`)
            .replace(ApiUrlPlaceholder.StoryId, `${storyId}`)
            .replace(ApiUrlPlaceholder.StatusIds, `${statusIds}`)
            .replace(ApiUrlPlaceholder.TempGuid, `${tempGuid}`);
    }
    static GetProjectStoryCopyToNextSprintUrl(apiUrlEnum: ApiUrl, projectId: number, storyId: number, sprintId: number) {
        return apiUrlEnum.replace(ApiUrlPlaceholder.ProjectId, `${projectId}`)
            .replace(ApiUrlPlaceholder.StoryId, `${storyId}`)
            .replace(ApiUrlPlaceholder.SprintId, `${sprintId}`);
    }
    static GetProjectStoriesOrderUpdateUrl(apiUrlEnum: ApiUrl, projectId: number) {
        return apiUrlEnum.replace(ApiUrlPlaceholder.ProjectId, `${projectId}`);
    }
    static GetStoryTasksUrl(apiUrlEnum: ApiUrl, storyId: number, taskId: number) {
        return apiUrlEnum.replace(ApiUrlPlaceholder.StoryId, `${storyId}`)
            .replace(ApiUrlPlaceholder.TaskId, `${taskId}`);
    }
    

    static GetSprintsUrl(apiUrlEnum: ApiUrl, sprintId: number) {
        return apiUrlEnum.replace(ApiUrlPlaceholder.SprintId, `${sprintId}`);
    }
    static GetSprintsUrlWithTeamId(apiUrlEnum: ApiUrl, teamId: string) {
        return apiUrlEnum.replace(ApiUrlPlaceholder.TeamId, `${teamId}`);
    }
    static GetNotesUrl(apiUrlEnum: ApiUrl, noteType: number, recordId: number, noteId: number) {
        return apiUrlEnum.replace(ApiUrlPlaceholder.NoteType, `${noteType}`)
            .replace(ApiUrlPlaceholder.RecordId, `${recordId}`)
            .replace(ApiUrlPlaceholder.NoteId, `${noteId}`);
    }
    static GetFilesUrl(apiUrlEnum: ApiUrl, fileType: number, recordId: number, fileId: number) {
        return apiUrlEnum.replace(ApiUrlPlaceholder.FileType, `${fileType}`)
            .replace(ApiUrlPlaceholder.RecordId, `${recordId}`)
            .replace(ApiUrlPlaceholder.FileId, `${fileId}`);
    }
    static GetUsersUrl(apiUrlEnum: ApiUrl, userId: string) {
        return apiUrlEnum.replace(ApiUrlPlaceholder.UserId, `${userId}`);
    }
    static GetTestScriptsUrl(apiUrlEnum: ApiUrl, testScriptId: number = 0, stepId: number = 0) {
        return apiUrlEnum.replace(ApiUrlPlaceholder.TestScriptId, `${testScriptId}`)
            .replace(ApiUrlPlaceholder.StepId, `${stepId}`);
    }

    static GetTestScriptsExportUrl(apiUrlEnum: ApiUrl, testScriptId: number = 0) {
        return apiUrlEnum.replace(ApiUrlPlaceholder.TestScriptId, `${testScriptId}`);
    }
    static GetTestScriptsExportDownloadUrl(apiUrlEnum: ApiUrl, filename: string) {
        return apiUrlEnum.replace(ApiUrlPlaceholder.FileName, `${filename}`);
    }

    static GetTestScriptsBulkUpdateUrl(apiUrlEnum: ApiUrl, testScriptId: number = 0) {
        return apiUrlEnum.replace(ApiUrlPlaceholder.TestScriptId, `${testScriptId}`);
    }

    static GetSprintCloseStoryHoursReportDataUrl(apiUrlEnum: ApiUrl, reportId: number, sprintId: number = null, startDate: Date = null, endDate: Date = null) {
        return apiUrlEnum
            .replace(ApiUrlPlaceholder.ReportId, `${reportId}`)
            .replace(ApiUrlPlaceholder.SprintId, `${sprintId}`)
            .replace(ApiUrlPlaceholder.StartDate, `${startDate}`)
            .replace(ApiUrlPlaceholder.EndDate, `${endDate}`);
    }

    static GetProductionSupportReportDataUrl(apiUrlEnum: ApiUrl, reportId: number, sprintId: number = null) {
        return apiUrlEnum
            .replace(ApiUrlPlaceholder.ReportId, `${reportId}`)
            .replace(ApiUrlPlaceholder.SprintId, `${sprintId}`);
    }

    static GetReportDownloadUrl(apiUrlEnum: ApiUrl, fileName: string) {
        return apiUrlEnum
            .replace(ApiUrlPlaceholder.FileName, `${fileName}`);
    }


}


