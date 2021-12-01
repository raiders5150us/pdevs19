/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="Models.ts" />
/// <reference path="Constants.ts" />
/// <reference path="Common.ts" />
/// <reference path="UserService.ts" />
var TestScriptService = /** @class */ (function () {
    function TestScriptService(apiService, ddlService, fileService, isDetailPage) {
        this.apiService = apiService;
        this.ddlService = ddlService;
        this.fileService = fileService;
        this.isDetailPage = isDetailPage;
        this.testScriptsTable = $('#test-scripts-table');
        this.testScriptsTableBody = $('#test-scripts-table > tbody');
        this.pagingContainer = $('#test-scripts-paging-container');
        this.infoContainer = $('#apdt_test-scripts_info');
        this.startFromElement = this.infoContainer.find('.apdt_startfrom');
        this.endToElement = this.infoContainer.find('.apdt_endto');
        this.totalElement = this.infoContainer.find('.apdt_total');
        this.oneClickApprovalBtn = $('#one-click-approval-btn');
        this.testScriptStepsTableBody = $('#test-script-steps-table > tbody');
        this.TestScriptStepsData = [];
        this.createEditTestScriptModal = $('#create-edit-test-script-modal');
        this.saveTestScriptModalForm = this.createEditTestScriptModal.find('#test-scripts-form');
        this.saveTestScriptBtn = this.createEditTestScriptModal.find('#save-test-script-btn');
        this.createEditTestScriptStepModal = $('#create-edit-test-script-step-modal');
        this.saveTestScriptStepModalForm = this.createEditTestScriptStepModal.find('#test-scripts-step-form');
        this.saveTestScriptStepBtn = this.createEditTestScriptStepModal.find('#save-test-script-step-btn');
        this.formProjectsDdl = this.saveTestScriptModalForm.find('#test-script-project-ddl');
        this.formStoryDdl = this.saveTestScriptModalForm.find('#test-script-story-ddl');
        this.stepStatuses = [];
        this.addNoteModal = $("#create-note-modal");
        this.addNoteModalForm = this.addNoteModal.find("#notes-form");
        this.addNoteSubmitButton = this.addNoteModalForm.find("#save-note-btn");
        this.testScriptStepNotesViewModal = $("#test_script_step_notes");
        this.selectedProjectId = 0;
        this.selectedStorId = 0;
        this.selectedTeamIds = "";
        this.selectedStoryStatusIds = "";
        this.init();
    }
    TestScriptService.prototype.clearTestScripts = function () {
        this.pagingContainer.html('');
        this.startFromElement.html("0");
        this.endToElement.html("0");
        this.totalElement.html("0");
        this.infoContainer.hide();
        this.testScriptsTableBody.empty();
        this.testScriptsTable.hide();
    };
    TestScriptService.prototype.loadTestScrips = function (projectId, storyId, teamIds, pno, psize) {
        var _this = this;
        if (pno === void 0) { pno = 1; }
        if (psize === void 0) { psize = Constants.DefaultPageSize; }
        this.selectedProjectId = projectId;
        this.selectedStorId = storyId;
        this.selectedTeamIds = teamIds;
        MainLoader.show();
        this.apiService.get(ApiUrl.TestScripts, { pno: pno, psize: psize, storyId: storyId, projectId: projectId, teamIds: teamIds })
            .done(function (s) {
            _this.clearTestScripts();
            if (s && s.Data && s.Data.length) {
                _this.testScriptsTable.show();
                _this.infoContainer.show();
                s.Data.forEach(function (s) {
                    var tr = $('<tr>');
                    //const story = `<b>${s.StoryName}</b> - <strong>As a </strong> ${s.StoryF1}<br />
                    //        <strong>I want to </strong> ${s.StoryF2}<br />
                    //        <strong>So I can </strong> ${s.StoryF3} `;
                    var action = "\n        <a role=\"button\" title=\"View Steps\" class=\"btn btn-xs btn-success m-r-5 d-inline\" href=\"/User-Story/" + s.StoryId + "/Test-Scripts/" + s.TestScriptId + "\"><i class=\"fa fa-list\"></i></a>\n        <button type=\"button\" title=\"Edit Script\" class=\"btn btn-xs btn-primary\" ap-action-test-script-modal-form data-story-id=\"" + s.StoryId + "\"  data-test-script-id=\"" + s.TestScriptId + "\" data-project-id=\"" + s.ProjectId + "\"><i class=\"fa fa-pencil\"></i></button>";
                    tr.append("<td class=\"text-center v-middle\">" + action + "</td>");
                    tr.append("<td class=\"text-center v-middle\">" + s.StoryName + "</td>");
                    tr.append("<td class=\"text-center v-middle\">" + s.TestScriptStatusName + "</td>");
                    tr.append("<td class=\"v-middle\">" + s.CreatedByUserName + "</td>");
                    tr.append("<td class=\"v-middle\">" + s.DeveloperName + "</td>");
                    tr.append("<td class=\"v-middle\">" + s.DevManagerName + "</td>");
                    tr.append("<td class=\"v-middle\">" + s.BusinessAnalystName + "</td>");
                    tr.append("<td class=\"v-middle\">" + s.BusinessStakeholderName + "</td>");
                    tr.append("<td class=\"v-middle\">" + Utils.JsonDateToStr(s.RequestDate) + "</td>");
                    tr.append("<td class=\"v-middle\">" + Utils.JsonDateToStr(s.RequestedByDate) + "</td>");
                    _this.testScriptsTableBody.append(tr);
                });
                var pageModel = {
                    CurrentPageNumber: s.CurrentPageNumber,
                    IsLastPage: s.IsLastPage,
                    PageSize: s.PageSize,
                    TotalPages: s.Count,
                };
                var pagination = Pagination.Render(pageModel);
                _this.pagingContainer.html("" + pagination);
                var startFrom = ((s.CurrentPageNumber - 1) * s.PageSize) + 1;
                var endTo = startFrom + s.Data.length - 1;
                _this.startFromElement.html("" + startFrom);
                _this.endToElement.html("" + endTo);
                _this.totalElement.html("" + s.Count);
                if (projectId > 0) {
                    var projectDetailUrl = UrlHelper.GetProjectsUrl(ApiUrl.ProjectDetail, projectId);
                    _this.apiService.get(projectDetailUrl)
                        .done(function (project) {
                        if (!(UserTokenHandler.isSuperUser() || UserTokenHandler.isUserStakeholderOrOwnerForProject(project))) {
                            $("[ap-action-test-script-modal-form]").hide();
                        }
                        else {
                            $("[ap-action-test-script-modal-form]").show();
                        }
                    });
                }
                else {
                    if (!(UserTokenHandler.isSuperUser())) {
                        $("[ap-action-test-script-modal-form]").hide();
                    }
                    else {
                        $("[ap-action-test-script-modal-form]").show();
                    }
                }
            }
            else {
                Alerts.Info('No Test Scripts found.');
            }
        })
            .always(function () { return MainLoader.hide(); });
    };
    TestScriptService.prototype.getTestScriptDetails = function (testScriptId) {
        var _this = this;
        var stepStatusUrl = ApiUrl.TestScriptStepsStatus;
        this.apiService.get(stepStatusUrl)
            .done(function (data, status, xhr) {
            _this.stepStatuses = data;
        })
            .always(function () { return MainLoader.hide(); });
        var u = UrlHelper.GetTestScriptsUrl(ApiUrl.TestScriptDetail, testScriptId);
        MainLoader.show();
        this.apiService.get(u)
            .done(function (t) {
            var projectFilesUrl = null;
            projectFilesUrl = UrlHelper.GetFilesUrl(ApiUrl.FilesOfRecord, FileType.TestScripts, testScriptId, 0);
            _this.apiService.get(projectFilesUrl, { psize: 100 })
                .done(function (files) {
                if (files.length > 0) {
                    $("#dvUploadedFile").css("display", "block");
                    $('[test-script-file]').attr('href', ApiUrl.Domain + "/" + files[files.length - 1].FileLocation);
                    $('[test-script-file]').html("" + files[files.length - 1].FileName);
                }
            });
            var developer = t.AssigneeMappings.filter(function (a) { return a.UserType == TestScriptAssigneeMappingUserTypes[TestScriptAssigneeMappingUserTypes.Developer].toString(); });
            var devManager = t.AssigneeMappings.filter(function (a) { return a.UserType == TestScriptAssigneeMappingUserTypes[TestScriptAssigneeMappingUserTypes.DevManager].toString(); });
            var businessAnalyst = t.AssigneeMappings.filter(function (a) { return a.UserType == TestScriptAssigneeMappingUserTypes[TestScriptAssigneeMappingUserTypes.BusinessAnalyst].toString(); });
            var businessStakeholder = t.AssigneeMappings.filter(function (a) { return a.UserType == TestScriptAssigneeMappingUserTypes[TestScriptAssigneeMappingUserTypes.BusinessStakeholder].toString(); });
            if (developer[0]) {
                $('[t-assigned-to-developer]').text(developer[0].FullName);
            }
            $('[t-assigned-to-dev-mgr]').text(devManager[0].FullName);
            $('[t-assigned-to-biz-analyst]').text(businessAnalyst[0].FullName);
            $('[t-assigned-to-biz-requester]').text(businessStakeholder[0].FullName);
            $('[t-project-name]').text(t.ProjectName);
            $('[t-created-by-user]').text(t.CreatedByUserName);
            $('[t-request-date]').text(Utils.JsonDateToStr(t.RequestDate));
            $('[t-requested-by-user]').text(t.CreatedByUserName);
            $('[t-requested-by-date]').text(Utils.JsonDateToStr(t.RequestedByDate));
            $('[t-test-script-status]').text(t.TestScriptStatusName);
            //const story = `<strong>As a </strong> ${t.StoryF1}<br />
            //                <strong>I want to </strong> ${t.StoryF2}<br />
            //                <strong>So I can </strong> ${t.StoryF3} 
            //                <a href="/Project/${t.ProjectId}/user-story/${t.StoryId}" title="View Story" class="m-l-10 btn btn-xs btn-info" target="_blank"><i class="fa fa-share"></i></a>`;
            $('[t-user-story-f1]').html("<strong><span style='color: #fff;'><a href='/Project/" + t.ProjectId + "/user-story/" + t.StoryId + "' target='_blank'>" + t.StoryName + " </a></span> : As a </strong>  " + t.StoryF1);
            $('[t-user-story-f2]').html("<strong>I want to </strong>  " + t.StoryF2);
            $('[t-user-story-f3]').html("<strong>So i can </strong>  " + t.StoryF3);
            $('[t-data-project-id]').attr('data-project-id', t.ProjectId);
            if (t.LastModifiedBy && t.LastModifiedByName && t.LastModifiedOn) {
                $('.modified-field').show();
                $('[t-modified-by-user]').text(t.LastModifiedByName);
                $('[t-modified-date]').text(Utils.JsonDateToStr(t.LastModifiedOn));
            }
            else {
                $('.modified-field').hide();
            }
            if (t.AssignedToUserId === UserTokenHandler.getUser().UserId
                && t.TestScriptStatusName.toLowerCase() !== 'approve'
                && t.TestScriptStatusName.toLowerCase() !== 'pass') {
                _this.oneClickApprovalBtn.removeClass('hide').show();
            }
            else {
                _this.oneClickApprovalBtn.addClass('hide').hide();
            }
            var projectDetailUrl = UrlHelper.GetProjectsUrl(ApiUrl.ProjectDetail, t.ProjectId);
            _this.apiService.get(projectDetailUrl)
                .done(function (project) {
                if (!(UserTokenHandler.isSuperUser() || UserTokenHandler.isUserStakeholderOrOwnerForProject(project))) {
                    $("[ap-action-test-script-modal-form]").remove();
                    $("[ap-action-test-script-step-edit-button]").remove();
                    $("[ap-action-test-script-step-modal-form]").remove();
                    $("[ap-action-test-script-save-steps]").remove();
                    //$("[ap-action-test-script-step-add-note-button]").remove();
                }
                //else {
                //    setTimeout(() => {
                //        $("input[name=test-script-developer-status]").removeAttr("disabled");
                //        $("input[name=test-script-devmgr-status]").removeAttr("disabled");
                //        $("input[name=test-script-bizanalyst-status]").removeAttr("disabled");
                //        $("input[name=test-script-bizrequester-status]").removeAttr("disabled");
                //    }, 100);
                //}
            });
        })
            .always(function () { return MainLoader.hide(); });
    };
    TestScriptService.prototype.loadTestScriptSteps = function (testScriptId, pno, psize) {
        var _this = this;
        if (pno === void 0) { pno = 1; }
        if (psize === void 0) { psize = 100; }
        MainLoader.show();
        var u = UrlHelper.GetTestScriptsUrl(ApiUrl.TestScriptSteps, testScriptId, 0);
        this.apiService.get(u, { pno: pno, psize: psize })
            .done(function (s) {
            _this.TestScriptStepsData = [];
            if (s && s.Data && s.Data.length) {
                s.Data.forEach(function (s) {
                    _this.TestScriptStepsData.push(s);
                });
            }
            _this.ReloadTestScriptStepsData();
        })
            .always(function () { return MainLoader.hide(); });
    };
    TestScriptService.prototype.ReloadTestScriptStepsData = function () {
        var _this = this;
        this.testScriptStepsTableBody.empty();
        if (this.stepStatuses.length == 0) {
            var stepStatusUrl = ApiUrl.TestScriptStepsStatus;
            this.apiService.get(stepStatusUrl)
                .done(function (data, status, xhr) {
                _this.stepStatuses = data;
                _this.getStepData();
            })
                .always(function () { return MainLoader.hide(); });
        }
        else {
            this.getStepData();
        }
    };
    TestScriptService.prototype.getStepData = function () {
        var _this = this;
        if (this.TestScriptStepsData && this.TestScriptStepsData.length) {
            var testScript_1 = null;
            var user_1 = UserTokenHandler.getUser();
            var developer_1;
            var devManager_1;
            var businessAnalyst_1;
            var businessStakeholder_1;
            var testScriptId = $("#MainTestScriptId").val() | 0;
            var u = UrlHelper.GetTestScriptsUrl(ApiUrl.TestScriptDetail, testScriptId);
            MainLoader.show();
            this.apiService.get(u)
                .done(function (t) {
                testScript_1 = t;
                developer_1 = t.AssigneeMappings.filter(function (a) { return a.UserType == TestScriptAssigneeMappingUserTypes[TestScriptAssigneeMappingUserTypes.Developer].toString(); });
                devManager_1 = t.AssigneeMappings.filter(function (a) { return a.UserType == TestScriptAssigneeMappingUserTypes[TestScriptAssigneeMappingUserTypes.DevManager].toString(); });
                businessAnalyst_1 = t.AssigneeMappings.filter(function (a) { return a.UserType == TestScriptAssigneeMappingUserTypes[TestScriptAssigneeMappingUserTypes.BusinessAnalyst].toString(); });
                businessStakeholder_1 = t.AssigneeMappings.filter(function (a) { return a.UserType == TestScriptAssigneeMappingUserTypes[TestScriptAssigneeMappingUserTypes.BusinessStakeholder].toString(); });
            })
                .always(function () {
                MainLoader.hide();
                _this.TestScriptStepsData.forEach(function (s) {
                    var passStatusId = _this.stepStatuses.filter(function (a) { return a.Text.toLowerCase() == "pass"; })[0].Value;
                    var failStatusId = _this.stepStatuses.filter(function (a) { return a.Text.toLowerCase() == "fail"; })[0].Value;
                    var developerPassStatus = (s.DeveloperStepStatusId == passStatusId.toString()) ? "checked='checked'" : "";
                    var developerFailStatus = (s.DeveloperStepStatusId == failStatusId.toString()) ? "checked='checked'" : "";
                    var devMgrPassStatus = (s.DevMgrStepStatusId == passStatusId.toString()) ? "checked='checked'" : "";
                    var devMgrFailStatus = (s.DevMgrStepStatusId == failStatusId.toString()) ? "checked='checked'" : "";
                    var bizAnalystPassStatus = (s.BizAnalystStepStatusId == passStatusId.toString()) ? "checked='checked'" : "";
                    var bizAnalystFailStatus = (s.BizAnalystStepStatusId == failStatusId.toString()) ? "checked='checked'" : "";
                    var bizRequesterPassStatus = (s.BizRequesterStepStatusId == passStatusId.toString()) ? "checked='checked'" : "";
                    var bizRequesterFailStatus = (s.BizRequesterStepStatusId == failStatusId.toString()) ? "checked='checked'" : "";
                    var tr = $('<tr>');
                    if (s.Editable == true) {
                        if (s.StepId == 0) {
                            var action = "\n                                <button type=\"button\" title=\"Delete Step\" class=\"btn btn-xs btn-primary\" ap-action-test-script-step-delete-button data-test-script-id=\"" + s.TestScriptId + "\" data-step-id=\"" + s.StepId + "\"><i class=\"fa fa-trash\"></i></button>";
                            tr.append("<td class=\"text-center v-middle\">" + action + "</td>");
                        }
                        else {
                            tr.append("<td class=\"text-center v-middle\"></td>");
                        }
                        tr.append("<td class=\"text-center\">\n                                    <input type=\"number\" min=\"1\" max=\"100\" class=\"form-control d-input\" placeholder=\"Step number\" name=\"StepNumber\" readonly value=\"" + s.StepNumber + "\" />                    \n                                    </td>");
                        tr.append("<td class=\"\">\n                            <textarea maxlength=\"500\" class=\"form-control d-input test-script-action-input\" name=\"Action\" placeholder=\"Action\" rows=\"4\">" + s.Action + "</textarea>\n                            </td>");
                        tr.append("<td class=\"\">\n                            <textarea maxlength=\"500\" class=\"form-control d-input test-script-expectedresult-input\" name=\"ExpectedResults\" placeholder=\"Expected result\" rows=\"4\">" + s.ExpectedResults + "</textarea>\n                            </td>");
                        if (s.StepId == 0) {
                            tr.append("<td class=\"\">\n                                <textarea maxlength=\"1000\" class=\"form-control d-input test-script-notes-input\" name=\"Notes\" placeholder=\"Notes\" rows=\"5\">" + s.Notes + "</textarea>\n                                </td>");
                        }
                        else {
                            tr.append("<td class=\"v-middle\" style=\"max-width: 200px;word-break: break-all;word-wrap: break-word;\">" + s.Notes + "</td>");
                        }
                        tr.append("<td class=\"text-center\">\n                        <div class=\"form-check form-check-inline\">\n                            <label class=\"form-check-label\" for=\"test_script_developer_status_pass" + s.StepNumber + "\">Pass</label>\n                            <input class=\"form-check-input test-script-status-pass\" data-usertype=\"developer\" data-stepid=\"" + s.StepId + "\" \n                            type=\"radio\" " + developerPassStatus + " name=\"test-script-developer-status" + s.StepNumber + "\" id=\"test_script_developer_status_pass" + s.StepNumber + "\" value=\"" + passStatusId + "\">\n                                        \n                            <label class=\"form-check-label\" for=\"test_script_developer_status_fail" + s.StepNumber + "\">Fail</label>\n                            <input class=\"form-check-input test-script-status-fail\"  data-usertype=\"developer\" data-stepid=\"" + s.StepId + "\" \n                            type=\"radio\" " + developerFailStatus + " name=\"test-script-developer-status" + s.StepNumber + "\" id=\"test_script_developer_status_fail" + s.StepNumber + "\" value=\"" + failStatusId + "\">\n                        </div>\n                    </td>");
                        tr.append("<td class=\"text-center\">\n                       <div class=\"form-check form-check-inline\">\n                            <label class=\"form-check-label\" for=\"test_script_devmgr_status_pass" + s.StepNumber + "\">Pass</label>\n                            <input class=\"form-check-input test-script-status-pass\" data-stepid=\"" + s.StepId + "\" \n                                data-usertype=\"devmgr\" " + devMgrPassStatus + " type=\"radio\" name=\"test-script-devmgr-status" + s.StepNumber + "\" id=\"test_script_devmgr_status_pass" + s.StepNumber + "\" value=\"" + passStatusId + "\">\n                                        \n                            <label class=\"form-check-label\" for=\"test_script_devmgr_status_fail" + s.StepNumber + "\">Fail</label>\n                            <input class=\"form-check-input test-script-status-fail\" data-stepid=\"" + s.StepId + "\" \n                            type=\"radio\" data-usertype=\"devmgr\" " + devMgrFailStatus + " name=\"test-script-devmgr-status" + s.StepNumber + "\" id=\"test_script_devmgr_status_fail" + s.StepNumber + "\" value=\"" + failStatusId + "\">\n                        </div>\n                    </td>");
                        tr.append("<td class=\"text-center\">\n                        <div class=\"form-check form-check-inline\">\n                            <label class=\"form-check-label\" for=\"test_script_bizanalyst_status_pass" + s.StepNumber + "\">Pass</label>\n                            <input class=\"form-check-input test-script-status-pass\" data-stepid=\"" + s.StepId + "\" \n                            type=\"radio\" " + bizAnalystPassStatus + " data-usertype=\"bizanalyst\" name=\"test-script-bizanalyst-status" + s.StepNumber + "\" id=\"test_script_bizanalyst_status_pass" + s.StepNumber + "\" value=\"" + passStatusId + "\">\n                                        \n                            <label class=\"form-check-label\" for=\"test_script_bizanalyst_status_fail" + s.StepNumber + "\">Fail</label>\n                            <input class=\"form-check-input test-script-status-fail\" data-stepid=\"" + s.StepId + "\" \n                            type=\"radio\" " + bizAnalystFailStatus + " data-usertype=\"bizanalyst\" name=\"test-script-bizanalyst-status" + s.StepNumber + "\" id=\"test_script_bizanalyst_status_fail" + s.StepNumber + "\" value=\"" + failStatusId + "\">\n                        </div>\n                    </td>");
                        tr.append("<td class=\"text-center\">\n                        <div class=\"form-check form-check-inline\">\n                            <label class=\"form-check-label\" for=\"test_script_bizrequester_status_pass" + s.StepNumber + "\">Pass</label>\n                            <input class=\"form-check-input test-script-status-pass\" data-stepid=\"" + s.StepId + "\"  \n                            type=\"radio\" " + bizRequesterPassStatus + " data-usertype=\"bizrequester\" name=\"test-script-bizrequester-status" + s.StepNumber + "\" id=\"test_script_bizrequester_status_pass" + s.StepNumber + "\" value=\"" + passStatusId + "\">\n                                        \n                            <label class=\"form-check-label\" for=\"test_script_bizrequester_status_fail" + s.StepNumber + "\">Fail</label>\n                            <input class=\"form-check-input test-script-status-fail\" data-stepid=\"" + s.StepId + "\"  \n                            type=\"radio\" " + bizRequesterFailStatus + " data-usertype=\"bizrequester\" name=\"test-script-bizrequester-status" + s.StepNumber + "\" id=\"test_script_bizrequester_status_fail" + s.StepNumber + "\" value=\"" + failStatusId + "\">\n                        </div>\n                    </td>");
                        //tr.append(`<td class="text-center ">
                        //<select class="form-control d-input test-script-status-ddl" name="TestScriptStatus"><option value="">Select Status</option></select>
                        //</td>`);
                    }
                    else {
                        var action = "\n                            <button type=\"button\" title=\"Edit Script\" class=\"btn btn-xs btn-primary\" ap-action-test-script-step-edit-button data-test-script-id=\"" + s.TestScriptId + "\" data-step-id=\"" + s.StepId + "\"><i class=\"fa fa-pencil\"></i></button>\n                            <button type=\"button\" title=\"Add Note\" class=\"btn btn-xs btn-primary\" ap-action-test-script-step-add-note-button data-test-script-id=\"" + s.TestScriptId + "\" data-step-id=\"" + s.StepId + "\"><i class=\"fa fa-pencil-square-o\"></i></button>\n                            <button type=\"button\" title=\"View Notes\" class=\"btn btn-xs btn-primary\" ap-action-test-script-step-view-notes-button data-test-script-id=\"" + s.TestScriptId + "\" data-step-id=\"" + s.StepId + "\"><i class=\"fa fa-sticky-note\"></i></button>";
                        tr.append("<td class=\"text-center v-middle\">" + action + "</td>");
                        tr.append("<td class=\"text-center v-middle\">\n" + s.StepNumber + " <input type=\"hidden\" min=\"1\" max=\"100\" class=\"form-control d-input\" placeholder=\"Step number\" name=\"StepNumber\" readonly value=\"" + s.StepNumber + "\" />                    \n                    </td>");
                        tr.append("<td class=\"v-middle\" style=\"max-width: 200px;word-break: break-all;word-wrap: break-word;\">" + ((s.Action == null || s.Action == undefined) ? "" : s.Action.replace(/\n/g, "<br/>")) + "</td>");
                        tr.append("<td class=\"v-middle\" style=\"max-width: 200px;word-break: break-all;word-wrap: break-word;\">" + ((s.ExpectedResults == null || s.ExpectedResults == undefined) ? "" : s.ExpectedResults.replace(/\n/g, "<br/>")) + "</td>");
                        tr.append("<td class=\"v-middle\" style=\"max-width: 200px;word-break: break-all;word-wrap: break-word;\">" + ((s.Notes == null || s.Notes == undefined) ? "" : s.Notes.replace(/\n/g, "<br/>")) + "</td>");
                        tr.append("<td class=\"text-center\">\n                        <div class=\"form-check form-check-inline\">\n                            <label class=\"form-check-label\" for=\"test_script_developer_status_pass" + s.StepNumber + "\">Pass</label>\n                            <input class=\"form-check-input test-script-status-pass\"  data-usertype=\"developer\"  data-stepid=\"" + s.StepId + "\" data-editable=\"" + (s.StepId > 0 ? 1 : 0) + "\"\n                            type=\"radio\" " + developerPassStatus + " name=\"test-script-developer-status" + s.StepNumber + "\" id=\"test_script_developer_status_pass" + s.StepNumber + "\" value=\"" + passStatusId + "\">\n                                        \n                            <label class=\"form-check-label\" for=\"test_script_developer_status_fail" + s.StepNumber + "\">Fail</label>\n                            <input class=\"form-check-input test-script-status-fail\"  data-usertype=\"developer\"  data-stepid=\"" + s.StepId + "\" data-editable=\"" + (s.StepId > 0 ? 1 : 0) + "\"\n                            type=\"radio\" " + developerFailStatus + " name=\"test-script-developer-status" + s.StepNumber + "\" id=\"test_script_developer_status_fail" + s.StepNumber + "\" value=\"" + failStatusId + "\">\n                        </div>\n                    </td>");
                        tr.append("<td class=\"text-center\">\n                       <div class=\"form-check form-check-inline\">\n                            <label class=\"form-check-label\" for=\"test_script_devmgr_status_pass" + s.StepNumber + "\">Pass</label>\n                            <input class=\"form-check-input test-script-status-pass\" data-stepid=\"" + s.StepId + "\"  data-editable=\"" + (s.StepId > 0 ? 1 : 0) + "\"\n                                data-usertype=\"devmgr\" " + devMgrPassStatus + " type=\"radio\" name=\"test-script-devmgr-status" + s.StepNumber + "\" id=\"test_script_devmgr_status_pass" + s.StepNumber + "\" value=\"" + passStatusId + "\">\n                                        \n                            <label class=\"form-check-label\" for=\"test_script_devmgr_status_fail" + s.StepNumber + "\">Fail</label>\n                            <input class=\"form-check-input test-script-status-fail\" data-stepid=\"" + s.StepId + "\"  data-editable=\"" + (s.StepId > 0 ? 1 : 0) + "\"\n                            type=\"radio\" data-usertype=\"devmgr\" " + devMgrFailStatus + " name=\"test-script-devmgr-status" + s.StepNumber + "\" id=\"test_script_devmgr_status_fail" + s.StepNumber + "\" value=\"" + failStatusId + "\">\n                        </div>\n                    </td>");
                        tr.append("<td class=\"text-center\">\n                        <div class=\"form-check form-check-inline\">\n                            <label class=\"form-check-label\" for=\"test_script_bizanalyst_status_pass" + s.StepNumber + "\">Pass</label>\n                            <input class=\"form-check-input test-script-status-pass\" data-stepid=\"" + s.StepId + "\"  data-editable=\"" + (s.StepId > 0 ? 1 : 0) + "\"\n                            type=\"radio\" " + bizAnalystPassStatus + " data-usertype=\"bizanalyst\" name=\"test-script-bizanalyst-status" + s.StepNumber + "\" id=\"test_script_bizanalyst_status_pass" + s.StepNumber + "\" value=\"" + passStatusId + "\">\n                                        \n                            <label class=\"form-check-label\" for=\"test_script_bizanalyst_status_fail" + s.StepNumber + "\">Fail</label>\n                            <input class=\"form-check-input test-script-status-fail\"  data-stepid=\"" + s.StepId + "\"  data-editable=\"" + (s.StepId > 0 ? 1 : 0) + "\"\n                            type=\"radio\" " + bizAnalystFailStatus + " data-usertype=\"bizanalyst\" name=\"test-script-bizanalyst-status" + s.StepNumber + "\" id=\"test_script_bizanalyst_status_fail" + s.StepNumber + "\" value=\"" + failStatusId + "\">\n                        </div>\n                    </td>");
                        tr.append("<td class=\"text-center\">\n                        <div class=\"form-check form-check-inline\">\n                            <label class=\"form-check-label\" for=\"test_script_bizrequester_status_pass" + s.StepNumber + "\">Pass</label>\n                            <input class=\"form-check-input test-script-status-pass\"  data-stepid=\"" + s.StepId + "\"  data-editable=\"" + (s.StepId > 0 ? 1 : 0) + "\"\n                            type=\"radio\" " + bizRequesterPassStatus + " data-usertype=\"bizrequester\" name=\"test-script-bizrequester-status" + s.StepNumber + "\" id=\"test_script_bizrequester_status_pass" + s.StepNumber + "\" value=\"" + passStatusId + "\">\n                                        \n                            <label class=\"form-check-label\" for=\"test_script_bizrequester_status_fail" + s.StepNumber + "\">Fail</label>\n                            <input class=\"form-check-input test-script-status-fail\"  data-stepid=\"" + s.StepId + "\"  data-editable=\"" + (s.StepId > 0 ? 1 : 0) + "\"\n                            type=\"radio\" " + bizRequesterFailStatus + " data-usertype=\"bizrequester\" name=\"test-script-bizrequester-status" + s.StepNumber + "\" id=\"test_script_bizrequester_status_fail" + s.StepNumber + "\" value=\"" + failStatusId + "\">\n                        </div>\n                    </td>");
                    }
                    _this.testScriptStepsTableBody.append(tr);
                    _this.ddlService.setTestScriptStatusesSingleDdl(false, null, $(tr).find("select"), s.TestScriptStatus);
                });
                var projectDetailUrl = UrlHelper.GetProjectsUrl(ApiUrl.ProjectDetail, testScript_1.ProjectId);
                _this.apiService.get(projectDetailUrl)
                    .done(function (project) {
                    if (!(UserTokenHandler.isSuperUser() || UserTokenHandler.isUserStakeholderOrOwnerForProject(project))) {
                        $("[ap-action-test-script-modal-form]").remove();
                        $("[ap-action-test-script-step-edit-button]").remove();
                        $("[ap-action-test-script-step-modal-form]").remove();
                        $("[ap-action-test-script-save-steps]").remove();
                        //$("[ap-action-test-script-step-add-note-button]").remove();
                    }
                    else {
                        setTimeout(function () {
                            $("#test-script-steps-table").find("input[data-usertype='developer']").removeAttr("disabled");
                            $("#test-script-steps-table").find("input[data-usertype='devmgr']").removeAttr("disabled");
                            $("#test-script-steps-table").find("input[data-usertype='bizanalyst']").removeAttr("disabled");
                            $("#test-script-steps-table").find("input[data-usertype='bizrequester']").removeAttr("disabled");
                        }, 100);
                    }
                })
                    .always(function () {
                    setTimeout(function () {
                        if (!(developer_1[0] != undefined && developer_1[0] != null && user_1.UserId == developer_1[0].AssignedToUserId)) {
                            $("#test-script-steps-table").find("input[data-usertype='developer']").prop("disabled", true);
                        }
                        if (!(user_1.UserId == devManager_1[0].AssignedToUserId)) {
                            $("#test-script-steps-table").find("input[data-usertype='devmgr']").prop("disabled", true);
                        }
                        if (!(user_1.UserId == businessAnalyst_1[0].AssignedToUserId)) {
                            $("#test-script-steps-table").find("input[data-usertype='bizanalyst']").prop("disabled", true);
                        }
                        if (!(user_1.UserId == businessStakeholder_1[0].AssignedToUserId)) {
                            $("#test-script-steps-table").find("input[data-usertype='bizrequester']").prop("disabled", true);
                        }
                    }, 300);
                });
            });
            //this.ddlService.reloadSelectors();
            $("[ap-action-test-script-save-steps]").show();
        }
        else {
            Alerts.Info('No Steps found.');
            $("[ap-action-test-script-save-steps]").hide();
        }
        var isAnyEditable = this.TestScriptStepsData.filter(function (a) { return a.Editable == true; }).length > 0;
        if (isAnyEditable) {
            $("[ap-action-test-script-save-steps]").show();
        }
        else {
            $("[ap-action-test-script-save-steps]").hide();
        }
    };
    TestScriptService.prototype.setPopupFieldsToUpdateScript = function (t) {
        var _this = this;
        this.saveTestScriptModalForm.find('[name=TestScriptStatus]').val(t.TestScriptStatus);
        this.saveTestScriptModalForm.find('[name=RequestDate]').val(Utils.JsonDateToStr(t.RequestDate, true));
        this.saveTestScriptModalForm.find('[name=RequestedByDate]').val(Utils.JsonDateToStr(t.RequestedByDate, true));
        var developer = t.AssigneeMappings.filter(function (a) { return a.UserType == TestScriptAssigneeMappingUserTypes[TestScriptAssigneeMappingUserTypes.Developer].toString(); });
        var devManager = t.AssigneeMappings.filter(function (a) { return a.UserType == TestScriptAssigneeMappingUserTypes[TestScriptAssigneeMappingUserTypes.DevManager].toString(); });
        var businessAnalyst = t.AssigneeMappings.filter(function (a) { return a.UserType == TestScriptAssigneeMappingUserTypes[TestScriptAssigneeMappingUserTypes.BusinessAnalyst].toString(); });
        var businessStakeholder = t.AssigneeMappings.filter(function (a) { return a.UserType == TestScriptAssigneeMappingUserTypes[TestScriptAssigneeMappingUserTypes.BusinessStakeholder].toString(); });
        if (developer != undefined && developer != null && developer.length > 0) {
            setTimeout(function () {
                _this.saveTestScriptModalForm.find("#developer-name").val(developer[0].FullName);
                _this.saveTestScriptModalForm.find("[name=AssignedToDeveloperId]").val(developer[0].AssignedToUserId);
            }, 100);
        }
        if (devManager != undefined && devManager != null && devManager.length > 0) {
            setTimeout(function () {
                _this.saveTestScriptModalForm.find("#dev-manager-name").val(devManager[0].FullName);
                _this.saveTestScriptModalForm.find("[name=AssignedToDevManagerId]").val(devManager[0].AssignedToUserId);
            }, 100);
        }
        if (businessAnalyst != undefined && businessAnalyst != null && businessAnalyst.length > 0) {
            setTimeout(function () {
                _this.saveTestScriptModalForm.find("#business-analyst-name").val(businessAnalyst[0].FullName);
                _this.saveTestScriptModalForm.find("[name=AssignedToBusinessAnalystId]").val(businessAnalyst[0].AssignedToUserId);
            }, 100);
        }
        if (businessStakeholder != undefined && businessStakeholder != null && businessStakeholder.length > 0) {
            setTimeout(function () {
                _this.saveTestScriptModalForm.find("#business-stakeholder-name").val(businessStakeholder[0].FullName);
                _this.saveTestScriptModalForm.find("[name=AssignedToBusinessStakeholderId]").val(businessStakeholder[0].AssignedToUserId);
            }, 100);
        }
        var projectDetailUrl = UrlHelper.GetProjectsUrl(ApiUrl.ProjectDetail, t.ProjectId);
        this.apiService.get(projectDetailUrl)
            .done(function (project) {
            if (!(UserTokenHandler.isSuperUser() || UserTokenHandler.isUserStakeholderOrOwnerForProject(project))) {
                $("#save-test-script-btn").remove();
            }
        });
    };
    TestScriptService.prototype.setPopupFieldsToUpdateScriptStep = function (t) {
        this.saveTestScriptStepModalForm.find('[name=TestScriptStatus]').val(t.TestScriptStatus);
        this.saveTestScriptStepModalForm.find('[name=StepNumber]').val(t.StepNumber);
        this.saveTestScriptStepModalForm.find('[name=Action]').val(t.Action);
        this.saveTestScriptStepModalForm.find('[name=ExpectedResults]').val(t.ExpectedResults);
        this.saveTestScriptStepModalForm.find('[name=Notes]').val(t.Notes);
    };
    TestScriptService.prototype.openCreateTestScriptPopup = function (projectId, storyId, testScriptId) {
        var _this = this;
        if (projectId === void 0) { projectId = 0; }
        if (testScriptId === void 0) { testScriptId = 0; }
        if (testScriptId > 0) {
            this.formProjectsDdl.val(projectId);
            if (projectId > 0) {
                this.ddlService.setStoriesDdl(projectId, this.formStoryDdl, true, function () { _this.formStoryDdl.val(storyId); });
            }
            this.createEditTestScriptModal.find('[name=StoryId]').val(storyId);
        }
        else {
            this.ddlService.setStoriesDdl(projectId, this.formStoryDdl, true);
        }
        this.createEditTestScriptModal.find('[name=TestScriptId]').val(testScriptId);
        if (testScriptId > 0) {
            var u = UrlHelper.GetTestScriptsUrl(ApiUrl.TestScriptDetail, testScriptId);
            MainLoader.show();
            this.apiService.get(u).done(function (t) {
                _this.setPopupFieldsToUpdateScript(t);
                _this.createEditTestScriptModal.modal('show');
            })
                .always(function () { return MainLoader.hide(); });
        }
        else {
            this.createEditTestScriptModal.modal('show');
            setTimeout(function () {
                if (testScriptId == 0) {
                    var requesteStatusVal = _this.createEditTestScriptModal.find('[name=TestScriptStatus] option').filter(function () { return $(this).html() == "Requested"; }).val();
                    _this.createEditTestScriptModal.find('[name=TestScriptStatus]').val(requesteStatusVal);
                }
            }, 200);
        }
    };
    TestScriptService.prototype.openCreateTestScriptStepPopup = function (testScriptId, stepId) {
        var _this = this;
        if (stepId === void 0) { stepId = 0; }
        this.createEditTestScriptStepModal.find('[name=StepId]').val(stepId);
        this.createEditTestScriptStepModal.find('[name=TestScriptId]').val(testScriptId);
        if (stepId > 0) {
            var u = UrlHelper.GetTestScriptsUrl(ApiUrl.TestScriptStepDetail, testScriptId, stepId);
            MainLoader.show();
            this.apiService.get(u).done(function (t) {
                _this.setPopupFieldsToUpdateScriptStep(t);
                _this.createEditTestScriptStepModal.modal('show');
            })
                .always(function () { return MainLoader.hide(); });
        }
        else
            this.createEditTestScriptStepModal.modal('show');
    };
    TestScriptService.prototype.resetScriptForm = function () {
        this.saveTestScriptModalForm[0].reset();
        this.saveTestScriptModalForm.find('input:hidden').val('');
        $('#test-script-project-ddl').val(this.selectedProjectId);
        $('#test-script-story-ddl').val(this.selectedStorId);
    };
    TestScriptService.prototype.resetScriptStepForm = function () {
        this.saveTestScriptStepModalForm[0].reset();
        this.saveTestScriptStepModalForm.find('input:hidden').val('');
    };
    TestScriptService.prototype.updateAssigneeMappingStatus = function (userId, userType, statusId) {
        var u = ApiUrl.TestScriptStepUpdateAssigneeStatus;
        MainLoader.show();
        var obj = {
            testScriptId: parseInt($("#MainTestScriptId").val()),
            userId: userId,
            userType: userType,
            statusId: parseInt(statusId)
        };
        this.apiService.postJson(u, JSON.stringify(obj))
            .done(function (ret) {
            Alerts.Success('Status updated successfully.', 'Success');
            //$this.loadStories(1, Constants.DefaultPageSize, true);
        }).always(function () {
            MainLoader.hide();
        });
    };
    TestScriptService.prototype.setTestScriptStatusValue = function (ddl, stepNumber) {
        var obj = this.TestScriptStepsData.filter(function (a) { return a.StepNumber == parseInt(stepNumber); })[0];
        if (obj) {
            obj.TestScriptStatus = $("option:selected", $(ddl)).val();
            obj.TestScriptStatusName = $("option:selected", $(ddl)).text();
        }
    };
    TestScriptService.prototype.init = function () {
        var _this = this;
        this.formProjectsDdl.change(function (e) {
            var selectedProjectId = $(e.target).val() || 0;
            _this.ddlService.setStoriesDdl(selectedProjectId, _this.formStoryDdl, true);
        });
        $(document).on("change", ".test-script-status-ddl", function (e) {
            var row = $(e.currentTarget).closest("tr");
            _this.setTestScriptStatusValue($(e.currentTarget), $(row).find("input[name='StepNumber']").val());
        });
        $(document).on("change", ".test-script-action-input", function (e) {
            var row = $(e.currentTarget).closest("tr");
            var stepNumber = $(row).find("input[name='StepNumber']").val();
            var obj = _this.TestScriptStepsData.filter(function (a) { return a.StepNumber == parseInt(stepNumber); })[0];
            if (obj) {
                obj.Action = $(e.currentTarget).val();
            }
        });
        $(document).on("change", ".test-script-action-input", function (e) {
            var row = $(e.currentTarget).closest("tr");
            var stepNumber = $(row).find("input[name='StepNumber']").val();
            var obj = _this.TestScriptStepsData.filter(function (a) { return a.StepNumber == parseInt(stepNumber); })[0];
            if (obj) {
                obj.Action = $(e.currentTarget).val();
            }
        });
        $(document).on("change", ".test-script-expectedresult-input", function (e) {
            var row = $(e.currentTarget).closest("tr");
            var stepNumber = $(row).find("input[name='StepNumber']").val();
            var obj = _this.TestScriptStepsData.filter(function (a) { return a.StepNumber == parseInt(stepNumber); })[0];
            if (obj) {
                obj.ExpectedResults = $(e.currentTarget).val();
            }
        });
        $(document).on("change", ".test-script-notes-input", function (e) {
            var row = $(e.currentTarget).closest("tr");
            var stepNumber = $(row).find("input[name='StepNumber']").val();
            var obj = _this.TestScriptStepsData.filter(function (a) { return a.StepNumber == parseInt(stepNumber); })[0];
            if (obj) {
                obj.Notes = $(e.currentTarget).val();
            }
        });
        this.createEditTestScriptModal.on('hide.bs.modal', function () {
            _this.resetScriptForm();
        });
        this.createEditTestScriptStepModal.on('hide.bs.modal', function () {
            _this.resetScriptForm();
        });
        this.oneClickApprovalBtn.on('click', function (e) {
            var btn = $(e.target).closest('#one-click-approval-btn');
            var testScriptId = btn.data('test-script-id');
            var approvalUrl = UrlHelper.GetTestScriptsUrl(ApiUrl.TestScriptUpdate, testScriptId);
            MainLoader.show();
        });
        $(document).on('click', '[ap-action-test-script-modal-form]', function (e) {
            var btn = $(e.target).closest('[ap-action-test-script-modal-form]');
            var projectId = btn.data('project-id') || 0;
            var storyId = btn.data('story-id');
            var testScriptId = btn.data('test-script-id') || 0;
            if (projectId == 0)
                projectId = $('#filter-project-id option:selected').val();
            _this.openCreateTestScriptPopup(projectId, storyId, testScriptId);
        });
        $(document).on('click', '[ap-action-export-test-script]', function (e) {
            var btn = $(e.target).closest('[ap-action-export-test-script]');
            var testScriptId = btn.data('test-script-id') || 0;
            var exportUrl = UrlHelper.GetTestScriptsExportUrl(ApiUrl.TestScriptExport, testScriptId);
            MainLoader.show();
            _this.apiService.get(exportUrl)
                .done(function (data) {
                if (data) {
                    var reportDownloadUrl = UrlHelper.GetTestScriptsExportDownloadUrl(ApiUrl.TestScriptExportDownload, data.fileName);
                    reportDownloadUrl = ApiUrl.BaseUrl + "/" + reportDownloadUrl;
                    window.location.href = reportDownloadUrl;
                }
            })
                .always(function () { return MainLoader.hide(); });
        });
        $(document).on('click', '[ap-action-test-script-step-modal-form]', function (e) {
            var btn = $(e.target).closest('[ap-action-test-script-step-modal-form]');
            var stepId = btn.data('step-id');
            var testScriptId = btn.data('test-script-id') || 0;
            var nextStepNumber = 0;
            if (_this.TestScriptStepsData && _this.TestScriptStepsData.length > 0) {
                var lastStep = _this.TestScriptStepsData.sort(function (a, b) { return a.StepNumber < b.StepNumber ? -1 : a.StepNumber > b.StepNumber ? 1 : 0; }).reverse()[0];
                if (lastStep) {
                    nextStepNumber = lastStep.StepNumber;
                }
            }
            _this.TestScriptStepsData.push({
                StepId: stepId,
                TestScriptId: testScriptId,
                StepNumber: nextStepNumber + 1,
                Action: "",
                ExpectedResults: "",
                TestScriptStatusName: "",
                Notes: '',
                BizAnalystStepStatusId: '',
                BizRequesterStepStatusId: '',
                DeveloperStepStatusId: '',
                DevMgrStepStatusId: '',
                Editable: true
            });
            _this.TestScriptStepsData = _this.TestScriptStepsData.sort(function (a, b) { return a.StepNumber < b.StepNumber ? -1 : a.StepNumber > b.StepNumber ? 1 : 0; });
            _this.ReloadTestScriptStepsData();
        });
        $(document).on('click', '[ap-action-test-script-step-edit-button]', function (e) {
            var btn = $(e.target).closest('[ap-action-test-script-step-edit-button]');
            var stepId = btn.data('step-id');
            var testScriptId = btn.data('test-script-id') || 0;
            var obj = _this.TestScriptStepsData.filter(function (a) { return a.StepId == stepId; })[0];
            if (obj) {
                obj.Editable = true;
            }
            _this.ReloadTestScriptStepsData();
        });
        $(document).on('click', '[ap-action-test-script-step-delete-button]', function (e) {
            var row = $(e.currentTarget).closest("tr");
            var stepNumber = $(row).find("input[name='StepNumber']").val();
            _this.TestScriptStepsData = _this.TestScriptStepsData.filter(function (a) { return a.StepNumber != stepNumber; });
            _this.ReloadTestScriptStepsData();
        });
        $(document).on('click', '[ap-action-test-script-step-add-note-button]', function (e) {
            var row = $(e.currentTarget).closest("tr");
            var stepId = $(e.currentTarget).data("step-id");
            _this.addNoteModal.find("#step_id").val(stepId);
            _this.addNoteModal.find("#note").val("");
            _this.addNoteModal.modal('show');
        });
        $(document).on('click', '[ap-action-test-script-step-view-notes-button]', function (e) {
            var row = $(e.currentTarget).closest("tr");
            var stepId = $(e.currentTarget).data("step-id");
            var testScriptId = $('#MainTestScriptId').val() || 0;
            var u = UrlHelper.GetTestScriptsUrl(ApiUrl.TestScriptStepDetail, testScriptId, stepId);
            MainLoader.show();
            _this.apiService.get(u).done(function (t) {
                _this.testScriptStepNotesViewModal.find("#p_step_notes").html(t.Notes);
                _this.testScriptStepNotesViewModal.modal('show');
            })
                .always(function () { return MainLoader.hide(); });
        });
        $(document).on('click', '[ap-action-test-script-save-step-note]', function (e) {
            var btn = $(e.target).closest('[ap-action-test-script-save-step-note]');
            var stepId = btn.closest("form").find('#step_id').val();
            var note = btn.closest("form").find('#note').val();
            if (note == undefined || note == null || note == "" || note.trim() == "") {
                Alerts.Error('Enter Note', 'Required');
                return;
            }
            var obj = {
                stepId: stepId,
                note: note
            };
            MainLoader.show();
            var stepNoteSaveUrl = ApiUrl.TestScriptStepNoteAdd;
            _this.apiService.post(stepNoteSaveUrl, obj)
                .done(function (data, status, xhr) {
                if (xhr.status === 200 || xhr.status === 201) {
                    Alerts.Success('Note added successfully.');
                    var testScriptId = $('#MainTestScriptId').val() || 0;
                    _this.addNoteModal.modal('hide');
                    _this.loadTestScriptSteps(testScriptId);
                }
            })
                .always(function () { return MainLoader.hide(); });
        });
        $(document).on('click', '[ap-action-test-script-save-steps]', function (e) {
            var btn = $(e.target).closest('[ap-action-test-script-save-steps]');
            var testScriptId = btn.data('test-script-id');
            var obj = {
                testScriptId: testScriptId,
                steps: _this.TestScriptStepsData
            };
            MainLoader.show();
            var stepSaveUrl = UrlHelper.GetTestScriptsBulkUpdateUrl(ApiUrl.TestScriptBulkStepUpdate, testScriptId);
            _this.apiService.postJson(stepSaveUrl, JSON.stringify(obj))
                .done(function (data, status, xhr) {
                if (xhr.status === 200 || xhr.status === 201) {
                    Alerts.Success('Steps updated successfully.');
                    //this.createEditTestScriptStepModal.modal('hide');
                    _this.loadTestScriptSteps(testScriptId);
                }
            })
                .always(function () { return MainLoader.hide(); });
        });
        this.saveTestScriptBtn.on('click', function () {
            var testScriptId = _this.saveTestScriptModalForm.find('[name=TestScriptId]').val() || 0;
            if (testScriptId > 0) {
                MainLoader.show();
                var sprintSaveUrl = UrlHelper.GetTestScriptsUrl(ApiUrl.TestScriptUpdate, testScriptId);
                _this.apiService.put(sprintSaveUrl, _this.saveTestScriptModalForm.serialize())
                    .done(function (data, status, xhr) {
                    if (xhr.status === 200 || xhr.status === 201) {
                        Alerts.Success('Test Script updated successfully.');
                        _this.createEditTestScriptModal.modal('hide');
                        if (_this.isDetailPage)
                            _this.getTestScriptDetails(testScriptId);
                        else if ((_this.selectedProjectId && _this.selectedStorId) || _this.selectedTeamIds) {
                            _this.loadTestScrips(_this.selectedProjectId, _this.selectedStorId, _this.selectedTeamIds);
                        }
                    }
                })
                    .always(function () { return MainLoader.hide(); });
            }
            else {
                MainLoader.show();
                var sprintSaveUrl = UrlHelper.GetTestScriptsUrl(ApiUrl.TestScriptCreate, testScriptId);
                _this.apiService.post(sprintSaveUrl, _this.saveTestScriptModalForm.serialize())
                    .done(function (data, status, xhr) {
                    if (xhr.status === 200 || xhr.status === 201) {
                        Alerts.Success('Test Script created successfully.');
                        _this.createEditTestScriptModal.modal('hide');
                        if ((_this.selectedProjectId && _this.selectedStorId) || _this.selectedTeamIds)
                            _this.loadTestScrips(_this.selectedProjectId, _this.selectedStorId, _this.selectedTeamIds);
                    }
                })
                    .always(function () { return MainLoader.hide(); });
            }
        });
        this.saveTestScriptStepBtn.on('click', function () {
            var stepId = _this.saveTestScriptStepModalForm.find('[name=StepId]').val() || 0;
            var testScriptId = _this.saveTestScriptStepModalForm.find('[name=TestScriptId]').val();
            if (stepId > 0) {
                MainLoader.show();
                var stepSaveUrl = UrlHelper.GetTestScriptsUrl(ApiUrl.TestScriptStepUpdate, testScriptId, stepId);
                _this.apiService.put(stepSaveUrl, _this.saveTestScriptStepModalForm.serialize())
                    .done(function (data, status, xhr) {
                    if (xhr.status === 200 || xhr.status === 201) {
                        Alerts.Success('Step updated successfully.');
                        _this.createEditTestScriptStepModal.modal('hide');
                        _this.loadTestScriptSteps(testScriptId);
                    }
                })
                    .always(function () { return MainLoader.hide(); });
            }
            else {
                MainLoader.show();
                var stepSaveUrl = UrlHelper.GetTestScriptsUrl(ApiUrl.TestScriptStepCreate, testScriptId, 0);
                _this.apiService.post(stepSaveUrl, _this.saveTestScriptStepModalForm.serialize())
                    .done(function (data, status, xhr) {
                    if (xhr.status === 200 || xhr.status === 201) {
                        Alerts.Success('Step created successfully.');
                        _this.createEditTestScriptStepModal.modal('hide');
                        _this.loadTestScriptSteps(testScriptId);
                    }
                })
                    .always(function () { return MainLoader.hide(); });
            }
        });
        $(document).on("change", ".test-script-status-pass,.test-script-status-fail", function (e) {
            var userType = $(e.target).data("usertype") || "";
            var editable = $(e.target).data("editable") || 0;
            var stepId = $(e.target).data("stepid") || 0;
            var selectedId = $(e.target).val() || 0;
            var testScriptId = $("#MainTestScriptId").val() | 0;
            var row = $(e.target).closest("tr");
            var stepNumber = $(row).find("input[name='StepNumber']").val();
            var obj = _this.TestScriptStepsData.filter(function (a) { return a.StepNumber == parseInt(stepNumber); })[0];
            if (obj) {
                switch (userType) {
                    case "developer":
                        obj.DeveloperStepStatusId = selectedId;
                        break;
                    case "devmgr":
                        obj.DevMgrStepStatusId = selectedId;
                        break;
                    case "bizanalyst":
                        obj.BizAnalystStepStatusId = selectedId;
                        break;
                    case "bizrequester":
                        obj.BizRequesterStepStatusId = selectedId;
                        break;
                }
            }
            if (editable == 1) {
                MainLoader.show();
                var stepSaveUrl = UrlHelper.GetTestScriptsUrl(ApiUrl.TestScriptStepUpdate, testScriptId, stepId);
                _this.apiService.putJson(stepSaveUrl, JSON.stringify(obj))
                    .done(function (data, status, xhr) {
                    if (xhr.status === 200 || xhr.status === 201) {
                        Alerts.Success('Step status updated successfully.');
                    }
                })
                    .always(function () { return MainLoader.hide(); });
            }
        });
    };
    return TestScriptService;
}());
//# sourceMappingURL=TestScriptService.js.map