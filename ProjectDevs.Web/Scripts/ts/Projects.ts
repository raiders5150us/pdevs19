/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/jqueryui/jqueryui.d.ts" />
/// <reference path="Models.ts" />
/// <reference path="Constants.ts" />
/// <reference path="Common.ts" />
/// <reference path="ProjectService.ts" />
/// <reference path="UserService.ts" />
/// <reference path="CookieUtils.ts" />

$(function () {
    const isMyPage: boolean = $('#IsMyPage').val() === 'True';
    const apiService = new ApiService();
    let selectedStakeholders: { id: string, name: string }[] = [];

    
    const projectService = new ProjectService(isMyPage, apiService, false, selectedStakeholders);
    const ddlService = new DdlService(apiService);

    //projectService.loadProjects();

    ddlService.setProjectStatusesDdl();
    //ddlService.setTeamsDdl();
    const cookieUtils = new CookieUtils(apiService);

    MainLoader.show();
    const selectedTeams = cookieUtils.getCookie(Constants.TeamSelectionCookieName);

    $.when(ddlService.setTeamsDdl(false, null, selectedTeams))
        .done(() => setTimeout(() => {
            filterProjects();
        }, 1000))
        .always(() => MainLoader.hide());

    UserService.loadUsersForAutocomplete(selectedStakeholders, 'stakeholder-txt', $('#stakeholders-box-list'));

    function filterProjects() {              
        let storyTeamId: string = "";
        if ($('#filter-team-id').select2('data')) {            
            storyTeamId = $('#filter-team-id').select2('data').map(a => a.id).toString();            
            cookieUtils.setCookie(Constants.TeamSelectionCookieName, storyTeamId);
        }
        else {
            storyTeamId = "0";
        }



        let statusId: string = "";
        if ($('#filter-status-id').select2('data')) {
            statusId = $('#filter-status-id').select2('data').map(a => a.id).toString();
        }
        else {
            statusId = "0";
        }

        projectService.projectFilterModel.storyTeamId = storyTeamId;
        projectService.projectFilterModel.statusId = statusId;
        projectService.loadProjects();
    }
    $(document).on("change", '#filter-team-id', function () {
        
        filterProjects();
    });
    $(document).on("change", '#filter-status-id', function () { filterProjects(); });
    $('#filter-team-id').select2({
        placeholder: 'Select Team'        
    });

    $('#filter-status-id').select2({
        placeholder: 'Select Status'
    });

    if (UserTokenHandler.isSuperUser()) {
        $("[ap-action-project-modal-form]").removeAttr("disabled");
    }
    else {
        $("[ap-action-project-modal-form]").attr("disabled", "disabled");
    }
});