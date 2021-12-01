/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/jqueryui/jqueryui.d.ts" />
/// <reference path="Models.ts" />
/// <reference path="Constants.ts" />
/// <reference path="Common.ts" />
/// <reference path="UserService.ts" />
var ProjectService = /** @class */ (function () {
    function ProjectService(isMyPage, apiService, isDetailPage, selectedStakeholders) {
        if (isDetailPage === void 0) { isDetailPage = false; }
        if (selectedStakeholders === void 0) { selectedStakeholders = []; }
        this.isMyPage = isMyPage;
        this.apiService = apiService;
        this.isDetailPage = isDetailPage;
        this.selectedStakeholders = selectedStakeholders;
        this.projectsTableBody = $('#projects-table > tbody');
        this.projectsTableFooter = $('#projects-table > tfoot');
        this.pagingContainer = $('#projects-paging-container');
        this.infoContainer = $('#apdt_projects_info');
        this.startFromElement = this.infoContainer.find('.apdt_startfrom');
        this.endToElement = this.infoContainer.find('.apdt_endto');
        this.totalElement = this.infoContainer.find('.apdt_total');
        this.projectModal = $('#create-edit-project-modal');
        this.projectForm = this.projectModal.find('#project-form');
        this.projectSaveBtn = this.projectModal.find('#save-project-btn');
        this.projectFilterModel = {
            storyTeamId: "",
            statusId: ""
        };
        this.init();
    }
    ProjectService.prototype.loadProjects = function (pno, psize) {
        var _this = this;
        if (pno === void 0) { pno = 1; }
        if (psize === void 0) { psize = Constants.DefaultPageSize; }
        var u = this.isMyPage ? ApiUrl.MyProjects : ApiUrl.Projects;
        var storyTeamId = this.projectFilterModel.storyTeamId;
        var statusId = this.projectFilterModel.statusId;
        MainLoader.show();
        this.apiService.get(u, { pno: pno, psize: psize, storyTeamId: storyTeamId, statusId: statusId })
            .done(function (projects) {
            _this.projectsTableBody.empty();
            if (projects.Data && projects.Data.length) {
                _this.projectsTableFooter.show();
                projects.Data.forEach(function (p) {
                    var tr = $('<tr>');
                    tr.append("<td class=\"text-center\">" + (p.PriorityRanking || 0) + "</td>");
                    tr.append("<td>" + p.ProjectName + "</td>");
                    tr.append("<td>" + p.TeamName + "</td>");
                    tr.append("<td>" + p.ProjectType + "</td>");
                    tr.append("<td>" + p.ProjectStatus + "</td>");
                    tr.append("<td>" + (p.ProductOwner || '') + "</td>");
                    tr.append("<td>" + (p.LeadDeveloper || '') + "</td>");
                    tr.append("<td>" + Utils.JsonDateToStr(p.RequestDate) + "</td>");
                    tr.append("<td>" + Utils.JsonDateToStr(p.RequestedByDate) + "</td>");
                    tr.append("<td>" + Utils.JsonDateToStr(p.StartDate) + "</td>");
                    tr.append("<td>" + Utils.JsonDateToStr(p.CompletedDate) + "</td>");
                    var actionColumn = "<a role=\"button\" title=\"View details\" class=\"btn btn-xs btn-success m-r-5\" href=\"/Projects/" + p.ProjectId + "\"><i class=\"fa fa-file-text-o\"></i></a>\n        <button type=\"button\" title=\"Edit details\" class=\"btn btn-xs btn-primary m-r-5\" ap-action-project-modal-form data-project-id=\"" + p.ProjectId + "\"><i class=\"fa fa-pencil\"></i></button>";
                    tr.append("<td class=\"text-center\">" + actionColumn + "</td>");
                    _this.projectsTableBody.append(tr);
                });
                var pageModel = {
                    CurrentPageNumber: projects.CurrentPageNumber,
                    IsLastPage: projects.IsLastPage,
                    PageSize: projects.PageSize,
                    TotalPages: projects.Count,
                };
                var pagination = Pagination.Render(pageModel);
                _this.pagingContainer.html("" + pagination);
                var startFrom = ((projects.CurrentPageNumber - 1) * projects.PageSize) + 1;
                var endTo = startFrom + projects.Data.length - 1;
                _this.startFromElement.html("" + startFrom);
                _this.endToElement.html("" + endTo);
                _this.totalElement.html("" + projects.Count);
            }
            else {
                Alerts.Info('No projects found.');
                _this.projectsTableFooter.hide();
                _this.pagingContainer.html('');
                _this.startFromElement.html("0");
                _this.endToElement.html("0");
                _this.totalElement.html("0");
            }
        })
            .always(function () { return MainLoader.hide(); });
    };
    ProjectService.prototype.resetProjectForm = function () {
        this.projectForm[0].reset();
        this.projectForm.find('input:hidden').val('').trigger('input');
        this.projectForm.find('select').val('').trigger('change');
        $('#stakeholders-box-list').empty();
        this.selectedStakeholders = [];
    };
    ProjectService.prototype.setPopupFieldsToUpdateProject = function (p) {
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
        for (var userId in p.StakeholderIdNames) {
            var stk = { id: userId, name: p.StakeholderIdNames[userId] };
            this.selectedStakeholders.push(stk);
            var selectedUl = this.projectModal.find('#stakeholders-box-list');
            var li = "<li class=\"m-r-5 m-b-5 d-tag\" data-uid=\"" + stk.id + "\">\n                            <span class=\"name\">" + stk.name + "</span>\n                            <span class=\"close-btn b\" title=\"Remove\">X</span>\n                        </li>";
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
    };
    ProjectService.prototype.openCreateProjectPopup = function (projectId) {
        var _this = this;
        if (projectId === void 0) { projectId = 0; }
        this.projectSaveBtn.removeAttr("disabled");
        var projectIdElement = this.projectModal.find('[name=ProjectId]');
        if (projectId > 0) {
            projectIdElement.val(projectId);
            var u = UrlHelper.GetProjectsUrl(ApiUrl.ProjectDetail, projectId);
            MainLoader.show();
            this.apiService.get(u).done(function (p) {
                _this.setPopupFieldsToUpdateProject(p);
                _this.projectModal.modal('show');
            })
                .always(function () { return MainLoader.hide(); });
        }
        else
            this.projectModal.modal('show');
    };
    ProjectService.prototype.getProjectObject = function (projectId) {
        var projectDetailUrl = UrlHelper.GetProjectsUrl(ApiUrl.ProjectDetail, projectId);
        this.apiService.get(projectDetailUrl)
            .done(function (project) {
            return project;
        });
        return null;
    };
    ProjectService.prototype.getProjectDetails = function (projectId) {
        var projectDetailUrl = UrlHelper.GetProjectsUrl(ApiUrl.ProjectDetail, projectId);
        MainLoader.show();
        this.apiService.get(projectDetailUrl)
            .done(function (project) {
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
                var stakeholderElement = $('[data-stakeholders-container]');
                var stakeholders = project.Stakeholders;
                if (stakeholders && stakeholders.length) {
                    stakeholderElement.append(stakeholders.map(function (s) { return "<span class=\"d-tag-sm m-r-5 m-b-5\">" + s + "</span>"; }));
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
            .always(function () { return MainLoader.hide(); });
    };
    ProjectService.prototype.init = function () {
        var _this = this;
        $(document).on('click', '#projects-paging-container a[data-pno]', function (e) {
            var btn = $(e.target).closest('a[data-pno]');
            var pNo = btn.data('pno') || 0;
            if (pNo > 0) {
                _this.loadProjects(pNo);
            }
        });
        $(document).on('click', '#stakeholders-box-list .close-btn', function (e) {
            var btn = $(e.target);
            var li = btn.closest('li');
            var userId = li.data('uid');
            if (userId) {
                _this.selectedStakeholders = _this.selectedStakeholders.filter(function (stk) { return stk.id != userId; });
                $('#stakeholder-ids').val(_this.selectedStakeholders.map(function (stk) { return stk.id; }).join(','));
            }
            li.remove();
        });
        $(document).on('click', '[ap-action-project-modal-form]', function (e) {
            var btn = $(e.target).closest('[ap-action-project-modal-form]');
            ;
            var projectId = btn.data('project-id') || 0;
            _this.openCreateProjectPopup(projectId);
        });
        this.projectModal.on('show.bs.modal', function (e) { });
        this.projectSaveBtn.on('click', function (e) {
            var projectId = _this.projectForm.find('[name=ProjectId]').val() || 0;
            if (projectId > 0) {
                MainLoader.show();
                var projectSaveUrl = UrlHelper.GetProjectsUrl(ApiUrl.ProjectUpdate, projectId);
                _this.apiService.put(projectSaveUrl, _this.projectForm.serialize())
                    .done(function (data, status, xhr) {
                    if (xhr.status === 200 || xhr.status === 204) {
                        Alerts.Success('Project saved successfully.', 'Success');
                        _this.resetProjectForm();
                        _this.projectModal.modal('hide');
                        if (!_this.isDetailPage)
                            _this.loadProjects();
                        else
                            _this.getProjectDetails(projectId);
                    }
                })
                    .always(function () { return MainLoader.hide(); });
            }
            else {
                MainLoader.show();
                var projectSaveUrl = UrlHelper.GetProjectsUrl(ApiUrl.ProjectCreate, projectId);
                _this.apiService.post(projectSaveUrl, _this.projectForm.serialize())
                    .done(function (data, status, xhr) {
                    if (xhr.status === 200 || xhr.status === 201) {
                        Alerts.Success('Project created successfully.', 'Success');
                        _this.resetProjectForm();
                        _this.projectModal.modal('hide');
                        if (!_this.isDetailPage)
                            _this.loadProjects();
                        else
                            _this.getProjectDetails(projectId);
                    }
                })
                    .always(function () { return MainLoader.hide(); });
            }
        });
        this.projectModal.on('hide.bs.modal', function () {
            _this.resetProjectForm();
        });
    };
    return ProjectService;
}());
//# sourceMappingURL=ProjectService.js.map