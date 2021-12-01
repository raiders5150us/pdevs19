/// <reference path="Models.ts" />
/// <reference path="Constants.ts" />
/// <reference path="Common.ts" />
/// <reference path="UserService.ts" />

class SprintService {
    private createEditSprintModal = $('#create-edit-sprint-additional-modal');
    private saveSprintModalForm = this.createEditSprintModal.find('#sprints-form');
    private saveSprintBtn = this.createEditSprintModal.find('#save-sprint-btn');
    private createEditSprintModal_Adtn = $('#create-edit-sprint-additional-modal');    
    storyFilterModel: { sprintId?: number } = {
        sprintId: 0
    }
    constructor(private apiService: ApiService, private isDetailPage = false) {
        this.init();
    }

    private init() {
        $(document).on('click', '[ap-action-sprint-modal-form]', e => {
           
            const btn = $(e.target).closest('[ap-action-sprint-modal-form]');
            const sprintId: number = btn.data('sprint-id') || 0;
            this.openCreateSprintPopup(sprintId);
        });

        $(document).on('click', '[ap-action-sprint-close]', e => {
            const btn = $(e.target).closest('[ap-action-sprint-close]');
            const sprintId: number = btn.data('sprint-id') || 0;
            if (!$("[ap-action-sprint-close]").attr("disabled")) {
                Alerts.Confirm('Are you sure you want to close this sprint?', 'confirm', () => {

                    const sprintCloseUrl: string = UrlHelper.GetSprintsUrl(ApiUrl.SprintClose, sprintId);
                    this.apiService.get(sprintCloseUrl, null)
                        .done((data: any, status: string, xhr: JQueryXHR) => {
                            if (xhr.status === 200 || xhr.status === 201) {

                                Alerts.Success('Sprint closed successfully.');
                                setTimeout(() => {
                                    this.getSprintDetails(sprintId);
                                }, 2000);
                                //this.createEditSprintModal.modal('hide');
                                //this.getSprintDetails(sprintId);
                            }
                        })
                        .always(() => MainLoader.hide());
                })
            }
        });


        this.saveSprintBtn.on('click', () => {      
            const sprintId: number = this.saveSprintModalForm.find('[name=SprintId]').val() || 0;
            MainLoader.show();
            if (sprintId > 0) {
                const sprintSaveUrl: string = UrlHelper.GetSprintsUrl(ApiUrl.SprintUpdate, sprintId);
                this.apiService.put(sprintSaveUrl, this.saveSprintModalForm.serialize())
                    .done((data: any, status: string, xhr: JQueryXHR) => {
                        if (xhr.status === 200 || xhr.status === 201) {
                            Alerts.Success('Sprint updated successfully.');
                            this.createEditSprintModal.modal('hide');
                            this.getSprintDetails(sprintId);
                        }
                    })
                    .always(() => MainLoader.hide());
            }
        });
    }

    openCreateSprintPopup(sprintId: number = 0) {
        const sprintIdElement = this.createEditSprintModal.find('[name=SprintId]');
        sprintIdElement.val(sprintId);
        if (sprintId > 0) {
            MainLoader.show();
            const sprintDetailUrl = UrlHelper.GetSprintsUrl(ApiUrl.SprintDetail, sprintId);
            this.apiService.get(sprintDetailUrl)
                .done((s: ISprint) => {
                    this.createEditSprintModal.find('[name=SprintName]').val(s.SprintName);
                    this.createEditSprintModal.find('[name=TeamId]').val(s.TeamID);
                    this.createEditSprintModal.find('[name=StartDate]').val(Utils.JsonDateToStr(s.StartDate, true));
                    this.createEditSprintModal.find('[name=EndDate]').val(Utils.JsonDateToStr(s.EndDate, true));
                    this.createEditSprintModal.find('[name=ChangeNumber]').val(s.ChangeNumber);
                    this.createEditSprintModal.find('[name=SprintRetrospective]').val(s.SprintRetrospective);
                    
                    if (s.IsClosed) {
                        this.createEditSprintModal.find('[ap-action-sprint-close]').attr("disabled", "disabled");
                    }
                    else {
                        this.createEditSprintModal.find('[ap-action-sprint-close]').removeAttr("disabled");
                    }
                    this.createEditSprintModal.modal('show');
                }).always(() => MainLoader.hide());
        }
        else
            this.createEditSprintModal.modal('show');
    }

    getSprintDetails(sprintId: number) {
        const sprintDetailUrl = UrlHelper.GetSprintsUrl(ApiUrl.SprintDetail, sprintId);

        MainLoader.show();
        this.apiService.get(sprintDetailUrl)
            .done((sprint: ISprint) => {
                
                $('[data-sprint-name]').text(sprint.SprintName);
                $('[data-team-name]').text(sprint.TeamName);
                $('[data-startdate]').text(Utils.JsonDateToStr(sprint.StartDate));
                $('[data-enddate]').text(Utils.JsonDateToStr(sprint.EndDate));

                $('[data-userstoriescount]').text(sprint.TotalStories);
                $('[data-userstoriescompleted]').text(sprint.CompletedStories);
                $('[data-changenumber]').text(sprint.ChangeNumber);
                $('[data-sprintretrospective]').text(sprint.SprintRetrospective);

               
                if (sprint.IsClosed) {
                    $('[ap-action-sprint-close]').attr("disabled", "disabled");
                }
                else {
                    $('[ap-action-sprint-close]').removeAttr("disabled");
                }
            })
            .always(() => MainLoader.hide());


        if (!(UserTokenHandler.isSuperUser())) {
            $("[ap-action-sprint-modal-form]").remove();
            $("[ap-action-file-modal-form]").remove();
        }

    }
}