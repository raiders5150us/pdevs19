/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="Models.ts" />
/// <reference path="ApiService.ts" />
/// <reference path="Constants.ts" />
var UserService = /** @class */ (function () {
    function UserService() {
    }
    UserService.GetUserFromApi = function (pno, psize, forceFromApi) {
        var _this = this;
        if (pno === void 0) { pno = 1; }
        if (psize === void 0) { psize = Constants.NestedAllPageSize; }
        if (forceFromApi === void 0) { forceFromApi = false; }
        if (forceFromApi)
            this.users = [];
        if (this.users && this.users.length)
            return this.users;
        return this.apiService.get(ApiUrl.Users, { pno: pno, psize: psize })
            .done(function (users) {
            if (users && users.Data && users.Data.length) {
                _this.users = users.Data;
            }
        });
    };
    UserService.loadUsersForAutocomplete = function (selectedUsersArray, multiSelectTextboxClass, selectedUl, callbackOnSelect) {
        var _this = this;
        if (selectedUsersArray === void 0) { selectedUsersArray = []; }
        if (multiSelectTextboxClass === void 0) { multiSelectTextboxClass = null; }
        if (selectedUl === void 0) { selectedUl = null; }
        if (callbackOnSelect === void 0) { callbackOnSelect = null; }
        $.when(this.GetUserFromApi())
            .done(function () {
            if (!_this.users || !_this.users.length) {
                Alerts.Error('Could not load users.');
            }
            else {
                var usersSource_1 = _this.users.map(function (u) {
                    return {
                        label: u.FullName,
                        value: u.FullName,
                        id: u.UserId,
                        isDeveloper: u.IsDeveloper
                    };
                });
                var developersSource_1 = usersSource_1.filter(function (u) { return u.isDeveloper == 1 || u.isDeveloper; });
                $(".users-auto,.users-auto-devloper").each(function (index, element) {
                    var txtBox = $(element);
                    var changeCalled = false;
                    var valueAtFocus = null;
                    if (!txtBox.data('loaded')) {
                        var source_1 = txtBox.hasClass('users-auto-devloper') ? developersSource_1 : usersSource_1;
                        var hdn_1 = txtBox.next('.autocomplete-value-hdn');
                        txtBox.focus(function (e) {
                            valueAtFocus = txtBox.val();
                        }).autocomplete({
                            source: source_1,
                            select: function (e, ui) {
                                if (multiSelectTextboxClass && txtBox.hasClass(multiSelectTextboxClass)) {
                                    var stk_1 = { id: ui.item.id, name: ui.item.value };
                                    if (!selectedUsersArray.some(function (s) { return s.id == stk_1.id; })) {
                                        var selectedIds = '';
                                        var val = hdn_1.val();
                                        selectedIds = (val ? val + "," : '') + stk_1.id;
                                        hdn_1.val(selectedIds);
                                        selectedUsersArray.push(stk_1);
                                        var li = "<li class=\"m-r-5 m-b-5 d-tag\" data-uid=\"" + stk_1.id + "\">\n                                                                <span class=\"name\">" + stk_1.name + "</span>\n                                                                <span class=\"close-btn b\" title=\"Remove\">X</span>\n                                                            </li>";
                                        if (selectedUl)
                                            selectedUl.append(li);
                                    }
                                    setTimeout(function () { return txtBox.val(''); }, 1);
                                }
                                else {
                                    hdn_1.val(ui.item.id);
                                    valueAtFocus = txtBox.val();
                                    if (callbackOnSelect)
                                        callbackOnSelect();
                                }
                            },
                            change: function (e, ui) {
                                changeCalled = true;
                                var value = txtBox.val();
                                if (value) {
                                    if (multiSelectTextboxClass && txtBox.hasClass(multiSelectTextboxClass)) {
                                        txtBox.val('');
                                    }
                                    else if (!source_1.some(function (u) { return u.label.toLowerCase() === value.toLowerCase(); })) {
                                        txtBox.val('');
                                        hdn_1.val('');
                                        if (callbackOnSelect)
                                            callbackOnSelect();
                                    }
                                }
                                else {
                                    txtBox.val('');
                                    hdn_1.val('');
                                    if (callbackOnSelect)
                                        callbackOnSelect();
                                }
                            }
                        })
                            .blur(function (e) {
                            var value = txtBox.val();
                            if (changeCalled)
                                changeCalled = false;
                            else {
                                if (valueAtFocus !== value) {
                                    txtBox.val('');
                                    hdn_1.val('');
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
    };
    UserService.users = [];
    UserService.apiService = new ApiService();
    return UserService;
}());
//# sourceMappingURL=UserService.js.map