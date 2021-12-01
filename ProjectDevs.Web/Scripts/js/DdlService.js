/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="Models.ts" />
/// <reference path="Constants.ts" />
/// <reference path="Common.ts" />
/// <reference path="UserService.ts" />
var DdlService = /** @class */ (function () {
    function DdlService(apiService) {
        this.apiService = apiService;
        this.projectsDdl = $('.projects-ddl');
        this.storiesStatusDdl = $('.stories-status-ddl');
        this.sprintsDdl = $('.sprints-ddl');
        this.taskStatusDdl = $('.task-status-ddl');
        this.reportTypeDdl = $('.report-type-ddl');
        this.testScriptStatusDdl = $('.test-script-status-ddl');
        this.testScriptStatusRequested = $('.test-script-status-requested');
        this.testScriptStatusPass = $('.test-script-status-pass');
        this.testScriptStatusFail = $('.test-script-status-fail');
        this.taskLOBDdl = $('.lob-ddl');
        this.projectStatusDdl = $('.projects-status-ddl');
        this.teamDdl = $('.teams-ddl');
        this.storyTypeDdl = $('.story-types-ddl');
    }
    DdlService.prototype.reloadSelectors = function () {
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
    };
    DdlService.prototype.setProjectsDdl = function (enableLoaders, callback, teamIds) {
        var _this = this;
        if (enableLoaders === void 0) { enableLoaders = false; }
        if (callback === void 0) { callback = null; }
        if (teamIds === void 0) { teamIds = null; }
        if (enableLoaders)
            MainLoader.show();
        var request = this.apiService.get(ApiUrl.ProjectsDdl, { teamId: teamIds })
            .done(function (status) {
            _this.projectsDdl.empty();
            _this.projectsDdl.append('<option value="0">Select Project</option>');
            if (status && status.length) {
                var options = status.map(function (s) { return "<option value=\"" + s.Value + "\">" + s.Text + "</option>"; }).join('');
                _this.projectsDdl.append(options);
            }
            if (callback)
                callback();
        }).
            always(function () {
            if (enableLoaders)
                MainLoader.hide();
        });
    };
    DdlService.prototype.setTaskLOBDdl = function (storyId, enableLoaders, callback) {
        var _this = this;
        if (storyId === void 0) { storyId = 0; }
        if (enableLoaders === void 0) { enableLoaders = false; }
        if (callback === void 0) { callback = null; }
        if (enableLoaders)
            MainLoader.show();
        var taskLOBUrl = UrlHelper.GetStoryTasksUrl(ApiUrl.StoryTaskLOB, storyId, 0);
        return this.apiService.get(taskLOBUrl)
            .done(function (status) {
            _this.taskLOBDdl.empty();
            _this.taskLOBDdl.append('<option value="0">Select LOB</option>');
            if (status && status.length) {
                var options = status.map(function (s) { return "<option value=\"" + s.Value + "\">" + s.Text + "</option>"; }).join('');
                _this.taskLOBDdl.append(options);
            }
            if (callback)
                callback();
        }).always(function () {
            if (enableLoaders)
                MainLoader.hide();
        });
    };
    DdlService.prototype.setStoryStatusesDdl = function (projectId, enableLoaders, callback, isEditCase) {
        var _this = this;
        if (projectId === void 0) { projectId = null; }
        if (enableLoaders === void 0) { enableLoaders = false; }
        if (callback === void 0) { callback = null; }
        if (isEditCase === void 0) { isEditCase = false; }
        if (enableLoaders)
            MainLoader.show();
        var storyStatusUrl = "";
        if (isEditCase) {
            storyStatusUrl = UrlHelper.GetProjectStoriesUrl(ApiUrl.ProjectStoriesStatus, projectId, 0);
        }
        else {
            storyStatusUrl = UrlHelper.GetProjectStoriesUrl(ApiUrl.ProjectStoriesStatus, 0, 0);
        }
        return this.apiService.get(storyStatusUrl)
            .done(function (status) {
            //const projectStatusDdl = $('#story-status');
            _this.storiesStatusDdl.empty();
            _this.storiesStatusDdl.append('<option value="0">Select Status</option>');
            if (status && status.length) {
                var options = status.map(function (s) { return "<option value=\"" + s.Value + "\">" + s.Text + "</option>"; }).join('');
                _this.storiesStatusDdl.append(options);
            }
            if (callback)
                callback();
        }).
            always(function () {
            if (enableLoaders)
                MainLoader.hide();
        });
    };
    DdlService.prototype.setSprintsDdl = function (enableLoaders, setMultiSelect, callback, teamId) {
        var _this = this;
        if (enableLoaders === void 0) { enableLoaders = false; }
        if (setMultiSelect === void 0) { setMultiSelect = true; }
        if (callback === void 0) { callback = null; }
        if (teamId === void 0) { teamId = null; }
        if (enableLoaders)
            MainLoader.show();
        var url = UrlHelper.GetSprintsUrlWithTeamId(ApiUrl.SprintsDdl, teamId);
        return this.apiService.get(url)
            .done(function (s) {
            _this.sprintsDdl.empty();
            _this.sprintsDdl.append('<option value="0" disabled>Select Sprint</option>');
            if (s && s.length) {
                var options = s.map(function (s) { return "<option value=\"" + s.Value + "\">" + s.Text + "</option>"; }).join('');
                _this.sprintsDdl.append(options);
            }
            if (setMultiSelect) {
                Utils.setMultiSelectDdl(_this.sprintsDdl, 'Sprint');
                _this.sprintsDdl.val('').trigger('change');
            }
            if (callback)
                callback();
        })
            .always(function () {
            if (enableLoaders)
                MainLoader.hide();
        });
    };
    DdlService.prototype.setTaskStatusesDdl = function (storyId, enableLoaders, callback) {
        var _this = this;
        if (storyId === void 0) { storyId = 0; }
        if (enableLoaders === void 0) { enableLoaders = false; }
        if (callback === void 0) { callback = null; }
        if (enableLoaders)
            MainLoader.show();
        var taskStatusUrl = UrlHelper.GetStoryTasksUrl(ApiUrl.StoryTasksStatus, storyId, 0);
        return this.apiService.get(taskStatusUrl)
            .done(function (status) {
            _this.taskStatusDdl.empty();
            _this.taskStatusDdl.append('<option value="0">Select Status</option>');
            if (status && status.length) {
                var options = status.map(function (s) { return "<option value=\"" + s.Value + "\">" + s.Text + "</option>"; }).join('');
                _this.taskStatusDdl.append(options);
            }
            if (callback)
                callback();
        }).always(function () {
            if (enableLoaders)
                MainLoader.hide();
        });
    };
    DdlService.prototype.setReportTypeDdl = function (enableLoaders, callback) {
        var _this = this;
        if (enableLoaders === void 0) { enableLoaders = false; }
        if (callback === void 0) { callback = null; }
        if (enableLoaders)
            MainLoader.show();
        var reportTypesUrl = ApiUrl.ReportTypes;
        return this.apiService.get(reportTypesUrl, null)
            .done(function (types) {
            _this.reportTypeDdl.empty();
            _this.reportTypeDdl.append('<option value="0">Select Report Type</option>');
            if (types && types.length) {
                var options = types.map(function (s) { return "<option value=\"" + s.Value + "\">" + s.Text + "</option>"; }).join('');
                _this.reportTypeDdl.append(options);
            }
            if (callback)
                callback();
        }).always(function () {
            if (enableLoaders)
                MainLoader.hide();
        });
    };
    DdlService.prototype.setTestScriptStatusesDdl = function (enableLoaders, callback) {
        var _this = this;
        if (enableLoaders === void 0) { enableLoaders = false; }
        if (callback === void 0) { callback = null; }
        if (enableLoaders)
            MainLoader.show();
        return this.apiService.get(ApiUrl.TestScriptStatus)
            .done(function (status) {
            _this.testScriptStatusDdl.empty();
            _this.testScriptStatusDdl.append('<option value="0">Select Status</option>');
            if (status && status.length) {
                var options = status.map(function (s) { return "<option value=\"" + s.Value + "\">" + s.Text + "</option>"; }).join('');
                _this.testScriptStatusDdl.append(options);
                var requestedStatus = status.filter(function (a) { return a.Text.toLowerCase() == "requested"; })[0];
                var passStatus = status.filter(function (a) { return a.Text.toLowerCase() == "pass"; })[0];
                var failStatus = status.filter(function (a) { return a.Text.toLowerCase() == "fail"; })[0];
                if (requestedStatus) {
                    _this.testScriptStatusRequested.val(requestedStatus.Value.toString());
                }
                if (passStatus) {
                    _this.testScriptStatusPass.val(passStatus.Value.toString());
                }
                if (failStatus) {
                    _this.testScriptStatusFail.val(failStatus.Value.toString());
                }
            }
            if (callback)
                callback();
        }).always(function () {
            if (enableLoaders)
                MainLoader.hide();
        });
    };
    DdlService.prototype.setTestScriptStatusesSingleDdl = function (enableLoaders, callback, element, selectedVal) {
        if (enableLoaders === void 0) { enableLoaders = false; }
        if (callback === void 0) { callback = null; }
        if (element === void 0) { element = null; }
        if (selectedVal === void 0) { selectedVal = 0; }
        if (enableLoaders)
            MainLoader.show();
        return this.apiService.get(ApiUrl.TestScriptStatus)
            .done(function (status) {
            $(element).empty();
            $(element).append('<option value="0">Select Status</option>');
            if (status && status.length) {
                var options = status.map(function (s) { return "<option value=\"" + s.Value + "\">" + s.Text + "</option>"; }).join('');
                $(element).append(options);
                setTimeout(function () {
                    $(element).val(selectedVal);
                }, 100);
            }
            if (callback)
                callback();
        }).always(function () {
            if (enableLoaders)
                MainLoader.hide();
        });
    };
    DdlService.prototype.setProjectStatusesDdl = function (enableLoaders, callback) {
        var _this = this;
        if (enableLoaders === void 0) { enableLoaders = false; }
        if (callback === void 0) { callback = null; }
        if (enableLoaders)
            MainLoader.show();
        return this.apiService.get(ApiUrl.ProjectStatus)
            .done(function (status) {
            //const projectStatusDdl = $('#project-status');
            _this.projectStatusDdl.empty();
            _this.projectStatusDdl.append('<option value="0">Select Status</option>');
            if (status && status.length) {
                var options = status.map(function (s) { return "<option value=\"" + s.Value + "\">" + s.Text + "</option>"; }).join('');
                _this.projectStatusDdl.append(options);
            }
            //Utils.setSearchableDdl(projectStatusDdl, 'SelectProject Status');
            if (callback)
                callback();
        }).always(function () {
            if (enableLoaders)
                MainLoader.hide();
        });
    };
    DdlService.prototype.setTeamsDdl = function (enableLoaders, callback, selectedData) {
        var _this = this;
        if (enableLoaders === void 0) { enableLoaders = false; }
        if (callback === void 0) { callback = null; }
        if (selectedData === void 0) { selectedData = null; }
        if (enableLoaders)
            MainLoader.show();
        return this.apiService.get(ApiUrl.Team)
            .done(function (status) {
            var arrSelectedTeams;
            if (selectedData != null) {
                arrSelectedTeams = selectedData.split(',').map(function (a) { return parseInt(a); });
            }
            _this.teamDdl.empty();
            _this.teamDdl.append('<option value="">Select Team</option>');
            if (status && status.length) {
                var options = status.map(function (s) {
                    if (arrSelectedTeams && arrSelectedTeams.indexOf(s.Value) != -1) {
                        return "<option selected=\"selected\" value=\"" + s.Value + "\">" + s.Text + "</option>";
                    }
                    else {
                        return "<option value=\"" + s.Value + "\">" + s.Text + "</option>";
                    }
                }).join('');
                _this.teamDdl.append(options);
            }
            if (callback)
                callback();
        }).always(function () {
            if (enableLoaders)
                MainLoader.hide();
        });
    };
    DdlService.prototype.setStoriesDdl = function (projectId, storiesDdlJq, enableLoaders, callback, statusIds) {
        if (projectId === void 0) { projectId = 0; }
        if (enableLoaders === void 0) { enableLoaders = false; }
        if (callback === void 0) { callback = null; }
        if (statusIds === void 0) { statusIds = "0"; }
        if (!storiesDdlJq)
            return false;
        if (enableLoaders)
            MainLoader.show();
        var storyDdlUrl = UrlHelper.GetProjectStoriesUrl(ApiUrl.ProjectStoriesDdl, projectId, 0, statusIds);
        return this.apiService.get(storyDdlUrl)
            .done(function (s) {
            storiesDdlJq.empty();
            storiesDdlJq.append('<option value="0">Select Story</option>');
            if (s && s.length) {
                var options = s.map(function (s) { return "<option value=\"" + s.Value + "\">" + s.Text + "</option>"; }).join('');
                storiesDdlJq.append(options);
            }
            if (callback)
                callback();
        })
            .always(function () {
            if (enableLoaders)
                MainLoader.hide();
        });
    };
    DdlService.prototype.setStoryTypesDdl = function (enableLoaders, callback) {
        var _this = this;
        if (enableLoaders === void 0) { enableLoaders = false; }
        if (callback === void 0) { callback = null; }
        if (enableLoaders)
            MainLoader.show();
        var storyTypeUrl = UrlHelper.GetProjectStoriesUrl(ApiUrl.ProjectStoriesTypes, 0, 0);
        return this.apiService.get(storyTypeUrl)
            .done(function (status) {
            _this.storyTypeDdl.empty();
            _this.storyTypeDdl.append('<option value="0">Select Type</option>');
            if (status && status.length) {
                var options = status.map(function (s) { return "<option value=\"" + s.Value + "\">" + s.Text + "</option>"; }).join('');
                _this.storyTypeDdl.append(options);
            }
            if (callback)
                callback();
        }).always(function () {
            if (enableLoaders)
                MainLoader.hide();
        });
    };
    return DdlService;
}());
//# sourceMappingURL=DdlService.js.map