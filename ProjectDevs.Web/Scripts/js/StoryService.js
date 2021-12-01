/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="Models.ts" />
/// <reference path="Constants.ts" />
/// <reference path="Common.ts" />
/// <reference path="UserService.ts" />
/// <reference path="FileService.ts" />
var StoryService = /** @class */ (function () {
    function StoryService(isMyPage, apiService, fileService, isDetailPage, isProjectDetailPage) {
        if (isDetailPage === void 0) { isDetailPage = false; }
        if (isProjectDetailPage === void 0) { isProjectDetailPage = false; }
        this.isMyPage = isMyPage;
        this.apiService = apiService;
        this.fileService = fileService;
        this.isDetailPage = isDetailPage;
        this.isProjectDetailPage = isProjectDetailPage;
        this.templateLi = $('#story-list-item-template>table>tbody>tr').first();
        this.storiesContainerUl = $('#user-stories-list');
        this.pagingContainer = $('#user-stories-paging-container');
        this.infoContainer = $('#apdt_userstories_info');
        this.startFromElement = this.infoContainer.find('.apdt_startfrom');
        this.endToElement = this.infoContainer.find('.apdt_endto');
        this.totalElement = this.infoContainer.find('.apdt_total');
        this.sprintProjectedHrsBar = $('#sprint-projected-hrs-progress-bar');
        this.sprintActualHrsBar = $('#sprint-actual-hrs-progress-bar');
        this.sprintRemainingHrsBar = $('#sprint-projected-hrs-remaining-progress-bar');
        this.createEditStoryModal = $('#create-edit-story-modal');
        this.saveStoryModalForm = this.createEditStoryModal.find('#story-form');
        this.saveStoryBtn = this.createEditStoryModal.find('#save-story-btn');
        this.createEditQuickStoryModal = $('#create-edit-quick-story-modal');
        this.saveQuickStoryModalForm = this.createEditQuickStoryModal.find('#quick-story-form');
        this.saveQuickStoryBtn = this.createEditQuickStoryModal.find('#save-story-btn');
        this.multiSelectSprintDdl = this.saveStoryModalForm.find('#sprint-id');
        this.storyFilterModel = {
            projectId: 0,
            assignedToUserId: null,
            storyStatusId: "",
            sprintId: 0,
            assignedToUserName: null,
            storyTeamId: ""
        };
        this.storyToSprintFilterModel = {
            projectId: null,
            assignedToUserId: null,
            assignedToUserName: null,
            teamId: null
        };
        this.init();
    }
    StoryService.prototype.clearStories = function () {
        this.storiesContainerUl.empty();
        this.pagingContainer.html('');
        this.startFromElement.html("0");
        this.endToElement.html("0");
        this.totalElement.html("0");
        this.infoContainer.hide();
    };
    StoryService.prototype.resetSprintHrsBars = function () {
        this.sprintActualHrsBar.removeClass('progress-bar-danger').addClass('progress-bar-success').width("0%");
        this.sprintProjectedHrsBar.width("0%").text("Projected: 0");
        this.sprintActualHrsBar.text("Actual: 0");
        this.sprintRemainingHrsBar.width("0%");
        this.sprintActualHrsBar.removeClass('active').width("0%").attr('value-now', 0);
    };
    StoryService.prototype.setSprintHrsBars = function (hrs) {
        var _this = this;
        var projectedLength = 100;
        var actualLength = 0;
        var remainigLength = 0;
        if (hrs.ActualHours >= hrs.ProjectedHours) {
            actualLength = 100;
            if (hrs.ActualHours > hrs.ProjectedHours) {
                this.sprintActualHrsBar.removeClass('progress-bar-success').addClass('progress-bar-danger');
            }
        }
        else if (hrs.ProjectedHours == 0) {
            return false;
        }
        else {
            remainigLength = ((hrs.ProjectedHours - hrs.ActualHours) / hrs.ProjectedHours) * 100;
            actualLength = 100 - remainigLength;
        }
        this.sprintProjectedHrsBar.width(projectedLength + "%").text("Projected: " + hrs.ProjectedHours + " Hrs");
        this.sprintActualHrsBar.text("Actual: " + hrs.ActualHours + " Hrs");
        this.sprintRemainingHrsBar.width(remainigLength + "%");
        setTimeout(function () {
            _this.sprintActualHrsBar.addClass('active').width(actualLength + "%").attr('value-now', actualLength);
            setTimeout(function () { return _this.sprintActualHrsBar.removeClass('active'); }, 2500);
        }, 2000);
    };
    StoryService.prototype.loadStories = function (pno, psize, showPaging) {
        var _this = this;
        if (pno === void 0) { pno = 1; }
        if (psize === void 0) { psize = Constants.DefaultPageSize; }
        if (showPaging === void 0) { showPaging = false; }
        var projectId = this.storyFilterModel.projectId;
        var assignedToUserId = this.storyFilterModel.assignedToUserId;
        var storyStatusId = this.storyFilterModel.storyStatusId;
        var storyTeamId = this.storyFilterModel.storyTeamId;
        var userStoriesUrl = null;
        if (this.storyFilterModel.sprintId && this.storyFilterModel.sprintId > 0) {
            userStoriesUrl = UrlHelper.GetSprintsUrl(ApiUrl.SprintStories, this.storyFilterModel.sprintId);
        }
        else {
            var u = this.isMyPage ? ApiUrl.MyStories : ApiUrl.ProjectStories;
            userStoriesUrl = UrlHelper.GetProjectStoriesUrl(u, projectId, 0);
        }
        MainLoader.show();
        var $this = this;
        this.apiService.get(userStoriesUrl, { pno: pno, psize: psize, projectId: projectId, assignedToUserId: assignedToUserId, storyStatusId: storyStatusId, storyTeamId: storyTeamId })
            .done(function (stories) {
            if (_this.storyFilterModel.sprintId) {
                _this.resetSprintHrsBars();
                var storyHours = stories.AdditionalData;
                if (storyHours) {
                    _this.setSprintHrsBars(storyHours);
                }
            }
            _this.storiesContainerUl.empty();
            _this.pagingContainer.empty();
            if (stories && stories.Data && stories.Data.length) {
                _this.infoContainer.show();
                stories.Data.forEach(function (story) {
                    var li = _this.templateLi.clone();
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
                    var projected = story.ProjectedHours || 0;
                    var actual = story.ActualHours || 0;
                    var actualClass = 'bg-info';
                    if (projected > actual)
                        actualClass = 'bg-success text-success';
                    else if (projected < actual)
                        actualClass = 'bg-danger text-danger';
                    li.find('[t-projected-hours]').text(projected).addClass('bg-info');
                    li.find('[t-actual-hours]').text(actual).addClass(actualClass);
                    li.find('[t-link]').attr('href', "/Project/" + story.ProjectId + "/User-Story/" + story.StoryId).attr('title', "AS A " + story.F1 + ", I WANT TO " + story.F2);
                    li.find('[t-start-date]').text(Utils.JsonDateToStr(story.StartDate) || 'N/A');
                    li.find('[t-end-date]').text(Utils.JsonDateToStr(story.EndDate) || 'N/A');
                    li.find('[t-data-story-id]').attr('data-story-id', story.StoryId);
                    li.find('[t-data-project-id]').attr('data-project-id', story.ProjectId);
                    li.find('[t-project]').text(story.ProjectName);
                    li.attr("data-id", story.StoryId);
                    if (story.Notes && story.Notes.length > 0) {
                        var note = story.Notes[0].replace(/\n/g, "<br />");
                        li.find('[t-story-note]').html(note);
                    }
                    else {
                        li.find('[t-story-note]').text('N/A');
                    }
                    //li.find('[t-title]').html(`<strong>As a</strong> ${story.F1} <strong>I want to</strong> ${story.F2} <strong>So I can</strong> ${story.F3}`);
                    $(li).addClass("user-stories-li");
                    _this.storiesContainerUl.append(li);
                });
                if (showPaging) {
                    var pageModel = {
                        CurrentPageNumber: stories.CurrentPageNumber,
                        IsLastPage: stories.IsLastPage,
                        PageSize: stories.PageSize,
                        TotalPages: stories.Count,
                    };
                    var pagination = Pagination.Render(pageModel);
                    _this.pagingContainer.html("" + pagination);
                    var startFrom = ((stories.CurrentPageNumber - 1) * stories.PageSize) + 1;
                    var endTo = startFrom + stories.Data.length - 1;
                    _this.startFromElement.html("" + startFrom);
                    _this.endToElement.html("" + endTo);
                    _this.totalElement.html("" + stories.Count);
                }
                if (UserTokenHandler.isSuperUser()) {
                    setTimeout(function () {
                        $("#user-stories-list").sortable({
                            items: 'tr',
                            handle: ".drag-handler",
                            cursor: 'move',
                            placeholder: "sortable-placeholder",
                            dropOnEmpty: false,
                            update: function (event, ui) {
                                var stories = [];
                                var liList = $("#user-stories-list tr.user-stories-li");
                                for (var i = 0; i < liList.length; i++) {
                                    stories.push({
                                        Id: parseInt($(liList[i]).attr("data-id")),
                                        Order: i + 1
                                    });
                                }
                                MainLoader.show();
                                var projectStoriesOrderUpdateUrl = UrlHelper.GetProjectStoriesOrderUpdateUrl(ApiUrl.ProjectStoryBulkOrderUpdate, projectId);
                                $this.apiService.postJson(projectStoriesOrderUpdateUrl, JSON.stringify({ Stories: stories }))
                                    .done(function (ret) {
                                    Alerts.Success('Ranks updated successfully.', 'Success');
                                    $this.loadStories(1, Constants.DefaultPageSize, true);
                                }).always(function () {
                                    MainLoader.hide();
                                });
                                ;
                            }
                        });
                    }, 500);
                }
                if (projectId > 0) {
                    var projectDetailUrl = UrlHelper.GetProjectsUrl(ApiUrl.ProjectDetail, projectId);
                    _this.apiService.get(projectDetailUrl)
                        .done(function (project) {
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
                    _this.pagingContainer.html('');
                    _this.startFromElement.html("0");
                    _this.endToElement.html("0");
                    _this.totalElement.html("0");
                }
            }
        })
            .always(function () {
            MainLoader.hide();
        });
    };
    ;
    StoryService.prototype.setMaxRank = function (projectId) {
        var _this = this;
        MainLoader.show();
        var storyId = $('#story-id').val() || 0;
        var url = UrlHelper.GetProjectsUrl(ApiUrl.ProjectStoriesMaxRank, projectId);
        this.apiService.get(url)
            .done(function (maxRank) {
            if (maxRank) {
                if (storyId == 0) {
                    _this.saveStoryModalForm.find('[name=PriorityRanking]').val(maxRank + 1).trigger('input');
                }
            }
        })
            .always(function () { return MainLoader.hide(); });
    };
    StoryService.prototype.getStoryDetails = function (storyId, projectId) {
        var storyDetailUrl = UrlHelper.GetProjectStoriesUrl(ApiUrl.ProjectStoriyDetail, projectId, storyId);
        MainLoader.show();
        this.apiService.get(storyDetailUrl)
            .done(function (story) {
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
            $('[data-story-daterange]').text(Utils.JsonDateToStr(story.StartDate) + " - " + Utils.JsonDateToStr(story.EndDate));
        })
            .always(function () { return MainLoader.hide(); });
        var projectDetailUrl = UrlHelper.GetProjectsUrl(ApiUrl.ProjectDetail, projectId);
        this.apiService.get(projectDetailUrl)
            .done(function (project) {
            if (!(UserTokenHandler.isSuperUser() || UserTokenHandler.isUserStakeholderOrOwnerForProject(project))) {
                $("[ap-action-story-modal-form]").remove();
                $("[ap-action-task-modal-form]").remove();
                $("[ap-action-note-modal-form]").remove();
                $("[ap-action-file-modal-form]").remove();
            }
        });
    };
    StoryService.prototype.setPopupFieldsToUpdateStory = function (s) {
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
            var sprintIds = Object.keys(s.SprintIdNames);
            this.saveStoryModalForm.find('[name=SprintIds]').val(sprintIds.join());
            this.saveStoryModalForm.find('#sprint-id').val(sprintIds).trigger('change');
        }
    };
    StoryService.prototype.openCreateStoryPopup = function (projectId, storyId, sprintId) {
        var _this = this;
        if (projectId === void 0) { projectId = 0; }
        if (storyId === void 0) { storyId = 0; }
        if (sprintId === void 0) { sprintId = 0; }
        if (projectId <= 0 || parseInt($('#story-project-id').val()) > 0) {
            projectId = parseInt($('#story-project-id').val());
        }
        if (storyId > 0 || projectId > 0) {
            var projectsDdl = this.createEditStoryModal.find('[name=ProjectId]');
            if (projectsDdl && projectsDdl.length && projectId > 0) {
                projectsDdl.val(projectId);
            }
            var storyIdElement = this.createEditStoryModal.find('[name=StoryId]');
            storyIdElement.val(storyId);
        }
        if (projectId > 0) {
            var projectDetailUrl = UrlHelper.GetProjectsUrl(ApiUrl.ProjectDetail, projectId);
            this.apiService.get(projectDetailUrl)
                .done(function (project) {
                _this.saveStoryModalForm.find('[name="StoryName"]').val(project.ProjectAbbreviation + project.NextNumber);
            });
        }
        if (sprintId > 0)
            this.saveStoryModalForm.find('#sprint-id').val(sprintId).trigger('change');
        if (storyId > 0) {
            var u = UrlHelper.GetProjectStoriesUrl(ApiUrl.ProjectStoriyDetail, projectId, storyId);
            MainLoader.show();
            this.apiService.get(u).done(function (s) {
                _this.setPopupFieldsToUpdateStory(s);
                _this.createEditStoryModal.modal('show');
            })
                .always(function () { return MainLoader.hide(); });
        }
        else {
            if (projectId > 0 && storyId == 0)
                this.setMaxRank(projectId);
            this.createEditStoryModal.modal('show');
        }
    };
    StoryService.prototype.newGuid = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
    StoryService.prototype.openCreateQuickStoryPopup = function (projectId, storyId, sprintId) {
        var _this = this;
        if (projectId === void 0) { projectId = 0; }
        if (storyId === void 0) { storyId = 0; }
        if (sprintId === void 0) { sprintId = 0; }
        if (projectId <= 0 || parseInt($('#story-project-id').val()) > 0) {
            projectId = parseInt($('#story-project-id').val());
        }
        var guid = this.newGuid();
        var tempGuidElement = this.createEditQuickStoryModal.find('[name=tmpGuid]');
        tempGuidElement.val(guid);
        this.createEditQuickStoryModal.find('#btnUploadTempFile').data("record-id", guid);
        if (storyId > 0 || projectId > 0) {
            var projectsDdl = this.createEditQuickStoryModal.find('[name=ProjectId]');
            if (projectsDdl && projectsDdl.length && projectId > 0) {
                projectsDdl.val(projectId);
            }
            var storyIdElement = this.createEditQuickStoryModal.find('[name=StoryId]');
            storyIdElement.val(storyId);
        }
        if (projectId > 0) {
            projectId = projectId == 0 ? parseInt($('#story-project-id').val()) : projectId;
            var projectDetailUrl = UrlHelper.GetProjectsUrl(ApiUrl.ProjectDetail, projectId);
            this.apiService.get(projectDetailUrl)
                .done(function (project) {
                _this.saveQuickStoryModalForm.find('[name="StoryName"]').val(project.ProjectAbbreviation + project.NextNumber);
            });
        }
        if (sprintId > 0)
            this.saveQuickStoryModalForm.find('#sprint-id').val(sprintId).trigger('change');
        var storageItem = localStorage.getItem(Constants.UserData);
        if (storageItem) {
            var user = JSON.parse(storageItem);
            this.saveQuickStoryModalForm.find('#requester-id').val(user.UserId);
        }
        var storyStatusUrl = UrlHelper.GetProjectStoriesUrl(ApiUrl.ProjectStoriesStatus, 0, 0);
        this.apiService.get(storyStatusUrl)
            .done(function (status) {
            var preGroomedStatus = status.filter(function (a) { return a.Text.toLowerCase() == "pre-groomed"; })[0];
            if (preGroomedStatus) {
                _this.saveQuickStoryModalForm.find('#story-status').val(preGroomedStatus.Value.toString());
            }
        }).
            always(function () {
        });
        this.createEditQuickStoryModal.modal('show');
    };
    StoryService.prototype.resetProjectStoryForm = function () {
        this.multiSelectSprintDdl.val('').trigger('change');
        this.saveStoryModalForm[0].reset();
        this.saveStoryModalForm.find('input:hidden').val('').trigger('input');
        this.saveStoryModalForm.find('[name=PriorityRanking]').val(0).trigger('input');
        this.saveStoryModalForm.find('[name=StoryId]').val(0).trigger('input');
        $('#story-project-id').val(this.storyFilterModel.projectId);
    };
    StoryService.prototype.resetQuickProjectStoryForm = function () {
        this.multiSelectSprintDdl.val('').trigger('change');
        this.saveQuickStoryModalForm[0].reset();
        this.saveQuickStoryModalForm.find('input:hidden').val('').trigger('input');
        this.saveQuickStoryModalForm.find('[name=PriorityRanking]').val(99);
        this.saveQuickStoryModalForm.find('[name=StoryId]').val(0).trigger('input');
        $('#story-project-id').val(this.storyFilterModel.projectId);
    };
    StoryService.prototype.init = function () {
        var _this = this;
        $(document).on('click', '#user-stories-paging-container a[data-pno]', function (e) {
            var btn = $(e.target).closest('a[data-pno]');
            var pNo = btn.data('pno') || 0;
            if (pNo > 0) {
                _this.loadStories(pNo, Constants.DefaultPageSize, true);
            }
        });
        this.createEditStoryModal.on('show.bs.modal', function () {
            var selectedProjectId = $('#story-project-id').val() || 0;
            if (selectedProjectId > 0)
                _this.setMaxRank(selectedProjectId);
        });
        this.createEditStoryModal.on('hide.bs.modal', function () {
            _this.resetProjectStoryForm();
        });
        this.createEditQuickStoryModal.on('hide.bs.modal', function () {
            _this.resetQuickProjectStoryForm();
        });
        this.multiSelectSprintDdl.on('change', function (e) {
            var sprintIdValues = _this.multiSelectSprintDdl.val();
            if (sprintIdValues)
                _this.saveStoryModalForm.find('[name="SprintIds"]').val(sprintIdValues.join());
        });
        $(document).on('click', '[ap-action-story-modal-form]', function (e) {
            var btn = $(e.target).closest('[ap-action-story-modal-form]');
            var projectId = btn.data('project-id') || 0;
            var storyId = btn.data('story-id') || 0;
            var sprintId = btn.data('sprint-id') || 0;
            _this.openCreateStoryPopup(projectId, storyId, sprintId);
        });
        $(document).on('click', '[ap-action-quick-story-modal-form]', function (e) {
            var btn = $(e.target).closest('[ap-action-quick-story-modal-form]');
            var projectId = btn.data('project-id') || 0;
            var storyId = btn.data('story-id') || 0;
            var sprintId = btn.data('sprint-id') || 0;
            _this.openCreateQuickStoryPopup(projectId, storyId, sprintId);
        });
        $(document).on('click', '[ap-action-story-copy-to-next-sprint]', function (e) {
            var btn = $(e.target).closest('[ap-action-story-copy-to-next-sprint]');
            var projectId = btn.data('project-id') || 0;
            var storyId = btn.data('story-id') || 0;
            var sprintId = parseInt($("#MainSprintId").val()) || 0;
            MainLoader.show();
            var url = UrlHelper.GetProjectStoryCopyToNextSprintUrl(ApiUrl.ProjectStoryCopyToNextSprint, projectId, storyId, sprintId);
            _this.apiService.post(url, {})
                .done(function (data, status, xhr) {
                Alerts.Success('Story copied to next sprint', 'Success');
            })
                .always(function () { return MainLoader.hide(); });
        });
        this.saveStoryBtn.on('click', function () {
            var projectId = _this.saveStoryModalForm.find('[name=ProjectId]').val();
            var storyId = _this.saveStoryModalForm.find('[name=StoryId]').val() || 0;
            if (storyId > 0) {
                MainLoader.show();
                var storySaveUrl = UrlHelper.GetProjectStoriesUrl(ApiUrl.ProjectStoryUpdate, projectId, storyId);
                _this.apiService.put(storySaveUrl, _this.saveStoryModalForm.serialize())
                    .done(function (data, status, xhr) {
                    if (xhr.status === 200 || xhr.status === 201) {
                        Alerts.Success('Story saved successfully.', 'Success');
                        _this.createEditStoryModal.modal('hide');
                        if (_this.isProjectDetailPage)
                            _this.loadStories(1, Constants.NestedDefaultPageSize, false);
                        else if (_this.isDetailPage)
                            _this.getStoryDetails(storyId, projectId);
                        else
                            _this.loadStories(1, Constants.DefaultPageSize, true);
                    }
                })
                    .always(function () { return MainLoader.hide(); });
            }
            else {
                MainLoader.show();
                var storySaveUrl = UrlHelper.GetProjectStoriesUrl(ApiUrl.ProjectStoryCreate, projectId, 0);
                _this.apiService.post(storySaveUrl, _this.saveStoryModalForm.serialize())
                    .done(function (data, status, xhr) {
                    if (xhr.status === 200 || xhr.status === 201) {
                        Alerts.Success('Story created successfully.', 'Success');
                        _this.createEditStoryModal.modal('hide');
                        if (_this.isProjectDetailPage)
                            _this.loadStories(1, Constants.NestedDefaultPageSize, false);
                        else if (!_this.isDetailPage)
                            _this.loadStories(1, Constants.DefaultPageSize, true);
                    }
                })
                    .always(function () { return MainLoader.hide(); });
            }
        });
        this.saveQuickStoryBtn.on('click', function () {
            var projectId = _this.saveQuickStoryModalForm.find('[name=ProjectId]').val();
            var storyId = _this.saveQuickStoryModalForm.find('[name=StoryId]').val() || 0;
            var tempGuid = _this.saveQuickStoryModalForm.find('[name=tmpGuid]').val() || "";
            MainLoader.show();
            var storySaveUrl = UrlHelper.GetProjectStoriesUrl(ApiUrl.ProjectStoryQuickCreate, projectId, 0, "", tempGuid);
            _this.apiService.post(storySaveUrl, _this.saveQuickStoryModalForm.serialize())
                .done(function (data, status, xhr) {
                if (xhr.status === 200 || xhr.status === 201) {
                    Alerts.Success('Story created successfully.', 'Success');
                    _this.createEditQuickStoryModal.modal('hide');
                    if (_this.isProjectDetailPage)
                        _this.loadStories(1, Constants.NestedDefaultPageSize, false);
                    else if (!_this.isDetailPage)
                        _this.loadStories(1, Constants.DefaultPageSize, true);
                }
            })
                .always(function () { return MainLoader.hide(); });
        });
        this.createEditStoryModal.find('[name=ProjectId]').on('change', function (e) {
            var ddl = $(e.target).closest('select');
            var projectId = ddl.val() || 0;
            if (projectId) {
                _this.setMaxRank(projectId);
                var projectDetailUrl = UrlHelper.GetProjectsUrl(ApiUrl.ProjectDetail, projectId);
                _this.apiService.get(projectDetailUrl)
                    .done(function (project) {
                    _this.saveStoryModalForm.find('[name="StoryName"]').val(project.ProjectAbbreviation + project.NextNumber);
                });
            }
        });
        this.createEditQuickStoryModal.find('[name=ProjectId]').on('change', function (e) {
            var ddl = $(e.target).closest('select');
            var projectId = ddl.val() || 0;
            if (projectId) {
                var projectDetailUrl = UrlHelper.GetProjectsUrl(ApiUrl.ProjectDetail, projectId);
                _this.apiService.get(projectDetailUrl)
                    .done(function (project) {
                    _this.saveQuickStoryModalForm.find('[name="StoryName"]').val(project.ProjectAbbreviation + project.NextNumber);
                });
            }
        });
    };
    return StoryService;
}());
//# sourceMappingURL=StoryService.js.map