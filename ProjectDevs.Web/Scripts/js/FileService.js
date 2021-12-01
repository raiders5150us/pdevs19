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
var FileService = /** @class */ (function () {
    function FileService(isMyPage, apiService, isFilesPage) {
        if (isFilesPage === void 0) { isFilesPage = false; }
        this.isMyPage = isMyPage;
        this.apiService = apiService;
        this.isFilesPage = isFilesPage;
        this.templateLi = $('#files-list-item-template > li').first();
        this.filesContainerUl = $('#files-list');
        this.createEditFileModal = $('#create-edit-file-modal');
        this.saveFileModalForm = this.createEditFileModal.find('#files-form');
        this.saveFileBtn = this.createEditFileModal.find('#save-file-btn');
        this.projectFilesFilterModel = {
            projectId: 0,
            assignedToUserId: null,
            teamId: ""
        };
        this.init();
    }
    FileService.prototype.loadProjectFiles = function (pno, psize) {
        var _this = this;
        if (pno === void 0) { pno = 1; }
        if (psize === void 0) { psize = Constants.DefaultPageSize; }
        var projectFilesUrl = this.isMyPage ? ApiUrl.MyProjectFiles : ApiUrl.ProjectFiles;
        MainLoader.show();
        this.apiService.get(projectFilesUrl, __assign(__assign({}, this.projectFilesFilterModel), { pno: pno, psize: psize }))
            .done(function (files) {
            _this.filesContainerUl.empty();
            if (files && files.Data && files.Data.length) {
                files.Data.forEach(function (f) {
                    var li = _this.templateLi.clone();
                    li.find('[t-file-name]').text(f.FileName);
                    li.find('[t-file-link]').attr('href', ApiUrl.Domain + "/" + f.FileLocation);
                    li.find('[t-data-file-id]').attr('data-file-id', f.FileId);
                    li.find('[t-data-record-id]').attr('data-record-id', f.AssociatedRecordId);
                    li.find('[t-data-file-name]').attr('data-file-name', f.FileName);
                    li.find('[t-data-file-type]').attr('data-file-type', f.FileTypeId);
                    li.find('[t-data-file-location]').attr('data-file-location', ApiUrl.Domain + "/" + f.FileLocation);
                    _this.filesContainerUl.append(li);
                });
            }
            if (_this.projectFilesFilterModel.projectId > 0) {
                var projectDetailUrl = UrlHelper.GetProjectsUrl(ApiUrl.ProjectDetail, _this.projectFilesFilterModel.projectId);
                _this.apiService.get(projectDetailUrl)
                    .done(function (project) {
                    if (!(UserTokenHandler.isSuperUser() || UserTokenHandler.isUserStakeholderOrOwnerForProject(project))) {
                        $("[files-ap-action-file-modal-form]").hide();
                    }
                    else {
                        $("[files-ap-action-file-modal-form]").show();
                    }
                });
            }
            else if (UserTokenHandler.isSuperUser()) {
                $("[files-ap-action-file-modal-form]").show();
            }
            else {
                $("[files-ap-action-file-modal-form]").hide();
            }
        })
            .always(function () { return MainLoader.hide(); });
    };
    FileService.prototype.loadFiles = function (fileType, recordId) {
        var _this = this;
        if (recordId === void 0) { recordId = 0; }
        var projectFilesUrl = null;
        if (recordId > 0)
            projectFilesUrl = UrlHelper.GetFilesUrl(ApiUrl.FilesOfRecord, fileType, recordId, 0);
        else {
            var u = this.isMyPage ? ApiUrl.MyFiles : ApiUrl.Files;
            projectFilesUrl = UrlHelper.GetFilesUrl(u, fileType, 0, 0);
        }
        this.apiService.get(projectFilesUrl, { psize: 100 })
            .done(function (files) {
            _this.filesContainerUl.empty();
            if (files && files.length) {
                files.forEach(function (f) {
                    var li = _this.templateLi.clone();
                    li.find('[t-file-name]').text(f.FileName);
                    li.find('[t-file-link]').attr('href', ApiUrl.Domain + "/" + f.FileLocation);
                    li.find('[t-data-file-id]').attr('data-file-id', f.FileId);
                    li.find('[t-data-record-id]').attr('data-record-id', f.AssociatedRecordId);
                    li.find('[t-data-file-name]').attr('data-file-name', f.FileName);
                    li.find('[t-data-file-type]').attr('data-file-type', f.FileTypeId);
                    li.find('[t-data-file-location]').attr('data-file-location', ApiUrl.Domain + "/" + f.FileLocation);
                    _this.filesContainerUl.append(li);
                });
            }
        });
    };
    FileService.prototype.openCreateFilePopup = function (fileTypeId, associateRecordId, fileId, editBtn) {
        if (fileTypeId === void 0) { fileTypeId = 0; }
        if (associateRecordId === void 0) { associateRecordId = 0; }
        if (fileId === void 0) { fileId = 0; }
        var fileTypeElement = this.createEditFileModal.find('[name=FileTypeId]');
        fileTypeElement.val(fileTypeId);
        var associatedRecordIdElement = this.createEditFileModal.find('[name=AssociatedRecordId]');
        associatedRecordIdElement.val(associateRecordId);
        var fileIdElement = this.createEditFileModal.find('[name=FileId]');
        fileIdElement.val(fileId);
        if (editBtn && editBtn.length > 0) {
            var fileName = editBtn.data('file-name');
            this.createEditFileModal.find('[name=FileName]').val(fileName);
            this.saveFileModalForm.find('.selected-file-preview').attr('src', editBtn.data('file-location')).removeClass('hidden');
        }
        this.createEditFileModal.modal('show');
    };
    FileService.prototype.resetProjectFilesForm = function () {
        this.saveFileModalForm[0].reset();
        this.saveFileModalForm.find('input:hidden').val('');
    };
    FileService.prototype.init = function () {
        var _this = this;
        this.createEditFileModal.on('hide.bs.modal', function () {
            _this.saveFileModalForm.find('.selected-file-preview').removeAttr('src').addClass('hidden');
            _this.resetProjectFilesForm();
        });
        $(document).on('click', '[ap-action-file-modal-form]', function (e) {
            var btn = $(e.target).closest('[ap-action-file-modal-form]');
            var fileTypeId = btn.data('file-type');
            var recordId = btn.data('record-id');
            var fileId = btn.data('file-id');
            _this.openCreateFilePopup(fileTypeId, recordId, fileId, btn);
        });
        $(document).on('click', '[files-ap-action-file-modal-form]', function (e) {
            var btn = $(e.target).closest('[files-ap-action-file-modal-form]');
            var fileTypeId = btn.data('file-type');
            var recordId = _this.projectFilesFilterModel.projectId;
            var fileId = btn.data('file-id');
            if (recordId && recordId > 0) {
                _this.openCreateFilePopup(fileTypeId, recordId, fileId, btn);
            }
            else {
                Alerts.Error('Project is required.', 'Validation error');
            }
        });
        this.saveFileBtn.on('click', function () {
            var recordId = _this.saveFileModalForm.find('[name=AssociatedRecordId]').val();
            var fileName = _this.saveFileModalForm.find('[name=FileName]').val();
            var fileId = _this.saveFileModalForm.find('[name=FileId]').val() || 0;
            var fileType = _this.saveFileModalForm.find('[name=FileTypeId]').val() || 0;
            if (!fileName) {
                Alerts.Error('File name is required.', 'Validation error');
                return false;
            }
            var filesJq = _this.saveFileModalForm.find('[name=File]');
            if (filesJq && filesJq.length) {
                var file = filesJq[0];
                if (file && file.files && file.files[0]) {
                    MainLoader.show();
                    var successMsg_1 = '';
                    var fileSaveUrl = '';
                    if (fileId > 0) {
                        successMsg_1 = 'File updated successfully.';
                        fileSaveUrl = UrlHelper.GetFilesUrl(ApiUrl.FileUpdate, fileType, recordId, fileId);
                    }
                    else {
                        successMsg_1 = 'File added successfully.';
                        fileSaveUrl = UrlHelper.GetFilesUrl(ApiUrl.FilesOfRecordCreate, fileType, recordId, 0);
                    }
                    var formData = new FormData();
                    formData.append('file', file.files[0]);
                    formData.append('FileName', fileName);
                    _this.apiService.postFile(fileSaveUrl, formData)
                        .done(function (data, status, xhr) {
                        if (xhr.status === 200 || xhr.status === 201) {
                            _this.createEditFileModal.modal('hide');
                            Alerts.Success(successMsg_1, 'Success');
                            if (fileType.toString() != "TemporaryFile") {
                                if (_this.isFilesPage)
                                    _this.loadProjectFiles();
                                else
                                    _this.loadFiles(fileType, recordId);
                            }
                        }
                    })
                        .always(function () { return MainLoader.hide(); });
                }
                else {
                    if (fileId > 0) {
                        MainLoader.show();
                        var fileSaveUrl = UrlHelper.GetFilesUrl(ApiUrl.FileNameUpdate, fileType, recordId, fileId);
                        _this.apiService.patch(fileSaveUrl, { fileName: fileName })
                            .done(function (data, status, xhr) {
                            if (xhr.status === 200 || xhr.status === 201) {
                                Alerts.Success('File name updated successfully.', 'Success');
                                _this.createEditFileModal.modal('hide');
                                if (_this.isFilesPage)
                                    _this.loadProjectFiles();
                                else
                                    _this.loadFiles(fileType, recordId);
                            }
                        })
                            .always(function () { return MainLoader.hide(); });
                    }
                    else {
                        Alerts.Error('Please select file to upload', 'Validation error');
                        return false;
                    }
                }
            }
        });
    };
    return FileService;
}());
//# sourceMappingURL=FileService.js.map