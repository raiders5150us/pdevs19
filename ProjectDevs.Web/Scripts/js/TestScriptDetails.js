/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="Models.ts" />
/// <reference path="Constants.ts" />
/// <reference path="Common.ts" />
/// <reference path="UserService.ts" />
/// <reference path="FileService.ts" />
$(function () {
    var MainStoryId = $('#MainStoryId').val() || 0;
    var MainTestScriptId = $('#MainTestScriptId').val();
    if (MainStoryId <= 0 || MainTestScriptId <= 0) {
        Alerts.Error('Invalid Link', 'Error', function () { return location.href = WebUrl.Dashboard; });
        return false;
    }
    var apiService = new ApiService();
    var ddlService = new DdlService(apiService);
    var fileService = new FileService(false, apiService);
    var testScriptService = new TestScriptService(apiService, ddlService, fileService, true);
    testScriptService.getTestScriptDetails(MainTestScriptId);
    testScriptService.loadTestScriptSteps(MainTestScriptId);
    ddlService.setProjectsDdl();
    ddlService.setTestScriptStatusesDdl();
    UserService.loadUsersForAutocomplete();
    $(document).on('hide.bs.modal', function (e) {
        testScriptService.getTestScriptDetails(MainTestScriptId);
    });
});
//# sourceMappingURL=TestScriptDetails.js.map