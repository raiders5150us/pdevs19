/// <reference path="Models.ts" />
/// <reference path="Constants.ts" />
/// <reference path="Common.ts" />
/// <reference path="UserService.ts" />

$(function () {
    const sprintId: number = $('#SprintId').val();

    const apiService = new ApiService();
    const ddlService = new DdlService(apiService);
    const sprintService = new SprintService(apiService,false);
    const fileService = new FileService(false, apiService);
    ddlService.setTeamsDdl();
    sprintService.getSprintDetails(sprintId);

    MainLoader.show();
    fileService.loadFiles(FileType.Sprints, sprintId);
    
    //const taskFilterModel: ITaskFilterModel = {
    //    ProjectId: MainProjectId,
    //    StoryId: MainStoryId,
    //    TaskStatus: 0,
    //    AssignedToUserId: null,
    //    TeamId: ""
    //}

    //taskService.loadTasks(taskFilterModel, 1, Constants.NestedDefaultPageSize);

});