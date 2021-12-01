/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/jqueryui/jqueryui.d.ts" />
/// <reference path="Models.ts" />
/// <reference path="Constants.ts" />
/// <reference path="Common.ts" />
/// <reference path="UserService.ts" />
/// <reference path="FileService.ts" />
$(function () {
    var MainProjectId = $('#MainProjectId').val();
    var MainStoryId = $('#MainStoryId').val();
    var apiService = new ApiService();
    var fileService = new FileService(false, apiService);
    var storyService = new StoryService(false, apiService, fileService, true);
    var noteService = new NoteService(false, apiService, false);
    var ddlService = new DdlService(apiService);
    var taskService = new TaskService(false, apiService, ddlService, false, true, false);
    storyService.getStoryDetails(MainStoryId, MainProjectId);
    MainLoader.show();
    $.when(ddlService.setProjectsDdl(), ddlService.setStoryStatusesDdl(), ddlService.setSprintsDdl(), ddlService.setStoryTypesDdl())
        .always(function () { return MainLoader.hide(); });
    fileService.loadFiles(FileType.UserStories, MainStoryId);
    noteService.loadNotes(1, Constants.NestedAllPageSize, NoteType.UserStories, MainStoryId);
    ddlService.setTaskStatusesDdl();
    UserService.loadUsersForAutocomplete();
    var taskFilterModel = {
        ProjectId: MainProjectId,
        StoryId: MainStoryId,
        TaskStatus: 0,
        AssignedToUserId: null,
        TeamId: ""
    };
    taskService.loadTasks(taskFilterModel, 1, Constants.NestedDefaultPageSize);
});
//# sourceMappingURL=UserStoryDetails.js.map