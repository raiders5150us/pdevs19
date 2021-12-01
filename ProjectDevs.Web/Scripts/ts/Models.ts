
interface ITokenModel {
    Token: string;
    ExpiryMiliseconds: number;
}
interface UserTokenModel {
    Token: ITokenModel;
    User: IProjectUser
}
interface IPaginationModel {
    TotalPages: number,
    CurrentPageNumber: number,
    PageSize: number,
    IsLastPage: boolean,
}
interface IDdlModel {
    Value: string | number | boolean,
    Text: string
}
interface IDashboardSummary {
    Date: Date;
    ActiveProjects: number;
    AverageStoriesCompletedPerSprint: number;
    AverageTimeToCompletionPerStory: number;
    ProjectedHoursToActualHours: number;
    TestScriptFirstAttemptPassRate: number;
    IssuesReportedPerStory: number;
}
interface IStoryHour {
    StoryId?: number;
    ProjectedHours: number;
    ActualHours: number;
}
interface IPagingModel<T> {
    Count: number;
    CurrentPageNumber: number;
    PageSize: number;
    Data: T[];
    HasMoreRows: boolean;
    IsLastPage: boolean;
    AdditionalData?: any;
}

interface IProjectDto {
    ProjectId: number;
    ProjectName: string;
    ProjectType: string;
    MeetingSchedule: string;
    RequestDate?: Date;
    RequestedByDate?: Date;
    CompletedDate?: Date;
    StartDate?: Date;
    PriorityRanking?: number;

    ProjectStatusId: number;
    ProductOwnerId: string;
    ProjectManagerId: string;
    LeadDeveloperId: string;
    BusinessAnalystId: string;
    StakeHolderIds: string[];

    ProjectStatus: string;
    ProductOwner: string;
    ProjectManager: string;
    LeadDeveloper: string;
    BusinessAnalyst: string;
    Stakeholders: string[];

    StakeholderIdNames: [],
    TeamID: number,
    TeamName: string,
    ProjectAbbreviation: string,
    NextNumber?: number
}

interface IRotaSuppDto {
    Sr: number;
    Title: string;
    Desc: string
    Start_Date: string;
    End_Date: string;
}

interface IProjectMeetingDto {
    MeetingId: number;
    Purpose: string;
    MeetingDate?: Date;
    MeetingTime: string;
    ProjectId: number;
    AttendeeIds: string[]
    ProjectName: string;
    AttendeeNames: string[];
    CreatedByUserId: string;
    CreatedByUserName: string
    AttendeeIdNames: []
}

interface IProjectStoryDisplayDto {
    StoryId: number;
    F1: string;
    F2: string;
    F3: string;
    StoryName: string;
    AcceptanceCriteria: string;
    RequestDate?: Date;
    RequesterTargetDate?: Date;
    GroomingCompleteDate?: Date;
    ProdTargetDate?: Date;
    StartDate?: Date;
    EndDate?: Date;
    Environment: string;
    PriorityRanking?: number;
    ProjectId: number;
    ProjectName: string;
    StoryStatusName: string;
    RequesterName: string;
    AssigneeName: string;
    StoryStatusId: number;
    RequesterId: string;
    AssigneeId: string;
    StoryTypeId?: number;
    StoryTypeName?: string;
    SprintIdNames: [];
    ProjectedHours?: number;
    ActualHours?: number;
    Notes: [string]
}
interface IProjectFile {
    FileId: number;
    FileTypeId: number;
    AssociatedRecordId: number;
    FileName: string;
    FileLocation: string;
    CreatedByUserId: string;
    CreatedOn: Date
}

interface IProjectNote {
    NoteId: number;
    NoteTypeId: number;
    ParentId: number;
    Note: string;
    CreatedByUserId: string;
    CreatedByUser?: string;
    CreatedOn: Date;
    ModifiedOn?: Date
}

interface ISprint {
    SprintId: number;
    TeamID: number;
    TeamName: string;
    SprintName: string;
    StartDate: Date
    EndDate: Date;
    TotalStories: number;
    CompletedStories: number;
    ChangeNumber: string;
    SprintRetrospective: string;
    IsClosed: boolean;
}

interface ISprintResult {
    SprintId: number;
    SprintName: string;
    TeamID: number;
    TeamName: string;
    StartDate: Date
    EndDate: Date;
    TotalStories: number;
    CompletedStories: number;
    PercentageComplete: number;
}

interface IStoryTask {
    TaskId: number;
    StoryId: number;
    TaskStatus: number;
    TaskName: string;
    TaskDescription: string;
    TaskType: string;
    AssignedToUserId: string;
    ProjectedHours?: number;
    ActualHours?: number;
    HoursWorked?: number;
    TaskStatusName?: string;
    AssigneeName?: string;
    ProjectId?: number;
    TicketNumber?: string;
    Changeset?: number;
    LOB: string;
}
interface IProjectUser {
    UserId: string;
    FirstName: string;
    LastName: string;
    ManagerId: string;
    IsDeveloper: number;//boolean
    IsActive: number;//boolean
    IsSuperUser: number;//boolean
    FullName: string;
}

interface ITestScriptDto {
    TestScriptId: number;
    StoryId: number;
    TestScriptStatus: number;
    CreatedByUserId: string;
    RequestDate?: Date;
    AssignedToUserId?: string;
    RequestedByDate?: Date;

    StoryF1: string;
    StoryF2: string;
    StoryF3: string;
    TestScriptStatusName: string;
    CreatedByUserName: string;
    DeveloperName: string;
    DevManagerName: string;
    BusinessAnalystName: string;
    BusinessStakeholderName: string;

    ProjectId?: number;
    ProjectName?: string;

    LastModifiedOn: Date;
    LastModifiedBy: string;
    LastModifiedByName: string;
    AssigneeMappings: ITestScriptAssigneeMappingsDto[],

    StoryName: string

}
enum TestScriptAssigneeMappingUserTypes {
    Developer = 1,
    DevManager = 2,
    BusinessAnalyst = 3,
    BusinessStakeholder = 4
}

interface ITestScriptAssigneeMappingsDto {
    FullName: string;
    AssignedToUserId: string;
    TestScriptStatus: number;
    UserType: string;
}

interface ITestScriptStepDto {
    StepId: number;
    TestScriptId: number;
    StepNumber: number;
    Action: string;
    ExpectedResults: string;

    DeveloperStepStatusId: string;
    DevMgrStepStatusId: string;
    BizAnalystStepStatusId: string;
    BizRequesterStepStatusId: string;


    Notes: string;
    TestScriptStatus?: number;
    TestScriptStatusName?: string;
    Editable?: boolean
}

interface ITaskFilterModel {
    ProjectId?: number;
    StoryId?: number;
    TeamId: string;
    TaskStatus?: number;
    AssignedToUserId?: string
}
interface INotification {
    NotificationId: number;
    UserId: string;
    Text: string;
    Hyperlink?: string
    Seen: boolean;
    CreatedOn: Date;
}
interface IStoriesWithoutEndDate {
    StoryId: number;
    StoryName: string;
    ProjectId: number;
    StoryStatus: number;
    F1: string;
    F2: string;
    F3: string;
    AcceptanceCriteria?: string;
    RequesterId?: string;
    RequestDate?: Date;
    StartDate?: Date;
    EndDate?: Date;
    AssignedToUserId?: string;
    Environment: string;
    PriorityRanking?: number;
    StoryTypeId?: number;
    ProjectName: string;
    StoryStatusName: string;
    ProjectPriorityRanking?: number;

    AssignedToUserName: string;
}

interface ISearchModel {
    ProjectId?: number;
    ProjectName?: string;
    MeetingSchedule?: string;
    IsProject?: boolean;
    StoryId?: number;
    F1?: string;
    F2?: string;
    F3?: string;
    AcceptanceCriteria?: string;
    IsStory?: boolean;
    TaskId?: number;
    TaskName?: string;
    TaskDescription?: string;
    TicketNumber?: string;
    IsTask?: boolean;
    NoteId?: number;
    Note?: string;
    IsNote?: boolean;
    MeetingId?: number;
    Purpose?: string;
    MeetingTime?: string;
    IsMeeting?: boolean;
    FileId?: number;
    FileName?: string;
    FileLocation?: string;
    IsFile?: boolean;
    IsTestScript?: boolean;
    TestScriptId?: number;
}

interface IApiLog {
    Level: string;
    CallSite: string;
    Type: string;
    Message: string;
    StackTrace: string;
    InnerException: string;
    AdditionalInfo: string;
    LoggedOnDate: Date
}

interface IReportSprintCloseStoryHours {
    Id: number;
    FirstName: string;
    StoryName: string;
    StartDate: Date;
    EndDate: Date;
    F1: string;
    F2: string;
    F3: string;
    TaskId: number;
    TaskName: string;
    ProjectedHours: number;
    HoursWorked: number;
    TotalActualHours: number;
}
interface IReportProductionSupport {
    StoryId: number;
    ProjectId: number;
    ProjectName: string;
    StoryStatus: number;
    StoryStatusName: string;
    F1: string;
    F2: string;
    F3: string;
    AcceptanceCriteria: string;
    RequesterID: string;
    RequesterName: string;
    RequestDate: Date;
    StartDate: Date;
    EndDate: Date;
    AssignedToUserID: string;
    AssignedToName: string;
    Environment: string;
    PriorityRanking: number;
    StoryTypeId: number;
    RequesterTargetDate: Date;
    GroomingCompleteDate: Date;
    ProdTargetDate: Date;
    StoryName: string;
    Note: string;
}
interface IReportProductionRelease {
    StoryId: number;
    ProjectId: number;
    ProjectName: string;
    StoryStatus: number;
    StoryStatusName: string;
    F1: string;
    F2: string;
    F3: string;
    AcceptanceCriteria: string;
    RequesterID: string;
    RequesterName: string;
    RequestDate: Date;
    StartDate: Date;
    EndDate: Date;
    AssignedToUserID: string;
    AssignedToName: string;
    Environment: string;
    PriorityRanking: number;
    StoryTypeId: number;
    RequesterTargetDate: Date;
    GroomingCompleteDate: Date;
    ProdTargetDate: Date;
    StoryName: string;
    Note: string;
}