/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="Models.ts" />
/// <reference path="Constants.ts" />
/// <reference path="Common.ts" />
/// <reference path="UserService.ts" />
/// <reference path="FileService.ts" />
$(function () {
    var apiService = new ApiService();
    var ddlService = new DdlService(apiService);
    var fileService = new FileService(false, apiService);
    var testScriptService = new TestScriptService(apiService, ddlService, fileService, false);
    var cookieUtils = new CookieUtils(apiService);
    var MainStoryId = $('#MainStoryId').val() || 0;
    var selectedTeams = cookieUtils.getCookie(Constants.TeamSelectionCookieName);
    var filterProjectId = 0;
    var filterStoryId = MainStoryId;
    var filterStoryStatusId = "0";
    var $this = this;
    $this.apiService = apiService;
    function loadTestScripts(pno) {
        if (pno === void 0) { pno = 1; }
        var storyTeamId = "0";
        if ($('#filter-team-id').select2('data')) {
            storyTeamId = $('#filter-team-id').select2('data').map(function (a) { return a.id; }).toString();
        }
        testScriptService.loadTestScrips(filterProjectId, filterStoryId, storyTeamId, pno);
    }
    $('#filter-team-id').select2({
        placeholder: 'Select',
        width: null,
        containerCssClass: ':all:'
    });
    $("#filter-story-id1").select2({
        delay: 500,
        placeholder: "Story",
        allowClear: true,
        ajax: {
            transport: function (params, success, failure) {
                var storyDdlUrl = UrlHelper.GetProjectStoriesUrl(ApiUrl.ProjectStoriesDdl, filterProjectId, null, filterStoryStatusId);
                storyDdlUrl += "?q=" + params.data.q;
                $this.apiService.get(storyDdlUrl)
                    .done(function (s) {
                    if (s.length > 0) {
                        var results = s.map(function (a) {
                            return { id: a.Value, text: a.Text };
                        });
                        var obj = { results: results, pagination: false };
                        success(obj);
                    }
                    else {
                        success({
                            results: [],
                            pagination: false
                        });
                    }
                });
                //var $request = $.ajax(params);
                //$request.then(success);
                //$request.fail(failure);
                //return $request;
            }
        },
        escapeMarkup: function (markup) { return markup; },
        minimumInputLength: 2,
    }).on("change", function (e) {
        filterStoryId = $("#filter-story-id1").val() | 0;
        loadTestScripts();
    });
    $(document).on('change', '#filter-team-id', function (e) {
        var storyTeamId = "0";
        filterStoryId = 0;
        testScriptService.clearTestScripts();
        if ($('#filter-team-id').select2('data')) {
            storyTeamId = $('#filter-team-id').select2('data').map(function (a) { return a.id; }).toString();
            cookieUtils.setCookie(Constants.TeamSelectionCookieName, storyTeamId);
        }
        $('#test-script-project-ddl').empty();
        $('#filter-story-id').empty();
        $('#filter-story-status-id').empty();
        MainLoader.show();
        $.when(ddlService.setProjectsDdl(true, null, storyTeamId))
            .always(function () { return MainLoader.hide(); });
    });
    $(document).on('click', '#test-scripts-paging-container a[data-pno]', function (e) {
        var btn = $(this);
        var pNo = btn.data('pno') || 0;
        if (pNo > 0) {
            loadTestScripts(pNo);
        }
    });
    UserService.loadUsersForAutocomplete();
    var storyDdl = $('#filter-story-id');
    $('#filter-project-id').change(function () {
        filterProjectId = $(this).val() || 0;
        filterStoryId = 0;
        storyDdl.empty();
        testScriptService.clearTestScripts();
        ddlService.setStoriesDdl(filterProjectId, storyDdl, true);
        $('#filter-story-status-id').empty();
        //ddlService.setStoriesDdl(filterProjectId, $('#test-script-story-ddl'));
        if (filterProjectId != null && filterProjectId.toString() != "0") {
            ddlService.setStoryStatusesDdl(filterProjectId, false, null, true);
            //ddlService.setStoriesDdl(filterProjectId, storyDdl);
            loadTestScripts();
        }
        $('#test-script-project-ddl').val(filterProjectId);
        testScriptService.selectedProjectId = filterProjectId;
        if (filterProjectId != null && filterProjectId.toString() != "0") {
            var projectDetailUrl = UrlHelper.GetProjectsUrl(ApiUrl.ProjectDetail, filterProjectId);
            apiService.get(projectDetailUrl)
                .done(function (project) {
                if (!(UserTokenHandler.isSuperUser() || UserTokenHandler.isUserStakeholderOrOwnerForProject(project))) {
                    $("[ap-action-test-script-modal-form]").hide();
                }
                else {
                    $("[ap-action-test-script-modal-form]").show();
                }
            });
        }
    });
    $('#filter-story-status-id').change(function () {
        filterStoryId = 0;
        if ($('#filter-story-status-id').select2('data')) {
            filterStoryStatusId = $('#filter-story-status-id').select2('data').map(function (a) { return a.id; }).toString();
        }
        else {
            filterStoryStatusId = "";
        }
        //if (filterStoryStatusId != "") {
        //    ddlService.setStoriesDdl(filterProjectId, storyDdl, false, null, filterStoryStatusId,);
        //}
        //else {
        //    ddlService.setStoriesDdl(filterProjectId, storyDdl);
        //}
        loadTestScripts();
    });
    ddlService.setProjectsDdl();
    ddlService.setTeamsDdl(false, function () {
        //MainLoader.show();
        //$.when(ddlService.setProjectsDdl(true, null, selectedTeams))
        //    .done(() => setTimeout(() => {
        //        debugger;
        //        loadTestScripts();
        //    }, 1000))
        //    .always(() => MainLoader.hide());
    }, selectedTeams);
    ddlService.setTestScriptStatusesDdl();
    $('#filter-story-status-id').select2({
        placeholder: 'Select Story Status'
    });
    storyDdl.change(function (e) {
        filterStoryId = $(this).val() || 0;
        loadTestScripts();
        $('#test-script-project-ddl').val(filterProjectId);
        $('#test-script-story-ddl').val(filterStoryId);
        testScriptService.selectedStorId = filterStoryId;
    });
    //if (!(UserTokenHandler.isSuperUser())) {
    //    $("[ap-action-test-script-modal-form]").remove();
    //}
});
//# sourceMappingURL=TestScripts.js.map