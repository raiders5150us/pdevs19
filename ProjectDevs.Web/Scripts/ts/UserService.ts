/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="Models.ts" />
/// <reference path="ApiService.ts" />
/// <reference path="Constants.ts" />

class UserService {
    static users: IProjectUser[] = [];
    private static readonly apiService = new ApiService();

    static GetUserFromApi(pno = 1, psize = Constants.NestedAllPageSize, forceFromApi = false) {
        if (forceFromApi)
            this.users = [];
        if (this.users && this.users.length)
            return this.users;
        return this.apiService.get(ApiUrl.Users, { pno, psize })
            .done((users: IPagingModel<IProjectUser>) => {
                if (users && users.Data && users.Data.length) {
                    this.users = users.Data;
                }
            });
    }

    static loadUsersForAutocomplete(selectedUsersArray: { id: string, name: string }[] = [], multiSelectTextboxClass: string = null, selectedUl: JQuery = null, callbackOnSelect: Function = null) {
        $.when(this.GetUserFromApi())
            .done(() => {
                if (!this.users || !this.users.length) {
                    Alerts.Error('Could not load users.');
                }
                else {
                    const usersSource = this.users.map(u => {
                        return {
                            label: u.FullName,
                            value: u.FullName,
                            id: u.UserId,
                            isDeveloper: u.IsDeveloper
                        }
                    });
                    const developersSource = usersSource.filter(u => u.isDeveloper == 1 || u.isDeveloper);
                    $(".users-auto,.users-auto-devloper").each((index, element) => {
                        const txtBox = $(element);
                        let changeCalled = false;
                        let valueAtFocus: string = null;
                        if (!txtBox.data('loaded')) {
                            const source = txtBox.hasClass('users-auto-devloper') ? developersSource : usersSource;
                            const hdn = txtBox.next('.autocomplete-value-hdn');
                            txtBox.focus(function (e) {
                                valueAtFocus = txtBox.val();
                            }).autocomplete({
                                    source: source,
                                    select: (e, ui) => {
                                        if (multiSelectTextboxClass && txtBox.hasClass(multiSelectTextboxClass)) {
                                            const stk = { id: ui.item.id, name: ui.item.value };
                                            if (!selectedUsersArray.some(s => s.id == stk.id)) {
                                                let selectedIds = '';
                                                const val = hdn.val();
                                                selectedIds = (val ? `${val},` : '') + stk.id;
                                                hdn.val(selectedIds);
                                                selectedUsersArray.push(stk);

                                                const li = `<li class="m-r-5 m-b-5 d-tag" data-uid="${stk.id}">
                                                                <span class="name">${stk.name}</span>
                                                                <span class="close-btn b" title="Remove">X</span>
                                                            </li>`;
                                                if (selectedUl)
                                                    selectedUl.append(li);
                                            }
                                            setTimeout(() => txtBox.val(''), 1);
                                        }
                                        else {
                                            hdn.val(ui.item.id);
                                            valueAtFocus = txtBox.val();
                                            if (callbackOnSelect)
                                                callbackOnSelect();
                                        }
                                    },
                                    change: function (e, ui) {
                                        changeCalled = true;
                                        const value: string = txtBox.val();
                                        if (value) {
                                            if (multiSelectTextboxClass && txtBox.hasClass(multiSelectTextboxClass)) {
                                                txtBox.val('');
                                            }
                                            else if (!source.some(u => u.label.toLowerCase() === value.toLowerCase())) {
                                                txtBox.val('');
                                                hdn.val('');
                                                if (callbackOnSelect)
                                                    callbackOnSelect();
                                            }
                                        }
                                        else {
                                            txtBox.val('');
                                            hdn.val('');
                                            if (callbackOnSelect)
                                                callbackOnSelect();
                                        }
                                    }
                                })
                                .blur(function (e) {
                                    const value: string = txtBox.val();
                                    if (changeCalled)
                                        changeCalled = false;
                                    else {
                                        if (valueAtFocus !== value) {
                                            txtBox.val('');
                                            hdn.val('');
                                            if (callbackOnSelect)
                                                callbackOnSelect();
                                        }
                                    }
                                });
                        }
                        txtBox.data('loaded', true);
                    });
                }
            });
    }
}