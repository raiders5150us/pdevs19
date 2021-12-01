/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/jqueryui/jqueryui.d.ts" />
/// <reference path="Models.ts" />
/// <reference path="Constants.ts" />
/// <reference path="Common.ts" />
/// <reference path="UserService.ts" />
$(function () {
    var MainProjectId = $('#MainProjectId').val() || 0;
    var MainNoteType = $('#MainNoteType').val() || 0;
    var MainRecordId = $('#MainRecordId').val() || 0;
    var isMyPage = $('#IsMyPage').val() === 'True';
    var apiService = new ApiService();
    var noteService = new NoteService(isMyPage, apiService, true, true, false, "notes_");
    var ddlService = new DdlService(apiService);
    var cookieUtils = new CookieUtils(apiService);
    var selectedTeams = cookieUtils.getCookie(Constants.TeamSelectionCookieName);
    noteService.projectNotesFilterModel.projectId = MainProjectId;
    ddlService.setProjectsDdl(true, function () {
        if (MainProjectId > 0) {
            $('#filter-project-id').val(MainProjectId);
            setTimeout(function () { return noteService.loadProjectNotes(); }, 500);
        }
    });
    ddlService.setTeamsDdl(false, function () {
        MainLoader.show();
        $.when(ddlService.setProjectsDdl(true, null, selectedTeams))
            .done(function () { return setTimeout(function () {
            noteService.projectNotesFilterModel.teamId = selectedTeams;
            noteService.loadProjectNotes();
        }, 200); })
            .always(function () { return MainLoader.hide(); });
    }, selectedTeams);
    $('#filter-project-id').change(function () {
        var projectId = $(this).val() || 0;
        noteService.projectNotesFilterModel.projectId = projectId;
        noteService.loadProjectNotes();
    });
    $('#filter-team-id').select2({
        placeholder: 'Select',
        width: null,
        containerCssClass: ':all:'
    });
    $(document).on('change', '#filter-team-id', function (e) {
        var projectId = $('#filter-project-id').val() || 0;
        var teamId = "0";
        if ($('#filter-team-id').select2('data')) {
            teamId = $('#filter-team-id').select2('data').map(function (a) { return a.id; }).toString();
            cookieUtils.setCookie(Constants.TeamSelectionCookieName, teamId);
        }
        MainLoader.show();
        $.when(ddlService.setProjectsDdl(true, null, teamId))
            .done(function () { return setTimeout(function () {
            noteService.projectNotesFilterModel.teamId = teamId;
            noteService.loadProjectNotes();
        }, 200); })
            .always(function () { return MainLoader.hide(); });
    });
    if (!(UserTokenHandler.isSuperUser())) {
        $("[notes-ap-action-note-modal-form]").hide();
    }
});
//# sourceMappingURL=Notes.js.map