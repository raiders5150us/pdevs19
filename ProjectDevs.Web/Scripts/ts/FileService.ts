/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="Models.ts" />
/// <reference path="Constants.ts" />
/// <reference path="Common.ts" />
/// <reference path="UserService.ts" />

class FileService {
    private templateLi = $('#files-list-item-template > li').first();
    private filesContainerUl = $('#files-list');

    private createEditFileModal = $('#create-edit-file-modal');
    private saveFileModalForm = this.createEditFileModal.find('#files-form');
    private saveFileBtn = this.createEditFileModal.find('#save-file-btn');

    constructor(private isMyPage: boolean, private apiService: ApiService, private isFilesPage = false) {
        this.init();
    }

    public projectFilesFilterModel: { projectId: number,teamId:string, assignedToUserId?: string } = {
        projectId: 0,
        assignedToUserId: null,
        teamId:""
    }

    loadProjectFiles(pno = 1, psize = Constants.DefaultPageSize) {
        const projectFilesUrl = this.isMyPage ? ApiUrl.MyProjectFiles : ApiUrl.ProjectFiles;
        MainLoader.show();
        this.apiService.get(projectFilesUrl, { ...this.projectFilesFilterModel, pno, psize })
            .done((files: IPagingModel<IProjectFile>) => {
                

                this.filesContainerUl.empty();

                if (files && files.Data && files.Data.length) {
                    files.Data.forEach(f => {
                        const li = this.templateLi.clone();
                        li.find('[t-file-name]').text(f.FileName);
                        li.find('[t-file-link]').attr('href', `${ApiUrl.Domain}/${f.FileLocation}`);
                        li.find('[t-data-file-id]').attr('data-file-id', f.FileId);
                        li.find('[t-data-record-id]').attr('data-record-id', f.AssociatedRecordId);
                        li.find('[t-data-file-name]').attr('data-file-name', f.FileName);
                        li.find('[t-data-file-type]').attr('data-file-type', f.FileTypeId);
                        li.find('[t-data-file-location]').attr('data-file-location', `${ApiUrl.Domain}/${f.FileLocation}`);

                        this.filesContainerUl.append(li);
                    });
                }

                if (this.projectFilesFilterModel.projectId > 0) {
                    const projectDetailUrl = UrlHelper.GetProjectsUrl(ApiUrl.ProjectDetail, this.projectFilesFilterModel.projectId);

                    this.apiService.get(projectDetailUrl)
                        .done((project: IProjectDto) => {
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
            .always(() => MainLoader.hide());
    }

    loadFiles(fileType: number, recordId = 0) {
        let projectFilesUrl: string = null;

        if (recordId > 0)
            projectFilesUrl = UrlHelper.GetFilesUrl(ApiUrl.FilesOfRecord, fileType, recordId, 0);
        else {
            const u = this.isMyPage ? ApiUrl.MyFiles : ApiUrl.Files;
            projectFilesUrl = UrlHelper.GetFilesUrl(u, fileType, 0, 0);
        }

        this.apiService.get(projectFilesUrl, { psize: 100 })
            .done((files: IProjectFile[]) => {
               

                this.filesContainerUl.empty();
                if (files && files.length) {
                    files.forEach(f => {
                        const li = this.templateLi.clone();
                        li.find('[t-file-name]').text(f.FileName);
                        li.find('[t-file-link]').attr('href', `${ApiUrl.Domain}/${f.FileLocation}`);
                        li.find('[t-data-file-id]').attr('data-file-id', f.FileId);
                        li.find('[t-data-record-id]').attr('data-record-id', f.AssociatedRecordId);
                        li.find('[t-data-file-name]').attr('data-file-name', f.FileName);
                        li.find('[t-data-file-type]').attr('data-file-type', f.FileTypeId);
                        li.find('[t-data-file-location]').attr('data-file-location', `${ApiUrl.Domain}/${f.FileLocation}`);

                        this.filesContainerUl.append(li);
                    });
                }
            });
    }

    openCreateFilePopup(fileTypeId: number = 0, associateRecordId: number = 0, fileId: number = 0, editBtn: JQuery) {
        const fileTypeElement = this.createEditFileModal.find('[name=FileTypeId]');
        fileTypeElement.val(fileTypeId);

        const associatedRecordIdElement = this.createEditFileModal.find('[name=AssociatedRecordId]');
        associatedRecordIdElement.val(associateRecordId);

        const fileIdElement = this.createEditFileModal.find('[name=FileId]');
        fileIdElement.val(fileId);

        if (editBtn && editBtn.length > 0) {
            const fileName = editBtn.data('file-name');
            this.createEditFileModal.find('[name=FileName]').val(fileName);
            this.saveFileModalForm.find('.selected-file-preview').attr('src', editBtn.data('file-location')).removeClass('hidden');
        }
        this.createEditFileModal.modal('show');
    }
    resetProjectFilesForm() {
        (this.saveFileModalForm[0] as HTMLFormElement).reset();
        this.saveFileModalForm.find('input:hidden').val('');
    }

    private init() {
        this.createEditFileModal.on('hide.bs.modal', () => {
            this.saveFileModalForm.find('.selected-file-preview').removeAttr('src').addClass('hidden');
            this.resetProjectFilesForm();
        });
        $(document).on('click', '[ap-action-file-modal-form]', e => {
           
            const btn = $(e.target).closest('[ap-action-file-modal-form]');
            const fileTypeId: number = btn.data('file-type');
            const recordId: number = btn.data('record-id');
            const fileId: number = btn.data('file-id');
            this.openCreateFilePopup(fileTypeId, recordId, fileId, btn);
        });

        $(document).on('click', '[files-ap-action-file-modal-form]', e => {
           
            const btn = $(e.target).closest('[files-ap-action-file-modal-form]');
            const fileTypeId: number = btn.data('file-type');
            const recordId: number = this.projectFilesFilterModel.projectId;
            const fileId: number = btn.data('file-id');
            if (recordId && recordId > 0) {
                this.openCreateFilePopup(fileTypeId, recordId, fileId, btn);
            }
            else {
                Alerts.Error('Project is required.', 'Validation error'); 
            }
        });

        this.saveFileBtn.on('click', () => {
            
            const recordId: number = this.saveFileModalForm.find('[name=AssociatedRecordId]').val();
            const fileName: string = this.saveFileModalForm.find('[name=FileName]').val();
            const fileId: number = this.saveFileModalForm.find('[name=FileId]').val() || 0;
            const fileType: number = this.saveFileModalForm.find('[name=FileTypeId]').val() || 0;
           
            if (!fileName) {
                Alerts.Error('File name is required.', 'Validation error');
                return false;
            }

            const filesJq = this.saveFileModalForm.find('[name=File]');
            if (filesJq && filesJq.length) {
                const file = (filesJq[0] as HTMLInputElement);
                if (file && file.files && file.files[0]) {
                    MainLoader.show();
                    let successMsg = '';
                    let fileSaveUrl = '';
                    if (fileId > 0) {
                        successMsg = 'File updated successfully.';
                        fileSaveUrl = UrlHelper.GetFilesUrl(ApiUrl.FileUpdate, fileType, recordId, fileId);
                    }
                    else {
                        successMsg = 'File added successfully.';
                        fileSaveUrl = UrlHelper.GetFilesUrl(ApiUrl.FilesOfRecordCreate, fileType, recordId, 0);
                    }
                    const formData = new FormData();
                    formData.append('file', file.files[0]);
                    formData.append('FileName', fileName);

                    this.apiService.postFile(fileSaveUrl, formData)
                        .done((data: any, status: string, xhr: JQueryXHR) => {
                            if (xhr.status === 200 || xhr.status === 201) {
                                this.createEditFileModal.modal('hide');
                                Alerts.Success(successMsg, 'Success');
                                if (fileType.toString() != "TemporaryFile") {
                                    
                                    if (this.isFilesPage)
                                        this.loadProjectFiles();
                                    else
                                        this.loadFiles(fileType, recordId);
                                }
                            }
                        })
                        .always(() => MainLoader.hide());
                }
                else {
                    if (fileId > 0) {
                        MainLoader.show();
                        const fileSaveUrl: string = UrlHelper.GetFilesUrl(ApiUrl.FileNameUpdate, fileType, recordId, fileId);
                        this.apiService.patch(fileSaveUrl, { fileName })
                            .done((data: any, status: string, xhr: JQueryXHR) => {
                                if (xhr.status === 200 || xhr.status === 201) {
                                    Alerts.Success('File name updated successfully.', 'Success');
                                    this.createEditFileModal.modal('hide'); if (this.isFilesPage)
                                        this.loadProjectFiles();
                                    else
                                        this.loadFiles(fileType, recordId);
                                }
                            })
                            .always(() => MainLoader.hide());
                    }
                    else {
                        Alerts.Error('Please select file to upload', 'Validation error');
                        return false;
                    }
                }
            }
        });
    }
}
