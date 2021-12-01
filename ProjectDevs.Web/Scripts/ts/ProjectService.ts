/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/jqueryui/jqueryui.d.ts" />
/// <reference path="Models.ts" />
/// <reference path="Constants.ts" />
/// <reference path="Common.ts" />
/// <reference path="UserService.ts" />

class ProjectService {
    projectsTableBody = $('#projects-table > tbody');
    projectsTableFooter = $('#projects-table > tfoot');

    pagingContainer = $('#projects-paging-container');
    infoContainer = $('#apdt_projects_info');
    startFromElement = this.infoContainer.find('.apdt_startfrom');
    endToElement = this.infoContainer.find('.apdt_endto');
    totalElement = this.infoContainer.find('.apdt_total');

    projectModal = $('#create-edit-project-modal');
    projectForm = this.projectModal.find('#project-form');
    projectSaveBtn = this.projectModal.find('#save-project-btn');

    projectFilterModel: { storyTeamId?: string ,statusId?:string} = {        
        storyTeamId: "",
        statusId:""
    }

    constructor(private isMyPage: boolean, private apiService: ApiService, private isDetailPage = false,
        private selectedStakeholders: { id: string, name: string }[] = []) {
        this.init();
    }

    loadProjects(pno = 1, psize = Constants.DefaultPageSize) {
        const u = this.isMyPage ? ApiUrl.MyProjects : ApiUrl.Projects;
        const storyTeamId = this.projectFilterModel.storyTeamId;
        const statusId = this.projectFilterModel.statusId;
        MainLoader.show();
        this.apiService.get(u, { pno, psize, storyTeamId, statusId })
            .done((projects: IPagingModel<IProjectDto>) => {
                this.projectsTableBody.empty();
                if (projects.Data && projects.Data.length) {
                    this.projectsTableFooter.show();
                    projects.Data.forEach(p => {
                        const tr = $('<tr>');

                        tr.append(`<td class="text-center">${p.PriorityRanking || 0}</td>`);
                        tr.append(`<td>${p.ProjectName}</td>`);
                        tr.append(`<td>${p.TeamName}</td>`);
                        tr.append(`<td>${p.ProjectType}</td>`);
                        tr.append(`<td>${p.ProjectStatus}</td>`);
                        tr.append(`<td>${p.ProductOwner || ''}</td>`);
                        tr.append(`<td>${p.LeadDeveloper || ''}</td>`);
                        tr.append(`<td>${Utils.JsonDateToStr(p.RequestDate)}</td>`);
                        tr.append(`<td>${Utils.JsonDateToStr(p.RequestedByDate)}</td>`);
                        tr.append(`<td>${Utils.JsonDateToStr(p.StartDate)}</td>`);
                        tr.append(`<td>${Utils.JsonDateToStr(p.CompletedDate)}</td>`);

                        const actionColumn =
                            `<a role="button" title="View details" class="btn btn-xs btn-success m-r-5" href="/Projects/${p.ProjectId}"><i class="fa fa-file-text-o"></i></a>
        <button type="button" title="Edit details" class="btn btn-xs btn-primary m-r-5" ap-action-project-modal-form data-project-id="${p.ProjectId}"><i class="fa fa-pencil"></i></button>`;

                        tr.append(`<td class="text-center">${actionColumn}</td>`);

                        this.projectsTableBody.append(tr);
                    });
                    const pageModel: IPaginationModel = {
                        CurrentPageNumber: projects.CurrentPageNumber,
                        IsLastPage: projects.IsLastPage,
                        PageSize: projects.PageSize,
                        TotalPages: projects.Count,
                    };
                    const pagination = Pagination.Render(pageModel);
                    this.pagingContainer.html(`${pagination}`);

                    const startFrom = ((projects.CurrentPageNumber - 1) * projects.PageSize) + 1;
                    const endTo = startFrom + projects.Data.length - 1;

                    this.startFromElement.html(`${startFrom}`);
                    this.endToElement.html(`${endTo}`);
                    this.totalElement.html(`${projects.Count}`);
                }
                else {
                    Alerts.Info('No projects found.');
                    this.projectsTableFooter.hide();

                    this.pagingContainer.html('');

                    this.startFromElement.html(`0`);
                    this.endToElement.html(`0`);
                    this.totalElement.html(`0`);
                }
            })
            .always(() => MainLoader.hide());
    }

    resetProjectForm() {
        (this.projectForm[0] as HTMLFormElement).reset();
        this.projectForm.find('input:hidden').val('').trigger('input');
        this.projectForm.find('select').val('').trigger('change');
        $('#stakeholders-box-list').empty();
        this.selectedStakeholders = [];
    }

    setPopupFieldsToUpdateProject(p: IProjectDto) {        
        this.projectModal.find('[name=ProjectName]').val(p.ProjectName);
        this.projectModal.find('[name=PriorityRanking]').val(p.PriorityRanking || 0).trigger('input');
        this.projectModal.find('[name=ProjectType]').val(p.ProjectType);
        this.projectModal.find('[name=ProjectStatusId]').val(p.ProjectStatusId);
        this.projectModal.find('[name=TeamId]').val(p.TeamID);

        this.projectModal.find('[name=MeetingSchedule]').val(p.MeetingSchedule);

        this.projectModal.find('[name=RequestDate]').val(Utils.JsonDateToStr(p.RequestDate, true));
        this.projectModal.find('[name=RequestedByDate]').val(Utils.JsonDateToStr(p.RequestedByDate, true));
        this.projectModal.find('[name=StartDate]').val(Utils.JsonDateToStr(p.StartDate, true));
        this.projectModal.find('[name=CompletedDate]').val(Utils.JsonDateToStr(p.CompletedDate, true));

        this.projectModal.find('[name=ProductOwnerId]').val(p.ProductOwnerId);
        this.projectModal.find('#product-owner-name').val(p.ProductOwner);

        this.projectModal.find('[name=ProjectManagerId]').val(p.ProjectManagerId);
        this.projectModal.find('#project-manager-name').val(p.ProjectManager);

        this.projectModal.find('[name=LeadDeveloperId]').val(p.LeadDeveloperId);
        this.projectModal.find('#lead-developer-name').val(p.LeadDeveloper);

        this.projectModal.find('[name=BusinessAnalystId]').val(p.BusinessAnalystId);
        this.projectModal.find('#business-analyst-name').val(p.BusinessAnalyst);
        
        for (const userId in p.StakeholderIdNames) {
            const stk = { id: userId, name: p.StakeholderIdNames[userId] };
            this.selectedStakeholders.push(stk);
            const selectedUl = this.projectModal.find('#stakeholders-box-list');
            const li = `<li class="m-r-5 m-b-5 d-tag" data-uid="${stk.id}">
                            <span class="name">${stk.name}</span>
                            <span class="close-btn b" title="Remove">X</span>
                        </li>`;
            selectedUl.append(li);
        }
        if (p.StakeHolderIds && p.StakeHolderIds.length)
            this.projectModal.find('[name=StakeHolderIds]').val(p.StakeHolderIds.join(','));
        
        if (UserTokenHandler.isSuperUser() || UserTokenHandler.isUserStakeholderOrOwnerForProject(p)) {
            this.projectSaveBtn.removeAttr("disabled");           
        }
        else {
            this.projectSaveBtn.attr("disabled", "disabled");            
        }
    }

    openCreateProjectPopup(projectId: number = 0) {
        this.projectSaveBtn.removeAttr("disabled");  
        const projectIdElement = this.projectModal.find('[name=ProjectId]');
        if (projectId > 0) {
            projectIdElement.val(projectId);
            const u = UrlHelper.GetProjectsUrl(ApiUrl.ProjectDetail, projectId);
            MainLoader.show();
            this.apiService.get(u).done((p: IProjectDto) => {
                this.setPopupFieldsToUpdateProject(p);
                this.projectModal.modal('show');
            })
                .always(() => MainLoader.hide());
        }
        else
            this.projectModal.modal('show');
    }

    getProjectObject(projectId: number): IProjectDto {
        const projectDetailUrl = UrlHelper.GetProjectsUrl(ApiUrl.ProjectDetail, projectId);
        this.apiService.get(projectDetailUrl)
            .done((project: IProjectDto) => {
                return project;
            }); 
        return null;
    }

    getProjectDetails(projectId: number) {
        const projectDetailUrl = UrlHelper.GetProjectsUrl(ApiUrl.ProjectDetail, projectId);

        MainLoader.show();
        this.apiService.get(projectDetailUrl)
            .done((project: IProjectDto) => {
                
                $('[data-project-name]').text(project.ProjectName);
                $('[data-priority-ranking]').text(project.PriorityRanking || 0);
                $('[data-project-type]').text(project.ProjectType);
                $('[data-project-team]').text(project.TeamName);

                $('[data-project-status]').text(project.ProjectStatus);
                $('[data-requested-date]').text(Utils.JsonDateToStr(project.RequestDate));
                $('[data-requested-by-date]').text(Utils.JsonDateToStr(project.RequestedByDate));
                $('[data-completed-date]').text(Utils.JsonDateToStr(project.CompletedDate));
                $('[data-start-date]').text(Utils.JsonDateToStr(project.StartDate));
                $('[data-meeting-schedule]').text(project.MeetingSchedule);
                $('[data-product-owner]').text(project.ProductOwner);
                $('[data-project-manager]').text(project.ProjectManager);
                $('[data-lead-developer]').text(project.LeadDeveloper);
                $('[data-business-analyst]').text(project.BusinessAnalyst);

                if (project.Stakeholders && project.Stakeholders.length) {
                    const stakeholderElement = $('[data-stakeholders-container]');
                    const stakeholders: string[] = project.Stakeholders;
                    if (stakeholders && stakeholders.length) {
                        stakeholderElement.append(stakeholders.map(s => `<span class="d-tag-sm m-r-5 m-b-5">${s}</span>`));
                    }
                }
                
                if (!(UserTokenHandler.isSuperUser() || UserTokenHandler.isUserStakeholderOrOwnerForProject(project))) {
                    $("[ap-action-project-modal-form]").remove();
                    $("[ap-action-story-modal-form]").remove();
                    $("[ap-action-meeting-modal-form]").remove();
                    $("[ap-action-file-modal-form]").remove();                   
                    $("[ap-action-note-modal-form]").remove();
                    $("[meeting_ap-action-note-modal-form]").remove();
                }
            })
            .always(() => MainLoader.hide());
    }



    private init() {
        $(document).on('click', '#projects-paging-container a[data-pno]', e => {
            const btn = $(e.target).closest('a[data-pno]');
            const pNo: number = btn.data('pno') || 0;
            if (pNo > 0) {
                this.loadProjects(pNo);
            }
        });

        $(document).on('click', '#stakeholders-box-list .close-btn', e => {
            const btn = $(e.target);
            const li = btn.closest('li');
            const userId = li.data('uid');
            if (userId) {
                this.selectedStakeholders = this.selectedStakeholders.filter(stk => stk.id != userId);

                $('#stakeholder-ids').val(this.selectedStakeholders.map(stk => stk.id).join(','));
            }
            li.remove();
        });

        $(document).on('click', '[ap-action-project-modal-form]', e => {
            const btn = $(e.target).closest('[ap-action-project-modal-form]');;
            const projectId: number = btn.data('project-id') || 0;
            this.openCreateProjectPopup(projectId);
        });

        this.projectModal.on('show.bs.modal', function (e) { });

        this.projectSaveBtn.on('click', e => {
            const projectId: number = this.projectForm.find('[name=ProjectId]').val() || 0;

            if (projectId > 0) {
                MainLoader.show();
                const projectSaveUrl: string = UrlHelper.GetProjectsUrl(ApiUrl.ProjectUpdate, projectId);
                this.apiService.put(projectSaveUrl, this.projectForm.serialize())
                    .done((data: any, status: string, xhr: JQueryXHR) => {
                        if (xhr.status === 200 || xhr.status === 204) {
                            Alerts.Success('Project saved successfully.', 'Success');
                            this.resetProjectForm();
                            this.projectModal.modal('hide');
                            if (!this.isDetailPage)
                                this.loadProjects();
                            else
                                this.getProjectDetails(projectId);
                        }
                    })
                    .always(() => MainLoader.hide());
            }
            else {
                MainLoader.show();
                const projectSaveUrl: string = UrlHelper.GetProjectsUrl(ApiUrl.ProjectCreate, projectId);
                this.apiService.post(projectSaveUrl, this.projectForm.serialize())
                    .done((data: any, status: string, xhr: JQueryXHR) => {
                        if (xhr.status === 200 || xhr.status === 201) {
                            Alerts.Success('Project created successfully.', 'Success');
                            this.resetProjectForm();
                            this.projectModal.modal('hide');
                            if (!this.isDetailPage)
                                this.loadProjects();
                            else
                                this.getProjectDetails(projectId);
                        }
                    })
                    .always(() => MainLoader.hide());
            }
        });

        this.projectModal.on('hide.bs.modal', () => {
            this.resetProjectForm();
        });
    }
}