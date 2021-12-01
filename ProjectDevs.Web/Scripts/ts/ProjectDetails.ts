/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/jqueryui/jqueryui.d.ts" />
/// <reference path="Models.ts" />
/// <reference path="Constants.ts" />
/// <reference path="Common.ts" />
/// <reference path="UserService.ts" />
/// <reference path="ProjectService.ts" />
/// <reference path="MeetingService.ts" />
/// <reference path="StoryService.ts" />
/// <reference path="FileService.ts" />
/// <reference path="NoteService.ts" />

$(function () {
    const ProjectId: number = $('#ProjectId').val();
    const apiService = new ApiService();

    let selectedMeetingAttendees: { id: string, name: string }[] = [];
    let selectedStakeholders: { id: string, name: string }[] = [];

    const projectService = new ProjectService(false, apiService, true, selectedStakeholders);
    const meetingService = new MeetingService(false, apiService, false, selectedMeetingAttendees);
    
    const fileService = new FileService(false, apiService);
    const noteService = new NoteService(false, apiService, false);
    const ddlService = new DdlService(apiService);
    const storyService = new StoryService(false, apiService,fileService, false, true);

    projectService.getProjectDetails(ProjectId);

    meetingService.loadMeetings(ProjectId, null, 1, Constants.NestedDefaultPageSize, false);
    UserService.loadUsersForAutocomplete(selectedMeetingAttendees, 'attendee-txt', $('#attendees-box-list'));

    storyService.storyFilterModel.projectId = ProjectId
    storyService.loadStories(1, Constants.NestedDefaultPageSize, false);

    fileService.loadFiles(FileType.Projects, ProjectId);

    noteService.loadNotes(1, Constants.NestedAllPageSize, NoteType.Projects, ProjectId);

    ddlService.setProjectsDdl();
    ddlService.setProjectStatusesDdl();
    ddlService.setSprintsDdl();
    ddlService.setStoryStatusesDdl(ProjectId);
    ddlService.setStoryTypesDdl();

    const meetingNoteService = new NoteService(false, apiService, true, false, true, 'meeting_');
    const meetingNotesModal = $('#meeting-notes-list-modal');
    meetingNotesModal.on('hide.bs.modal', function (e) {
        meetingNoteService.clearNotes();
    });
    $(document).on('click', '[ap-action-meeting-notes-modal]', function (e) {
        const btn = $(e.target).closest('[ap-action-meeting-notes-modal]');
        const recordId: number = btn.data('record-id') || btn.attr('data-record-id') || 0;
        if (recordId > 0) {
            meetingNoteService.loadNotes(1, Constants.DefaultPageSize, NoteType.Meetings, recordId);
            meetingNotesModal.modal('show');
            const project = projectService.getProjectObject(ProjectId);
            setTimeout(() => {
                if (!(UserTokenHandler.isSuperUser() || UserTokenHandler.isUserStakeholderOrOwnerForProject(project))) {
                    $("[ap-action-project-modal-form]").remove();
                    $("[ap-action-story-modal-form]").remove();
                    $("[ap-action-meeting-modal-form]").remove();
                    $("[ap-action-file-modal-form]").remove();
                    $("[ap-action-note-modal-form]").remove();
                }
            }, 100)
        }
    });
});