/// <reference path="Models.ts" />
/// <reference path="Constants.ts" />
/// <reference path="Common.ts" />
/// <reference path="UserService.ts" />
$(function () {
    var sprintId = $('#SprintId').val();
    var apiService = new ApiService();
    var ddlService = new DdlService(apiService);
    var sprintService = new SprintService(apiService, false);
    var fileService = new FileService(false, apiService);
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
//# sourceMappingURL=SprintDetail.js.map