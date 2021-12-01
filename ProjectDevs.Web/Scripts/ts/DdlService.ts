/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="Models.ts" />
/// <reference path="Constants.ts" />
/// <reference path="Common.ts" />
/// <reference path="UserService.ts" />

class DdlService {
    projectsDdl = $('.projects-ddl');
    storiesStatusDdl = $('.stories-status-ddl');
    sprintsDdl = $('.sprints-ddl');
    taskStatusDdl = $('.task-status-ddl');
    reportTypeDdl = $('.report-type-ddl');
    testScriptStatusDdl = $('.test-script-status-ddl');
    testScriptStatusRequested = $('.test-script-status-requested');
    testScriptStatusPass = $('.test-script-status-pass');
    testScriptStatusFail = $('.test-script-status-fail');
    taskLOBDdl = $('.lob-ddl');

    projectStatusDdl = $('.projects-status-ddl');
    teamDdl = $('.teams-ddl');
    storyTypeDdl = $('.story-types-ddl');

    constructor(private apiService: ApiService) { }

    reloadSelectors() {
        this.projectsDdl = $('.projects-ddl');
        this.storiesStatusDdl = $('.stories-status-ddl');
        this.sprintsDdl = $('.sprints-ddl');
        this.taskStatusDdl = $('.task-status-ddl');
        this.reportTypeDdl = $('.report-type-ddl');
        this.testScriptStatusDdl = $('.test-script-status-ddl');
        this.testScriptStatusRequested = $('.test-script-status-requested');
        this.testScriptStatusPass = $('.test-script-status-pass');
        this.testScriptStatusFail = $('.test-script-status-fail');
        this.projectStatusDdl = $('.projects-status-ddl');
        this.teamDdl = $('.teams-ddl');
        this.storyTypeDdl = $('.story-types-ddl');
        this.taskLOBDdl = $('.lob-ddl');
    }

    setProjectsDdl(enableLoaders = false, callback: Function = null, teamIds = null) {
        if (enableLoaders)
            MainLoader.show();
        const request = this.apiService.get(ApiUrl.ProjectsDdl, { teamId: teamIds })
            .done((status: IDdlModel[]) => {

                this.projectsDdl.empty();
                this.projectsDdl.append('<option value="0">Select Project</option>');
                if (status && status.length) {
                    const options = status.map(s => `<option value="${s.Value}">${s.Text}</option>`).join('');
                    this.projectsDdl.append(options);
                }
                if (callback)
                    callback();
            }).
            always(() => {
                if (enableLoaders)
                    MainLoader.hide();
            });
    }

    setTaskLOBDdl(storyId = 0, enableLoaders = false, callback: Function = null) {
        if (enableLoaders)
            MainLoader.show();
        const taskLOBUrl = UrlHelper.GetStoryTasksUrl(ApiUrl.StoryTaskLOB, storyId, 0);
        return this.apiService.get(taskLOBUrl)
            .done((status: IDdlModel[]) => {
                this.taskLOBDdl.empty();
                this.taskLOBDdl.append('<option value="0">Select LOB</option>');
                if (status && status.length) {
                    const options = status.map(s => `<option value="${s.Value}">${s.Text}</option>`).join('');
                    this.taskLOBDdl.append(options);
                }
                if (callback)
                    callback();
            }).always(() => {
                if (enableLoaders)
                    MainLoader.hide();
            });
    }

    setStoryStatusesDdl(projectId = null, enableLoaders = false, callback: Function = null, isEditCase = false) {
        if (enableLoaders)
            MainLoader.show();
        let storyStatusUrl = "";
        if (isEditCase) {
            storyStatusUrl = UrlHelper.GetProjectStoriesUrl(ApiUrl.ProjectStoriesStatus, projectId, 0);
        }
        else {
            storyStatusUrl = UrlHelper.GetProjectStoriesUrl(ApiUrl.ProjectStoriesStatus, 0, 0);
        }

        return this.apiService.get(storyStatusUrl)
            .done((status: IDdlModel[]) => {
                //const projectStatusDdl = $('#story-status');
                this.storiesStatusDdl.empty();
                this.storiesStatusDdl.append('<option value="0">Select Status</option>');
                if (status && status.length) {
                    const options = status.map(s => `<option value="${s.Value}">${s.Text}</option>`).join('');
                    this.storiesStatusDdl.append(options);
                }
                if (callback)
                    callback();
            }).
            always(() => {
                if (enableLoaders)
                    MainLoader.hide();
            });
    }

    setSprintsDdl(enableLoaders = false, setMultiSelect = true, callback: Function = null, teamId: string = null) {
        if (enableLoaders)
            MainLoader.show();
        
        var url = UrlHelper.GetSprintsUrlWithTeamId(ApiUrl.SprintsDdl, teamId);
        return this.apiService.get(url)
            .done((s: IDdlModel[]) => {
                this.sprintsDdl.empty();
                this.sprintsDdl.append('<option value="0" disabled>Select Sprint</option>');
                if (s && s.length) {
                    const options = s.map(s => `<option value="${s.Value}">${s.Text}</option>`).join('');
                    this.sprintsDdl.append(options);
                }
                if (setMultiSelect) {
                    Utils.setMultiSelectDdl(this.sprintsDdl, 'Sprint');
                    this.sprintsDdl.val('').trigger('change');
                }
                if (callback)
                    callback();
            })
            .always(() => {
                if (enableLoaders)
                    MainLoader.hide();
            });
    }

    setTaskStatusesDdl(storyId = 0, enableLoaders = false, callback: Function = null) {
        if (enableLoaders)
            MainLoader.show();
        const taskStatusUrl = UrlHelper.GetStoryTasksUrl(ApiUrl.StoryTasksStatus, storyId, 0);
        return this.apiService.get(taskStatusUrl)
            .done((status: IDdlModel[]) => {
                this.taskStatusDdl.empty();
                this.taskStatusDdl.append('<option value="0">Select Status</option>');
                if (status && status.length) {
                    const options = status.map(s => `<option value="${s.Value}">${s.Text}</option>`).join('');
                    this.taskStatusDdl.append(options);
                }
                if (callback)
                    callback();
            }).always(() => {
                if (enableLoaders)
                    MainLoader.hide();
            });
    }
    setReportTypeDdl(enableLoaders = false, callback: Function = null) {
        if (enableLoaders)
            MainLoader.show();
        const reportTypesUrl = ApiUrl.ReportTypes;

        return this.apiService.get(reportTypesUrl, null)
            .done((types: IDdlModel[]) => {
                this.reportTypeDdl.empty();
                this.reportTypeDdl.append('<option value="0">Select Report Type</option>');
                if (types && types.length) {
                    const options = types.map(s => `<option value="${s.Value}">${s.Text}</option>`).join('');
                    this.reportTypeDdl.append(options);
                }
                if (callback)
                    callback();
            }).always(() => {
                if (enableLoaders)
                    MainLoader.hide();
            });
    }

    setTestScriptStatusesDdl(enableLoaders = false, callback: Function = null) {
        if (enableLoaders)
            MainLoader.show();
        return this.apiService.get(ApiUrl.TestScriptStatus)
            .done((status: IDdlModel[]) => {
                this.testScriptStatusDdl.empty();
                this.testScriptStatusDdl.append('<option value="0">Select Status</option>');
                if (status && status.length) {
                    const options = status.map(s => `<option value="${s.Value}">${s.Text}</option>`).join('');
                    this.testScriptStatusDdl.append(options);


                    const requestedStatus = status.filter(a => a.Text.toLowerCase() == "requested")[0];
                    const passStatus = status.filter(a => a.Text.toLowerCase() == "pass")[0];
                    const failStatus = status.filter(a => a.Text.toLowerCase() == "fail")[0];
                    if (requestedStatus) {
                        this.testScriptStatusRequested.val(requestedStatus.Value.toString());
                    }
                    if (passStatus) {
                        this.testScriptStatusPass.val(passStatus.Value.toString());
                    }
                    if (failStatus) {
                        this.testScriptStatusFail.val(failStatus.Value.toString());
                    }

                }



                if (callback)
                    callback();
            }).always(() => {
                if (enableLoaders)
                    MainLoader.hide();
            });
    }

    setTestScriptStatusesSingleDdl(enableLoaders = false, callback: Function = null, element = null, selectedVal = 0) {
        if (enableLoaders)
            MainLoader.show();
        return this.apiService.get(ApiUrl.TestScriptStatus)
            .done((status: IDdlModel[]) => {
                $(element).empty();
                $(element).append('<option value="0">Select Status</option>');
                if (status && status.length) {
                    const options = status.map(s => `<option value="${s.Value}">${s.Text}</option>`).join('');
                    $(element).append(options);
                    setTimeout(() => {
                        $(element).val(selectedVal);
                    }, 100);
                }
                if (callback)
                    callback();
            }).always(() => {
                if (enableLoaders)
                    MainLoader.hide();
            });
    }

    setProjectStatusesDdl(enableLoaders = false, callback: Function = null) {
        if (enableLoaders)
            MainLoader.show();
        return this.apiService.get(ApiUrl.ProjectStatus)
            .done((status: IDdlModel[]) => {
                //const projectStatusDdl = $('#project-status');
                this.projectStatusDdl.empty();
                this.projectStatusDdl.append('<option value="0">Select Status</option>');
                if (status && status.length) {
                    const options = status.map(s => `<option value="${s.Value}">${s.Text}</option>`).join('');
                    this.projectStatusDdl.append(options);
                }
                //Utils.setSearchableDdl(projectStatusDdl, 'SelectProject Status');
                if (callback)
                    callback();
            }).always(() => {
                if (enableLoaders)
                    MainLoader.hide();
            });
    }

    setTeamsDdl(enableLoaders = false, callback: Function = null, selectedData: string = null) {
        if (enableLoaders)
            MainLoader.show();
        return this.apiService.get(ApiUrl.Team)
            .done((status: IDdlModel[]) => {
                var arrSelectedTeams: number[];
                if (selectedData != null) {
                    arrSelectedTeams = selectedData.split(',').map(a => parseInt(a));
                }

                this.teamDdl.empty();
                this.teamDdl.append('<option value="">Select Team</option>');
                if (status && status.length) {

                    const options = status.map(s => {
                        if (arrSelectedTeams && arrSelectedTeams.indexOf(s.Value as number) != -1) {
                            return `<option selected="selected" value="${s.Value}">${s.Text}</option>`
                        }
                        else {
                            return `<option value="${s.Value}">${s.Text}</option>`
                        }
                    }).join('');
                    this.teamDdl.append(options);
                }
                if (callback)
                    callback();
            }).always(() => {
                if (enableLoaders)
                    MainLoader.hide();
            });
    }

    setStoriesDdl(projectId = 0, storiesDdlJq: JQuery, enableLoaders = false, callback: Function = null, statusIds = "0") {
        if (!storiesDdlJq)
            return false;

        if (enableLoaders)
            MainLoader.show();
        const storyDdlUrl = UrlHelper.GetProjectStoriesUrl(ApiUrl.ProjectStoriesDdl, projectId, 0, statusIds);
        return this.apiService.get(storyDdlUrl)
            .done((s: IDdlModel[]) => {
                storiesDdlJq.empty();
                storiesDdlJq.append('<option value="0">Select Story</option>');
                if (s && s.length) {
                    const options = s.map(s => `<option value="${s.Value}">${s.Text}</option>`).join('');
                    storiesDdlJq.append(options);
                }
                if (callback)
                    callback();
            })
            .always(() => {
                if (enableLoaders)
                    MainLoader.hide();
            });
    }

    setStoryTypesDdl(enableLoaders = false, callback: Function = null) {
        if (enableLoaders)
            MainLoader.show();
        const storyTypeUrl = UrlHelper.GetProjectStoriesUrl(ApiUrl.ProjectStoriesTypes, 0, 0);
        return this.apiService.get(storyTypeUrl)
            .done((status: IDdlModel[]) => {
                this.storyTypeDdl.empty();
                this.storyTypeDdl.append('<option value="0">Select Type</option>');
                if (status && status.length) {
                    const options = status.map(s => `<option value="${s.Value}">${s.Text}</option>`).join('');
                    this.storyTypeDdl.append(options);
                }
                if (callback)
                    callback();
            }).always(() => {
                if (enableLoaders)
                    MainLoader.hide();
            });
    }
}