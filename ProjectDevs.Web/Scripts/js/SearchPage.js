/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/jqueryui/jqueryui.d.ts" />
/// <reference path="Models.ts" />
/// <reference path="Constants.ts" />
/// <reference path="Common.ts" />
var SearchService = /** @class */ (function () {
    function SearchService(apiService, searchTerm) {
        this.apiService = apiService;
        this.searchTerm = searchTerm;
        this.searchResultsContainer = $('#all-search-results');
        this.seachResultsUl = $('#search-results-ul');
        this.projectTemplateLi = $('#project-search-list-item-template > li').first();
        this.storyTemplateLi = $('#story-search-list-item-template > li').first();
        this.taskTemplateLi = $('#task-search-list-item-template > li').first();
        this.meetingTemplateLi = $('#meeting-search-list-item-template > li').first();
        this.fileTemplateLi = $('#file-search-list-item-template > li').first();
        this.noteTemplateLi = $('#note-search-list-item-template > li').first();
        this.testScriptTemplateLi = $('#testscript-search-list-item-template > li').first();
        this.pagingContainer = $('#search-paging-container');
        this.infoContainer = $('#apdt_search_info');
        this.startFromElement = this.infoContainer.find('.apdt_startfrom');
        this.endToElement = this.infoContainer.find('.apdt_endto');
        this.totalElement = this.infoContainer.find('.apdt_total');
        this.init();
    }
    SearchService.prototype.loadSearchResults = function (pno, psize) {
        var _this = this;
        if (pno === void 0) { pno = 1; }
        if (psize === void 0) { psize = Constants.DefaultPageSize; }
        MainLoader.show();
        this.apiService.get(ApiUrl.SearchResults, { pno: pno, psize: psize, q: this.searchTerm })
            .done(function (ns) {
            _this.seachResultsUl.empty();
            if (ns && ns.Data && ns.Data.length) {
                _this.infoContainer.show();
                ns.Data.forEach(function (r) {
                    var li;
                    if (r.IsProject) {
                        li = _this.projectTemplateLi.clone();
                        li.find('[t-project]').text(r.ProjectName);
                        li.find('[t-link]').attr('href', "/Projects/" + r.ProjectId);
                        li.find('[t-meeting-schedule]').text("Meeting Schedule: " + r.MeetingSchedule);
                        li.attr('data-result-type', "" + SearchResultType.Project);
                    }
                    else if (r.IsStory) {
                        li = _this.storyTemplateLi.clone();
                        var story = "<strong>As a</strong> " + r.F1 + " <strong>I want to</strong> " + r.F2 + " <strong>So I can</strong> " + r.F3;
                        li.find('[t-story]').html(story);
                        li.find('[t-story-name]').html("User Story Description: " + story);
                        li.find('[t-link]').attr('href', "/Project/" + r.ProjectId + "/User-Story/" + r.StoryId);
                        li.attr('data-result-type', "" + SearchResultType.Story);
                    }
                    else if (r.IsTask) {
                        li = _this.taskTemplateLi.clone();
                        var ticket = r.TicketNumber ? r.TicketNumber + ": " : "";
                        li.find('[t-task-name]').text("" + ticket + r.TaskName);
                        li.find('[t-link]').attr('href', "/User-Story/" + r.StoryId + "/Tasks/" + r.TaskId);
                        li.find('[t-task-description]').text("Description: " + r.TaskDescription);
                        li.attr('data-result-type', "" + SearchResultType.Task);
                    }
                    else if (r.IsMeeting) {
                        li = _this.meetingTemplateLi.clone();
                        li.find('[t-meeting-purpose]').text(r.Purpose);
                        li.find('[t-meeting-time]').text("Meeting Time: " + r.MeetingTime);
                        li.attr('data-result-type', "" + SearchResultType.Meeting);
                    }
                    else if (r.IsFile) {
                        li = _this.fileTemplateLi.clone();
                        li.find('[t-file-name]').text(r.FileName);
                        li.find('[t-link]').attr('href', ApiUrl.Domain + "/" + r.FileLocation);
                        li.attr('data-result-type', "" + SearchResultType.File);
                    }
                    else if (r.IsNote) {
                        li = _this.noteTemplateLi.clone();
                        li.find('[t-note-text]').text(r.Note);
                        li.attr('data-result-type', "" + SearchResultType.Note);
                    }
                    else if (r.IsTestScript) {
                        li = _this.testScriptTemplateLi.clone();
                        var story = "<strong>As a</strong> " + r.F1 + " <strong>I want to</strong> " + r.F2 + " <strong>So I can</strong> " + r.F3;
                        li.find('[t-testscript-text]').html(story);
                        li.find('[t-link]').attr('href', "/User-Story/" + r.StoryId + "/Test-Scripts/" + r.TestScriptId);
                        li.attr('data-result-type', "" + SearchResultType.TestScript);
                    }
                    li.find('[t-project-name]').text("Project: " + r.ProjectName);
                    _this.seachResultsUl.append(li);
                });
                $('[data-search-filter-by="all"]').trigger('click');
                var pageModel = {
                    CurrentPageNumber: ns.CurrentPageNumber,
                    IsLastPage: ns.IsLastPage,
                    PageSize: ns.PageSize,
                    TotalPages: ns.Count,
                };
                var pagination = Pagination.Render(pageModel);
                _this.pagingContainer.html("" + pagination);
                var startFrom = ((ns.CurrentPageNumber - 1) * ns.PageSize) + 1;
                var endTo = startFrom + ns.Data.length - 1;
                _this.startFromElement.html("" + startFrom);
                _this.endToElement.html("" + endTo);
                _this.totalElement.html("" + ns.Count);
            }
            else {
                Alerts.Info('No search results found.', 'Empty');
                _this.pagingContainer.html('');
                _this.startFromElement.html("0");
                _this.endToElement.html("0");
                _this.totalElement.html("0");
                _this.infoContainer.hide();
            }
        })
            .always(function () { return MainLoader.hide(); });
    };
    SearchService.prototype.init = function () {
        var _this = this;
        $(document).on('click', '#search-paging-container a[data-pno]', function (e) {
            var btn = $(e.target).closest('a[data-pno]');
            var pNo = btn.data('pno') || 0;
            if (pNo > 0) {
                _this.loadSearchResults(pNo);
            }
        });
        var filterBy = {
            all: '',
            files: SearchResultType.File,
            projects: SearchResultType.Project,
            stories: SearchResultType.Story,
            meetings: SearchResultType.Meeting,
            notes: SearchResultType.Note,
            tasks: SearchResultType.Task,
            testscripts: SearchResultType.TestScript
        };
        $(document).on('click', '[data-search-filter-by]', function (e) {
            var btn = $(e.target).closest('[data-search-filter-by]');
            var filterType = filterBy[btn.attr('data-search-filter-by')];
            _this.seachResultsUl.find('li').hide();
            _this.seachResultsUl.hide();
            if (filterType === '') {
                _this.seachResultsUl.find('li').show();
                _this.seachResultsUl.slideDown('fast');
            }
            else {
                _this.seachResultsUl.find("li[data-result-type=\"" + filterType + "\"]").show();
                _this.seachResultsUl.slideDown('fast');
            }
        });
    };
    return SearchService;
}());
$(function () {
    var searhTerm = $('#SearchQuery').val();
    if (!searhTerm || searhTerm.length <= 2) {
        Alerts.Info('At least 3 characters search term required', 'Required');
        return false;
    }
    var apiService = new ApiService();
    var searchService = new SearchService(apiService, searhTerm);
    searchService.loadSearchResults();
});
//# sourceMappingURL=SearchPage.js.map