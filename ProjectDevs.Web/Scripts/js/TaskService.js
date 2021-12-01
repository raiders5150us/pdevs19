/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="Models.ts" />
/// <reference path="Constants.ts" />
/// <reference path="Common.ts" />
/// <reference path="UserService.ts" />
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var TaskService = /** @class */ (function () {
    function TaskService(isMyPage, apiService, ddlService, isDetailPage, isStoryDetailPage, showPaging) {
        if (isDetailPage === void 0) { isDetailPage = false; }
        if (isStoryDetailPage === void 0) { isStoryDetailPage = false; }
        if (showPaging === void 0) { showPaging = true; }
        this.isMyPage = isMyPage;
        this.apiService = apiService;
        this.ddlService = ddlService;
        this.isDetailPage = isDetailPage;
        this.isStoryDetailPage = isStoryDetailPage;
        this.showPaging = showPaging;
        this.templateLi = $('#task-list-item-template > li').first();
        this.tasksContainerUl = $('#story-tasks-list');
        this.pagingContainer = $('#story-tasks-paging-container');
        this.infoContainer = $('#apdt_storytasks_info');
        this.startFromElement = this.infoContainer.find('.apdt_startfrom');
        this.endToElement = this.infoContainer.find('.apdt_endto');
        this.totalElement = this.infoContainer.find('.apdt_total');
        this.createEditTaskModal = $('#create-edit-task-modal');
        this.saveTaskModalForm = this.createEditTaskModal.find('#task-form');
        this.saveTaskBtn = this.createEditTaskModal.find('#save-task-btn');
        this.formProjectsDdl = this.saveTaskModalForm.find('#task-project-ddl');
        this.formStoryDdl = this.saveTaskModalForm.find('#task-story-ddl');
        this.selectedProjectId = 0;
        this.selectedStorId = 0;
        this.projectObj = null;
        this.defaultTaskFilterModel = {
            ProjectId: 0,
            StoryId: 0,
            TaskStatus: 0,
            TeamId: "",
            AssignedToUserId: null
        };
        this.init();
    }
    TaskService.prototype.loadTasks = function (taskFilter, pno, psize) {
        var _this = this;
        if (taskFilter === void 0) { taskFilter = this.defaultTaskFilterModel; }
        if (pno === void 0) { pno = 1; }
        if (psize === void 0) { psize = Constants.DefaultPageSize; }
        this.taskFilterModel = __assign({}, taskFilter);
        var u = this.isMyPage ? ApiUrl.MyTasks : ApiUrl.StoryTasks;
        var tasksUrl = UrlHelper.GetStoryTasksUrl(u, taskFilter.StoryId, 0);
        MainLoader.show();
        this.apiService.get(tasksUrl, __assign(__assign({}, taskFilter), { pno: pno, psize: psize }))
            .done(function (tasks) {
            _this.tasksContainerUl.empty();
            _this.infoContainer.show();
            if (tasks && tasks.Data && tasks.Data.length) {
                tasks.Data.forEach(function (task) {
                    var li = _this.templateLi.clone();
                    li.find('[t-status]').text(task.TaskStatusName);
                    li.find('[t-ticket-number]').text(task.TicketNumber);
                    li.find('[t-changeset]').text(task.Changeset || '');
                    li.find('[t-title]').text(task.TaskName);
                    li.find('[t-link]').attr('href', "/User-Story/" + task.StoryId + "/Tasks/" + task.TaskId);
                    li.find('[t-task-type]').text(task.TaskType);
                    li.find('[t-assignee]').text(task.AssigneeName);
                    li.find('[t-projected-hours]').text((task.ProjectedHours || 'NA') + " Hrs");
                    li.find('[t-actual-hours]').text((task.ActualHours || 'NA') + " Hrs");
                    li.find('[t-data-task-id]').attr('data-task-id', task.TaskId);
                    li.find('[t-data-story-id]').attr('data-story-id', task.StoryId);
                    li.find('[t-data-project-id]').attr('data-project-id', task.ProjectId);
                    _this.tasksContainerUl.append(li);
                });
                if (_this.showPaging) {
                    var pageModel = {
                        CurrentPageNumber: tasks.CurrentPageNumber,
                        IsLastPage: tasks.IsLastPage,
                        PageSize: tasks.PageSize,
                        TotalPages: tasks.Count,
                    };
                    var pagination = Pagination.Render(pageModel);
                    _this.pagingContainer.html("" + pagination);
                    var startFrom = ((tasks.CurrentPageNumber - 1) * tasks.PageSize) + 1;
                    var endTo = startFrom + tasks.Data.length - 1;
                    _this.startFromElement.html("" + startFrom);
                    _this.endToElement.html("" + endTo);
                    _this.totalElement.html("" + tasks.Count);
                }
                if (taskFilter.ProjectId > 0) {
                    var projectDetailUrl = UrlHelper.GetProjectsUrl(ApiUrl.ProjectDetail, taskFilter.ProjectId);
                    _this.apiService.get(projectDetailUrl)
                        .done(function (project) {
                        if (!(UserTokenHandler.isSuperUser() || UserTokenHandler.isUserStakeholderOrOwnerForProject(project))) {
                            $("[ap-action-task-modal-form]").hide();
                        }
                        else {
                            $("[ap-action-task-modal-form]").show();
                        }
                    });
                }
                else if (UserTokenHandler.isSuperUser()) {
                    $("[ap-action-task-modal-form]").show();
                }
                else {
                    $("[ap-action-task-modal-form]").hide();
                }
            }
            else {
                Alerts.Info('No tasks found.');
                if (_this.showPaging) {
                    _this.pagingContainer.html('');
                    _this.startFromElement.html("0");
                    _this.endToElement.html("0");
                    _this.totalElement.html("0");
                }
            }
        })
            .always(function () { return MainLoader.hide(); });
    };
    TaskService.prototype.clearTasks = function () {
        this.tasksContainerUl.empty();
        this.pagingContainer.html('');
        this.startFromElement.html("0");
        this.endToElement.html("0");
        this.totalElement.html("0");
    };
    TaskService.prototype.getTaskDetails = function (storyId, taskId) {
        var _this = this;
        var taskDetailUrl = UrlHelper.GetStoryTasksUrl(ApiUrl.StoryTaskDetail, storyId, taskId);
        MainLoader.show();
        this.apiService.get(taskDetailUrl)
            .done(function (task) {
            $('[data-task-name]').text(task.TaskName);
            $('[data-ticket-number]').text(task.TicketNumber);
            $('[data-changeset]').text(task.Changeset || '');
            $('[data-task-status]').text(task.TaskStatusName);
            $('[data-task-type]').text(task.TaskType);
            $('[data-assignee-name]').text(task.AssigneeName);
            $('[data-projected-hours]').text("Projected Hours: " + ((task.ProjectedHours || '') + " Hrs"));
            $('[data-actual-hours]').text('Actual Hours: ' + ((task.ActualHours || '') + " Hrs"));
            $('[data-task-description]').text(task.TaskDescription);
            $('[data-task-notes-link]').attr('href', "/Project/" + task.ProjectId + "/Notes/type/" + NoteType.Tasks + "/of/" + taskId);
            setTimeout(function () {
                debugger;
                $("#task-lob-ddl").val(task.LOB.split(',')).change();
            }, 500);
            var projectDetailUrl = UrlHelper.GetProjectsUrl(ApiUrl.ProjectDetail, task.ProjectId);
            _this.apiService.get(projectDetailUrl)
                .done(function (project) {
                if (!(UserTokenHandler.isSuperUser() || UserTokenHandler.isUserStakeholderOrOwnerForProject(project))) {
                    $("[ap-action-task-modal-form]").remove();
                    $("[ap-action-note-modal-form]").remove();
                    $("[ap-action-file-modal-form]").remove();
                }
            });
        })
            .always(function () { return MainLoader.hide(); });
    };
    TaskService.prototype.setPopupFieldsToUpdateTask = function (t) {
        this.saveTaskModalForm.find('[name=TaskStatus]').val(t.TaskStatus);
        this.saveTaskModalForm.find('[name=TaskType]').val(t.TaskType);
        this.saveTaskModalForm.find('[name=TaskName]').val(t.TaskName);
        this.saveTaskModalForm.find('[name=TicketNumber]').val(t.TicketNumber);
        this.saveTaskModalForm.find('[name=Changeset]').val(t.Changeset || '');
        this.saveTaskModalForm.find('[name=TaskDescription]').val(t.TaskDescription);
        this.saveTaskModalForm.find('[name=ProjectedHours]').val(t.ProjectedHours);
        this.saveTaskModalForm.find('[name=ActualHours]').val(t.ActualHours);
        this.saveTaskModalForm.find('[name=HoursWorked]').val(t.HoursWorked);
        this.saveTaskModalForm.find('[name=AssignedToUserId]').val(t.AssignedToUserId);
        this.saveTaskModalForm.find('#assignee-name').val(t.AssigneeName);
        $("#task-lob-ddl").val(t.LOB == null ? [] : t.LOB.split(',')).change();
    };
    TaskService.prototype.openCreateTaskPopup = function (storyId, taskId, projectId) {
        var _this = this;
        if (storyId === void 0) { storyId = 0; }
        if (taskId === void 0) { taskId = 0; }
        if (projectId === void 0) { projectId = 0; }
        if (taskId > 0) {
            this.formProjectsDdl.val(projectId);
            if (projectId > 0) {
                this.ddlService.setStoriesDdl(projectId, this.formStoryDdl, true, function () { _this.formStoryDdl.val(storyId); });
            }
        }
        var taskIdElement = this.createEditTaskModal.find('[name=TaskId]');
        taskIdElement.val(taskId);
        if (taskId > 0) {
            var u = UrlHelper.GetStoryTasksUrl(ApiUrl.StoryTaskDetail, storyId, taskId);
            MainLoader.show();
            this.apiService.get(u).done(function (t) {
                _this.setPopupFieldsToUpdateTask(t);
                _this.createEditTaskModal.modal('show');
            })
                .always(function () { return MainLoader.hide(); });
        }
        else {
            this.createEditTaskModal.modal('show');
            setTimeout(function () {
                _this.formProjectsDdl.val(projectId);
                if (projectId > 0) {
                    _this.ddlService.setStoriesDdl(projectId, _this.formStoryDdl, true, function () { _this.formStoryDdl.val(storyId); });
                }
            }, 200);
        }
    };
    TaskService.prototype.resetStoryTaskForm = function () {
        this.saveTaskModalForm[0].reset();
        this.saveTaskModalForm.find('input:hidden').val('');
        $('#task-project-ddl').val(this.defaultTaskFilterModel.ProjectId);
        $('#task-story-ddl').val(this.defaultTaskFilterModel.StoryId);
        $('#task-lob-ddl').val([]).change();
    };
    TaskService.prototype.init = function () {
        var _this = this;
        this.formProjectsDdl.change(function (e) {
            var selectedProjectId = $(e.target).val() || 0;
            _this.ddlService.setStoriesDdl(selectedProjectId, _this.formStoryDdl, true);
        });
        $(document).on('click', '#story-tasks-paging-container a[data-pno]', function (e) {
            var btn = $(e.target).closest('a[data-pno]');
            var pNo = btn.data('pno') || 0;
            if (pNo > 0) {
                _this.loadTasks(__assign({}, _this.taskFilterModel), pNo);
            }
        });
        this.createEditTaskModal.on('hide.bs.modal', function () {
            _this.resetStoryTaskForm();
        });
        $(document).on('click', '[ap-action-task-modal-form]', function (e) {
            var btn = $(e.target).closest('[ap-action-task-modal-form]');
            var storyId = btn.data('story-id');
            var taskId = btn.data('task-id') || 0;
            var projectId = btn.data('project-id') || 0;
            _this.openCreateTaskPopup(storyId, taskId, projectId);
        });
        this.saveTaskBtn.on('click', function () {
            var storyId = _this.saveTaskModalForm.find('[name=StoryId]').val();
            var taskId = _this.saveTaskModalForm.find('[name=TaskId]').val();
            if (taskId > 0) {
                MainLoader.show();
                var taskSaveUrl = UrlHelper.GetStoryTasksUrl(ApiUrl.StoryTaskUpdate, storyId, taskId);
                _this.apiService.put(taskSaveUrl, _this.saveTaskModalForm.serialize())
                    .done(function (data, status, xhr) {
                    if (xhr.status === 200 || xhr.status === 201) {
                        Alerts.Success('Task saved successfully.');
                        _this.createEditTaskModal.modal('hide');
                        if (_this.isDetailPage)
                            _this.getTaskDetails(storyId, taskId);
                        else if (_this.isStoryDetailPage)
                            _this.loadTasks(__assign({}, _this.taskFilterModel), 1, Constants.NestedDefaultPageSize);
                        else
                            _this.loadTasks(__assign({}, _this.taskFilterModel));
                    }
                })
                    .always(function () { return MainLoader.hide(); });
            }
            else {
                MainLoader.show();
                var taskSaveUrl = UrlHelper.GetStoryTasksUrl(ApiUrl.StoryTaskCreate, storyId, 0);
                _this.apiService.post(taskSaveUrl, _this.saveTaskModalForm.serialize())
                    .done(function (data, status, xhr) {
                    if (xhr.status === 200 || xhr.status === 201) {
                        Alerts.Success('Task created successfully.');
                        _this.createEditTaskModal.modal('hide');
                        if (_this.isStoryDetailPage)
                            _this.loadTasks(__assign({}, _this.taskFilterModel), 1, Constants.NestedDefaultPageSize);
                        if (!_this.isDetailPage)
                            _this.loadTasks(__assign({}, _this.taskFilterModel));
                    }
                })
                    .always(function () { return MainLoader.hide(); });
            }
        });
    };
    return TaskService;
}());
//# sourceMappingURL=TaskService.js.map