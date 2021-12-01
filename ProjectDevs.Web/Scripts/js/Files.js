/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="Models.ts" />
/// <reference path="Constants.ts" />
/// <reference path="Common.ts" />
/// <reference path="UserService.ts" />
$(function () {
    var MainProjectId = $('#MainProjectId').val() || 0;
    var MainFileType = $('#MainFileType').val() || 0;
    var MainRecordId = $('#MainRecordId').val() || 0;
    var isMyPage = $('#IsMyPage').val() === 'True';
    var apiService = new ApiService();
    var fileService = new FileService(isMyPage, apiService, true);
    var ddlService = new DdlService(apiService);
    var cookieUtils = new CookieUtils(apiService);
    fileService.projectFilesFilterModel.projectId = MainProjectId;
    var selectedTeams = cookieUtils.getCookie(Constants.TeamSelectionCookieName);
    ddlService.setProjectsDdl(true, function () {
        if (MainProjectId > 0) {
            $('#filter-project-id').val(MainProjectId);
            setTimeout(function () { return fileService.loadProjectFiles(); }, 500);
        }
    });
    ddlService.setTeamsDdl(false, function () {
        var projectId = $('#filter-project-id').val() || 0;
        MainLoader.show();
        $.when(ddlService.setProjectsDdl(true, null, selectedTeams))
            .done(function () { return setTimeout(function () {
            fileService.projectFilesFilterModel.projectId = projectId;
            fileService.projectFilesFilterModel.teamId = selectedTeams;
            fileService.loadProjectFiles();
        }, 200); })
            .always(function () { return MainLoader.hide(); });
    }, selectedTeams);
    $('#filter-team-id').select2({
        placeholder: 'Select',
        width: null,
        containerCssClass: ':all:'
    });
    $(document).on('change', '#filter-team-id', function (e) {
        var projectId = $('#filter-project-id').val() || 0;
        var teamId = "0";
        if ($('#filter-team-id').select2('data')) {
            teamId = $('#filter-team-id').select2('data').map(function (a) { return a.id; }).toString();
            cookieUtils.setCookie(Constants.TeamSelectionCookieName, teamId);
        }
        MainLoader.show();
        $.when(ddlService.setProjectsDdl(true, null, teamId))
            .done(function () { return setTimeout(function () {
            fileService.projectFilesFilterModel.projectId = projectId;
            fileService.projectFilesFilterModel.teamId = teamId;
            fileService.loadProjectFiles();
        }, 200); })
            .always(function () { return MainLoader.hide(); });
    });
    $('#filter-project-id').change(function () {
        var projectId = $(this).val() || 0;
        fileService.projectFilesFilterModel.projectId = projectId;
        fileService.loadProjectFiles();
    });
    if (!(UserTokenHandler.isSuperUser())) {
        $("[files-ap-action-file-modal-form]").hide();
    }
});
//# sourceMappingURL=Files.js.map