/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/jqueryui/jqueryui.d.ts" />
/// <reference path="Models.ts" />
/// <reference path="Constants.ts" />
/// <reference path="Common.ts" />
/// <reference path="UserService.ts" />

$(function () {
    const MainProjectId: number = $('#MainProjectId').val();
    const MainStoryId: number = $('#MainStoryId').val();
    const isMyPage: boolean = $('#IsMyPage').val() === 'True';

    const apiService = new ApiService();

    const ddlService = new DdlService(apiService);
    const taskService = new TaskService(isMyPage, apiService, ddlService, false, false, true);
    const cookieUtils = new CookieUtils(apiService); 
    const selectedTeams = cookieUtils.getCookie(Constants.TeamSelectionCookieName);

    const taskFilterModel: ITaskFilterModel = {
        ProjectId: MainProjectId,
        StoryId: MainStoryId,
        TaskStatus: 0,
        AssignedToUserId: null,
        TeamId:""
    }

    ddlService.setProjectsDdl(false, function () {
        $('#task-lob-ddl').select2({
            placeholder: 'Select LOB'
        }).on("change", function () {
            $("#hdnLOBId").val($('#task-lob-ddl').val().join());
        });
    });

    ddlService.setTaskLOBDdl();
    ddlService.setTeamsDdl(false, function () {
        MainLoader.show();
        $.when(ddlService.setProjectsDdl(true, null, selectedTeams))
            .done(() => setTimeout(() => {
                taskFilterModel.TeamId = selectedTeams;
                taskService.clearTasks();
                taskService.loadTasks(taskFilterModel);
            }, 200))
            .always(() => MainLoader.hide());
    }, selectedTeams);

    let filterProjectId = MainProjectId;
    let filterStoryId = MainStoryId;
    const storyDdl = $('#filter-story-id');
    $('#filter-project-id').change(function () {
        filterProjectId = $(this).val() || 0;

        
        taskFilterModel.ProjectId = filterProjectId;
        taskFilterModel.StoryId = 0;
        taskService.clearTasks();

        storyDdl.empty();
        ddlService.setStoriesDdl(filterProjectId, storyDdl, true);

        $('#task-project-ddl').val(filterProjectId);
        ddlService.setStoriesDdl(filterProjectId, $('#task-story-ddl'), true);
        taskService.defaultTaskFilterModel.ProjectId = filterProjectId;
        if (filterProjectId == 0) {
            taskService.loadTasks(taskFilterModel);
        }
        if (filterProjectId > 0) {
            const projectDetailUrl = UrlHelper.GetProjectsUrl(ApiUrl.ProjectDetail, filterProjectId);
            apiService.get(projectDetailUrl)
                .done((project: IProjectDto) => {
                    if (!(UserTokenHandler.isSuperUser() || UserTokenHandler.isUserStakeholderOrOwnerForProject(project))) {
                        $("[ap-action-task-modal-form]").hide();
                    }
                    else {
                        $("[ap-action-task-modal-form]").show();
                    }
                });
        }


    });

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

        $('#filter-story-id').empty();
        MainLoader.show();
        $.when(ddlService.setProjectsDdl(true, null, teamId))
            .done(() => setTimeout(() => {
                taskFilterModel.TeamId = teamId;
                taskService.clearTasks();
                taskService.loadTasks(taskFilterModel);
            }, 200))
            .always(() => MainLoader.hide());


        
    });

    storyDdl.change(function (e) {
        filterStoryId = $(this).val() || 0;
        taskFilterModel.StoryId = filterStoryId;

        taskService.clearTasks();
        taskService.loadTasks(taskFilterModel);

        $('#task-story-ddl').val(filterStoryId);
        taskService.defaultTaskFilterModel.StoryId = filterStoryId;
    })

    if (isMyPage)
        taskService.loadTasks(taskFilterModel);
    else {
        if (MainProjectId > 0 && MainStoryId > 0) {
            setTimeout(() => {
                $('#filter-project-id').val(filterProjectId);
                ddlService.setStoriesDdl(filterProjectId, storyDdl, false, () => { storyDdl.val(MainStoryId); taskService.loadTasks(taskFilterModel); });
            }, 2000);
        }
    }

    ddlService.setTaskStatusesDdl(MainStoryId);

    UserService.loadUsersForAutocomplete(null, null, null, () => filterTasks());

    $('#filter-task-status').change(filterTasks);

    function filterTasks() {
        taskFilterModel.TaskStatus = $('#filter-task-status').val() || null;
        taskFilterModel.AssignedToUserId = $('#filter-assignee-id').val() || null;
        taskService.loadTasks(taskFilterModel);
    }
    $('#filter-assignee-name').blur(function () {
        if ($('#filter-assignee-id').val() && !$(this).val()) {
            $('#filter-assignee-id').val('');
            filterTasks();
        }
    });
   
    if (!(UserTokenHandler.isSuperUser())) {
        $("[ap-action-task-modal-form]").hide();       
    }        
});