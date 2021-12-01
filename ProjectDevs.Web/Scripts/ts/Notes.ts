/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/jqueryui/jqueryui.d.ts" />
/// <reference path="Models.ts" />
/// <reference path="Constants.ts" />
/// <reference path="Common.ts" />
/// <reference path="UserService.ts" />

$(function () {
    const MainProjectId: number = $('#MainProjectId').val() || 0;
    const MainNoteType: number = $('#MainNoteType').val() || 0;
    const MainRecordId: number = $('#MainRecordId').val() || 0;
    const isMyPage: boolean = $('#IsMyPage').val() === 'True';

    const apiService = new ApiService();

    const noteService = new NoteService(isMyPage, apiService, true, true, false,"notes_");
    const ddlService = new DdlService(apiService);
    const cookieUtils = new CookieUtils(apiService);
    const selectedTeams = cookieUtils.getCookie(Constants.TeamSelectionCookieName);

    noteService.projectNotesFilterModel.projectId = MainProjectId;
    ddlService.setProjectsDdl(true, () => {
        if (MainProjectId > 0) {
            $('#filter-project-id').val(MainProjectId);
            setTimeout(() => noteService.loadProjectNotes(), 500);
        }
    });
    ddlService.setTeamsDdl(false, function () {
        MainLoader.show();
        $.when(ddlService.setProjectsDdl(true, null, selectedTeams))
            .done(() => setTimeout(() => {
                noteService.projectNotesFilterModel.teamId = selectedTeams;
                noteService.loadProjectNotes();
            }, 200))
            .always(() => MainLoader.hide());
    }, selectedTeams);

    $('#filter-project-id').change(function () {
        const projectId = $(this).val() || 0;
        noteService.projectNotesFilterModel.projectId = projectId;
        noteService.loadProjectNotes();
    });

    $('#filter-team-id').select2({
        placeholder: 'Select',
        width: null,
        containerCssClass: ':all:'
    });
    $(document).on('change', '#filter-team-id', function (e) {
        const projectId = $('#filter-project-id').val() || 0;
        let teamId: string = "0";
        if ($('#filter-team-id').select2('data')) {
            teamId = $('#filter-team-id').select2('data').map(a => a.id).toString();
            cookieUtils.setCookie(Constants.TeamSelectionCookieName, teamId);
        }

        MainLoader.show();
        $.when(ddlService.setProjectsDdl(true, null, teamId))
            .done(() => setTimeout(() => {
                noteService.projectNotesFilterModel.teamId = teamId;
                noteService.loadProjectNotes();   
            }, 200))
            .always(() => MainLoader.hide());
    });

    if (!(UserTokenHandler.isSuperUser())) {
        $("[notes-ap-action-note-modal-form]").hide();
    }
});