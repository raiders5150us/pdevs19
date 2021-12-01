/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/jqueryui/jqueryui.d.ts" />
/// <reference path="Models.ts" />
/// <reference path="Constants.ts" />
/// <reference path="Common.ts" />
/// <reference path="UserService.ts" />
$(function () {
    var apiService = new ApiService();
    var usersTableBody = $('#users-table > tbody');
    var usersTableFooter = $('#users-table > tfoot');
    var pagingContainer = $('#users-paging-container');
    var infoContainer = $('#apdt_users_info');
    var startFromElement = infoContainer.find('.apdt_startfrom');
    var endToElement = infoContainer.find('.apdt_endto');
    var totalElement = infoContainer.find('.apdt_total');
    var isSuperUser = UserTokenHandler.getUser().IsSuperUser || false;
    if (!isSuperUser) {
        $('#users-tbl-action-col').remove();
    }
    function loadUsers(pno, psize) {
        if (pno === void 0) { pno = 1; }
        if (psize === void 0) { psize = Constants.DefaultPageSize; }
        MainLoader.show();
        apiService.get(ApiUrl.Users, { pno: pno, psize: psize })
            .done(function (users) {
            usersTableBody.empty();
            if (users && users.Data && users.Data.length) {
                usersTableFooter.show();
                users.Data.forEach(function (u) {
                    var tr = $('<tr>');
                    tr.data('user', u);
                    tr.append("<td>" + u.UserId + "</td>");
                    tr.append("<td>" + u.FirstName + "</td>");
                    tr.append("<td>" + u.LastName + "</td>");
                    var isDeveloperClass = u.IsDeveloper === 1 ? "<i class=\"fa fa-check text-success\"></i>" : "<i class=\"fa fa-times text-danger\"></i>";
                    var isActiveClass = u.IsActive === 1 ? "<i class=\"fa fa-check text-success\"></i>" : "<i class=\"fa fa-times text-danger\"></i>";
                    var isSuperUserClass = u.IsSuperUser === 1 ? "<i class=\"fa fa-check text-success\"></i>" : "<i class=\"fa fa-times text-danger\"></i>";
                    tr.append("<td class=\"text-center\">" + isDeveloperClass + "</td>");
                    tr.append("<td class=\"text-center\">" + isSuperUserClass + "</td>");
                    tr.append("<td class=\"text-center\">" + isActiveClass + "</td>");
                    if (isSuperUser) {
                        var actionColumn = "\n    <button type=\"button\" title=\"Edit details\" class=\"btn btn-xs btn-primary m-r-5\" ap-action-user-modal-form data-user-id=\"" + u.UserId + "\"><i class=\"fa fa-pencil\"></i></button>";
                        tr.append("<td class=\"text-center\">" + actionColumn + "</td>");
                    }
                    usersTableBody.append(tr);
                });
                var pageModel = {
                    CurrentPageNumber: users.CurrentPageNumber,
                    IsLastPage: users.IsLastPage,
                    PageSize: users.PageSize,
                    TotalPages: users.Count,
                };
                var pagination = Pagination.Render(pageModel);
                pagingContainer.html("" + pagination);
                var startFrom = ((users.CurrentPageNumber - 1) * users.PageSize) + 1;
                var endTo = startFrom + users.Data.length - 1;
                startFromElement.html("" + startFrom);
                endToElement.html("" + endTo);
                totalElement.html("" + users.Count);
            }
            else {
                Alerts.Info('No users found.');
                usersTableFooter.hide();
                pagingContainer.html('');
                startFromElement.html("0");
                endToElement.html("0");
                totalElement.html("0");
            }
        })
            .always(function () { return MainLoader.hide(); });
    }
    loadUsers();
    $(document).on('click', '#users-paging-container a[data-pno]', function (e) {
        var btn = $(this);
        var pNo = btn.data('pno') || 0;
        if (pNo > 0) {
            loadUsers(pNo);
        }
    });
    /**** Create/Edit Users ****/
    var createEditUserModal = $('#create-edit-user-modal');
    var saveUserModalForm = createEditUserModal.find('#users-form');
    var saveUserBtn = createEditUserModal.find('#save-user-btn');
    function openCreateUserPopup(userId, editBtn) {
        if (userId === void 0) { userId = null; }
        if (editBtn === void 0) { editBtn = null; }
        var userIdElement = createEditUserModal.find('[name=UserId]');
        userIdElement.val(userId);
        if (userId && editBtn) {
            userIdElement.prop('readonly', true);
            var user = editBtn.closest('tr').data('user');
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
        saveUserModalForm[0].reset();
        saveUserModalForm.find('input:hidden').val('');
    }
    createEditUserModal.on('hide.bs.modal', function () {
        resetStoryUserForm();
    });
    $(document).on('click', '[ap-action-user-modal-form]', function (e) {
        var btn = $(this);
        var userId = btn.data('user-id');
        openCreateUserPopup(userId, btn);
    });
    saveUserBtn.on('click', function (e) {
        var serializedForm = saveUserModalForm.serialize();
        serializedForm = serializedForm.replace('IsActive=on', 'IsActive=1');
        serializedForm = serializedForm.replace('IsDeveloper=on', 'IsDeveloper=1');
        if (serializedForm.indexOf('IsActive') == -1) {
            serializedForm += '&IsActive=0';
        }
        if (serializedForm.indexOf('IsDeveloper') == -1) {
            serializedForm += '&IsDeveloper=0';
        }
        var userId = saveUserModalForm.find('[name=UserId]').val();
        if (saveUserModalForm.find('[name=UserId]').prop('readonly') === true) {
            MainLoader.show();
            var userSaveUrl = UrlHelper.GetUsersUrl(ApiUrl.UserUpdate, userId);
            apiService.put(userSaveUrl, serializedForm)
                .done(function (data, status, xhr) {
                if (xhr.status === 200 || xhr.status === 201) {
                    Alerts.Success('User updated successfully.');
                    createEditUserModal.modal('hide');
                    loadUsers();
                }
            })
                .always(function () { return MainLoader.hide(); });
        }
        else {
            MainLoader.show();
            var userSaveUrl = UrlHelper.GetUsersUrl(ApiUrl.UserCreate, userId);
            apiService.post(userSaveUrl, serializedForm)
                .done(function (data, status, xhr) {
                if (xhr.status === 200 || xhr.status === 201) {
                    Alerts.Success('User created successfully.');
                    createEditUserModal.modal('hide');
                    loadUsers();
                }
            })
                .always(function () { return MainLoader.hide(); });
        }
    });
    if (!(UserTokenHandler.isSuperUser())) {
        $("[ap-action-user-modal-form]").remove();
    }
    /**** Create/Edit Users END ****/
});
//# sourceMappingURL=Users.js.map