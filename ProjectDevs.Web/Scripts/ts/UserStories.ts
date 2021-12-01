/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/jqueryui/jqueryui.d.ts" />
/// <reference path="Models.ts" />
/// <reference path="Constants.ts" />
/// <reference path="Common.ts" />
/// <reference path="UserService.ts" />
/// <reference path="StoryService.ts" />
/// <reference path="FileService.ts" />
/// <reference path="NoteService.ts" />

$(function () {

    const isMyPage: boolean = $('#IsMyPage').val() === 'True';
    const apiService = new ApiService();
    const fileService = new FileService(false, apiService);
    const storyService = new StoryService(isMyPage, apiService,fileService, false);
    const ddlService = new DdlService(apiService);
    const cookieUtils = new CookieUtils(apiService);
    const selectedTeams = cookieUtils.getCookie(Constants.TeamSelectionCookieName);

    MainLoader.show();
    $.when(ddlService.setTeamsDdl(false, function () {
        MainLoader.show();
        $.when(ddlService.setProjectsDdl(true, null, selectedTeams))
            .done(() => setTimeout(() => filterStoriesByRequesterAssignee(), 1000))
            .always(() => MainLoader.hide());
        }, selectedTeams)

        , ddlService.setStoryStatusesDdl(), ddlService.setSprintsDdl(), ddlService.setStoryTypesDdl())
        .done(() => setTimeout(() => initilLoadStories(),1000))
        .always(() => MainLoader.hide());

    UserService.loadUsersForAutocomplete(null, null, null, () => filterStoriesByRequesterAssignee());

    function initilLoadStories() {
        const qsProjectId = QueryStrings.get('projectId');
        if (qsProjectId) {
            const projectId: number = parseInt(`${qsProjectId}`);
            $('#filter-project-id').val(projectId);
        }        
        filterStoriesByRequesterAssignee();
    }

    $('#filter-project-id').change(function () {
        const projectId: number = $(this).val() || 0;
        $('#story-project-id').val(projectId);
        filterStoriesByRequesterAssignee();
    });
    $('#filter-story-status-id').change(filterStoriesByRequesterAssignee);
    
    $('#filter-story-status-id').select2({
        placeholder: 'Select',
        width: null,
        containerCssClass: ':all:'
    });

    function filterStoriesByRequesterAssignee() {       
        const projectId: number = $('#filter-project-id').val() || 0;
        let storyTeamId: string = "0";
        if ($('#filter-team-id').select2('data')) {
            storyTeamId = $('#filter-team-id').select2('data').map(a => a.id).toString();
        }
        
        if (projectId <= 0 && (storyTeamId=="0" || storyTeamId=="")) {
            if (!isMyPage) {
                storyService.clearStories();
                return false;
            }
        }

        let storyStatusId: string = "";
        if ($('#filter-story-status-id').select2('data')) {
            storyStatusId = $('#filter-story-status-id').select2('data').map(a => a.id).toString();
        }
        else {
            storyStatusId = "0";
        }
        
        storyService.storyFilterModel.projectId = projectId;
        storyService.storyFilterModel.storyStatusId = storyStatusId;
        storyService.storyFilterModel.storyTeamId = storyTeamId;
        storyService.storyFilterModel.assignedToUserId = $('#filter-assignee-id').val() || null;
        storyService.loadStories(1, Constants.DefaultPageSize, true);
    }


    $('#filter-team-id').change(() => {
        let storyTeamId: string = "0";
        if ($('#filter-team-id').select2('data')) {
            storyTeamId = $('#filter-team-id').select2('data').map(a => a.id).toString();
            cookieUtils.setCookie(Constants.TeamSelectionCookieName, storyTeamId);
        }

        MainLoader.show();
        $.when(ddlService.setProjectsDdl(true,null,storyTeamId))
            .done(() => setTimeout(() => filterStoriesByRequesterAssignee(), 1000))
            .always(() => MainLoader.hide());
    });

    $('#filter-team-id').select2({
        placeholder: 'Select',
        width: null,
        containerCssClass: ':all:'
    });
    



    $('#filter-assignee-name').blur(function () {
        if ($('#filter-assignee-id').val() && !$(this).val()) {
            $('#filter-assignee-id').val('');
            filterStoriesByRequesterAssignee();
        }
    });

    if (!(UserTokenHandler.isSuperUser())) {
        $("[ap-action-story-modal-form]").hide();
    }
});

