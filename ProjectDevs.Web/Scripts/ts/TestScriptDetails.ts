/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="Models.ts" />
/// <reference path="Constants.ts" />
/// <reference path="Common.ts" />
/// <reference path="UserService.ts" />
/// <reference path="FileService.ts" />

$(function () {  

    const MainStoryId: number = $('#MainStoryId').val() || 0;
    const MainTestScriptId: number = $('#MainTestScriptId').val();

    if (MainStoryId <= 0 || MainTestScriptId <= 0) {
        Alerts.Error('Invalid Link', 'Error', () => location.href = WebUrl.Dashboard);
        return false;
    }

    const apiService = new ApiService();
    const ddlService = new DdlService(apiService);
    const fileService = new FileService(false, apiService);
    const testScriptService = new TestScriptService(apiService, ddlService,fileService, true);
    

    testScriptService.getTestScriptDetails(MainTestScriptId);
    testScriptService.loadTestScriptSteps(MainTestScriptId);

    ddlService.setProjectsDdl();
    ddlService.setTestScriptStatusesDdl();
    UserService.loadUsersForAutocomplete();

    $(document).on('hide.bs.modal', e => {
        testScriptService.getTestScriptDetails(MainTestScriptId);
    });
});