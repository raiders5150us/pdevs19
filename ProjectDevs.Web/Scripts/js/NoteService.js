/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="Models.ts" />
/// <reference path="Constants.ts" />
/// <reference path="Common.ts" />
/// <reference path="UserService.ts" />
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var NoteService = /** @class */ (function () {
    function NoteService(isMyPage, apiService, showPaging, isNotesPage, isMeetingNotesPage, idPrefix) {
        if (showPaging === void 0) { showPaging = false; }
        if (isNotesPage === void 0) { isNotesPage = false; }
        if (isMeetingNotesPage === void 0) { isMeetingNotesPage = false; }
        if (idPrefix === void 0) { idPrefix = ''; }
        this.isMyPage = isMyPage;
        this.apiService = apiService;
        this.showPaging = showPaging;
        this.isNotesPage = isNotesPage;
        this.isMeetingNotesPage = isMeetingNotesPage;
        this.idPrefix = idPrefix;
        this.templateLi = $('#notes-list-item-template > li').first();
        this.notesContainerUl = this.isMeetingNotesPage ? $('#meeting-notes-list') : $('#notes-list');
        this.pagingContainer = this.isMeetingNotesPage ? $('#meeting-notes-paging-container') : $('#notes-paging-container');
        this.infoContainer = this.isMeetingNotesPage ? $('#apdt_meeting-notes_info') : $('#apdt_notes_info');
        this.startFromElement = this.infoContainer.find('.apdt_startfrom');
        this.endToElement = this.infoContainer.find('.apdt_endto');
        this.totalElement = this.infoContainer.find('.apdt_total');
        this.createEditNoteModal = $('#' + this.idPrefix + 'create-edit-notes-modal');
        this.saveNoteModalForm = this.createEditNoteModal.find('#' + this.idPrefix + 'notes-form');
        this.saveNoteBtn = this.createEditNoteModal.find('#' + this.idPrefix + 'save-note-btn');
        this.projectNotesFilterModel = {
            projectId: 0,
            assignedToUserId: null,
            teamId: ""
        };
        this.noteType = 0;
        this.recordId = 0;
        this.init();
    }
    NoteService.prototype.clearNotes = function () {
        this.notesContainerUl.empty();
        this.pagingContainer.html('');
        this.startFromElement.html("0");
        this.endToElement.html("0");
        this.totalElement.html("0");
    };
    NoteService.prototype.setNotesList = function (notes, projectId) {
        var _this = this;
        if (projectId === void 0) { projectId = 0; }
        if (projectId == 0) {
            projectId = this.projectNotesFilterModel.projectId;
        }
        this.notesContainerUl.empty();
        this.infoContainer.show();
        if (notes && notes.Data && notes.Data.length) {
            notes.Data.forEach(function (n) {
                var li = _this.templateLi.clone();
                li.find('[t-createdby]').text(n.CreatedByUser);
                li.find('[t-createdon]').text("Created: " + Utils.JsonDateToStr(n.CreatedOn));
                li.find('[t-modifiedon]').text("Modified: " + Utils.JsonDateToStr(n.ModifiedOn));
                li.find('[t-data-note-id]').attr('data-note-id', n.NoteId);
                li.find('[t-data-record-id]').attr('data-record-id', n.ParentId);
                li.find('[t-data-note-type]').attr('data-note-type', n.NoteTypeId);
                li.find('[t-note-text]').html(n.Note.replace(/\n/g, "<br/>"));
                _this.notesContainerUl.append(li);
            });
            if (this.showPaging) {
                var pageModel = {
                    CurrentPageNumber: notes.CurrentPageNumber,
                    IsLastPage: notes.IsLastPage,
                    PageSize: notes.PageSize,
                    TotalPages: notes.Count,
                };
                var pagination = Pagination.Render(pageModel);
                this.pagingContainer.html("" + pagination);
                var startFrom = ((notes.CurrentPageNumber - 1) * notes.PageSize) + 1;
                var endTo = startFrom + notes.Data.length - 1;
                this.startFromElement.html("" + startFrom);
                this.endToElement.html("" + endTo);
                this.totalElement.html("" + notes.Count);
            }
            if (projectId > 0) {
                var projectDetailUrl = UrlHelper.GetProjectsUrl(ApiUrl.ProjectDetail, projectId);
                this.apiService.get(projectDetailUrl)
                    .done(function (project) {
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
                this.startFromElement.html("0");
                this.endToElement.html("0");
                this.totalElement.html("0");
            }
        }
    };
    NoteService.prototype.loadProjectNotes = function (pno, psize) {
        var _this = this;
        if (pno === void 0) { pno = 1; }
        if (psize === void 0) { psize = Constants.DefaultPageSize; }
        var projectNotesUrl = this.isMyPage ? ApiUrl.MyProjectNotes : ApiUrl.ProjectNotes;
        MainLoader.show();
        this.apiService.get(projectNotesUrl, __assign(__assign({}, this.projectNotesFilterModel), { pno: pno, psize: psize }))
            .done(function (notes) { return _this.setNotesList(notes); })
            .always(function () { return MainLoader.hide(); });
    };
    NoteService.prototype.loadNotes = function (pno, psize, noteTypeId, recordId, projectId) {
        var _this = this;
        if (pno === void 0) { pno = 1; }
        if (psize === void 0) { psize = Constants.DefaultPageSize; }
        if (recordId === void 0) { recordId = 0; }
        if (projectId === void 0) { projectId = 0; }
        this.noteType = noteTypeId;
        this.recordId = recordId;
        var notesUrl = null;
        if (recordId > 0)
            notesUrl = UrlHelper.GetNotesUrl(ApiUrl.NotesOfRecord, noteTypeId, recordId, 0);
        else {
            var u = this.isMyPage ? ApiUrl.MyNotes : ApiUrl.Notes;
            notesUrl = UrlHelper.GetNotesUrl(u, noteTypeId, 0, 0);
        }
        MainLoader.show();
        this.apiService.get(notesUrl, { pno: pno, psize: psize })
            .done(function (notes) { return _this.setNotesList(notes, projectId); })
            .always(function () { return MainLoader.hide(); });
    };
    NoteService.prototype.openCreateNotePopup = function (noteTypeId, parentId, noteId, editBtn) {
        if (noteTypeId === void 0) { noteTypeId = 0; }
        if (parentId === void 0) { parentId = 0; }
        if (noteId === void 0) { noteId = 0; }
        var noteTypeElement = this.createEditNoteModal.find('[name=NoteTypeId]');
        noteTypeElement.val(noteTypeId);
        var parentIdElement = this.createEditNoteModal.find('[name=ParentId]');
        parentIdElement.val(parentId);
        var noteIdElement = this.createEditNoteModal.find('[name=NoteId]');
        noteIdElement.val(noteId);
        if (editBtn && editBtn.length > 0) {
            var li = editBtn.closest('.note-li-wrapper');
            if (li && li.length) {
                var noteText = li.find('[t-note-text]').text();
                this.createEditNoteModal.find('[name=Note]').val(noteText);
            }
        }
        this.createEditNoteModal.modal('show');
    };
    NoteService.prototype.resetProjectNotesForm = function () {
        this.saveNoteModalForm[0].reset();
        this.saveNoteModalForm.find('input:hidden').val('');
    };
    NoteService.prototype.createEditClickHandler = function (btn) {
        var noteTypeId = btn.data('note-type');
        var recordId = btn.data('record-id');
        var noteId = btn.data('note-id');
        this.openCreateNotePopup(noteTypeId, recordId, noteId, btn);
    };
    NoteService.prototype.init = function () {
        var _this = this;
        var pageNumbersBtn = this.isMeetingNotesPage ? '#meeting-notes-paging-container a[data-pno]' : '#notes-paging-container a[data-pno]';
        $(document).on('click', pageNumbersBtn, function (e) {
            var btn = $(e.target).closest('a[data-pno]');
            var pNo = btn.data('pno') || 0;
            if (pNo > 0) {
                if (_this.isNotesPage)
                    _this.loadProjectNotes(pNo);
                else
                    _this.loadNotes(pNo, Constants.DefaultPageSize, _this.noteType, _this.recordId);
            }
        });
        this.createEditNoteModal.on('hide.bs.modal', function () {
            _this.resetProjectNotesForm();
        });
        var EditLiBtn = this.isMeetingNotesPage ? '#meeting-notes-list [ap-action-note-modal-form]' : '#notes-list [ap-action-note-modal-form]';
        $(document).on('click', EditLiBtn, function (e) {
            var btn = $(e.target).closest('[ap-action-note-modal-form]');
            _this.createEditClickHandler(btn);
        });
        var createLiBtn = '[' + this.idPrefix + 'ap-action-note-modal-form]';
        $(document).on('click', createLiBtn, function (e) {
            var btn = $(e.target).closest('[' + _this.idPrefix + 'ap-action-note-modal-form]');
            _this.createEditClickHandler(btn);
        });
        var createNoteBtn = '[notes-ap-action-note-modal-form]';
        $(document).on('click', createNoteBtn, function (e) {
            var btn = $(e.target).closest('[notes-ap-action-note-modal-form]');
            $(btn).data("record-id", _this.projectNotesFilterModel.projectId);
            if (_this.projectNotesFilterModel.projectId && _this.projectNotesFilterModel.projectId > 0) {
                _this.createEditClickHandler(btn);
            }
            else {
                Alerts.Error('Project is required.', 'Validation error');
            }
        });
        this.saveNoteBtn.on('click', function () {
            var recordId = _this.saveNoteModalForm.find('[name=ParentId]').val();
            var noteId = _this.saveNoteModalForm.find('[name=NoteId]').val() || 0;
            var note = _this.saveNoteModalForm.find('[name=Note]').val();
            var noteTypeId = _this.createEditNoteModal.find('[name=NoteTypeId]').val();
            if (!note) {
                Alerts.Error('Note text is required.');
                return false;
            }
            if (noteId > 0) {
                var noteSaveUrl = UrlHelper.GetNotesUrl(ApiUrl.NoteUpdate, noteTypeId, recordId, noteId);
                MainLoader.show();
                _this.apiService.put(noteSaveUrl, { note: note })
                    .done(function (data, status, xhr) {
                    if (xhr.status === 200 || xhr.status === 201) {
                        Alerts.Success('Note saved successfully.', 'Success', function () { return _this.createEditNoteModal.modal('hide'); });
                        if (_this.isNotesPage)
                            _this.loadProjectNotes();
                        else if (_this.showPaging || _this.isMeetingNotesPage)
                            _this.loadNotes(1, Constants.DefaultPageSize, noteTypeId, recordId);
                        else if (!_this.isMeetingNotesPage)
                            _this.loadNotes(1, Constants.NestedAllPageSize, noteTypeId, recordId);
                    }
                })
                    .always(function () { return MainLoader.hide(); });
            }
            else {
                MainLoader.show();
                var noteSaveUrl = UrlHelper.GetNotesUrl(ApiUrl.NotesOfRecordCreate, noteTypeId, recordId, 0);
                _this.apiService.post(noteSaveUrl, { note: note })
                    .done(function (data, status, xhr) {
                    if (xhr.status === 200 || xhr.status === 201) {
                        Alerts.Success('Note added successfully.', 'Success', function () { return _this.createEditNoteModal.modal('hide'); });
                        if (_this.isNotesPage)
                            _this.loadProjectNotes();
                        else if (_this.showPaging)
                            _this.loadNotes(1, Constants.DefaultPageSize, noteTypeId, recordId);
                        else if (!_this.isMeetingNotesPage)
                            _this.loadNotes(1, Constants.NestedAllPageSize, noteTypeId, recordId);
                    }
                })
                    .always(function () { return MainLoader.hide(); });
            }
        });
    };
    return NoteService;
}());
//# sourceMappingURL=NoteService.js.map