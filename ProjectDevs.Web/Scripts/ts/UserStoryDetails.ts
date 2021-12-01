/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/jqueryui/jqueryui.d.ts" />
/// <reference path="Models.ts" />
/// <reference path="Constants.ts" />
/// <reference path="Common.ts" />
/// <reference path="UserService.ts" />
/// <reference path="FileService.ts" />

$(function () {
    const MainProjectId: number = $('#MainProjectId').val();
    const MainStoryId: number = $('#MainStoryId').val();

    const apiService = new ApiService();
    const fileService = new FileService(false, apiService);
    const storyService = new StoryService(false, apiService,fileService, true);    
    const noteService = new NoteService(false, apiService, false);
    const ddlService = new DdlService(apiService);
    const taskService = new TaskService(false, apiService, ddlService, false, true, false);

    storyService.getStoryDetails(MainStoryId, MainProjectId);

    MainLoader.show();
    $.when(ddlService.setProjectsDdl(), ddlService.setStoryStatusesDdl(), ddlService.setSprintsDdl(), ddlService.setStoryTypesDdl())
        .always(() => MainLoader.hide());

    fileService.loadFiles(FileType.UserStories, MainStoryId);

    noteService.loadNotes(1, Constants.NestedAllPageSize, NoteType.UserStories, MainStoryId);

    ddlService.setTaskStatusesDdl();

    UserService.loadUsersForAutocomplete();

    const taskFilterModel: ITaskFilterModel = {
        ProjectId: MainProjectId,
        StoryId: MainStoryId,
        TaskStatus: 0,
        AssignedToUserId: null,
        TeamId:""
    }

    taskService.loadTasks(taskFilterModel, 1, Constants.NestedDefaultPageSize);

});