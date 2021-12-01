/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="Models.ts" />
/// <reference path="ApiService.ts" />
/// <reference path="Constants.ts" />
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var MainLoader = /** @class */ (function () {
    function MainLoader() {
    }
    MainLoader.show = function () {
        this.loaderElement.css('display', 'flex');
    };
    MainLoader.hide = function () {
        this.loaderElement.hide();
    };
    MainLoader.loaderElement = $('#full-overlay');
    return MainLoader;
}());
var Pagination = /** @class */ (function () {
    function Pagination() {
    }
    Pagination.Render = function (pagingModel) {
        var PageNumber = pagingModel.CurrentPageNumber;
        var PageSize = pagingModel.PageSize;
        var TotalRecords = pagingModel.TotalPages;
        var nav = '<nav class="text-right"><ul class="pagination pagination-sm m-0">';
        var TotalPages = Math.ceil(TotalRecords / PageSize);
        if (+PageNumber > 1) {
            nav += "<li><a role=\"button\" data-pno=\"" + (PageNumber - 1) + "\"><span>Prev</span></a></li>";
        }
        else {
            nav += "<li class=\"disabled\"><span>Prev</span></li>";
        }
        if ((+PageNumber - 3) > 1) {
            nav += "<li><a role=\"button\" data-pno=\"1\"><span>1</span></a></li>";
            nav += "<li class='disabled'><span>...</span></li>";
        }
        for (var i = +PageNumber - 3; i <= +PageNumber; i++)
            if (i >= 1) {
                if (+PageNumber != i) {
                    nav += "<li><a role=\"button\" data-pno=\"" + i + "\"><span>" + i + "</span></a></li>";
                }
                else {
                    nav += "<li class=\"active\"><span>" + i + "</span></li>";
                }
            }
        for (var i = +PageNumber + 1; i <= +PageNumber + 3; i++)
            if (i <= TotalPages) {
                if (+PageNumber != i) {
                    nav += "<li><a role=\"button\" data-pno=\"" + i + "\"><span>" + i + "</span></a></li>";
                }
                else {
                    nav += "<li class=\"active\"><span>" + i + "</span></li>";
                }
            }
        if ((+PageNumber + 3) < TotalPages) {
            nav += "<li class=\"disabled\"><span>...</span></li>";
            nav += "<li><a role=\"button\" data-pno=\"" + TotalPages + "\"><span>" + TotalPages + "</span></a></li>";
        }
        if (+PageNumber < TotalPages) {
            nav += "<li><a role=\"button\" data-pno=\"" + (PageNumber + 1) + "\"><span>Next</span></a></li>";
        }
        else {
            nav += "<li class=\"disabled\"><span>Next</span></li>";
        }
        nav += '</ul></nav>';
        return nav;
    };
    return Pagination;
}());
var Utils = /** @class */ (function () {
    function Utils() {
    }
    Utils.JsonDateToStr = function (jsonDate, forInputDate, separator) {
        if (forInputDate === void 0) { forInputDate = false; }
        if (separator === void 0) { separator = '-'; }
        if (jsonDate) {
            var dt = new Date("" + jsonDate);
            var m = dt.getMonth() + 1;
            var d = dt.getDate();
            var yy = dt.getFullYear();
            var mm = m < 10 ? '0' + m : '' + m;
            var dd = d < 10 ? '0' + d : '' + d;
            if (forInputDate)
                return yy + separator + mm + separator + dd;
            else
                return mm + separator + dd + separator + yy;
        }
        return '';
    };
    Utils.JsonDateTimeToStr = function (jsonDateTime, separator) {
        if (separator === void 0) { separator = '-'; }
        var datePart = this.JsonDateToStr(jsonDateTime, false, separator);
        if (datePart) {
            var dt = new Date("" + jsonDateTime);
            var h = dt.getHours();
            var m = dt.getMinutes();
            var s = dt.getSeconds();
            var ampm = h > 12 ? "PM" : 'AM';
            h = h || 12; //00 AM Should display 12 AM
            if (h > 12)
                h = h - 12;
            var hh = h < 10 ? '0' + h : '' + h;
            var mm = m < 10 ? '0' + m : '' + m;
            var ss = s < 10 ? '0' + s : '' + s;
            var timePart = hh + ":" + mm + ":" + ss;
            return datePart + ' ' + timePart + ' ' + ampm;
        }
        return '';
    };
    Utils.setMultiSelectDdl = function (ddl, placeholder) {
        if (placeholder === void 0) { placeholder = 'Select'; }
        if (ddl) {
            ddl.prop('multiple', true);
            this.setSearchableDdl(ddl, placeholder);
        }
        else
            console.warn('setMultiSelectDdl: Dropdownlist not found', ddl, placeholder);
    };
    Utils.setSearchableDdl = function (ddl, placeholder) {
        if (placeholder === void 0) { placeholder = 'Select'; }
        if (ddl && ddl.length) {
            ddl.select2({
                placeholder: placeholder,
                width: null,
                containerCssClass: ':all:'
            });
        }
        else
            console.warn('setSearchableDdl: Dropdownlist not found', ddl, placeholder);
    };
    return Utils;
}());
var QueryStrings = /** @class */ (function () {
    function QueryStrings() {
    }
    QueryStrings.setup = function (url) {
        var _this = this;
        if (url === void 0) { url = null; }
        if (!url)
            url = window.location.search;
        var search = url.split('?');
        if (search.length == 2) {
            var qs = search[1];
            if (qs) {
                var qsParts = qs.split('&');
                qsParts.forEach(function (qsp) {
                    if (qsp) {
                        var qsv = qsp.split('=');
                        if (qsv && qsv.length) {
                            if (qsv[0]) {
                                var item = { key: qsv[0], value: undefined };
                                if (qsv.length > 1)
                                    item.value = qsv[1];
                                _this.items.push(item);
                            }
                        }
                    }
                });
            }
        }
    };
    QueryStrings.reset = function () {
        this.items = [];
    };
    QueryStrings.add = function (key, value) {
        if (!this.items.length)
            this.setup();
        this.items.push({ key: key, value: value });
    };
    QueryStrings.has = function (key, ignoreCase) {
        if (ignoreCase === void 0) { ignoreCase = true; }
        if (!key)
            return false;
        if (!this.items.length)
            this.setup();
        if (ignoreCase) {
            return this.items.some(function (q) { return q.key.toLowerCase() === key.toLowerCase(); });
        }
        else {
            return this.items.some(function (q) { return q.key === key; });
        }
    };
    QueryStrings.get = function (key, ignoreCase) {
        if (ignoreCase === void 0) { ignoreCase = true; }
        if (!key)
            return null;
        if (!this.items.length)
            this.setup();
        if (ignoreCase) {
            var filtered = this.items.filter(function (q) { return q.key.toLowerCase() === key.toLowerCase(); });
            return (filtered && filtered.length) ? filtered[0].value : null;
        }
        else {
            var filtered = this.items.filter(function (q) { return q.key === key; });
            return (filtered && filtered.length) ? filtered[0].value : null;
        }
    };
    QueryStrings.prototype.getParameterByName = function (name, url) {
        if (!url)
            url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'), results = regex.exec(url);
        if (!results)
            return null;
        if (!results[2])
            return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    };
    QueryStrings.items = [];
    return QueryStrings;
}());
var Alerts = /** @class */ (function () {
    function Alerts() {
    }
    Alerts.Success = function (message, title, callback) {
        if (title === void 0) { title = 'Alert'; }
        if (callback === void 0) { callback = null; }
        if (!this.ifCustomAlerts) {
            alert(message);
            if (callback)
                callback();
            return;
        }
        if (callback)
            this.alertCallback = callback;
        this.ShowAlert(message, title, 'success', false);
    };
    Alerts.Error = function (message, title, callback) {
        if (title === void 0) { title = 'Alert'; }
        if (callback === void 0) { callback = null; }
        if (!this.ifCustomAlerts) {
            alert(message);
            if (callback)
                callback();
            return;
        }
        if (callback)
            this.alertCallback = callback;
        this.ShowAlert(message, title, 'danger', false);
    };
    Alerts.Info = function (message, title, callback) {
        if (title === void 0) { title = 'Alert'; }
        if (callback === void 0) { callback = null; }
        if (!this.ifCustomAlerts) {
            alert(message);
            if (callback)
                callback();
            return;
        }
        if (callback)
            this.alertCallback = callback;
        this.ShowAlert(message, title, 'info', false);
    };
    Alerts.Default = function (message, title, callback) {
        if (title === void 0) { title = 'Alert'; }
        if (callback === void 0) { callback = null; }
        if (!this.ifCustomAlerts) {
            alert(message);
            if (callback)
                callback();
            return;
        }
        if (callback)
            this.alertCallback = callback;
        this.ShowAlert(message, title, 'primary', false);
    };
    Alerts.Confirm = function (message, title, okCallback, cancelCallback) {
        if (title === void 0) { title = 'Confirm'; }
        if (okCallback === void 0) { okCallback = null; }
        if (cancelCallback === void 0) { cancelCallback = null; }
        if (!this.ifCustomAlerts) {
            if (confirm(message)) {
                if (okCallback)
                    okCallback();
            }
            else {
                if (cancelCallback)
                    cancelCallback();
            }
            return;
        }
        if (okCallback)
            this.confirmOkCallback = okCallback;
        if (cancelCallback)
            this.confirmCancelCallback = cancelCallback;
        this.ShowAlert(message, title, 'warning', true);
    };
    Alerts.callAlertCallback = function () {
        if (this.alertCallback)
            this.alertCallback();
        this.clearAlerts();
    };
    Alerts.callConfirmOkCallback = function () {
        if (this.confirmOkCallback)
            this.confirmOkCallback();
        this.clearAlerts();
    };
    Alerts.callConfirmCancelCallback = function () {
        if (this.confirmCancelCallback)
            this.confirmCancelCallback();
        this.clearAlerts();
    };
    Alerts.clearAlerts = function () {
        this.alertCallback = null;
        this.confirmOkCallback = null;
        this.confirmCancelCallback = null;
        this.alertHeader.css('class', 'modal-header');
        this.alertBody.html('');
        this.alertTitle.html('Alert');
        this.confirmBody.css('class', 'modal-header');
        this.confirmBody.html('');
        this.confirmTitle.html('Confirm');
    };
    Alerts.ifCustomAlerts = function () {
        return this.alertModal && this.confirmModal;
    };
    Alerts.ShowAlert = function (messsage, title, colorClass, isConfirm) {
        if (title === void 0) { title = null; }
        if (isConfirm === void 0) { isConfirm = false; }
        if (!isConfirm) {
            this.alertBody.html(messsage);
            this.alertTitle.html(title || 'Alert');
            if (colorClass)
                this.alertHeader.addClass("modal-header-" + colorClass);
            this.alertModal.modal('show');
        }
        else {
            this.confirmBody.html(messsage);
            this.confirmTitle.html(title || 'Confirm');
            if (colorClass)
                this.confirmHeader.addClass("modal-header-" + colorClass);
            this.confirmModal.modal('show');
        }
    };
    Alerts.alertCallback = null;
    Alerts.confirmOkCallback = null;
    Alerts.confirmCancelCallback = null;
    Alerts.alertModal = null;
    Alerts.alertHeader = null;
    Alerts.alertTitle = null;
    Alerts.alertBody = null;
    Alerts.confirmModal = null;
    Alerts.confirmHeader = null;
    Alerts.confirmTitle = null;
    Alerts.confirmBody = null;
    return Alerts;
}());
var NotificationService = /** @class */ (function () {
    function NotificationService(apiService) {
        this.apiService = apiService;
        this.notificationsModal = $('#notifications-list-modal');
        this.notificationsUl = this.notificationsModal.find('#notifications-ul');
        this.pagingContainer = $('#notifications-paging-container');
        this.infoContainer = $('#apdt_notifications_info');
        this.startFromElement = this.infoContainer.find('.apdt_startfrom');
        this.endToElement = this.infoContainer.find('.apdt_endto');
        this.totalElement = this.infoContainer.find('.apdt_total');
        this.init();
    }
    NotificationService.prototype.setNotificationCount = function () {
        this.apiService.get(ApiUrl.NotificationsCount)
            .done(function (count) {
            $('[pd-notifications-counter]').text(count);
        })
            .fail(function () { return console.log('Error in getting notifications count'); });
    };
    NotificationService.prototype.loadNotifications = function (pno, psize) {
        var _this = this;
        if (pno === void 0) { pno = 1; }
        if (psize === void 0) { psize = Constants.DefaultPageSize; }
        MainLoader.show();
        this.apiService.get(ApiUrl.Notifications, { pno: pno, psize: psize })
            .done(function (ns) {
            _this.notificationsUl.empty();
            if (ns && ns.Data && ns.Data.length) {
                ns.Data.forEach(function (n) {
                    var content = '';
                    if (n.Hyperlink) {
                        content = "<a href=\"" + n.Hyperlink + "\">" + n.Text + " - [" + Utils.JsonDateToStr(n.CreatedOn) + "]</a>";
                    }
                    else
                        content = n.Text + " - [" + Utils.JsonDateToStr(n.CreatedOn) + "]";
                    _this.notificationsUl.append("<li>" + content + "</li>");
                });
                var pageModel = {
                    CurrentPageNumber: ns.CurrentPageNumber,
                    IsLastPage: ns.IsLastPage,
                    PageSize: ns.PageSize,
                    TotalPages: ns.Count,
                };
                var pagination = Pagination.Render(pageModel);
                _this.pagingContainer.html("" + pagination);
                var startFrom = ((ns.CurrentPageNumber - 1) * ns.PageSize) + 1;
                var endTo = startFrom + ns.Data.length - 1;
                _this.startFromElement.html("" + startFrom);
                _this.endToElement.html("" + endTo);
                _this.totalElement.html("" + ns.Count);
            }
            else {
                Alerts.Info('No notifications found.', 'Empty');
                _this.pagingContainer.html('');
                _this.startFromElement.html("0");
                _this.endToElement.html("0");
                _this.totalElement.html("0");
            }
        })
            .always(function () { return MainLoader.hide(); });
    };
    NotificationService.prototype.init = function () {
        var _this = this;
        $('#top-notifications-btn').click(function (e) {
            var btn = $(e.target).closest('#top-notifications-btn');
            if (!btn.data('loaded')) {
                MainLoader.show();
                _this.apiService.get(ApiUrl.Notifications, { psize: 5 })
                    .done(function (ns) {
                    if (ns && ns.Data && ns.Data.length) {
                        var notificationsList_1 = $('#top-notifications-list');
                        notificationsList_1.empty();
                        ns.Data.forEach(function (n) {
                            var content = '';
                            if (n.Hyperlink) {
                                content = "<a href=\"" + n.Hyperlink + "\">" + n.Text + " - [" + Utils.JsonDateToStr(n.CreatedOn) + "]</a>";
                            }
                            else
                                content = n.Text + " - [" + Utils.JsonDateToStr(n.CreatedOn) + "]";
                            notificationsList_1.append("<li>" + content + "</li>");
                        });
                        notificationsList_1.append('<li role="separator" class="divider"></li>');
                        notificationsList_1.append(' <li><a role="button" data-toggle="modal" data-target="#notifications-list-modal">All notifications</a></li>');
                        btn.data('loaded', true);
                        _this.setNotificationCount();
                    }
                })
                    .always(function () { return MainLoader.hide(); });
            }
        });
        this.notificationsModal.on('show.bs.modal', function (e) {
            _this.loadNotifications();
        });
        this.notificationsModal.on('hide.bs.modal', function (e) {
            _this.notificationsUl.empty();
            _this.pagingContainer.html('');
            _this.startFromElement.html("0");
            _this.endToElement.html("0");
            _this.totalElement.html("0");
        });
        $(document).on('click', '#notifications-paging-container a[data-pno]', function (e) {
            var btn = $(e.target).closest('a[data-pno]');
            var pNo = btn.data('pno') || 0;
            if (pNo > 0) {
                _this.loadNotifications(pNo);
            }
        });
    };
    return NotificationService;
}());
$(function () {
    Alerts.alertModal = $('#CustomAlertModal');
    Alerts.confirmModal = $('#CustomConfirmModal');
    var confirmOkBtn = Alerts.confirmModal.find('.okbtn');
    var confirmCancelBtn = Alerts.confirmModal.find('.cancelbtn');
    Alerts.alertHeader = Alerts.alertModal.find('.modal-header');
    Alerts.alertTitle = Alerts.alertModal.find('.modal-title');
    Alerts.alertBody = Alerts.alertModal.find('.modal-body');
    Alerts.confirmHeader = Alerts.confirmModal.find('.modal-header');
    Alerts.confirmTitle = Alerts.confirmModal.find('.modal-title');
    Alerts.confirmBody = Alerts.confirmModal.find('.modal-body');
    Alerts.alertModal.on('hide.bs.modal', function (e) {
        Alerts.callAlertCallback();
    });
    confirmOkBtn.on('click', function (e) {
        Alerts.callConfirmOkCallback();
    });
    confirmCancelBtn.on('click', function (e) {
        Alerts.callConfirmCancelCallback();
    });
    $(document).on("show.bs.modal", ".modal", function (e) {
        var zIndex = 1040 + 10 * $(".modal:visible").length;
        $(this).css("z-index", zIndex);
        setTimeout(function () {
            $(".modal-backdrop")
                .not(".modal-stack")
                .css("z-index", zIndex - 1)
                .addClass("modal-stack");
        }, 0);
    });
});
function IsLoginPage() {
    var url = location.pathname;
    return url.toLowerCase().indexOf('/login') > -1;
}
var ImageExtensions = ['png', 'jpg', 'jpeg'];
var AllowedExtensions = __spreadArrays(ImageExtensions, ['docx', 'doc', 'xlsx', 'xls', 'pdf', 'ppt', 'pptx', 'txt']);
$(function () {
    var user = UserTokenHandler.getUser();
    if (user) {
        $('[data-loggedin-username]').text(user.FullName);
        $('#pd-top-bar, #pd-body-container').show();
        MainLoader.hide();
    }
    else {
        MainLoader.hide();
        if (!IsLoginPage()) {
            Alerts.Info('Please login and continue.', 'Login Required', function () { return location.href = WebUrl.Login; });
            return false;
        }
        else {
            return false;
        }
    }
    $(document).on('click', '[pd-action-signout]', function (e) {
        e.preventDefault();
        UserTokenHandler.removeToken();
        location.href = WebUrl.Login;
    });
    var searchForm = $('#top-bar-search-form');
    var searchTxt = $('#top-bar-search-txt');
    var searchBtn = $('#top-bar-search-btn');
    function doSearch(e) {
        var term = searchTxt.val();
        if (term && term.length > 0) {
            if (term.length < 3)
                Alerts.Info('At-least 3 characters required in search term.', 'Search Term Requirement');
            else
                searchForm.submit();
        }
        return false;
    }
    searchTxt.keydown(function (e) {
        var code = e.keyCode || e.which;
        if (code === 13)
            return doSearch(e);
    });
    searchBtn.click(doSearch);
    try {
        var apiService = new ApiService();
        var notificationService = new NotificationService(apiService);
        notificationService.setNotificationCount();
    }
    catch (ex) {
        console.error('Exception in notifications', ex);
    }
    $(document).on('keydown', '[pd-val-number]', function (e) {
        var code = e.keyCode || e.which;
        if ((code >= 48 && code <= 57) || (code >= 96 && code <= 105) // Number keys
            || (code >= 37 && code <= 39) // Arrow Keys
            || code === 8 // Backspace
            || code === 9 // Tab
            || code === 36 // Home
            || code === 35 // End
        ) {
        }
        else
            return false;
    });
    $('#theme-selector').change(function (e) {
        MainLoader.show();
        var selectedTheme = $(this).val();
        document.cookie = Constants.ThemeCookieName + "=" + selectedTheme;
        setTimeout(function () { return location.reload(); }, 100);
    });
    $.fn.select2.defaults.set("theme", "bootstrap");
    $(document).on('change', 'input[data-preview]', function () {
        var inputJq = $(this);
        var previewElement = $(inputJq.data('preview'));
        var nameElement = $(inputJq.data('file-name-target'));
        var selectedFileName = inputJq.val().split('\\').pop();
        var nameParts = selectedFileName.split('.');
        var extension = nameParts.pop();
        var fileNameWithoutExtension = nameParts;
        if (!AllowedExtensions.some(function (ext) { return ext.toLowerCase() === extension.toLowerCase(); })) {
            Alerts.Error("This file type is not allowed. <br />Allowed file types are: " + AllowedExtensions.join(', '), 'FIle Extension Error');
            inputJq.val('');
            return false;
        }
        if (nameElement) {
            if (!nameElement.val()) {
                nameElement.val(fileNameWithoutExtension);
            }
        }
        if (previewElement) {
            if (ImageExtensions.some(function (ex) { return ex.toLowerCase() === extension.toLowerCase(); })) {
                var input = this;
                if (input.files && input.files[0]) {
                    var file = input.files[0];
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        var fileResult = e.target.result;
                        previewElement.attr('src', "" + fileResult).removeClass('hidden');
                    };
                    reader.readAsDataURL(file);
                }
            }
            else {
                previewElement.removeAttr('src').addClass('hidden');
            }
        }
    });
});
//# sourceMappingURL=Common.js.map