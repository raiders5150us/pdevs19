/// <reference path="Models.ts" />
/// <reference path="Constants.ts" />
/// <reference path="Common.ts" />
/// <reference path="UserService.ts" />
var SprintService = /** @class */ (function () {
    function SprintService(apiService, isDetailPage) {
        if (isDetailPage === void 0) { isDetailPage = false; }
        this.apiService = apiService;
        this.isDetailPage = isDetailPage;
        this.createEditSprintModal = $('#create-edit-sprint-additional-modal');
        this.saveSprintModalForm = this.createEditSprintModal.find('#sprints-form');
        this.saveSprintBtn = this.createEditSprintModal.find('#save-sprint-btn');
        this.createEditSprintModal_Adtn = $('#create-edit-sprint-additional-modal');
        this.storyFilterModel = {
            sprintId: 0
        };
        this.init();
    }
    SprintService.prototype.init = function () {
        var _this = this;
        $(document).on('click', '[ap-action-sprint-modal-form]', function (e) {
            var btn = $(e.target).closest('[ap-action-sprint-modal-form]');
            var sprintId = btn.data('sprint-id') || 0;
            _this.openCreateSprintPopup(sprintId);
        });
        $(document).on('click', '[ap-action-sprint-close]', function (e) {
            var btn = $(e.target).closest('[ap-action-sprint-close]');
            var sprintId = btn.data('sprint-id') || 0;
            if (!$("[ap-action-sprint-close]").attr("disabled")) {
                Alerts.Confirm('Are you sure you want to close this sprint?', 'confirm', function () {
                    var sprintCloseUrl = UrlHelper.GetSprintsUrl(ApiUrl.SprintClose, sprintId);
                    _this.apiService.get(sprintCloseUrl, null)
                        .done(function (data, status, xhr) {
                        if (xhr.status === 200 || xhr.status === 201) {
                            Alerts.Success('Sprint closed successfully.');
                            setTimeout(function () {
                                _this.getSprintDetails(sprintId);
                            }, 2000);
                            //this.createEditSprintModal.modal('hide');
                            //this.getSprintDetails(sprintId);
                        }
                    })
                        .always(function () { return MainLoader.hide(); });
                });
            }
        });
        this.saveSprintBtn.on('click', function () {
            var sprintId = _this.saveSprintModalForm.find('[name=SprintId]').val() || 0;
            MainLoader.show();
            if (sprintId > 0) {
                var sprintSaveUrl = UrlHelper.GetSprintsUrl(ApiUrl.SprintUpdate, sprintId);
                _this.apiService.put(sprintSaveUrl, _this.saveSprintModalForm.serialize())
                    .done(function (data, status, xhr) {
                    if (xhr.status === 200 || xhr.status === 201) {
                        Alerts.Success('Sprint updated successfully.');
                        _this.createEditSprintModal.modal('hide');
                        _this.getSprintDetails(sprintId);
                    }
                })
                    .always(function () { return MainLoader.hide(); });
            }
        });
    };
    SprintService.prototype.openCreateSprintPopup = function (sprintId) {
        var _this = this;
        if (sprintId === void 0) { sprintId = 0; }
        var sprintIdElement = this.createEditSprintModal.find('[name=SprintId]');
        sprintIdElement.val(sprintId);
        if (sprintId > 0) {
            MainLoader.show();
            var sprintDetailUrl = UrlHelper.GetSprintsUrl(ApiUrl.SprintDetail, sprintId);
            this.apiService.get(sprintDetailUrl)
                .done(function (s) {
                _this.createEditSprintModal.find('[name=SprintName]').val(s.SprintName);
                _this.createEditSprintModal.find('[name=TeamId]').val(s.TeamID);
                _this.createEditSprintModal.find('[name=StartDate]').val(Utils.JsonDateToStr(s.StartDate, true));
                _this.createEditSprintModal.find('[name=EndDate]').val(Utils.JsonDateToStr(s.EndDate, true));
                _this.createEditSprintModal.find('[name=ChangeNumber]').val(s.ChangeNumber);
                _this.createEditSprintModal.find('[name=SprintRetrospective]').val(s.SprintRetrospective);
                if (s.IsClosed) {
                    _this.createEditSprintModal.find('[ap-action-sprint-close]').attr("disabled", "disabled");
                }
                else {
                    _this.createEditSprintModal.find('[ap-action-sprint-close]').removeAttr("disabled");
                }
                _this.createEditSprintModal.modal('show');
            }).always(function () { return MainLoader.hide(); });
        }
        else
            this.createEditSprintModal.modal('show');
    };
    SprintService.prototype.getSprintDetails = function (sprintId) {
        var sprintDetailUrl = UrlHelper.GetSprintsUrl(ApiUrl.SprintDetail, sprintId);
        MainLoader.show();
        this.apiService.get(sprintDetailUrl)
            .done(function (sprint) {
            $('[data-sprint-name]').text(sprint.SprintName);
            $('[data-team-name]').text(sprint.TeamName);
            $('[data-startdate]').text(Utils.JsonDateToStr(sprint.StartDate));
            $('[data-enddate]').text(Utils.JsonDateToStr(sprint.EndDate));
            $('[data-userstoriescount]').text(sprint.TotalStories);
            $('[data-userstoriescompleted]').text(sprint.CompletedStories);
            $('[data-changenumber]').text(sprint.ChangeNumber);
            $('[data-sprintretrospective]').text(sprint.SprintRetrospective);
            if (sprint.IsClosed) {
                $('[ap-action-sprint-close]').attr("disabled", "disabled");
            }
            else {
                $('[ap-action-sprint-close]').removeAttr("disabled");
            }
        })
            .always(function () { return MainLoader.hide(); });
        if (!(UserTokenHandler.isSuperUser())) {
            $("[ap-action-sprint-modal-form]").remove();
            $("[ap-action-file-modal-form]").remove();
        }
    };
    return SprintService;
}());
//# sourceMappingURL=SprintService.js.map