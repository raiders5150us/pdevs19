/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="Models.ts" />
/// <reference path="Constants.ts" />
/// <reference path="Common.ts" />
/// <reference path="UserService.ts" />
/// <reference path="FileService.ts" />

$(function () {
    const apiService = new ApiService();
    const ddlService = new DdlService(apiService);
    const fileService = new FileService(false,apiService);
    const testScriptService = new TestScriptService(apiService, ddlService, fileService, false);
    const cookieUtils = new CookieUtils(apiService); 
    const MainStoryId: number = $('#MainStoryId').val() || 0;
    const selectedTeams = cookieUtils.getCookie(Constants.TeamSelectionCookieName);


    let filterProjectId = 0;
    let filterStoryId = MainStoryId;
    let filterStoryStatusId = "0";
    let $this = this;

    $this.apiService = apiService;
    function loadTestScripts(pno = 1) {
        let storyTeamId: string = "0";
        if ($('#filter-team-id').select2('data')) {
            storyTeamId = $('#filter-team-id').select2('data').map(a => a.id).toString();
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
            transport: (params, success, failure) => {                
                let storyDdlUrl = UrlHelper.GetProjectStoriesUrl(ApiUrl.ProjectStoriesDdl, filterProjectId, null, filterStoryStatusId);
                storyDdlUrl += "?q=" + params.data.q;
                $this.apiService.get(storyDdlUrl)
                    .done((s: IDdlModel[]) => {
                        if (s.length > 0) {
                            let results = s.map((a) => {
                                return { id: a.Value, text: a.Text };
                            });

                            let obj = { results: results, pagination: false };
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
        escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
        minimumInputLength: 2,        
    }).on("change", function (e) {
        filterStoryId = $("#filter-story-id1").val() | 0;
        loadTestScripts();
    });
    $(document).on('change', '#filter-team-id', function (e) {
        let storyTeamId: string = "0";
        filterStoryId = 0;
        testScriptService.clearTestScripts();
        if ($('#filter-team-id').select2('data')) {
            storyTeamId = $('#filter-team-id').select2('data').map(a => a.id).toString();
            cookieUtils.setCookie(Constants.TeamSelectionCookieName, storyTeamId);
        }

        $('#test-script-project-ddl').empty();
        $('#filter-story-id').empty();
        $('#filter-story-status-id').empty();
        MainLoader.show();
        $.when(ddlService.setProjectsDdl(true, null, storyTeamId))            
            .always(() => MainLoader.hide());
    });
    $(document).on('click', '#test-scripts-paging-container a[data-pno]', function (e) {
        const btn = $(this);
        const pNo: number = btn.data('pno') || 0;
        if (pNo > 0) {            
            loadTestScripts(pNo);
        }
    });



    UserService.loadUsersForAutocomplete();

    const storyDdl = $('#filter-story-id');
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
            const projectDetailUrl = UrlHelper.GetProjectsUrl(ApiUrl.ProjectDetail, filterProjectId);
            apiService.get(projectDetailUrl)
                .done((project: IProjectDto) => {

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
            filterStoryStatusId = $('#filter-story-status-id').select2('data').map(a => a.id).toString();
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
    })

    //if (!(UserTokenHandler.isSuperUser())) {
    //    $("[ap-action-test-script-modal-form]").remove();
    //}
});