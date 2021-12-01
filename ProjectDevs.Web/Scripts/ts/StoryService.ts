/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="Models.ts" />
/// <reference path="Constants.ts" />
/// <reference path="Common.ts" />
/// <reference path="UserService.ts" />
/// <reference path="FileService.ts" />

class StoryService {
    private templateLi = $('#story-list-item-template>table>tbody>tr').first();
    private storiesContainerUl = $('#user-stories-list');
    private pagingContainer = $('#user-stories-paging-container');
    private infoContainer = $('#apdt_userstories_info');
    private startFromElement = this.infoContainer.find('.apdt_startfrom');
    private endToElement = this.infoContainer.find('.apdt_endto');
    private totalElement = this.infoContainer.find('.apdt_total');

    private sprintProjectedHrsBar = $('#sprint-projected-hrs-progress-bar');
    private sprintActualHrsBar = $('#sprint-actual-hrs-progress-bar');
    private sprintRemainingHrsBar = $('#sprint-projected-hrs-remaining-progress-bar');

    private createEditStoryModal = $('#create-edit-story-modal');
    private saveStoryModalForm = this.createEditStoryModal.find('#story-form');
    private saveStoryBtn = this.createEditStoryModal.find('#save-story-btn');


    private createEditQuickStoryModal = $('#create-edit-quick-story-modal');
    private saveQuickStoryModalForm = this.createEditQuickStoryModal.find('#quick-story-form');
    private saveQuickStoryBtn = this.createEditQuickStoryModal.find('#save-story-btn');

    private multiSelectSprintDdl = this.saveStoryModalForm.find('#sprint-id');

    storyFilterModel: { projectId: number, assignedToUserId: string, assignedToUserName: string, storyStatusId?: string, sprintId?: number, storyTeamId?: string } = {
        projectId: 0,
        assignedToUserId: null,
        storyStatusId: "",
        sprintId: 0,
        assignedToUserName: null,
        storyTeamId: ""
    }

    storyToSprintFilterModel: { projectId?: number, assignedToUserId: string, assignedToUserName: string, teamId: string } = {
        projectId: null,
        assignedToUserId: null,
        assignedToUserName: null,
        teamId: null
    }

    constructor(private isMyPage: boolean, private apiService: ApiService,private fileService:FileService, private isDetailPage = false, private isProjectDetailPage = false) {
        this.init();
    }

    clearStories() {
        this.storiesContainerUl.empty();
        this.pagingContainer.html('');
        this.startFromElement.html(`0`);
        this.endToElement.html(`0`);
        this.totalElement.html(`0`);
        this.infoContainer.hide();
    }

    resetSprintHrsBars() {
        this.sprintActualHrsBar.removeClass('progress-bar-danger').addClass('progress-bar-success').width(`0%`);

        this.sprintProjectedHrsBar.width(`0%`).text(`Projected: 0`);
        this.sprintActualHrsBar.text(`Actual: 0`);
        this.sprintRemainingHrsBar.width(`0%`);

        this.sprintActualHrsBar.removeClass('active').width(`0%`).attr('value-now', 0);
    }

    setSprintHrsBars(hrs: IStoryHour) {
        let projectedLength = 100;
        let actualLength = 0;
        let remainigLength = 0;

        if (hrs.ActualHours >= hrs.ProjectedHours) {
            actualLength = 100;
            if (hrs.ActualHours > hrs.ProjectedHours) {
                this.sprintActualHrsBar.removeClass('progress-bar-success').addClass('progress-bar-danger');
            }
        }
        else if (hrs.ProjectedHours == 0) { return false; }
        else {
            remainigLength = ((hrs.ProjectedHours - hrs.ActualHours) / hrs.ProjectedHours) * 100;
            actualLength = 100 - remainigLength;
        }
        this.sprintProjectedHrsBar.width(`${projectedLength}%`).text(`Projected: ${hrs.ProjectedHours} Hrs`);
        this.sprintActualHrsBar.text(`Actual: ${hrs.ActualHours} Hrs`);
        this.sprintRemainingHrsBar.width(`${remainigLength}%`);
        setTimeout(() => {
            this.sprintActualHrsBar.addClass('active').width(`${actualLength}%`).attr('value-now', actualLength);
            setTimeout(() => this.sprintActualHrsBar.removeClass('active'), 2500);
        }, 2000);
    }

    loadStories(pno: number = 1, psize: number = Constants.DefaultPageSize, showPaging = false) {
        const projectId = this.storyFilterModel.projectId;
        const assignedToUserId = this.storyFilterModel.assignedToUserId;
        const storyStatusId = this.storyFilterModel.storyStatusId;
        const storyTeamId = this.storyFilterModel.storyTeamId;

        let userStoriesUrl: string = null;
        if (this.storyFilterModel.sprintId && this.storyFilterModel.sprintId > 0) {
            userStoriesUrl = UrlHelper.GetSprintsUrl(ApiUrl.SprintStories, this.storyFilterModel.sprintId);
        }
        else {
            const u = this.isMyPage ? ApiUrl.MyStories : ApiUrl.ProjectStories;
            userStoriesUrl = UrlHelper.GetProjectStoriesUrl(u, projectId, 0);
        }

        MainLoader.show();
        let $this = this;
        this.apiService.get(userStoriesUrl, { pno, psize, projectId, assignedToUserId, storyStatusId, storyTeamId })
            .done((stories: IPagingModel<IProjectStoryDisplayDto>) => {


                if (this.storyFilterModel.sprintId) {
                    this.resetSprintHrsBars();

                    const storyHours = stories.AdditionalData as IStoryHour;
                    if (storyHours) {
                        this.setSprintHrsBars(storyHours);
                    }
                }

                this.storiesContainerUl.empty();
                this.pagingContainer.empty();
                if (stories && stories.Data && stories.Data.length) {
                    this.infoContainer.show();
                    stories.Data.forEach(story => {

                        const li = this.templateLi.clone();
                        li.find("td:first").addClass("drag-handler");
                        li.find('[t-env]').text(story.Environment || 'Env');
                        li.find('[t-story-name]').text(story.StoryName || 'N/A');
                        li.find('[t-story-as-a]').text(story.F1 || 'N/A');
                        li.find('[t-story-i-want-to]').text(story.F2 || 'N/A');
                        li.find('[t-so-i-can]').text(story.F3 || 'N/A');

                        li.find('[t-acceptance-criteria]').html(story.AcceptanceCriteria.replace(/\n/g, "<br/>") || 'N/A');

                        li.find('[t-requester]').text(story.RequesterName || 'N/A');
                        li.find('[t-assignee]').text(story.AssigneeName || 'N/A');
                        li.find('[t-status]').text(story.StoryStatusName || 'N/A');
                        li.find('[t-story-type]').text(story.StoryTypeName || 'N/A');
                        li.find('[t-priority-ranking]').text(story.PriorityRanking || '');
                        const projected = story.ProjectedHours || 0;
                        const actual = story.ActualHours || 0;

                        let actualClass = 'bg-info';
                        if (projected > actual)
                            actualClass = 'bg-success text-success';
                        else if (projected < actual)
                            actualClass = 'bg-danger text-danger';
                        li.find('[t-projected-hours]').text(projected).addClass('bg-info');
                        li.find('[t-actual-hours]').text(actual).addClass(actualClass);

                        li.find('[t-link]').attr('href', `/Project/${story.ProjectId}/User-Story/${story.StoryId}`).attr('title', `AS A ${story.F1}, I WANT TO ${story.F2}`);



                        li.find('[t-start-date]').text(Utils.JsonDateToStr(story.StartDate) || 'N/A');
                        li.find('[t-end-date]').text(Utils.JsonDateToStr(story.EndDate) || 'N/A');
                        li.find('[t-data-story-id]').attr('data-story-id', story.StoryId);
                        li.find('[t-data-project-id]').attr('data-project-id', story.ProjectId);
                        li.find('[t-project]').text(story.ProjectName);
                        li.attr("data-id", story.StoryId);

                        if (story.Notes && story.Notes.length > 0) {
                            let note = story.Notes[0].replace(/\n/g, "<br />");
                            li.find('[t-story-note]').html(note);
                        }
                        else {
                            li.find('[t-story-note]').text('N/A');
                        }

                        //li.find('[t-title]').html(`<strong>As a</strong> ${story.F1} <strong>I want to</strong> ${story.F2} <strong>So I can</strong> ${story.F3}`);


                        $(li).addClass("user-stories-li");
                        this.storiesContainerUl.append(li);
                    });
                    if (showPaging) {
                        const pageModel: IPaginationModel = {
                            CurrentPageNumber: stories.CurrentPageNumber,
                            IsLastPage: stories.IsLastPage,
                            PageSize: stories.PageSize,
                            TotalPages: stories.Count,
                        };
                        const pagination = Pagination.Render(pageModel);
                        this.pagingContainer.html(`${pagination}`);

                        const startFrom = ((stories.CurrentPageNumber - 1) * stories.PageSize) + 1;
                        const endTo = startFrom + stories.Data.length - 1;

                        this.startFromElement.html(`${startFrom}`);
                        this.endToElement.html(`${endTo}`);
                        this.totalElement.html(`${stories.Count}`);
                    }

                    if (UserTokenHandler.isSuperUser()) {
                        setTimeout(() => {
                            $("#user-stories-list").sortable({
                                items: 'tr',
                                handle: ".drag-handler",
                                cursor: 'move',
                                placeholder: "sortable-placeholder",
                                dropOnEmpty: false,
                                update: function (event, ui) {
                                    let stories = [];
                                    let liList = $("#user-stories-list tr.user-stories-li");
                                    for (var i = 0; i < liList.length; i++) {
                                        stories.push({
                                            Id: parseInt($(liList[i]).attr("data-id")),
                                            Order: i + 1
                                        });
                                    }
                                    MainLoader.show();
                                    let projectStoriesOrderUpdateUrl = UrlHelper.GetProjectStoriesOrderUpdateUrl(ApiUrl.ProjectStoryBulkOrderUpdate, projectId);
                                    $this.apiService.postJson(projectStoriesOrderUpdateUrl, JSON.stringify({ Stories: stories }))
                                        .done((ret) => {
                                            Alerts.Success('Ranks updated successfully.', 'Success');
                                            $this.loadStories(1, Constants.DefaultPageSize, true);
                                        }).always(() => {
                                            MainLoader.hide();
                                        });;
                                }
                            });
                        }, 500);
                    }


                    if (projectId > 0) {
                        const projectDetailUrl = UrlHelper.GetProjectsUrl(ApiUrl.ProjectDetail, projectId);

                        this.apiService.get(projectDetailUrl)
                            .done((project: IProjectDto) => {
                                if (!(UserTokenHandler.isSuperUser() || UserTokenHandler.isUserStakeholderOrOwnerForProject(project))) {
                                    $("[ap-action-story-copy-to-next-sprint]").hide();
                                    $("[ap-action-story-modal-form]").hide();
                                }
                                else {
                                    $("[ap-action-story-copy-to-next-sprint]").show();
                                    $("[ap-action-story-modal-form]").show();
                                }
                            });
                    }
                    else if (UserTokenHandler.isSuperUser()) {
                        $("[ap-action-story-copy-to-next-sprint]").show();
                        $("[ap-action-story-modal-form]").show();
                    }
                    else {
                        $("[ap-action-story-copy-to-next-sprint]").hide();
                        $("[ap-action-story-modal-form]").hide();
                    }
                }
                else {
                    Alerts.Info('No stories found.');
                    if (showPaging) {
                        this.pagingContainer.html('');

                        this.startFromElement.html(`0`);
                        this.endToElement.html(`0`);
                        this.totalElement.html(`0`);
                    }
                }
            })
            .always(() => {
                MainLoader.hide();
            });
    };
    setMaxRank(projectId: number) {
        MainLoader.show();
        const storyId: number = $('#story-id').val() || 0;
        const url = UrlHelper.GetProjectsUrl(ApiUrl.ProjectStoriesMaxRank, projectId);

        this.apiService.get(url)
            .done((maxRank: number) => {
                if (maxRank) {
                    if (storyId == 0) {
                        this.saveStoryModalForm.find('[name=PriorityRanking]').val(maxRank + 1).trigger('input');
                    }
                }
            })
            .always(() => MainLoader.hide());
    }
    getStoryDetails(storyId: number, projectId: number) {
        const storyDetailUrl = UrlHelper.GetProjectStoriesUrl(ApiUrl.ProjectStoriyDetail, projectId, storyId);

        MainLoader.show();
        this.apiService.get(storyDetailUrl)
            .done((story: IProjectStoryDisplayDto) => {
                $('[data-story-name]').text(story.StoryName);
                $('[data-story-f1]').text(story.F1);
                $('[data-story-projectname]').text(story.ProjectName);
                $('[data-story-priority]').text(story.PriorityRanking);
                $('[data-story-env]').text(story.Environment || 'ENV');
                $('[data-story-status]').text(story.StoryStatusName || 'Status');
                $('[data-story-f2]').text(story.F2);
                $('[data-story-f3]').text(story.F3);
                $('[data-story-acceptancecriteria]').html(story.AcceptanceCriteria.replace(/\n/g, "<br/>"));
                $('[data-story-assignee]').text(story.AssigneeName);
                $('[data-story-requester]').text(story.RequesterName);
                $('[data-story-type]').text(story.StoryTypeName);
                $('[data-story-requesteddate]').text(Utils.JsonDateToStr(story.RequestDate));

                $('[data-story-requestertargetdate]').text(Utils.JsonDateToStr(story.RequesterTargetDate));
                $('[data-story-groomingcompletedate]').text(Utils.JsonDateToStr(story.GroomingCompleteDate));
                $('[data-story-prodtargetdate]').text(Utils.JsonDateToStr(story.ProdTargetDate));


                $('[data-story-daterange]').text(`${Utils.JsonDateToStr(story.StartDate)} - ${Utils.JsonDateToStr(story.EndDate)}`);
            })
            .always(() => MainLoader.hide());

        const projectDetailUrl = UrlHelper.GetProjectsUrl(ApiUrl.ProjectDetail, projectId);

        this.apiService.get(projectDetailUrl)
            .done((project: IProjectDto) => {
                if (!(UserTokenHandler.isSuperUser() || UserTokenHandler.isUserStakeholderOrOwnerForProject(project))) {
                    $("[ap-action-story-modal-form]").remove();
                    $("[ap-action-task-modal-form]").remove();
                    $("[ap-action-note-modal-form]").remove();
                    $("[ap-action-file-modal-form]").remove();
                }
            });

    }

    setPopupFieldsToUpdateStory(s: IProjectStoryDisplayDto) {

        this.saveStoryModalForm.find('[name=StoryStatus]').val(s.StoryStatusId);
        this.saveStoryModalForm.find('[name=StoryTypeId]').val(s.StoryTypeId);
        this.saveStoryModalForm.find('[name=PriorityRanking]').val(s.PriorityRanking || 0).trigger('input');
        this.saveStoryModalForm.find('[name=F1]').val(s.F1);
        this.saveStoryModalForm.find('[name=F2]').val(s.F2);
        this.saveStoryModalForm.find('[name=F3]').val(s.F3);
        this.saveStoryModalForm.find('[name=StoryName]').val(s.StoryName);


        this.saveStoryModalForm.find('[name=AcceptanceCriteria]').val(s.AcceptanceCriteria);
        this.saveStoryModalForm.find('[name=RequestDate]').val(Utils.JsonDateToStr(s.RequestDate, true));

        this.saveStoryModalForm.find('[name=RequesterTargetDate]').val(Utils.JsonDateToStr(s.RequesterTargetDate, true));
        this.saveStoryModalForm.find('[name=GroomingCompleteDate]').val(Utils.JsonDateToStr(s.GroomingCompleteDate, true));
        this.saveStoryModalForm.find('[name=ProdTargetDate]').val(Utils.JsonDateToStr(s.ProdTargetDate, true));


        this.saveStoryModalForm.find('[name=StartDate]').val(Utils.JsonDateToStr(s.StartDate, true));
        this.saveStoryModalForm.find('[name=EndDate]').val(Utils.JsonDateToStr(s.EndDate, true));

        this.saveStoryModalForm.find('[name=RequesterId]').val(s.RequesterId);
        this.saveStoryModalForm.find('#requster-name').val(s.RequesterName);

        this.saveStoryModalForm.find('[name=AssignedToUserId]').val(s.AssigneeId);
        this.saveStoryModalForm.find('#assigned-to-name').val(s.AssigneeName);

        this.saveStoryModalForm.find('[name=Environment]').val(s.Environment);

        if (s.SprintIdNames) {
            const sprintIds = Object.keys(s.SprintIdNames);

            this.saveStoryModalForm.find('[name=SprintIds]').val(sprintIds.join());
            this.saveStoryModalForm.find('#sprint-id').val(sprintIds).trigger('change');
        }
    }

    openCreateStoryPopup(projectId: number = 0, storyId: number = 0, sprintId = 0) {
        if (projectId <= 0 || parseInt($('#story-project-id').val()) > 0) {
            projectId = parseInt($('#story-project-id').val());
        }

        if (storyId > 0 || projectId > 0) {
            const projectsDdl = this.createEditStoryModal.find('[name=ProjectId]');
            if (projectsDdl && projectsDdl.length && projectId > 0) {
                projectsDdl.val(projectId);
            }
            const storyIdElement = this.createEditStoryModal.find('[name=StoryId]');
            storyIdElement.val(storyId);
        }
        
        if (projectId > 0) {
            
            const projectDetailUrl = UrlHelper.GetProjectsUrl(ApiUrl.ProjectDetail, projectId);

            this.apiService.get(projectDetailUrl)
                .done((project: IProjectDto) => {
                    this.saveStoryModalForm.find('[name="StoryName"]').val(project.ProjectAbbreviation+project.NextNumber);
                });
        }
        if (sprintId > 0)
            this.saveStoryModalForm.find('#sprint-id').val(sprintId).trigger('change');

        if (storyId > 0) {
            const u = UrlHelper.GetProjectStoriesUrl(ApiUrl.ProjectStoriyDetail, projectId, storyId);
            MainLoader.show();
            this.apiService.get(u).done((s: IProjectStoryDisplayDto) => {
                this.setPopupFieldsToUpdateStory(s);
                this.createEditStoryModal.modal('show');
            })
                .always(() => MainLoader.hide());
        }
        else {
            if (projectId > 0 && storyId == 0)
                this.setMaxRank(projectId);
            this.createEditStoryModal.modal('show');
        }
    }
    newGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    openCreateQuickStoryPopup(projectId: number = 0, storyId: number = 0, sprintId = 0) {        
        if (projectId <= 0 || parseInt($('#story-project-id').val()) > 0)
        {
            projectId = parseInt($('#story-project-id').val());
        }

        const guid = this.newGuid();

        const tempGuidElement = this.createEditQuickStoryModal.find('[name=tmpGuid]');
        tempGuidElement.val(guid);
        this.createEditQuickStoryModal.find('#btnUploadTempFile').data("record-id", guid);

        if (storyId > 0 || projectId > 0) {
            const projectsDdl = this.createEditQuickStoryModal.find('[name=ProjectId]');
            if (projectsDdl && projectsDdl.length && projectId > 0) {
                projectsDdl.val(projectId);
            }
            const storyIdElement = this.createEditQuickStoryModal.find('[name=StoryId]');
            storyIdElement.val(storyId);
        }
        
        if (projectId > 0) {
            projectId = projectId == 0 ? parseInt($('#story-project-id').val()) : projectId;
            const projectDetailUrl = UrlHelper.GetProjectsUrl(ApiUrl.ProjectDetail, projectId);

            this.apiService.get(projectDetailUrl)
                .done((project: IProjectDto) => {
                    this.saveQuickStoryModalForm.find('[name="StoryName"]').val(project.ProjectAbbreviation + project.NextNumber);
                });
        }

        if (sprintId > 0)
            this.saveQuickStoryModalForm.find('#sprint-id').val(sprintId).trigger('change');

        const storageItem = localStorage.getItem(Constants.UserData);
        if (storageItem) {
            const user: IProjectUser = JSON.parse(storageItem);
            this.saveQuickStoryModalForm.find('#requester-id').val(user.UserId);
        }

        const storyStatusUrl = UrlHelper.GetProjectStoriesUrl(ApiUrl.ProjectStoriesStatus, 0, 0);
        this.apiService.get(storyStatusUrl)
            .done((status: IDdlModel[]) => {
                var preGroomedStatus = status.filter(a => { return a.Text.toLowerCase() == "pre-groomed" })[0];
                if (preGroomedStatus) {
                    this.saveQuickStoryModalForm.find('#story-status').val(preGroomedStatus.Value.toString());
                }
            }).
            always(() => {                
            });

        this.createEditQuickStoryModal.modal('show');       
        
    }
    resetProjectStoryForm() {
        this.multiSelectSprintDdl.val('').trigger('change');
        (this.saveStoryModalForm[0] as HTMLFormElement).reset();
        this.saveStoryModalForm.find('input:hidden').val('').trigger('input');
        this.saveStoryModalForm.find('[name=PriorityRanking]').val(0).trigger('input');
        this.saveStoryModalForm.find('[name=StoryId]').val(0).trigger('input');
        $('#story-project-id').val(this.storyFilterModel.projectId);
    }
    resetQuickProjectStoryForm() {
        this.multiSelectSprintDdl.val('').trigger('change');
        (this.saveQuickStoryModalForm[0] as HTMLFormElement).reset();        
        this.saveQuickStoryModalForm.find('input:hidden').val('').trigger('input');  
        this.saveQuickStoryModalForm.find('[name=PriorityRanking]').val(99);
        this.saveQuickStoryModalForm.find('[name=StoryId]').val(0).trigger('input');
        $('#story-project-id').val(this.storyFilterModel.projectId);
    }

    private init() {
        $(document).on('click', '#user-stories-paging-container a[data-pno]', e => {
            const btn = $(e.target).closest('a[data-pno]');
            const pNo: number = btn.data('pno') || 0;
            if (pNo > 0) {
                this.loadStories(pNo, Constants.DefaultPageSize, true);
            }
        });

        this.createEditStoryModal.on('show.bs.modal', () => {
            const selectedProjectId: number = $('#story-project-id').val() || 0;

            if (selectedProjectId > 0)
                this.setMaxRank(selectedProjectId);
        });
        this.createEditStoryModal.on('hide.bs.modal', () => {
            this.resetProjectStoryForm();
        });
        
        this.createEditQuickStoryModal.on('hide.bs.modal', () => {
            this.resetQuickProjectStoryForm();
        });

        this.multiSelectSprintDdl.on('change', e => {
            const sprintIdValues = this.multiSelectSprintDdl.val();

            if (sprintIdValues)
                this.saveStoryModalForm.find('[name="SprintIds"]').val(sprintIdValues.join());
        });

        $(document).on('click', '[ap-action-story-modal-form]', e => {

            const btn = $(e.target).closest('[ap-action-story-modal-form]');
            const projectId: number = btn.data('project-id') || 0;
            const storyId: number = btn.data('story-id') || 0;
            const sprintId: number = btn.data('sprint-id') || 0;
            this.openCreateStoryPopup(projectId, storyId, sprintId);
        });

        $(document).on('click', '[ap-action-quick-story-modal-form]', e => {
            const btn = $(e.target).closest('[ap-action-quick-story-modal-form]');
            const projectId: number = btn.data('project-id') || 0;
            const storyId: number = btn.data('story-id') || 0;
            const sprintId: number = btn.data('sprint-id') || 0;
            this.openCreateQuickStoryPopup(projectId, storyId, sprintId);
        });

        $(document).on('click', '[ap-action-story-copy-to-next-sprint]', e => {

            const btn = $(e.target).closest('[ap-action-story-copy-to-next-sprint]');
            const projectId: number = btn.data('project-id') || 0;
            const storyId: number = btn.data('story-id') || 0;
            const sprintId: number = parseInt($("#MainSprintId").val()) || 0;
            MainLoader.show();
            const url: string = UrlHelper.GetProjectStoryCopyToNextSprintUrl(ApiUrl.ProjectStoryCopyToNextSprint, projectId, storyId, sprintId);

            this.apiService.post(url, {})
                .done((data: any, status: string, xhr: JQueryXHR) => {
                    Alerts.Success('Story copied to next sprint', 'Success');
                })
                .always(() => MainLoader.hide());

        });

        this.saveStoryBtn.on('click', () => {

            const projectId: number = this.saveStoryModalForm.find('[name=ProjectId]').val();
            const storyId: number = this.saveStoryModalForm.find('[name=StoryId]').val() || 0;

            if (storyId > 0) {
                MainLoader.show();
                const storySaveUrl: string = UrlHelper.GetProjectStoriesUrl(ApiUrl.ProjectStoryUpdate, projectId, storyId);
                this.apiService.put(storySaveUrl, this.saveStoryModalForm.serialize())
                    .done((data: any, status: string, xhr: JQueryXHR) => {
                        if (xhr.status === 200 || xhr.status === 201) {
                            Alerts.Success('Story saved successfully.', 'Success');
                            this.createEditStoryModal.modal('hide');

                            if (this.isProjectDetailPage)
                                this.loadStories(1, Constants.NestedDefaultPageSize, false);
                            else if (this.isDetailPage)
                                this.getStoryDetails(storyId, projectId);
                            else
                                this.loadStories(1, Constants.DefaultPageSize, true);
                        }
                    })
                    .always(() => MainLoader.hide());
            }
            else {
                MainLoader.show();
                const storySaveUrl: string = UrlHelper.GetProjectStoriesUrl(ApiUrl.ProjectStoryCreate, projectId, 0);
                this.apiService.post(storySaveUrl, this.saveStoryModalForm.serialize())
                    .done((data: any, status: string, xhr: JQueryXHR) => {
                        if (xhr.status === 200 || xhr.status === 201) {
                            Alerts.Success('Story created successfully.', 'Success');
                            this.createEditStoryModal.modal('hide');

                            if (this.isProjectDetailPage)
                                this.loadStories(1, Constants.NestedDefaultPageSize, false);
                            else if (!this.isDetailPage)
                                this.loadStories(1, Constants.DefaultPageSize, true);
                        }
                    })
                    .always(() => MainLoader.hide());
            }
        });



        this.saveQuickStoryBtn.on('click', () => {
            const projectId: number = this.saveQuickStoryModalForm.find('[name=ProjectId]').val();
            const storyId: number = this.saveQuickStoryModalForm.find('[name=StoryId]').val() || 0;
            const tempGuid: string = this.saveQuickStoryModalForm.find('[name=tmpGuid]').val() || "";
            MainLoader.show();
            const storySaveUrl: string = UrlHelper.GetProjectStoriesUrl(ApiUrl.ProjectStoryQuickCreate, projectId, 0, "", tempGuid);
            this.apiService.post(storySaveUrl, this.saveQuickStoryModalForm.serialize())
                .done((data: any, status: string, xhr: JQueryXHR) => {
                    if (xhr.status === 200 || xhr.status === 201) {
                        Alerts.Success('Story created successfully.', 'Success');
                        this.createEditQuickStoryModal.modal('hide');

                        if (this.isProjectDetailPage)
                            this.loadStories(1, Constants.NestedDefaultPageSize, false);
                        else if (!this.isDetailPage)
                            this.loadStories(1, Constants.DefaultPageSize, true);
                    }
                })
                .always(() => MainLoader.hide());

        });

        this.createEditStoryModal.find('[name=ProjectId]').on('change', e => {
            const ddl = $(e.target).closest('select');
            const projectId: number = ddl.val() || 0;
            if (projectId) {
                this.setMaxRank(projectId);

                const projectDetailUrl = UrlHelper.GetProjectsUrl(ApiUrl.ProjectDetail, projectId);

                this.apiService.get(projectDetailUrl)
                    .done((project: IProjectDto) => {
                        this.saveStoryModalForm.find('[name="StoryName"]').val(project.ProjectAbbreviation + project.NextNumber);
                    });
            }
        });

        this.createEditQuickStoryModal.find('[name=ProjectId]').on('change', e => {
            const ddl = $(e.target).closest('select');
            const projectId: number = ddl.val() || 0;
            if (projectId) {               
                const projectDetailUrl = UrlHelper.GetProjectsUrl(ApiUrl.ProjectDetail, projectId);
                this.apiService.get(projectDetailUrl)
                    .done((project: IProjectDto) => {
                        this.saveQuickStoryModalForm.find('[name="StoryName"]').val(project.ProjectAbbreviation + project.NextNumber);
                    });
            }
        });
    }
}