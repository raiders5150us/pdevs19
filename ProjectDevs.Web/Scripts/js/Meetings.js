/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/jqueryui/jqueryui.d.ts" />
/// <reference path="Models.ts" />
/// <reference path="Constants.ts" />
/// <reference path="Common.ts" />
/// <reference path="UserService.ts" />
$(function () {
    var MainProjectId = $('#MainProjectId').val() || 0;
    var isMyPage = $('#IsMyPage').val() === 'True';
    var selectedMeetingAttendees = [];
    var apiService = new ApiService();
    var meetingService = new MeetingService(isMyPage, apiService, true, selectedMeetingAttendees);
    var ddlService = new DdlService(apiService);
    var cookieUtils = new CookieUtils(apiService);
    var selectedTeams = cookieUtils.getCookie(Constants.TeamSelectionCookieName);
    ddlService.setProjectsDdl(true, function () {
        if (MainProjectId > 0) {
            $('#filter-project-id').val(MainProjectId);
            var storyTeamId_1 = "0";
            if ($('#filter-team-id').select2('data')) {
                storyTeamId_1 = $('#filter-team-id').select2('data').map(function (a) { return a.id; }).toString();
            }
            setTimeout(function () { return meetingService.loadMeetings(MainProjectId, storyTeamId_1, 1, Constants.DefaultPageSize, true); }, 500);
        }
    });
    ddlService.setTeamsDdl(false, function () {
        MainLoader.show();
        var projectId = $('#filter-project-id').val() || 0;
        $.when(ddlService.setProjectsDdl(true, null, selectedTeams))
            .done(function () { return setTimeout(function () {
            meetingService.loadMeetings(projectId, selectedTeams, 1, Constants.DefaultPageSize, true);
        }, 200); })
            .always(function () { return MainLoader.hide(); });
    }, selectedTeams);
    UserService.loadUsersForAutocomplete(selectedMeetingAttendees, 'attendee-txt', $('#attendees-box-list'));
    $('#filter-project-id').change(function () {
        var projectId = $(this).val() || 0;
        var storyTeamId = "0";
        if ($('#filter-team-id').select2('data')) {
            storyTeamId = $('#filter-team-id').select2('data').map(function (a) { return a.id; }).toString();
        }
        meetingService.loadMeetings(projectId, storyTeamId, 1, Constants.DefaultPageSize, true);
    });
    var noteService = new NoteService(false, apiService, true, false, true, 'meeting_');
    var meetingNotesModal = $('#meeting-notes-list-modal');
    meetingNotesModal.on('hide.bs.modal', function (e) {
        noteService.clearNotes();
    });
    $(document).on('click', '[ap-action-meeting-notes-modal]', function (e) {
        var btn = $(e.target).closest('[ap-action-meeting-notes-modal]');
        var recordId = btn.data('record-id') || btn.attr('data-record-id') || 0;
        var projectId = $('#filter-project-id').val() || 0;
        if (recordId > 0) {
            noteService.loadNotes(1, Constants.DefaultPageSize, NoteType.Meetings, recordId, projectId);
            meetingNotesModal.modal('show');
        }
    });
    $('#filter-team-id').select2({
        placeholder: 'Select',
        width: null,
        containerCssClass: ':all:'
    });
    $(document).on('change', '#filter-team-id', function (e) {
        var projectId = $('#filter-project-id').val() || 0;
        var storyTeamId = "0";
        if ($('#filter-team-id').select2('data')) {
            storyTeamId = $('#filter-team-id').select2('data').map(function (a) { return a.id; }).toString();
            cookieUtils.setCookie(Constants.TeamSelectionCookieName, storyTeamId);
        }
        MainLoader.show();
        $.when(ddlService.setProjectsDdl(true, null, storyTeamId))
            .done(function () { return setTimeout(function () {
            meetingService.loadMeetings(projectId, storyTeamId, 1, Constants.DefaultPageSize, true);
        }, 200); })
            .always(function () { return MainLoader.hide(); });
    });
    if (!(UserTokenHandler.isSuperUser())) {
        $("[ap-action-meeting-modal-form]").hide();
    }
});
//# sourceMappingURL=Meetings.js.map