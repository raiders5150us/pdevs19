/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="Models.ts" />
/// <reference path="Constants.ts" />
/// <reference path="Common.ts" />
/// <reference path="UserService.ts" />

$(function () {
    const MainStoryId: number = $('#MainStoryId').val();
    const MainTaskId: number = $('#MainTaskId').val();

    const apiService = new ApiService();

    const ddlService = new DdlService(apiService);
    const taskService = new TaskService(false, apiService, ddlService, true, false, false);
    const fileService = new FileService(false, apiService);
    const noteService = new NoteService(false, apiService, false);

    taskService.getTaskDetails(MainStoryId, MainTaskId);

    fileService.loadFiles(FileType.Tasks, MainTaskId);

    noteService.loadNotes(1, Constants.NestedAllPageSize, NoteType.Tasks, MainTaskId);

    ddlService.setTaskStatusesDdl(MainStoryId);

    ddlService.setProjectsDdl();

    UserService.loadUsersForAutocomplete();
});