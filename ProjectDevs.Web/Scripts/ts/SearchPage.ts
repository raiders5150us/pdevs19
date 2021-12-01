/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/jqueryui/jqueryui.d.ts" />
/// <reference path="Models.ts" />
/// <reference path="Constants.ts" />
/// <reference path="Common.ts" />

class SearchService {
    private searchResultsContainer = $('#all-search-results');
    private seachResultsUl = $('#search-results-ul');

    private projectTemplateLi = $('#project-search-list-item-template > li').first();
    private storyTemplateLi = $('#story-search-list-item-template > li').first();
    private taskTemplateLi = $('#task-search-list-item-template > li').first();
    private meetingTemplateLi = $('#meeting-search-list-item-template > li').first();
    private fileTemplateLi = $('#file-search-list-item-template > li').first();
    private noteTemplateLi = $('#note-search-list-item-template > li').first();
    private testScriptTemplateLi = $('#testscript-search-list-item-template > li').first();

    private pagingContainer = $('#search-paging-container');
    private infoContainer = $('#apdt_search_info');
    private startFromElement = this.infoContainer.find('.apdt_startfrom');
    private endToElement = this.infoContainer.find('.apdt_endto');
    private totalElement = this.infoContainer.find('.apdt_total');

    constructor(private apiService: ApiService, private searchTerm: string) {
        this.init();
    }

    loadSearchResults(pno = 1, psize = Constants.DefaultPageSize) {
        MainLoader.show();
        this.apiService.get(ApiUrl.SearchResults, { pno, psize, q: this.searchTerm })
            .done((ns: IPagingModel<ISearchModel>) => {
                this.seachResultsUl.empty();
                if (ns && ns.Data && ns.Data.length) {
                    this.infoContainer.show();
                    ns.Data.forEach(r => {
                        let li: JQuery;
                        if (r.IsProject) {
                            li = this.projectTemplateLi.clone();

                            li.find('[t-project]').text(r.ProjectName);
                            li.find('[t-link]').attr('href', `/Projects/${r.ProjectId}`);
                            li.find('[t-meeting-schedule]').text(`Meeting Schedule: ${r.MeetingSchedule}`);

                            li.attr('data-result-type', `${SearchResultType.Project}`);
                        }
                        else if (r.IsStory) {
                            li = this.storyTemplateLi.clone();
                            const story = `<strong>As a</strong> ${r.F1} <strong>I want to</strong> ${r.F2} <strong>So I can</strong> ${r.F3}`;
                            li.find('[t-story]').html(story);
                            li.find('[t-story-name]').html(`User Story Description: ${story}`);
                            li.find('[t-link]').attr('href', `/Project/${r.ProjectId}/User-Story/${r.StoryId}`);

                            li.attr('data-result-type', `${SearchResultType.Story}`);
                        }
                        else if (r.IsTask) {
                            li = this.taskTemplateLi.clone();
                            const ticket = r.TicketNumber ? r.TicketNumber + ": " : "";
                            li.find('[t-task-name]').text(`${ticket}${r.TaskName}`);

                            li.find('[t-link]').attr('href', `/User-Story/${r.StoryId}/Tasks/${r.TaskId}`);
                            li.find('[t-task-description]').text(`Description: ${r.TaskDescription}`);

                            li.attr('data-result-type', `${SearchResultType.Task}`);
                        }
                        else if (r.IsMeeting) {
                            li = this.meetingTemplateLi.clone();

                            li.find('[t-meeting-purpose]').text(r.Purpose);
                            li.find('[t-meeting-time]').text(`Meeting Time: ${r.MeetingTime}`);

                            li.attr('data-result-type', `${SearchResultType.Meeting}`);
                        }
                        else if (r.IsFile) {
                            li = this.fileTemplateLi.clone();

                            li.find('[t-file-name]').text(r.FileName);
                            li.find('[t-link]').attr('href', `${ApiUrl.Domain}/${r.FileLocation}`);

                            li.attr('data-result-type', `${SearchResultType.File}`);
                        }
                        else if (r.IsNote) {
                            li = this.noteTemplateLi.clone();

                            li.find('[t-note-text]').text(r.Note);

                            li.attr('data-result-type', `${SearchResultType.Note}`);
                        }
                        else if (r.IsTestScript) {
                            li = this.testScriptTemplateLi.clone();
                            const story = `<strong>As a</strong> ${r.F1} <strong>I want to</strong> ${r.F2} <strong>So I can</strong> ${r.F3}`;
                            li.find('[t-testscript-text]').html(story);                            
                            li.find('[t-link]').attr('href', `/User-Story/${r.StoryId}/Test-Scripts/${r.TestScriptId}`);

                            li.attr('data-result-type', `${SearchResultType.TestScript}`);
                        }
                        li.find('[t-project-name]').text(`Project: ${r.ProjectName}`);

                        this.seachResultsUl.append(li)
                    });

                    $('[data-search-filter-by="all"]').trigger('click');

                    const pageModel: IPaginationModel = {
                        CurrentPageNumber: ns.CurrentPageNumber,
                        IsLastPage: ns.IsLastPage,
                        PageSize: ns.PageSize,
                        TotalPages: ns.Count,
                    };
                    const pagination = Pagination.Render(pageModel);
                    this.pagingContainer.html(`${pagination}`);

                    const startFrom = ((ns.CurrentPageNumber - 1) * ns.PageSize) + 1;
                    const endTo = startFrom + ns.Data.length - 1;

                    this.startFromElement.html(`${startFrom}`);
                    this.endToElement.html(`${endTo}`);
                    this.totalElement.html(`${ns.Count}`);
                }
                else {
                    Alerts.Info('No search results found.', 'Empty');
                    this.pagingContainer.html('');
                    this.startFromElement.html(`0`);
                    this.endToElement.html(`0`);
                    this.totalElement.html(`0`);
                    this.infoContainer.hide();
                }
            })
            .always(() => MainLoader.hide());
    }
    init() {
        $(document).on('click', '#search-paging-container a[data-pno]', (e) => {
            const btn = $(e.target).closest('a[data-pno]');
            const pNo: number = btn.data('pno') || 0;
            if (pNo > 0) {
                this.loadSearchResults(pNo);
            }
        });
        const filterBy = {
            all: '',
            files: SearchResultType.File,
            projects: SearchResultType.Project,
            stories: SearchResultType.Story,
            meetings: SearchResultType.Meeting,
            notes: SearchResultType.Note,
            tasks: SearchResultType.Task,
            testscripts: SearchResultType.TestScript
        }

        $(document).on('click', '[data-search-filter-by]', e => {
            const btn = $(e.target).closest('[data-search-filter-by]');
            const filterType = filterBy[btn.attr('data-search-filter-by')];
            this.seachResultsUl.find('li').hide();
            this.seachResultsUl.hide();

            if (filterType === '') {
                this.seachResultsUl.find('li').show();
                this.seachResultsUl.slideDown('fast');
            }
            else {
                this.seachResultsUl.find(`li[data-result-type="${filterType}"]`).show();
                this.seachResultsUl.slideDown('fast');
            }
        });
    }
}

$(function () {
    const searhTerm: string = $('#SearchQuery').val();
    if (!searhTerm || searhTerm.length <= 2) {
        Alerts.Info('At least 3 characters search term required', 'Required');
        return false;
    }

    const apiService = new ApiService();
    const searchService = new SearchService(apiService, searhTerm);

    searchService.loadSearchResults();
});