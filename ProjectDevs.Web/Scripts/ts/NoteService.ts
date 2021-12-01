/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="Models.ts" />
/// <reference path="Constants.ts" />
/// <reference path="Common.ts" />
/// <reference path="UserService.ts" />

class NoteService {
    private templateLi = $('#notes-list-item-template > li').first();
    private notesContainerUl = this.isMeetingNotesPage ? $('#meeting-notes-list') : $('#notes-list');
    private pagingContainer = this.isMeetingNotesPage ? $('#meeting-notes-paging-container') : $('#notes-paging-container');
    private infoContainer = this.isMeetingNotesPage ? $('#apdt_meeting-notes_info') : $('#apdt_notes_info');
    private startFromElement = this.infoContainer.find('.apdt_startfrom');
    private endToElement = this.infoContainer.find('.apdt_endto');
    private totalElement = this.infoContainer.find('.apdt_total');

    private createEditNoteModal = $('#' + this.idPrefix + 'create-edit-notes-modal');
    private saveNoteModalForm = this.createEditNoteModal.find('#' + this.idPrefix + 'notes-form');
    private saveNoteBtn = this.createEditNoteModal.find('#' + this.idPrefix + 'save-note-btn');

    public projectNotesFilterModel: { projectId: number,teamId:string, assignedToUserId?: string } = {
        projectId: 0,
        assignedToUserId: null,
        teamId:""
    }

    constructor(private isMyPage: boolean, private apiService: ApiService, private showPaging = false, private isNotesPage = false, private isMeetingNotesPage = false, private idPrefix = '') {
        this.init();
    }
    clearNotes() {
        this.notesContainerUl.empty();
        this.pagingContainer.html('');

        this.startFromElement.html(`0`);
        this.endToElement.html(`0`);
        this.totalElement.html(`0`);
    }
    setNotesList(notes: IPagingModel<IProjectNote>,projectId=0) {
        
        if (projectId == 0) {
            projectId = this.projectNotesFilterModel.projectId;
        }

        this.notesContainerUl.empty();
        this.infoContainer.show();
        if (notes && notes.Data && notes.Data.length) {
            notes.Data.forEach(n => {
                const li = this.templateLi.clone();
                li.find('[t-createdby]').text(n.CreatedByUser);
                li.find('[t-createdon]').text(`Created: ${Utils.JsonDateToStr(n.CreatedOn)}`);
                li.find('[t-modifiedon]').text(`Modified: ${Utils.JsonDateToStr(n.ModifiedOn)}`);
                li.find('[t-data-note-id]').attr('data-note-id', n.NoteId);
                li.find('[t-data-record-id]').attr('data-record-id', n.ParentId);
                li.find('[t-data-note-type]').attr('data-note-type', n.NoteTypeId);
                li.find('[t-note-text]').html(n.Note.replace(/\n/g,"<br/>"));

                this.notesContainerUl.append(li);
            });
            if (this.showPaging) {
                const pageModel: IPaginationModel = {
                    CurrentPageNumber: notes.CurrentPageNumber,
                    IsLastPage: notes.IsLastPage,
                    PageSize: notes.PageSize,
                    TotalPages: notes.Count,
                };
                const pagination = Pagination.Render(pageModel);
                this.pagingContainer.html(`${pagination}`);

                const startFrom = ((notes.CurrentPageNumber - 1) * notes.PageSize) + 1;
                const endTo = startFrom + notes.Data.length - 1;

                this.startFromElement.html(`${startFrom}`);
                this.endToElement.html(`${endTo}`);
                this.totalElement.html(`${notes.Count}`);
            }

            if (projectId > 0) {
                const projectDetailUrl = UrlHelper.GetProjectsUrl(ApiUrl.ProjectDetail, projectId);

                this.apiService.get(projectDetailUrl)
                    .done((project: IProjectDto) => {
                        if (!(UserTokenHandler.isSuperUser() || UserTokenHandler.isUserStakeholderOrOwnerForProject(project))) {
                            $("[notes-ap-action-note-modal-form]").hide();
                            $("[ap-action-note-modal-form]").hide();
                        }
                        else {
                            $("[notes-ap-action-note-modal-form]").show();
                            $("[ap-action-note-modal-form]").show();
                        }
                    });
            }
            else if (UserTokenHandler.isSuperUser()) {
                $("[notes-ap-action-note-modal-form]").show();
                $("[ap-action-note-modal-form]").show();
            }
            else {
                $("[notes-ap-action-note-modal-form]").hide();
                $("[ap-action-note-modal-form]").hide();
            }
        }
        else {
            //Alerts.Info('No notes found.', 'Empty');
            if (this.showPaging) {
                this.pagingContainer.html('');

                this.startFromElement.html(`0`);
                this.endToElement.html(`0`);
                this.totalElement.html(`0`);
            }
        }

    }

    loadProjectNotes(pno = 1, psize = Constants.DefaultPageSize) {
        
        const projectNotesUrl = this.isMyPage ? ApiUrl.MyProjectNotes : ApiUrl.ProjectNotes;
        MainLoader.show();
        this.apiService.get(projectNotesUrl, { ...this.projectNotesFilterModel, pno, psize })
            .done(notes => this.setNotesList(notes))
            .always(() => MainLoader.hide());
    }

    private noteType = 0;
    private recordId = 0;

    loadNotes(pno = 1, psize = Constants.DefaultPageSize, noteTypeId: number, recordId = 0, projectId = 0) {
        
        this.noteType = noteTypeId;
        this.recordId = recordId;

        let notesUrl: string = null;
        if (recordId > 0)
            notesUrl = UrlHelper.GetNotesUrl(ApiUrl.NotesOfRecord, noteTypeId, recordId, 0);
        else {
            const u = this.isMyPage ? ApiUrl.MyNotes : ApiUrl.Notes;
            notesUrl = UrlHelper.GetNotesUrl(u, noteTypeId, 0, 0);
        }

        MainLoader.show();
        this.apiService.get(notesUrl, { pno, psize })
            .done(notes => this.setNotesList(notes, projectId))
            .always(() => MainLoader.hide());
    }

    openCreateNotePopup(noteTypeId: number = 0, parentId: number = 0, noteId: number = 0, editBtn: JQuery) {
        const noteTypeElement = this.createEditNoteModal.find('[name=NoteTypeId]');
        noteTypeElement.val(noteTypeId);

        const parentIdElement = this.createEditNoteModal.find('[name=ParentId]');
        parentIdElement.val(parentId);

        const noteIdElement = this.createEditNoteModal.find('[name=NoteId]');
        noteIdElement.val(noteId);

        if (editBtn && editBtn.length > 0) {
            const li = editBtn.closest('.note-li-wrapper');
            if (li && li.length) {
                const noteText = li.find('[t-note-text]').text();
                this.createEditNoteModal.find('[name=Note]').val(noteText);
            }
        }

        this.createEditNoteModal.modal('show');
    }
    resetProjectNotesForm() {
        (this.saveNoteModalForm[0] as HTMLFormElement).reset();
        this.saveNoteModalForm.find('input:hidden').val('');
    }
    private createEditClickHandler(btn: JQuery) {
        const noteTypeId: number = btn.data('note-type');
        const recordId: number = btn.data('record-id');
        const noteId: number = btn.data('note-id');

        this.openCreateNotePopup(noteTypeId, recordId, noteId, btn);
    }
    private init() {
        const pageNumbersBtn = this.isMeetingNotesPage ? '#meeting-notes-paging-container a[data-pno]' : '#notes-paging-container a[data-pno]';
       
        $(document).on('click', pageNumbersBtn, (e) => {
            const btn = $(e.target).closest('a[data-pno]');
            const pNo: number = btn.data('pno') || 0;
            if (pNo > 0) {
                if (this.isNotesPage)
                    this.loadProjectNotes(pNo);
                else
                    this.loadNotes(pNo, Constants.DefaultPageSize, this.noteType, this.recordId);
            }
        });

        this.createEditNoteModal.on('hide.bs.modal', () => {
            this.resetProjectNotesForm();
        });
        const EditLiBtn = this.isMeetingNotesPage ? '#meeting-notes-list [ap-action-note-modal-form]' : '#notes-list [ap-action-note-modal-form]';
        $(document).on('click', EditLiBtn, (e) => {
            
            const btn = $(e.target).closest('[ap-action-note-modal-form]');
            this.createEditClickHandler(btn);
        });
        const createLiBtn = '[' + this.idPrefix + 'ap-action-note-modal-form]';
        $(document).on('click', createLiBtn, (e) => {
            
            const btn = $(e.target).closest('[' + this.idPrefix + 'ap-action-note-modal-form]');
            this.createEditClickHandler(btn);
        });

        const createNoteBtn = '[notes-ap-action-note-modal-form]';
        $(document).on('click', createNoteBtn, (e) => {                       
            const btn = $(e.target).closest('[notes-ap-action-note-modal-form]');
            $(btn).data("record-id", this.projectNotesFilterModel.projectId);

            if (this.projectNotesFilterModel.projectId && this.projectNotesFilterModel.projectId > 0) {
                this.createEditClickHandler(btn);
            }
            else {
                Alerts.Error('Project is required.', 'Validation error');
            }            
        });

        
        this.saveNoteBtn.on('click', () => {
            
            const recordId: number = this.saveNoteModalForm.find('[name=ParentId]').val();
            const noteId: number = this.saveNoteModalForm.find('[name=NoteId]').val() || 0;
            const note: string = this.saveNoteModalForm.find('[name=Note]').val();
            const noteTypeId: number = this.createEditNoteModal.find('[name=NoteTypeId]').val();

            if (!note) {
                Alerts.Error('Note text is required.');
                return false;
            }

            if (noteId > 0) {
                const noteSaveUrl: string = UrlHelper.GetNotesUrl(ApiUrl.NoteUpdate, noteTypeId, recordId, noteId);
                MainLoader.show();
                this.apiService.put(noteSaveUrl, { note })
                    .done((data: any, status: string, xhr: JQueryXHR) => {
                        if (xhr.status === 200 || xhr.status === 201) {
                            Alerts.Success('Note saved successfully.', 'Success', () => this.createEditNoteModal.modal('hide'));
                            if (this.isNotesPage)
                                this.loadProjectNotes();
                            else if (this.showPaging || this.isMeetingNotesPage)
                                this.loadNotes(1, Constants.DefaultPageSize, noteTypeId, recordId);
                            else if (!this.isMeetingNotesPage)
                                this.loadNotes(1, Constants.NestedAllPageSize, noteTypeId, recordId);
                        }
                    })
                    .always(() => MainLoader.hide());
            }
            else {
                MainLoader.show();
                const noteSaveUrl: string = UrlHelper.GetNotesUrl(ApiUrl.NotesOfRecordCreate, noteTypeId, recordId, 0);
                this.apiService.post(noteSaveUrl, { note })
                    .done((data: any, status: string, xhr: JQueryXHR) => {
                        if (xhr.status === 200 || xhr.status === 201) {
                            Alerts.Success('Note added successfully.', 'Success', () => this.createEditNoteModal.modal('hide'));

                            if (this.isNotesPage)
                                this.loadProjectNotes();
                            else if (this.showPaging)
                                this.loadNotes(1, Constants.DefaultPageSize, noteTypeId, recordId);
                            else if (!this.isMeetingNotesPage)
                                this.loadNotes(1, Constants.NestedAllPageSize, noteTypeId, recordId);
                        }
                    })
                    .always(() => MainLoader.hide());
            }
        });
    }
}