/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/jqueryui/jqueryui.d.ts" />
/// <reference path="Models.ts" />
/// <reference path="Constants.ts" />
/// <reference path="Common.ts" />
/// <reference path="UserService.ts" />

$(function () {
    const apiService = new ApiService();

    const usersTableBody = $('#users-table > tbody');
    const usersTableFooter = $('#users-table > tfoot');

    const pagingContainer = $('#users-paging-container');
    const infoContainer = $('#apdt_users_info');
    const startFromElement = infoContainer.find('.apdt_startfrom');
    const endToElement = infoContainer.find('.apdt_endto');
    const totalElement = infoContainer.find('.apdt_total');

    const isSuperUser = UserTokenHandler.getUser().IsSuperUser || false;
    if (!isSuperUser) {
        $('#users-tbl-action-col').remove();
    }

    function loadUsers(pno: number = 1, psize: number = Constants.DefaultPageSize) {
        MainLoader.show();
        apiService.get(ApiUrl.Users, { pno, psize })
            .done((users: IPagingModel<IProjectUser>) => {
                
                usersTableBody.empty();
                if (users && users.Data && users.Data.length) {
                    usersTableFooter.show();
                    users.Data.forEach(u => {
                        const tr = $('<tr>');
                        tr.data('user', u);
                        tr.append(`<td>${u.UserId}</td>`);
                        tr.append(`<td>${u.FirstName}</td>`);
                        tr.append(`<td>${u.LastName}</td>`);

                        const isDeveloperClass = u.IsDeveloper === 1 ? `<i class="fa fa-check text-success"></i>` : `<i class="fa fa-times text-danger"></i>`;
                        const isActiveClass = u.IsActive === 1 ? `<i class="fa fa-check text-success"></i>` : `<i class="fa fa-times text-danger"></i>`;
                        const isSuperUserClass = u.IsSuperUser === 1 ? `<i class="fa fa-check text-success"></i>` : `<i class="fa fa-times text-danger"></i>`;

                        tr.append(`<td class="text-center">${isDeveloperClass}</td>`);
                        tr.append(`<td class="text-center">${isSuperUserClass}</td>`);
                        tr.append(`<td class="text-center">${isActiveClass}</td>`);

                        if (isSuperUser) {
                            const actionColumn = `
    <button type="button" title="Edit details" class="btn btn-xs btn-primary m-r-5" ap-action-user-modal-form data-user-id="${u.UserId}"><i class="fa fa-pencil"></i></button>`;

                            tr.append(`<td class="text-center">${actionColumn}</td>`);
                        }
                        usersTableBody.append(tr);
                    });
                    const pageModel: IPaginationModel = {
                        CurrentPageNumber: users.CurrentPageNumber,
                        IsLastPage: users.IsLastPage,
                        PageSize: users.PageSize,
                        TotalPages: users.Count,
                    };
                    const pagination = Pagination.Render(pageModel);
                    pagingContainer.html(`${pagination}`);

                    const startFrom = ((users.CurrentPageNumber - 1) * users.PageSize) + 1;
                    const endTo = startFrom + users.Data.length - 1;

                    startFromElement.html(`${startFrom}`);
                    endToElement.html(`${endTo}`);
                    totalElement.html(`${users.Count}`);
                }
                else {
                    Alerts.Info('No users found.');
                    usersTableFooter.hide();

                    pagingContainer.html('');

                    startFromElement.html(`0`);
                    endToElement.html(`0`);
                    totalElement.html(`0`);
                }
            })
            .always(() => MainLoader.hide());
    }

    loadUsers();

    $(document).on('click', '#users-paging-container a[data-pno]', function (e) {
        const btn = $(this);
        const pNo: number = btn.data('pno') || 0;
        if (pNo > 0) {
            loadUsers(pNo);
        }
    });

    /**** Create/Edit Users ****/

    const createEditUserModal = $('#create-edit-user-modal');
    const saveUserModalForm = createEditUserModal.find('#users-form');
    const saveUserBtn = createEditUserModal.find('#save-user-btn');
    function openCreateUserPopup(userId: string = null, editBtn: JQuery = null) {
        const userIdElement = createEditUserModal.find('[name=UserId]');
        userIdElement.val(userId);
        if (userId && editBtn) {
            userIdElement.prop('readonly', true);            
            const user: IProjectUser = editBtn.closest('tr').data('user');
            saveUserModalForm.find('[name=FirstName]').val(user.FirstName);
            saveUserModalForm.find('[name=LastName]').val(user.LastName);
            saveUserModalForm.find('[name=ManagerId]').val(user.ManagerId);
            saveUserModalForm.find('[name=IsDeveloper]').prop('checked', user.IsDeveloper == 1);
            saveUserModalForm.find('[name=IsSuperUser]').prop('checked', user.IsSuperUser == 1);
            saveUserModalForm.find('[name=IsSuperUser]').val(user.IsSuperUser);
            saveUserModalForm.find('[name=IsActive]').prop('checked', user.IsActive == 1);
            createEditUserModal.modal('show');
        }
        else {
            saveUserModalForm.find('[name=IsSuperUser]').val(0);
            userIdElement.prop('readonly', false);
            createEditUserModal.modal('show');
        }
    }
    function resetStoryUserForm() {
        (saveUserModalForm[0] as HTMLFormElement).reset();
        saveUserModalForm.find('input:hidden').val('');
    }
    createEditUserModal.on('hide.bs.modal', function () {
        resetStoryUserForm();
    });
    $(document).on('click', '[ap-action-user-modal-form]', function (e) {
        const btn = $(this);
        const userId: string = btn.data('user-id');

        openCreateUserPopup(userId, btn);
    });
    saveUserBtn.on('click', function (e) {
        
        let serializedForm = saveUserModalForm.serialize();
        serializedForm = serializedForm.replace('IsActive=on', 'IsActive=1');
        serializedForm = serializedForm.replace('IsDeveloper=on', 'IsDeveloper=1');
        if (serializedForm.indexOf('IsActive') == -1) {
            serializedForm += '&IsActive=0';
        }
        if (serializedForm.indexOf('IsDeveloper') == -1) {
            serializedForm += '&IsDeveloper=0';
        }
        
        const userId = saveUserModalForm.find('[name=UserId]').val();
        if (saveUserModalForm.find('[name=UserId]').prop('readonly') === true) {
            MainLoader.show();
            const userSaveUrl: string = UrlHelper.GetUsersUrl(ApiUrl.UserUpdate, userId);
            apiService.put(userSaveUrl, serializedForm)
                .done((data: any, status: string, xhr: JQueryXHR) => {
                    if (xhr.status === 200 || xhr.status === 201) {
                        Alerts.Success('User updated successfully.');
                        createEditUserModal.modal('hide');
                        loadUsers();
                    }
                })
                .always(() => MainLoader.hide());
        }
        else {
            MainLoader.show();
            const userSaveUrl: string = UrlHelper.GetUsersUrl(ApiUrl.UserCreate, userId);
            apiService.post(userSaveUrl, serializedForm)
                .done((data: any, status: string, xhr: JQueryXHR) => {
                    if (xhr.status === 200 || xhr.status === 201) {
                        Alerts.Success('User created successfully.');
                        createEditUserModal.modal('hide');
                        loadUsers();
                    }
                })
                .always(() => MainLoader.hide());
        }
    });
    if (!(UserTokenHandler.isSuperUser())) {
        $("[ap-action-user-modal-form]").remove();
    }
    /**** Create/Edit Users END ****/
});