/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/jqueryui/jqueryui.d.ts" />
/// <reference path="Models.ts" />
/// <reference path="Constants.ts" />
/// <reference path="Common.ts" />
/// <reference path="UserService.ts" />

$(function () {
    const MainProjectId: number = $('#MainProjectId').val() || 0;
    const isMyPage: boolean = $('#IsMyPage').val() === 'True';

    let selectedMeetingAttendees: { id: string, name: string }[] = [];

    const apiService = new ApiService();
    const meetingService = new MeetingService(isMyPage, apiService, true, selectedMeetingAttendees);
    const ddlService = new DdlService(apiService);
    const cookieUtils = new CookieUtils(apiService); 
    const selectedTeams = cookieUtils.getCookie(Constants.TeamSelectionCookieName);
    ddlService.setProjectsDdl(true, () => {
        if (MainProjectId > 0) {
            $('#filter-project-id').val(MainProjectId);

            let storyTeamId: string = "0";
            if ($('#filter-team-id').select2('data')) {
                storyTeamId = $('#filter-team-id').select2('data').map(a => a.id).toString();
            }

            setTimeout(() => meetingService.loadMeetings(MainProjectId, storyTeamId, 1, Constants.DefaultPageSize, true), 500);
        }
    });
    ddlService.setTeamsDdl(false, function () {
        MainLoader.show();
        const projectId = $('#filter-project-id').val() || 0;
        $.when(ddlService.setProjectsDdl(true, null, selectedTeams))
            .done(() => setTimeout(() => {
                meetingService.loadMeetings(projectId, selectedTeams, 1, Constants.DefaultPageSize, true);
            }, 200))
            .always(() => MainLoader.hide());
    }, selectedTeams);

    UserService.loadUsersForAutocomplete(selectedMeetingAttendees, 'attendee-txt', $('#attendees-box-list'));

    $('#filter-project-id').change(function () {
        const projectId = $(this).val() || 0;
        let storyTeamId: string = "0";
        if ($('#filter-team-id').select2('data')) {
            storyTeamId = $('#filter-team-id').select2('data').map(a => a.id).toString();
        }

        meetingService.loadMeetings(projectId, storyTeamId, 1, Constants.DefaultPageSize, true);
    });

    const noteService = new NoteService(false, apiService, true, false, true, 'meeting_');

    const meetingNotesModal = $('#meeting-notes-list-modal');
    meetingNotesModal.on('hide.bs.modal', function (e) {
        noteService.clearNotes();
    });
    $(document).on('click', '[ap-action-meeting-notes-modal]', function (e) {        
        const btn = $(e.target).closest('[ap-action-meeting-notes-modal]');
        const recordId: number = btn.data('record-id') || btn.attr('data-record-id') || 0;
        const projectId = $('#filter-project-id').val() || 0;
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
        const projectId = $('#filter-project-id').val() || 0;
        let storyTeamId: string = "0";
        if ($('#filter-team-id').select2('data')) {
            storyTeamId = $('#filter-team-id').select2('data').map(a => a.id).toString();
            cookieUtils.setCookie(Constants.TeamSelectionCookieName, storyTeamId);
        }

        MainLoader.show();
        $.when(ddlService.setProjectsDdl(true, null, storyTeamId))
            .done(() => setTimeout(() => {
                meetingService.loadMeetings(projectId, storyTeamId, 1, Constants.DefaultPageSize, true);
            }, 200))
            .always(() => MainLoader.hide());
    });


    if (!(UserTokenHandler.isSuperUser())) {
        $("[ap-action-meeting-modal-form]").hide();
    }

});