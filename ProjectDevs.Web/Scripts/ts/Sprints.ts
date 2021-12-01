/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/jqueryui/jqueryui.d.ts" />
/// <reference path="Models.ts" />
/// <reference path="Constants.ts" />
/// <reference path="Common.ts" />
/// <reference path="UserService.ts" />

$(function () {
    const apiService = new ApiService();
    const ddlService = new DdlService(apiService);
    const cookieUtils = new CookieUtils(apiService);
    const sprintsTableBody = $('#sprints-table > tbody');
    const sprintsTableFooter = $('#sprints-table > tfoot');

    const pagingContainer = $('#sprints-paging-container');
    const infoContainer = $('#apdt_sprints_info');
    const startFromElement = infoContainer.find('.apdt_startfrom');
    const endToElement = infoContainer.find('.apdt_endto');
    const totalElement = infoContainer.find('.apdt_total');
    const selectedTeams = cookieUtils.getCookie(Constants.TeamSelectionCookieName);
    ddlService.setTeamsDdl(false, function () {
        loadSprints();
    }, selectedTeams);

    function loadSprints(pno: number = 1, psize: number = Constants.DefaultPageSize) {


        let storyTeamId: string = "";
        if ($('#filter-team-id').select2('data')) {
            storyTeamId = $('#filter-team-id').select2('data').map(a => a.id).toString();

        }
        sprintsTableBody.empty();
        sprintsTableFooter.hide();
        pagingContainer.html('');
        startFromElement.html(`0`);
        endToElement.html(`0`);
        totalElement.html(`0`);

        if (storyTeamId != "") {
            MainLoader.show();
            apiService.get(ApiUrl.Sprints, { pno, psize, storyTeamId })
                .done((sprints: IPagingModel<ISprintResult>) => {
                    if (sprints && sprints.Data && sprints.Data.length) {
                        sprintsTableFooter.show();
                        sprints.Data.forEach(s => {
                            const tr = $('<tr>');

                            tr.append(`<td>${s.SprintName}</td>`);
                            tr.append(`<td>${s.TeamName}</td>`);
                            tr.append(`<td>${Utils.JsonDateToStr(s.StartDate)}</td>`);
                            tr.append(`<td>${Utils.JsonDateToStr(s.EndDate)}</td>`);
                            tr.append(`<td class="text-center">${s.TotalStories}</td>`);
                            tr.append(`<td class="text-center">${s.CompletedStories}</td>`);
                            tr.append(`<td class="text-center">${s.PercentageComplete}%</td>`);

                            const actionColumn = `
                            <a role="button" title="View user stories" class="btn btn-xs btn-success m-r-5" href="/Sprint/${s.SprintId}/User-Stories"><i class="fa fa-list"></i></a>
                            <button type="button" title="Edit details" class="btn btn-xs btn-primary m-r-5" ap-action-sprint-modal-form data-sprint-id="${s.SprintId}"><i class="fa fa-pencil"></i></button>
                            <a role="button" title="Edit additional details" class="btn btn-xs btn-primary m-r-5" href="/Sprint/${s.SprintId}"><i class="fa fa-clipboard"></i></a>`;

                            tr.append(`<td class="text-center">${actionColumn}</td>`);

                            sprintsTableBody.append(tr);
                        });
                        const pageModel: IPaginationModel = {
                            CurrentPageNumber: sprints.CurrentPageNumber,
                            IsLastPage: sprints.IsLastPage,
                            PageSize: sprints.PageSize,
                            TotalPages: sprints.Count,
                        };
                        const pagination = Pagination.Render(pageModel);
                        pagingContainer.html(`${pagination}`);

                        const startFrom = ((sprints.CurrentPageNumber - 1) * sprints.PageSize) + 1;
                        const endTo = startFrom + sprints.Data.length - 1;

                        startFromElement.html(`${startFrom}`);
                        endToElement.html(`${endTo}`);
                        totalElement.html(`${sprints.Count}`);

                        if (!(UserTokenHandler.isSuperUser())) {
                            $("[ap-action-sprint-modal-form]").remove();
                            $("[ap-additional-action-sprint-modal-form]").remove();
                        }
                    }
                    else {
                        Alerts.Info('No sprints found.');
                        sprintsTableFooter.hide();

                        pagingContainer.html('');

                        startFromElement.html(`0`);
                        endToElement.html(`0`);
                        totalElement.html(`0`);
                    }
                })
                .always(() => MainLoader.hide());
        }
    }


    $(document).on("change", '#filter-team-id', function () {
        var storyTeamId = $('#filter-team-id').select2('data').map(a => a.id).toString();
        cookieUtils.setCookie(Constants.TeamSelectionCookieName, storyTeamId);

        loadSprints();
    });
    $('#filter-team-id').select2({
        placeholder: 'Select',
        width: null,
        containerCssClass: ':all:'
    });

    //loadSprints();

    $(document).on('click', '#sprints-paging-container a[data-pno]', function (e) {
        const btn = $(this);
        const pNo: number = btn.data('pno') || 0;
        if (pNo > 0) {
            loadSprints(pNo);
        }
    });

    /**** Create/Edit Sprints ****/

    const createEditSprintModal = $('#create-edit-sprint-modal');
    const saveSprintModalForm = createEditSprintModal.find('#sprints-form');
    const saveSprintBtn = createEditSprintModal.find('#save-sprint-btn');

    const createEditSprintModal_Adtn = $('#create-edit-sprint-additional-modal');
    const saveSprintModalForm_Adtn = createEditSprintModal_Adtn.find('#sprints-form');
    const saveSprintBtn_Adtn = createEditSprintModal_Adtn.find('#save-sprint-btn');

    function openCreateSprintPopup(sprintId: number = 0) {
        const sprintIdElement = createEditSprintModal.find('[name=SprintId]');
        sprintIdElement.val(sprintId);
        if (sprintId > 0) {
            MainLoader.show();
            const sprintDetailUrl = UrlHelper.GetSprintsUrl(ApiUrl.SprintDetail, sprintId);
            apiService.get(sprintDetailUrl)
                .done((s: ISprint) => {
                    createEditSprintModal.find('[name=SprintName]').val(s.SprintName);
                    createEditSprintModal.find('[name=TeamId]').val(s.TeamID);
                    createEditSprintModal.find('[name=StartDate]').val(Utils.JsonDateToStr(s.StartDate, true));
                    createEditSprintModal.find('[name=EndDate]').val(Utils.JsonDateToStr(s.EndDate, true));

                    createEditSprintModal.modal('show');
                }).always(() => MainLoader.hide());
        }
        else
            createEditSprintModal.modal('show');
    }

    function openEditSprintPopupWithAdditionalDetails(sprintId: number = 0) {
        const sprintIdElement = createEditSprintModal_Adtn.find('[name=SprintId]');
        sprintIdElement.val(sprintId);
        if (sprintId > 0) {
            MainLoader.show();
            const sprintDetailUrl = UrlHelper.GetSprintsUrl(ApiUrl.SprintDetail, sprintId);
            apiService.get(sprintDetailUrl)
                .done((s: ISprint) => {                    
                    createEditSprintModal_Adtn.find('[name=SprintName]').val(s.SprintName);
                    createEditSprintModal_Adtn.find('[name=TeamId]').val(s.TeamID);
                    createEditSprintModal_Adtn.find('[name=StartDate]').val(Utils.JsonDateToStr(s.StartDate, true));
                    createEditSprintModal_Adtn.find('[name=EndDate]').val(Utils.JsonDateToStr(s.EndDate, true));

                    createEditSprintModal_Adtn.find('[name=ChangeNumber]').val(s.ChangeNumber);
                    createEditSprintModal_Adtn.find('[name=SprintRetrospective]').val(s.SprintRetrospective);

                    createEditSprintModal_Adtn.modal('show');
                }).always(() => MainLoader.hide());
        }        
    }

    function resetStorySprintForm() {
        (saveSprintModalForm[0] as HTMLFormElement).reset();
        saveSprintModalForm.find('input:hidden').val('');
    }
    createEditSprintModal.on('hide.bs.modal', function () {
        resetStorySprintForm();
    });
    $(document).on('click', '[ap-action-sprint-modal-form]', function (e) {
        const btn = $(this);
        const sprintId: number = btn.data('sprint-id') || 0;

        openCreateSprintPopup(sprintId);
    });


    function resetStorySprintAdditionalForm() {
        (saveSprintModalForm_Adtn[0] as HTMLFormElement).reset();
        saveSprintModalForm_Adtn.find('input:hidden').val('');
    }
    createEditSprintModal_Adtn.on('hide.bs.modal', function () {
        resetStorySprintAdditionalForm();
    });

    $(document).on('click', '[ap-additional-action-sprint-modal-form]', function (e) {
        const btn = $(this);
        const sprintId: number = btn.data('sprint-id') || 0;

        openEditSprintPopupWithAdditionalDetails(sprintId);
    });

    saveSprintBtn.on('click', function (e) {

        const sprintId: number = saveSprintModalForm.find('[name=SprintId]').val() || 0;
        MainLoader.show();
        if (sprintId > 0) {
            const sprintSaveUrl: string = UrlHelper.GetSprintsUrl(ApiUrl.SprintUpdate, sprintId);
            apiService.put(sprintSaveUrl, saveSprintModalForm.serialize())
                .done((data: any, status: string, xhr: JQueryXHR) => {
                    if (xhr.status === 200 || xhr.status === 201) {
                        Alerts.Success('Sprint updated successfully.');
                        createEditSprintModal.modal('hide');
                        loadSprints();
                    }
                })
                .always(() => MainLoader.hide());
        }
        else {
            const sprintSaveUrl: string = UrlHelper.GetSprintsUrl(ApiUrl.SprintCreate, 0);
            apiService.post(sprintSaveUrl, saveSprintModalForm.serialize())
                .done((data: any, status: string, xhr: JQueryXHR) => {
                    if (xhr.status === 200 || xhr.status === 201) {
                        Alerts.Success('Sprint created successfully.');
                        createEditSprintModal.modal('hide');
                        loadSprints();
                    }
                })
                .always(() => MainLoader.hide());
        }
    });

    saveSprintBtn_Adtn.on('click', function (e) {
        const sprintId: number = saveSprintModalForm_Adtn.find('[name=SprintId]').val() || 0;
        MainLoader.show();
        if (sprintId > 0) {
            const sprintSaveUrl: string = UrlHelper.GetSprintsUrl(ApiUrl.SprintUpdate, sprintId);
            apiService.put(sprintSaveUrl, saveSprintModalForm_Adtn.serialize())
                .done((data: any, status: string, xhr: JQueryXHR) => {
                    if (xhr.status === 200 || xhr.status === 201) {
                        Alerts.Success('Sprint updated successfully.');
                        createEditSprintModal_Adtn.modal('hide');
                        loadSprints();
                    }
                })
                .always(() => MainLoader.hide());
        }        
    });

    if (!(UserTokenHandler.isSuperUser())) {
        $("[ap-action-sprint-modal-form]").hide();
        $("[ap-additional-action-sprint-modal-form]").hide();
    }

    /**** Create/Edit Sprints END ****/
});