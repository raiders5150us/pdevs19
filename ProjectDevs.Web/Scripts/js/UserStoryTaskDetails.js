/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="Models.ts" />
/// <reference path="Constants.ts" />
/// <reference path="Common.ts" />
/// <reference path="UserService.ts" />
$(function () {
    var MainStoryId = $('#MainStoryId').val();
    var MainTaskId = $('#MainTaskId').val();
    var apiService = new ApiService();
    var ddlService = new DdlService(apiService);
    var taskService = new TaskService(false, apiService, ddlService, true, false, false);
    var fileService = new FileService(false, apiService);
    var noteService = new NoteService(false, apiService, false);
    taskService.getTaskDetails(MainStoryId, MainTaskId);
    fileService.loadFiles(FileType.Tasks, MainTaskId);
    noteService.loadNotes(1, Constants.NestedAllPageSize, NoteType.Tasks, MainTaskId);
    ddlService.setTaskStatusesDdl(MainStoryId);
    ddlService.setProjectsDdl();
    UserService.loadUsersForAutocomplete();
});
//# sourceMappingURL=UserStoryTaskDetails.js.map