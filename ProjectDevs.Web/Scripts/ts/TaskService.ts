/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="Models.ts" />
/// <reference path="Constants.ts" />
/// <reference path="Common.ts" />
/// <reference path="UserService.ts" />

class TaskService {

    private templateLi = $('#task-list-item-template > li').first();
    private tasksContainerUl = $('#story-tasks-list');
    private pagingContainer = $('#story-tasks-paging-container');
    private infoContainer = $('#apdt_storytasks_info');
    private startFromElement = this.infoContainer.find('.apdt_startfrom');
    private endToElement = this.infoContainer.find('.apdt_endto');
    private totalElement = this.infoContainer.find('.apdt_total');

    private createEditTaskModal = $('#create-edit-task-modal');
    private saveTaskModalForm = this.createEditTaskModal.find('#task-form');
    private saveTaskBtn = this.createEditTaskModal.find('#save-task-btn');

    private formProjectsDdl = this.saveTaskModalForm.find('#task-project-ddl');
    private formStoryDdl = this.saveTaskModalForm.find('#task-story-ddl');

    private selectedProjectId = 0;
    private selectedStorId = 0;
    private projectObj: IProjectDto = null;

    constructor(private isMyPage: boolean, private apiService: ApiService, private ddlService: DdlService, private isDetailPage = false, private isStoryDetailPage = false, private showPaging = true) {
        this.init();
    }

    defaultTaskFilterModel: ITaskFilterModel = {
        ProjectId: 0,
        StoryId: 0,
        TaskStatus: 0,
        TeamId:"",
        AssignedToUserId: null
    }
    private taskFilterModel: ITaskFilterModel;

    loadTasks(taskFilter = this.defaultTaskFilterModel, pno: number = 1, psize: number = Constants.DefaultPageSize) {

        this.taskFilterModel = { ...taskFilter };

        const u = this.isMyPage ? ApiUrl.MyTasks : ApiUrl.StoryTasks;
        const tasksUrl = UrlHelper.GetStoryTasksUrl(u, taskFilter.StoryId, 0);

        MainLoader.show();
        this.apiService.get(tasksUrl, { ...taskFilter, pno, psize })
            .done((tasks: IPagingModel<IStoryTask>) => {
                
                this.tasksContainerUl.empty();
                this.infoContainer.show();
                if (tasks && tasks.Data && tasks.Data.length) {
                    tasks.Data.forEach(task => {
                        const li = this.templateLi.clone();
                        li.find('[t-status]').text(task.TaskStatusName);
                        li.find('[t-ticket-number]').text(task.TicketNumber);
                        li.find('[t-changeset]').text(task.Changeset || '');
                        li.find('[t-title]').text(task.TaskName);
                        li.find('[t-link]').attr('href', `/User-Story/${task.StoryId}/Tasks/${task.TaskId}`);
                        li.find('[t-task-type]').text(task.TaskType);
                        li.find('[t-assignee]').text(task.AssigneeName);
                        li.find('[t-projected-hours]').text(`${task.ProjectedHours || 'NA'} Hrs`);
                        li.find('[t-actual-hours]').text(`${task.ActualHours || 'NA'} Hrs`);
                        li.find('[t-data-task-id]').attr('data-task-id', task.TaskId);
                        li.find('[t-data-story-id]').attr('data-story-id', task.StoryId);
                        li.find('[t-data-project-id]').attr('data-project-id', task.ProjectId);

                        this.tasksContainerUl.append(li);
                    });
                    if (this.showPaging) {
                        const pageModel: IPaginationModel = {
                            CurrentPageNumber: tasks.CurrentPageNumber,
                            IsLastPage: tasks.IsLastPage,
                            PageSize: tasks.PageSize,
                            TotalPages: tasks.Count,
                        };
                        const pagination = Pagination.Render(pageModel);
                        this.pagingContainer.html(`${pagination}`);

                        const startFrom = ((tasks.CurrentPageNumber - 1) * tasks.PageSize) + 1;
                        const endTo = startFrom + tasks.Data.length - 1;

                        this.startFromElement.html(`${startFrom}`);
                        this.endToElement.html(`${endTo}`);
                        this.totalElement.html(`${tasks.Count}`);
                    }
                   
                    if (taskFilter.ProjectId > 0) {
                        const projectDetailUrl = UrlHelper.GetProjectsUrl(ApiUrl.ProjectDetail, taskFilter.ProjectId);
                        this.apiService.get(projectDetailUrl)
                            .done((project: IProjectDto) => {
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
                    if (this.showPaging) {
                        this.pagingContainer.html('');

                        this.startFromElement.html(`0`);
                        this.endToElement.html(`0`);
                        this.totalElement.html(`0`);
                    }
                }
            })
            .always(() => MainLoader.hide());
    }

    clearTasks() {
        this.tasksContainerUl.empty();
        this.pagingContainer.html('');

        this.startFromElement.html(`0`);
        this.endToElement.html(`0`);
        this.totalElement.html(`0`);
    }

    getTaskDetails(storyId: number, taskId: number) {
        const taskDetailUrl = UrlHelper.GetStoryTasksUrl(ApiUrl.StoryTaskDetail, storyId, taskId);
        MainLoader.show();
        this.apiService.get(taskDetailUrl)
            .done((task: IStoryTask) => {
                
                $('[data-task-name]').text(task.TaskName);
                $('[data-ticket-number]').text(task.TicketNumber);
                $('[data-changeset]').text(task.Changeset || '');
                $('[data-task-status]').text(task.TaskStatusName);
                $('[data-task-type]').text(task.TaskType);
                $('[data-assignee-name]').text(task.AssigneeName);
                $('[data-projected-hours]').text(`Projected Hours: ` + `${task.ProjectedHours || ''} Hrs`);
                $('[data-actual-hours]').text('Actual Hours: ' + `${task.ActualHours || ''} Hrs`);
                $('[data-task-description]').text(task.TaskDescription);
                $('[data-task-notes-link]').attr('href', `/Project/${task.ProjectId}/Notes/type/${NoteType.Tasks}/of/${taskId}`);

                setTimeout(() => {
                    debugger;
                    $("#task-lob-ddl").val(task.LOB.split(',')).change();
                }, 500);                

                const projectDetailUrl = UrlHelper.GetProjectsUrl(ApiUrl.ProjectDetail, task.ProjectId);
                this.apiService.get(projectDetailUrl)
                    .done((project: IProjectDto) => {
                        if (!(UserTokenHandler.isSuperUser() || UserTokenHandler.isUserStakeholderOrOwnerForProject(project))) {
                            $("[ap-action-task-modal-form]").remove();
                            $("[ap-action-note-modal-form]").remove();
                            $("[ap-action-file-modal-form]").remove();
                        }
                    });
            })
            .always(() => MainLoader.hide());
    }

    setPopupFieldsToUpdateTask(t: IStoryTask) {
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
        $("#task-lob-ddl").val(t.LOB==null?[]: t.LOB.split(',')).change();
    }

    openCreateTaskPopup(storyId: number = 0, taskId: number = 0, projectId = 0) {
        if (taskId > 0) {
            this.formProjectsDdl.val(projectId);
            if (projectId > 0) {
                this.ddlService.setStoriesDdl(projectId, this.formStoryDdl, true, () => { this.formStoryDdl.val(storyId); });
            }
        }
        const taskIdElement = this.createEditTaskModal.find('[name=TaskId]');
        taskIdElement.val(taskId);
        if (taskId > 0) {
            const u = UrlHelper.GetStoryTasksUrl(ApiUrl.StoryTaskDetail, storyId, taskId);
            MainLoader.show();
            this.apiService.get(u).done((t: IStoryTask) => {
                this.setPopupFieldsToUpdateTask(t);
                this.createEditTaskModal.modal('show');
            })
                .always(() => MainLoader.hide());
        }
        else {
            this.createEditTaskModal.modal('show');
            setTimeout(() => {
                this.formProjectsDdl.val(projectId);
                if (projectId > 0) {
                    this.ddlService.setStoriesDdl(projectId, this.formStoryDdl, true, () => { this.formStoryDdl.val(storyId); });
                }
            }, 200);
        }
    }

    resetStoryTaskForm() {
        (this.saveTaskModalForm[0] as HTMLFormElement).reset();
        this.saveTaskModalForm.find('input:hidden').val('');

        $('#task-project-ddl').val(this.defaultTaskFilterModel.ProjectId);
        $('#task-story-ddl').val(this.defaultTaskFilterModel.StoryId);
        $('#task-lob-ddl').val([]).change();
    }

    private init() {
        this.formProjectsDdl.change((e) => {
            const selectedProjectId = $(e.target).val() || 0;
            this.ddlService.setStoriesDdl(selectedProjectId, this.formStoryDdl, true);
        });

        $(document).on('click', '#story-tasks-paging-container a[data-pno]', e => {
            const btn = $(e.target).closest('a[data-pno]');
            const pNo: number = btn.data('pno') || 0;
            if (pNo > 0) {
                this.loadTasks({ ...this.taskFilterModel }, pNo);
            }
        });

        this.createEditTaskModal.on('hide.bs.modal', () => {
            this.resetStoryTaskForm();
        });
        $(document).on('click', '[ap-action-task-modal-form]', e => {
            const btn = $(e.target).closest('[ap-action-task-modal-form]');
            const storyId: number = btn.data('story-id');
            const taskId: number = btn.data('task-id') || 0;
            const projectId: number = btn.data('project-id') || 0;

            this.openCreateTaskPopup(storyId, taskId, projectId);
        });
        this.saveTaskBtn.on('click', () => {
            
            const storyId: number = this.saveTaskModalForm.find('[name=StoryId]').val();
            const taskId = this.saveTaskModalForm.find('[name=TaskId]').val();
            if (taskId > 0) {
                MainLoader.show();
                const taskSaveUrl: string = UrlHelper.GetStoryTasksUrl(ApiUrl.StoryTaskUpdate, storyId, taskId);
                this.apiService.put(taskSaveUrl, this.saveTaskModalForm.serialize())
                    .done((data: any, status: string, xhr: JQueryXHR) => {
                        if (xhr.status === 200 || xhr.status === 201) {
                            Alerts.Success('Task saved successfully.');
                            this.createEditTaskModal.modal('hide');
                            if (this.isDetailPage)
                                this.getTaskDetails(storyId, taskId);
                            else if (this.isStoryDetailPage)
                                this.loadTasks({ ...this.taskFilterModel }, 1, Constants.NestedDefaultPageSize);
                            else
                                this.loadTasks({ ...this.taskFilterModel });
                        }
                    })
                    .always(() => MainLoader.hide());
            }
            else {
                MainLoader.show();
                const taskSaveUrl: string = UrlHelper.GetStoryTasksUrl(ApiUrl.StoryTaskCreate, storyId, 0);
                this.apiService.post(taskSaveUrl, this.saveTaskModalForm.serialize())
                    .done((data: any, status: string, xhr: JQueryXHR) => {
                        if (xhr.status === 200 || xhr.status === 201) {
                            Alerts.Success('Task created successfully.');
                            this.createEditTaskModal.modal('hide');
                            if (this.isStoryDetailPage)
                                this.loadTasks({ ...this.taskFilterModel }, 1, Constants.NestedDefaultPageSize);
                            if (!this.isDetailPage)
                                this.loadTasks({ ...this.taskFilterModel });
                        }
                    })
                    .always(() => MainLoader.hide());
            }
        });
    }
}