/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/jqueryui/jqueryui.d.ts" />
/// <reference path="Models.ts" />
/// <reference path="Constants.ts" />
/// <reference path="Common.ts" />
/// <reference path="UserService.ts" />
/// <reference path="StoryService.ts" />
/// <reference path="FileService.ts" />
$(function () {
    var MainSprintId = $('#MainSprintId').val();
    var apiService = new ApiService();
    var fileService = new FileService(false, apiService);
    var storyService = new StoryService(false, apiService, fileService);
    var ddlService = new DdlService(apiService);
    MainLoader.show();
    $.when(ddlService.setStoryStatusesDdl(), ddlService.setSprintsDdl(), ddlService.setStoryTypesDdl())
        .always(function () { return MainLoader.hide(); });
    function getSprintDetails(sprintId) {
        var sprintDetailUrl = UrlHelper.GetSprintsUrl(ApiUrl.SprintDetail, sprintId);
        apiService.get(sprintDetailUrl)
            .done(function (sprint) {
            ddlService.setProjectsDdl(true, null, sprint.TeamID);
            $('[t-sprint-name]').text(" in " + sprint.SprintName + " [" + Utils.JsonDateToStr(sprint.StartDate) + " - " + Utils.JsonDateToStr(sprint.EndDate) + "]");
        });
    }
    getSprintDetails(MainSprintId);
    storyService.storyFilterModel.sprintId = MainSprintId;
    storyService.loadStories(1, Constants.DefaultPageSize, true);
    UserService.loadUsersForAutocomplete(null, null, null, function () {
        if (!sideBarVisible) {
            filterStories();
        }
        else {
            var assignedToUserId = $('#filter-assignee-id-stories-sprint').val() || null;
            storyService.storyToSprintFilterModel.assignedToUserId = assignedToUserId;
            loadStoriesToAddToSprint();
        }
    });
    $('#filter-project-id').change(filterStories);
    function filterStories() {
        var projectId = $('#filter-project-id').val() || 0;
        storyService.storyFilterModel.projectId = projectId;
        storyService.storyFilterModel.assignedToUserId = $('#filter-assignee-id').val() || null;
        setTimeout(function () {
            storyService.storyFilterModel.assignedToUserName = $("#filter-assignee-name").val() || null;
        }, 200);
        storyService.loadStories(1, Constants.DefaultPageSize, true);
    }
    /****** Add Stories to the Sprint Section ********/
    var sideBarVisible = false;
    function hideRightSlidePanel() {
        $('#mySidenavR').css({
            'width': 0,
            padding: 0,
            margin: 0
        });
        storiesSprintUl.empty();
        pagingContainer.html('');
        startFromElement.html("0");
        endToElement.html("0");
        totalElement.html("0");
        sideBarVisible = false;
    }
    function showRightSlidePanel() {
        $('#mySidenavR').removeAttr('style');
        $('#mySidenavR').width('calc(100vw - 250px)');
        sideBarVisible = true;
    }
    $('.closeNavR').click(function () { return hideRightSlidePanel(); });
    $('#filter-project-id-stories-sprint').change(function () {
        var projectId = $('#filter-project-id-stories-sprint').val() || null;
        storyService.storyToSprintFilterModel.projectId = projectId;
        loadStoriesToAddToSprint();
    });
    $('[ap-action-stories-to-sprint-refresh]').click(function () {
        storyService.loadStories(1, Constants.DefaultPageSize, true);
    });
    $('[ap-action-stories-to-sprint]').click(function () {
        showRightSlidePanel();
        setTimeout(function () {
            storyService.storyToSprintFilterModel.projectId = storyService.storyFilterModel.projectId;
            storyService.storyToSprintFilterModel.assignedToUserId = storyService.storyFilterModel.assignedToUserId;
            storyService.storyToSprintFilterModel.assignedToUserName = storyService.storyFilterModel.assignedToUserName;
            loadStoriesToAddToSprint();
        }, 500);
    });
    var templateLi = $('#stories-sprint-list-item-template > li').first();
    var storiesSprintUl = $('#stories-sprint-ul');
    var pagingContainer = $('#stories-sprint-paging-container');
    var infoContainer = $('#apdt_stories-sprint_info');
    var startFromElement = infoContainer.find('.apdt_startfrom');
    var endToElement = infoContainer.find('.apdt_endto');
    var totalElement = infoContainer.find('.apdt_total');
    infoContainer.hide();
    function loadStoriesToAddToSprint(pno, psize) {
        if (pno === void 0) { pno = 1; }
        if (psize === void 0) { psize = Constants.DefaultPageSize; }
        MainLoader.show();
        apiService.get(ApiUrl.ProjectStoriesWithoutEndDate, { pno: pno, psize: psize, projectId: storyService.storyToSprintFilterModel.projectId, assignedToUserId: storyService.storyToSprintFilterModel.assignedToUserId, sprintId: storyService.storyFilterModel.sprintId })
            .done(function (stories) {
            storiesSprintUl.empty();
            pagingContainer.empty();
            if (stories && stories.Data && stories.Data.length) {
                infoContainer.show();
                $("#filter-project-id-stories-sprint").val(storyService.storyToSprintFilterModel.projectId);
                $("#filter-assignee-name-stories-sprint").val(storyService.storyToSprintFilterModel.assignedToUserName);
                stories.Data.forEach(function (story, index) {
                    var li = templateLi.clone();
                    li.find('[t-priority-ranking]').text("Story Rank: " + (story.PriorityRanking || ''));
                    li.find('[t-project-rank]').text("Project Rank: " + (story.ProjectPriorityRanking || ''));
                    if (story.StoryName) {
                        li.find('[t-title]').html(story.StoryName + " - <strong>As a</strong> " + story.F1 + " <strong>I want to</strong> " + story.F2 + " <strong>So I can</strong> " + story.F3);
                    }
                    else {
                        li.find('[t-title]').html("<strong>As a</strong> " + story.F1 + " <strong>I want to</strong> " + story.F2 + " <strong>So I can</strong> " + story.F3);
                    }
                    li.find('[t-link]').attr('href', "/Project/" + story.ProjectId + "/User-Story/" + story.StoryId);
                    li.find('[t-assignee]').text("Assignee: " + story.AssignedToUserName);
                    li.find('[t-start-date]').text(Utils.JsonDateToStr(story.StartDate));
                    li.find('[t-end-date]').text(Utils.JsonDateToStr(story.EndDate));
                    li.find('[t-data-story-id]').attr('data-story-id', story.StoryId);
                    li.find('[t-data-project-id]').attr('data-project-id', story.ProjectId);
                    li.find('[t-project]').text("Project: " + story.ProjectName);
                    li.find('[t-story-status]').text("Story Status : " + story.StoryStatusName);
                    li.find('[t-dynamic-id]').attr('id', "story_id_" + story.StoryId + "_" + index);
                    li.find('[t-dynamic-for]').attr('for', "story_id_" + story.StoryId + "_" + index);
                    storiesSprintUl.append(li);
                });
                var pageModel = {
                    CurrentPageNumber: stories.CurrentPageNumber,
                    IsLastPage: stories.IsLastPage,
                    PageSize: stories.PageSize,
                    TotalPages: stories.Count,
                };
                var pagination = Pagination.Render(pageModel);
                pagingContainer.html("" + pagination);
                var startFrom = ((stories.CurrentPageNumber - 1) * stories.PageSize) + 1;
                var endTo = startFrom + stories.Data.length - 1;
                startFromElement.html("" + startFrom);
                endToElement.html("" + endTo);
                totalElement.html("" + stories.Count);
            }
            else {
                Alerts.Info('No stories found.');
                pagingContainer.html('');
                startFromElement.html("0");
                endToElement.html("0");
                totalElement.html("0");
                infoContainer.hide();
            }
        })
            .always(function () { return MainLoader.hide(); });
    }
    $(document).on('click', '#stories-sprint-paging-container a[data-pno]', function (e) {
        var btn = $(this);
        var pNo = btn.data('pno') || 0;
        if (pNo > 0) {
            loadStoriesToAddToSprint(pNo);
        }
    });
    $('#add-stories-to-sprint-btn').click(function (e) {
        e.preventDefault();
        var chks = storiesSprintUl.find('.story-chk:checked');
        if (chks.length > 0) {
            var Ids = $(chks).map(function (i, chk) { return $(chk).data('story-id'); })
                .get().join(',').split(',')
                .map(function (id) { return parseInt(id); });
            MainLoader.show();
            var url = UrlHelper.GetSprintsUrl(ApiUrl.SprintAddStories, MainSprintId);
            apiService.post(url, { '': Ids })
                .done(function (data, status, xhr) {
                if (xhr.status === 200 || xhr.status === 201) {
                    Alerts.Success('Selected stories added to the sprint successfully.', 'Success', function () {
                        hideRightSlidePanel();
                        setTimeout(function () { return filterStories(); }, 500);
                    });
                }
            })
                .always(function () { return MainLoader.hide(); });
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
        var allChks = storiesSprintUl.find('.story-chk');
        var chks = storiesSprintUl.find('.story-chk:checked');
        if (allChks.length === chks.length)
            $('#chk-all').prop('checked', true);
        else
            $('#chk-all').prop('checked', false);
    });
    if (!(UserTokenHandler.isSuperUser())) {
        $("[ap-action-stories-to-sprint]").remove();
    }
});
//# sourceMappingURL=SprintStories.js.map