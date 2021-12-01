/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="Models.ts" />
/// <reference path="Constants.ts" />
/// <reference path="Common.ts" />
/// <reference path="UserService.ts" />
var MeetingService = /** @class */ (function () {
    function MeetingService(isMyPage, apiService, isMeetingsPage, selectedMeetingAttendees) {
        if (isMeetingsPage === void 0) { isMeetingsPage = false; }
        if (selectedMeetingAttendees === void 0) { selectedMeetingAttendees = []; }
        this.isMyPage = isMyPage;
        this.apiService = apiService;
        this.isMeetingsPage = isMeetingsPage;
        this.selectedMeetingAttendees = selectedMeetingAttendees;
        this.templateLi = $('#meeting-list-item-template > li').first();
        this.meetingsContainerUl = $('#project-meetings-list');
        this.pagingContainer = $('#meetings-paging-container');
        this.infoContainer = $('#apdt_meetings_info');
        this.startFromElement = this.infoContainer.find('.apdt_startfrom');
        this.endToElement = this.infoContainer.find('.apdt_endto');
        this.totalElement = this.infoContainer.find('.apdt_total');
        this.createEditMeetingModal = $('#create-edit-meetings-modal');
        this.saveMeetingModalForm = this.createEditMeetingModal.find('#meetings-form');
        this.saveMeetingBtn = this.createEditMeetingModal.find('#save-meeting-btn');
        this.selectedProjectId = 0;
        this.selectedTeamIds = "";
        this.init();
    }
    MeetingService.prototype.loadMeetings = function (projectId, storyTeamId, pno, psize, showPaging) {
        var _this = this;
        if (pno === void 0) { pno = 1; }
        if (psize === void 0) { psize = Constants.DefaultPageSize; }
        if (showPaging === void 0) { showPaging = false; }
        this.selectedProjectId = projectId;
        this.selectedTeamIds = storyTeamId;
        var u = this.isMyPage ? ApiUrl.MyMeetings : ApiUrl.ProjectMeetings;
        var projectMeetigsUrl = UrlHelper.GetMeetingsUrl(u, projectId, 0);
        this.apiService.get(projectMeetigsUrl, { pno: pno, psize: psize, storyTeamId: storyTeamId })
            .done(function (meetings) {
            _this.infoContainer.show();
            _this.meetingsContainerUl.empty();
            if (meetings && meetings.Data && meetings.Data.length) {
                meetings.Data.forEach(function (m) {
                    var li = _this.templateLi.clone();
                    li.find('[t-meeting-purpose]').text(m.Purpose);
                    li.find('[t-meeting-date]').text(Utils.JsonDateToStr(m.MeetingDate));
                    li.find('[t-meeting-time]').text(m.MeetingTime);
                    li.find('[t-meeting-project]').text(m.ProjectName);
                    li.find('[t-data-project-id]').attr('data-project-id', m.ProjectId);
                    li.find('[t-data-meeting-id]').attr('data-meeting-id', m.MeetingId);
                    li.find('[t-data-record-id]').attr('data-record-id', m.MeetingId);
                    if (m.AttendeeNames) {
                        var attendees = m.AttendeeNames;
                        li.find('[t-meeting-attendees-container]').append(attendees.map(function (s) { return "<span class=\"d-tag m-r-5 m-b-5\">" + s + "</span>"; }));
                    }
                    _this.meetingsContainerUl.append(li);
                });
                if (showPaging) {
                    var pageModel = {
                        CurrentPageNumber: meetings.CurrentPageNumber,
                        IsLastPage: meetings.IsLastPage,
                        PageSize: meetings.PageSize,
                        TotalPages: meetings.Count,
                    };
                    var pagination = Pagination.Render(pageModel);
                    _this.pagingContainer.html("" + pagination);
                    var startFrom = ((meetings.CurrentPageNumber - 1) * meetings.PageSize) + 1;
                    var endTo = startFrom + meetings.Data.length - 1;
                    _this.startFromElement.html("" + startFrom);
                    _this.endToElement.html("" + endTo);
                    _this.totalElement.html("" + meetings.Count);
                }
                if (projectId > 0) {
                    var projectDetailUrl = UrlHelper.GetProjectsUrl(ApiUrl.ProjectDetail, projectId);
                    _this.apiService.get(projectDetailUrl)
                        .done(function (project) {
                        if (!(UserTokenHandler.isSuperUser() || UserTokenHandler.isUserStakeholderOrOwnerForProject(project))) {
                            $("[ap-action-meeting-modal-form]").hide();
                            $("[meeting_ap-action-note-modal-form]").hide();
                        }
                        else {
                            $("[ap-action-meeting-modal-form]").show();
                            $("[meeting_ap-action-note-modal-form]").show();
                        }
                    });
                }
                else if (UserTokenHandler.isSuperUser()) {
                    $("[ap-action-meeting-modal-form]").show();
                    $("[meeting_ap-action-note-modal-form]").show();
                }
                else {
                    $("[ap-action-meeting-modal-form]").hide();
                    $("[meeting_ap-action-note-modal-form]").hide();
                }
            }
            else {
                if (!_this.isMeetingsPage)
                    Alerts.Info('No meetings found.', 'Empty');
                if (showPaging) {
                    _this.pagingContainer.html('');
                    _this.startFromElement.html("0");
                    _this.endToElement.html("0");
                    _this.totalElement.html("0");
                }
            }
        });
    };
    MeetingService.prototype.setPopupFieldsToUpdateMeeting = function (m) {
        this.saveMeetingModalForm.find('[name=MeetingDate]').val(Utils.JsonDateToStr(m.MeetingDate, true));
        this.saveMeetingModalForm.find('[name=MeetingTime]').val(m.MeetingTime);
        this.saveMeetingModalForm.find('[name=Purpose]').val(m.Purpose);
        for (var userId in m.AttendeeIdNames) {
            var stk = { id: userId, name: m.AttendeeIdNames[userId] };
            this.selectedMeetingAttendees.push(stk);
            var selectedUl = this.saveMeetingModalForm.find('#attendees-box-list');
            var li = "<li class=\"m-r-5 m-b-5 d-tag\" data-uid=\"" + stk.id + "\">\n                            <span class=\"name\">" + stk.name + "</span>\n                            <span class=\"close-btn b\" title=\"Remove\">X</span>\n                        </li>";
            selectedUl.append(li);
        }
        if (m.AttendeeIds && m.AttendeeIds.length)
            this.saveMeetingModalForm.find('[name=AttendeeIds]').val(m.AttendeeIds.join(','));
    };
    MeetingService.prototype.openCreateMeetingPopup = function (projectId, meetingId) {
        var _this = this;
        if (projectId === void 0) { projectId = 0; }
        if (meetingId === void 0) { meetingId = 0; }
        var projectsDdl = this.createEditMeetingModal.find('[name=ProjectId]');
        if (projectsDdl && projectsDdl.length && projectId > 0) {
            projectsDdl.val(projectId);
        }
        var meetingIdElement = this.createEditMeetingModal.find('[name=MeetingId]');
        meetingIdElement.val(meetingId);
        if (meetingId > 0) {
            var u = UrlHelper.GetMeetingsUrl(ApiUrl.ProjectMeetingDetail, projectId, meetingId);
            MainLoader.show();
            this.apiService.get(u).done(function (m) {
                _this.setPopupFieldsToUpdateMeeting(m);
                _this.createEditMeetingModal.modal('show');
            })
                .always(function () { return MainLoader.hide(); });
        }
        else
            this.createEditMeetingModal.modal('show');
    };
    MeetingService.prototype.resetProjectMeetingsForm = function () {
        this.saveMeetingModalForm[0].reset();
        this.saveMeetingModalForm.find('input:hidden').val('');
        $('#attendees-box-list').empty();
        this.selectedMeetingAttendees = [];
    };
    MeetingService.prototype.init = function () {
        var _this = this;
        $(document).on('click', '#meetings-paging-container a[data-pno]', function (e) {
            var btn = $(e.target).closest('a[data-pno]');
            var pNo = btn.data('pno') || 0;
            if (pNo > 0) {
                _this.loadMeetings(_this.selectedProjectId, _this.selectedTeamIds, pNo, Constants.DefaultPageSize, true);
            }
        });
        this.createEditMeetingModal.on('hide.bs.modal', function () {
            _this.resetProjectMeetingsForm();
        });
        $(document).on('click', '[ap-action-meeting-modal-form]', function (e) {
            var btn = $(e.target).closest('[ap-action-meeting-modal-form]');
            var projectId = btn.data('project-id');
            var meetingId = btn.data('meeting-id') || 0;
            _this.openCreateMeetingPopup(projectId, meetingId);
        });
        this.saveMeetingBtn.on('click', function () {
            var projectId = _this.saveMeetingModalForm.find('[name=ProjectId]').val();
            var meetingId = _this.saveMeetingModalForm.find('[name=MeetingId]').val() || 0;
            if (meetingId > 0) {
                MainLoader.show();
                var meetingSaveUrl = UrlHelper.GetMeetingsUrl(ApiUrl.ProjectMeetingUpdate, projectId, meetingId);
                _this.apiService.put(meetingSaveUrl, _this.saveMeetingModalForm.serialize())
                    .done(function (data, status, xhr) {
                    if (xhr.status === 200 || xhr.status === 201) {
                        Alerts.Success('Meeting saved successfully.');
                        _this.createEditMeetingModal.modal('hide');
                        _this.loadMeetings(projectId, _this.selectedTeamIds);
                    }
                })
                    .always(function () { return MainLoader.hide(); });
            }
            else {
                MainLoader.show();
                var meetingSaveUrl = UrlHelper.GetMeetingsUrl(ApiUrl.ProjectMeetingCreate, projectId, 0);
                _this.apiService.post(meetingSaveUrl, _this.saveMeetingModalForm.serialize())
                    .done(function (data, status, xhr) {
                    if (xhr.status === 200 || xhr.status === 201) {
                        Alerts.Success('Meeting created successfully.');
                        _this.createEditMeetingModal.modal('hide');
                        _this.loadMeetings(projectId, _this.selectedTeamIds);
                    }
                })
                    .always(function () { return MainLoader.hide(); });
            }
        });
    };
    return MeetingService;
}());
//# sourceMappingURL=MeetingService.js.map