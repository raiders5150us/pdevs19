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
    var isMyPage = $('#IsMyPage').val() === 'True';
    var apiService = new ApiService();
    var fileService = new FileService(false, apiService);
    var storyService = new StoryService(isMyPage, apiService, fileService, false);
    var ddlService = new DdlService(apiService);
    var cookieUtils = new CookieUtils(apiService);
    var selectedTeams = cookieUtils.getCookie(Constants.TeamSelectionCookieName);
    MainLoader.show();
    $.when(ddlService.setTeamsDdl(false, function () {
        MainLoader.show();
        $.when(ddlService.setProjectsDdl(true, null, selectedTeams))
            .done(function () { return setTimeout(function () { return filterStoriesByRequesterAssignee(); }, 1000); })
            .always(function () { return MainLoader.hide(); });
    }, selectedTeams), ddlService.setStoryStatusesDdl(), ddlService.setSprintsDdl(), ddlService.setStoryTypesDdl())
        .done(function () { return setTimeout(function () { return initilLoadStories(); }, 1000); })
        .always(function () { return MainLoader.hide(); });
    UserService.loadUsersForAutocomplete(null, null, null, function () { return filterStoriesByRequesterAssignee(); });
    function initilLoadStories() {
        var qsProjectId = QueryStrings.get('projectId');
        if (qsProjectId) {
            var projectId = parseInt("" + qsProjectId);
            $('#filter-project-id').val(projectId);
        }
        filterStoriesByRequesterAssignee();
    }
    $('#filter-project-id').change(function () {
        var projectId = $(this).val() || 0;
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
        var projectId = $('#filter-project-id').val() || 0;
        var storyTeamId = "0";
        if ($('#filter-team-id').select2('data')) {
            storyTeamId = $('#filter-team-id').select2('data').map(function (a) { return a.id; }).toString();
        }
        if (projectId <= 0 && (storyTeamId == "0" || storyTeamId == "")) {
            if (!isMyPage) {
                storyService.clearStories();
                return false;
            }
        }
        var storyStatusId = "";
        if ($('#filter-story-status-id').select2('data')) {
            storyStatusId = $('#filter-story-status-id').select2('data').map(function (a) { return a.id; }).toString();
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
    $('#filter-team-id').change(function () {
        var storyTeamId = "0";
        if ($('#filter-team-id').select2('data')) {
            storyTeamId = $('#filter-team-id').select2('data').map(function (a) { return a.id; }).toString();
            cookieUtils.setCookie(Constants.TeamSelectionCookieName, storyTeamId);
        }
        MainLoader.show();
        $.when(ddlService.setProjectsDdl(true, null, storyTeamId))
            .done(function () { return setTimeout(function () { return filterStoriesByRequesterAssignee(); }, 1000); })
            .always(function () { return MainLoader.hide(); });
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
//# sourceMappingURL=UserStories.js.map