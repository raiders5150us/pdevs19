/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="Models.ts" />
/// <reference path="Constants.ts" />
/// <reference path="Common.ts" />
/// <reference path="UserService.ts" />

$(function () {
    const MainProjectId: number = $('#MainProjectId').val() || 0;
    const MainFileType: number = $('#MainFileType').val() || 0;
    const MainRecordId: number = $('#MainRecordId').val() || 0;
    const isMyPage: boolean = $('#IsMyPage').val() === 'True';

    const apiService = new ApiService();

    const fileService = new FileService(isMyPage, apiService, true);
    const ddlService = new DdlService(apiService);
    const cookieUtils = new CookieUtils(apiService);

    fileService.projectFilesFilterModel.projectId = MainProjectId;
    const selectedTeams = cookieUtils.getCookie(Constants.TeamSelectionCookieName);

    ddlService.setProjectsDdl(true, () => {
        if (MainProjectId > 0) {
            $('#filter-project-id').val(MainProjectId);
            setTimeout(() => fileService.loadProjectFiles(), 500);
        }
    });
    ddlService.setTeamsDdl(false, function () {
        const projectId = $('#filter-project-id').val() || 0;
        MainLoader.show();
        $.when(ddlService.setProjectsDdl(true, null, selectedTeams))
            .done(() => setTimeout(() => {
                fileService.projectFilesFilterModel.projectId = projectId;
                fileService.projectFilesFilterModel.teamId = selectedTeams;
                fileService.loadProjectFiles();
            }, 200))
            .always(() => MainLoader.hide());
    }, selectedTeams);

    $('#filter-team-id').select2({
        placeholder: 'Select',
        width: null,
        containerCssClass: ':all:'
    });
    $(document).on('change', '#filter-team-id', function (e) {
        const projectId = $('#filter-project-id').val() || 0;
        let teamId: string = "0";
        if ($('#filter-team-id').select2('data')) {
            teamId = $('#filter-team-id').select2('data').map(a => a.id).toString();
            cookieUtils.setCookie(Constants.TeamSelectionCookieName, teamId);
        }

        MainLoader.show();
        $.when(ddlService.setProjectsDdl(true, null, teamId))
            .done(() => setTimeout(() => {
                fileService.projectFilesFilterModel.projectId = projectId;
                fileService.projectFilesFilterModel.teamId = teamId;
                fileService.loadProjectFiles();
            }, 200))
            .always(() => MainLoader.hide());
    });

    $('#filter-project-id').change(function () {
        const projectId = $(this).val() || 0;
        fileService.projectFilesFilterModel.projectId = projectId;
        fileService.loadProjectFiles();
    });

    if (!(UserTokenHandler.isSuperUser())) {
        $("[files-ap-action-file-modal-form]").hide();
    }
});