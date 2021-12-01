/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/jqueryui/jqueryui.d.ts" />
/// <reference path="Models.ts" />
/// <reference path="Constants.ts" />
/// <reference path="Common.ts" />
/// <reference path="UserService.ts" />
/// <reference path="StoryService.ts" />
/// <reference path="FileService.ts" />

$(function () {
    const MainSprintId: number = $('#MainSprintId').val();

    const apiService = new ApiService();
    const fileService = new FileService(false, apiService);
    const storyService = new StoryService(false, apiService, fileService);
    const ddlService = new DdlService(apiService);

    MainLoader.show();

    $.when(ddlService.setStoryStatusesDdl(), ddlService.setSprintsDdl(), ddlService.setStoryTypesDdl())
        .always(() => MainLoader.hide());


    function getSprintDetails(sprintId) {
        const sprintDetailUrl = UrlHelper.GetSprintsUrl(ApiUrl.SprintDetail, sprintId);
        apiService.get(sprintDetailUrl)
            .done((sprint: ISprint) => {
                ddlService.setProjectsDdl(true, null, sprint.TeamID);
                $('[t-sprint-name]').text(` in ${sprint.SprintName} [${Utils.JsonDateToStr(sprint.StartDate)} - ${Utils.JsonDateToStr(sprint.EndDate)}]`);
            });
    }
    getSprintDetails(MainSprintId);
    storyService.storyFilterModel.sprintId = MainSprintId;
    storyService.loadStories(1, Constants.DefaultPageSize, true);

    UserService.loadUsersForAutocomplete(null, null, null, () => {
        if (!sideBarVisible) {
            filterStories();
        }
        else {
            const assignedToUserId: string = $('#filter-assignee-id-stories-sprint').val() || null;
            storyService.storyToSprintFilterModel.assignedToUserId = assignedToUserId;
            loadStoriesToAddToSprint();
        }
    });



    $('#filter-project-id').change(filterStories);
    function filterStories() {
        const projectId: number = $('#filter-project-id').val() || 0;

        storyService.storyFilterModel.projectId = projectId;
        storyService.storyFilterModel.assignedToUserId = $('#filter-assignee-id').val() || null;
        setTimeout(() => {
            storyService.storyFilterModel.assignedToUserName = $("#filter-assignee-name").val() || null;
        }, 200);
        
        storyService.loadStories(1, Constants.DefaultPageSize, true);
    }


    /****** Add Stories to the Sprint Section ********/
    let sideBarVisible: Boolean = false;
    function hideRightSlidePanel() {
        $('#mySidenavR').css({
            'width': 0,
            padding: 0,
            margin: 0
        });

        storiesSprintUl.empty();
        pagingContainer.html('');
        startFromElement.html(`0`);
        endToElement.html(`0`);
        totalElement.html(`0`);
        sideBarVisible = false;
    }
    function showRightSlidePanel() {
        $('#mySidenavR').removeAttr('style');
        $('#mySidenavR').width('calc(100vw - 250px)');
        sideBarVisible = true;
    }
    $('.closeNavR').click(() => hideRightSlidePanel());



    $('#filter-project-id-stories-sprint').change(() => {
        const projectId: number = $('#filter-project-id-stories-sprint').val() || null;
        storyService.storyToSprintFilterModel.projectId = projectId;
        loadStoriesToAddToSprint();
    });

    $('[ap-action-stories-to-sprint-refresh]').click(function () {
        storyService.loadStories(1, Constants.DefaultPageSize, true);
    });
    $('[ap-action-stories-to-sprint]').click(function () {
        showRightSlidePanel();
        setTimeout(() => {
            
            storyService.storyToSprintFilterModel.projectId = storyService.storyFilterModel.projectId;
            storyService.storyToSprintFilterModel.assignedToUserId = storyService.storyFilterModel.assignedToUserId;
            storyService.storyToSprintFilterModel.assignedToUserName = storyService.storyFilterModel.assignedToUserName;
            loadStoriesToAddToSprint();
        }, 500);
    });

    const templateLi = $('#stories-sprint-list-item-template > li').first();
    const storiesSprintUl = $('#stories-sprint-ul');
    const pagingContainer = $('#stories-sprint-paging-container');
    const infoContainer = $('#apdt_stories-sprint_info');
    const startFromElement = infoContainer.find('.apdt_startfrom');
    const endToElement = infoContainer.find('.apdt_endto');
    const totalElement = infoContainer.find('.apdt_total');
    infoContainer.hide();

    function loadStoriesToAddToSprint(pno = 1, psize = Constants.DefaultPageSize) {
        MainLoader.show();

        apiService.get(ApiUrl.ProjectStoriesWithoutEndDate, { pno, psize, projectId: storyService.storyToSprintFilterModel.projectId, assignedToUserId: storyService.storyToSprintFilterModel.assignedToUserId, sprintId: storyService.storyFilterModel.sprintId })
            .done((stories: IPagingModel<IStoriesWithoutEndDate>) => {
                storiesSprintUl.empty();
                pagingContainer.empty();
                if (stories && stories.Data && stories.Data.length) {
                    infoContainer.show();
                    
                    $("#filter-project-id-stories-sprint").val(storyService.storyToSprintFilterModel.projectId);
                    $("#filter-assignee-name-stories-sprint").val(storyService.storyToSprintFilterModel.assignedToUserName);
                    stories.Data.forEach((story, index) => {
                        const li = templateLi.clone();
                        li.find('[t-priority-ranking]').text(`Story Rank: ${story.PriorityRanking || ''}`);
                        li.find('[t-project-rank]').text(`Project Rank: ${story.ProjectPriorityRanking || ''}`);
                        if (story.StoryName) {
                            li.find('[t-title]').html(`${story.StoryName} - <strong>As a</strong> ${story.F1} <strong>I want to</strong> ${story.F2} <strong>So I can</strong> ${story.F3}`);
                        }
                        else {
                            li.find('[t-title]').html(`<strong>As a</strong> ${story.F1} <strong>I want to</strong> ${story.F2} <strong>So I can</strong> ${story.F3}`);
                        }
                        
                        li.find('[t-link]').attr('href', `/Project/${story.ProjectId}/User-Story/${story.StoryId}`);

                        li.find('[t-assignee]').text(`Assignee: ${story.AssignedToUserName}`);
                        li.find('[t-start-date]').text(Utils.JsonDateToStr(story.StartDate));
                        li.find('[t-end-date]').text(Utils.JsonDateToStr(story.EndDate));
                        li.find('[t-data-story-id]').attr('data-story-id', story.StoryId);
                        li.find('[t-data-project-id]').attr('data-project-id', story.ProjectId);
                        li.find('[t-project]').text(`Project: ${story.ProjectName}`);
                        li.find('[t-story-status]').text(`Story Status : ${story.StoryStatusName}`);

                        li.find('[t-dynamic-id]').attr('id', `story_id_${story.StoryId}_${index}`);
                        li.find('[t-dynamic-for]').attr('for', `story_id_${story.StoryId}_${index}`);

                        storiesSprintUl.append(li);
                    });
                    const pageModel: IPaginationModel = {
                        CurrentPageNumber: stories.CurrentPageNumber,
                        IsLastPage: stories.IsLastPage,
                        PageSize: stories.PageSize,
                        TotalPages: stories.Count,
                    };
                    const pagination = Pagination.Render(pageModel);
                    pagingContainer.html(`${pagination}`);

                    const startFrom = ((stories.CurrentPageNumber - 1) * stories.PageSize) + 1;
                    const endTo = startFrom + stories.Data.length - 1;

                    startFromElement.html(`${startFrom}`);
                    endToElement.html(`${endTo}`);
                    totalElement.html(`${stories.Count}`);
                }
                else {
                    Alerts.Info('No stories found.');
                    pagingContainer.html('');

                    startFromElement.html(`0`);
                    endToElement.html(`0`);
                    totalElement.html(`0`);
                    infoContainer.hide();
                }
            })
            .always(() => MainLoader.hide());
    }

    $(document).on('click', '#stories-sprint-paging-container a[data-pno]', function (e) {
        const btn = $(this);
        const pNo: number = btn.data('pno') || 0;
        if (pNo > 0) {
            loadStoriesToAddToSprint(pNo);
        }
    });
    $('#add-stories-to-sprint-btn').click(function (e) {
        e.preventDefault();
        const chks = storiesSprintUl.find('.story-chk:checked');
        if (chks.length > 0) {
            const Ids: number[] = $(chks).map((i, chk) => $(chk).data('story-id'))
                .get().join(',').split(',')
                .map(id => parseInt(id));
            MainLoader.show();
            const url = UrlHelper.GetSprintsUrl(ApiUrl.SprintAddStories, MainSprintId);
            apiService.post(url, { '': Ids })
                .done((data: any, status: string, xhr: JQueryXHR) => {
                    if (xhr.status === 200 || xhr.status === 201) {
                        Alerts.Success('Selected stories added to the sprint successfully.', 'Success', () => {
                            hideRightSlidePanel();
                            setTimeout(() => filterStories(), 500);
                        });
                    }
                })
                .always(() => MainLoader.hide());
        }
        else {
            Alerts.Error('Please select user story to add to Sprint.', 'Selection Required');
            return false;
        }
    });
    $('#chk-all').change(function () {
        storiesSprintUl.find('.story-chk').prop('checked', $(this).prop('checked'));
    });

    $(document).on('change', '.story-chk', function () {
        const allChks = storiesSprintUl.find('.story-chk');
        const chks = storiesSprintUl.find('.story-chk:checked');
        if (allChks.length === chks.length)
            $('#chk-all').prop('checked', true);
        else
            $('#chk-all').prop('checked', false);
    });

    if (!(UserTokenHandler.isSuperUser())) {
        $("[ap-action-stories-to-sprint]").remove();
    }
});