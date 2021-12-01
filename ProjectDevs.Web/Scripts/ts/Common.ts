/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="Models.ts" />
/// <reference path="ApiService.ts" />
/// <reference path="Constants.ts" />

class MainLoader {
    static readonly loaderElement = $('#full-overlay');
    static show() {
        this.loaderElement.css('display', 'flex');
    }
    static hide() {
        this.loaderElement.hide();
    }
}

class Pagination {
    static Render(pagingModel: IPaginationModel): string {
        const PageNumber = pagingModel.CurrentPageNumber;
        const PageSize = pagingModel.PageSize;
        const TotalRecords = pagingModel.TotalPages;

        var nav = '<nav class="text-right"><ul class="pagination pagination-sm m-0">';

        var TotalPages = Math.ceil(TotalRecords / PageSize);
        if (+PageNumber > 1) {
            nav += `<li><a role="button" data-pno="${PageNumber - 1}"><span>Prev</span></a></li>`;
        }
        else {
            nav += `<li class="disabled"><span>Prev</span></li>`;
        }
        if ((+PageNumber - 3) > 1) {
            nav += `<li><a role="button" data-pno="1"><span>1</span></a></li>`;
            nav += `<li class='disabled'><span>...</span></li>`;
        }
        for (var i = +PageNumber - 3; i <= +PageNumber; i++)
            if (i >= 1) {
                if (+PageNumber != i) {
                    nav += `<li><a role="button" data-pno="${i}"><span>${i}</span></a></li>`;
                }
                else {
                    nav += `<li class="active"><span>${i}</span></li>`;
                }
            }
        for (var i = +PageNumber + 1; i <= +PageNumber + 3; i++)
            if (i <= TotalPages) {
                if (+PageNumber != i) {
                    nav += `<li><a role="button" data-pno="${i}"><span>${i}</span></a></li>`;
                }
                else {
                    nav += `<li class="active"><span>${i}</span></li>`;
                }
            }
        if ((+PageNumber + 3) < TotalPages) {
            nav += `<li class="disabled"><span>...</span></li>`;
            nav += `<li><a role="button" data-pno="${TotalPages}"><span>${TotalPages}</span></a></li>`;
        }
        if (+PageNumber < TotalPages) {
            nav += `<li><a role="button" data-pno="${PageNumber + 1}"><span>Next</span></a></li>`;
        }
        else {
            nav += `<li class="disabled"><span>Next</span></li>`;
        }

        nav += '</ul></nav>';
        return nav;
    }
}

class Utils {
    static JsonDateToStr(jsonDate: Date, forInputDate = false, separator = '-', ): string {
        if (jsonDate) {
            const dt = new Date(`${jsonDate}`);
            let m = dt.getMonth() + 1;
            let d = dt.getDate();
            let yy = dt.getFullYear();
            const mm = m < 10 ? '0' + m : '' + m;
            const dd = d < 10 ? '0' + d : '' + d;

            if (forInputDate)
                return yy + separator + mm + separator + dd;
            else
                return mm + separator + dd + separator + yy;
        }
        return '';
    }
    static JsonDateTimeToStr(jsonDateTime: Date, separator = '-'): string {
        const datePart = this.JsonDateToStr(jsonDateTime, false, separator);
        if (datePart) {
            const dt = new Date(`${jsonDateTime}`);
            let h = dt.getHours();
            const m = dt.getMinutes();
            const s = dt.getSeconds();
            const ampm = h > 12 ? "PM" : 'AM';
            h = h || 12;    //00 AM Should display 12 AM
            if (h > 12)
                h = h - 12;
            const hh = h < 10 ? '0' + h : '' + h;
            const mm = m < 10 ? '0' + m : '' + m;
            const ss = s < 10 ? '0' + s : '' + s;

            const timePart = `${hh}:${mm}:${ss}`;
            return datePart + ' ' + timePart + ' ' + ampm;
        }
        return '';
    }

    static setMultiSelectDdl(ddl: JQuery, placeholder = 'Select') {
        if (ddl) {
            ddl.prop('multiple', true);
            this.setSearchableDdl(ddl, placeholder);
        }
        else
            console.warn('setMultiSelectDdl: Dropdownlist not found', ddl, placeholder);
    }
    static setSearchableDdl(ddl: JQuery, placeholder = 'Select') {
        if (ddl && ddl.length) {
            ddl.select2({
                placeholder: placeholder,
                width: null,
                containerCssClass: ':all:'
            });
        }
        else
            console.warn('setSearchableDdl: Dropdownlist not found', ddl, placeholder);
    }
}

class QueryStrings {
    static items: { key: string, value: string | number | boolean | undefined | null }[] = [];
    static setup(url: string = null) {
        if (!url)
            url = window.location.search;
        const search = url.split('?');
        if (search.length == 2) {
            const qs = search[1];
            if (qs) {
                const qsParts = qs.split('&');
                qsParts.forEach(qsp => {
                    if (qsp) {
                        const qsv = qsp.split('=');
                        if (qsv && qsv.length) {
                            if (qsv[0]) {
                                const item = { key: qsv[0], value: undefined };
                                if (qsv.length > 1)
                                    item.value = qsv[1];
                                this.items.push(item);
                            }
                        }
                    }
                });
            }
        }
        
    }
    static reset() {
        this.items = [];
    }
    static add(key: string, value: string | number | boolean | undefined | null) {
        if (!this.items.length)
            this.setup();
        this.items.push({ key, value });
    }
    static has(key: string, ignoreCase = true) {
        if (!key)
            return false;
        if (!this.items.length)
            this.setup();
        if (ignoreCase) {
            return this.items.some(q => q.key.toLowerCase() === key.toLowerCase());
        }
        else {
            return this.items.some(q => q.key === key);
        }
    }
    static get(key: string, ignoreCase = true) {
        if (!key)
            return null;
        if (!this.items.length)
            this.setup();
        if (ignoreCase) {
            const filtered = this.items.filter(q => q.key.toLowerCase() === key.toLowerCase());
            return (filtered && filtered.length) ? filtered[0].value : null;
        }
        else {
            const filtered = this.items.filter(q => q.key === key);
            return (filtered && filtered.length) ? filtered[0].value : null;
        }
    }
    getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
}

class Alerts {
    private static alertCallback: Function = null;
    private static confirmOkCallback: Function = null;
    private static confirmCancelCallback: Function = null;

    static alertModal: JQuery = null;
    static alertHeader: JQuery = null;
    static alertTitle: JQuery = null;
    static alertBody: JQuery = null;

    static confirmModal: JQuery = null;
    static confirmHeader: JQuery = null;
    static confirmTitle: JQuery = null;
    static confirmBody: JQuery = null;

    static Success(message: string, title: string = 'Alert', callback: Function = null) {
        if (!this.ifCustomAlerts) {
            alert(message);
            if (callback)
                callback();
            return;
        }
        if (callback)
            this.alertCallback = callback;
        this.ShowAlert(message, title, 'success', false);
    }
    static Error(message: string, title: string = 'Alert', callback: Function = null) {
        if (!this.ifCustomAlerts) {
            alert(message);
            if (callback)
                callback();
            return;
        }
        if (callback)
            this.alertCallback = callback;
        this.ShowAlert(message, title, 'danger', false);
    }
    static Info(message: string, title: string = 'Alert', callback: Function = null) {
        if (!this.ifCustomAlerts) {
            alert(message);
            if (callback)
                callback();
            return;
        }
        if (callback)
            this.alertCallback = callback;
        this.ShowAlert(message, title, 'info', false);
    }
    static Default(message: string, title: string = 'Alert', callback: Function = null) {
        if (!this.ifCustomAlerts) {
            alert(message);
            if (callback)
                callback();
            return;
        }
        if (callback)
            this.alertCallback = callback;
        this.ShowAlert(message, title, 'primary', false);
    }
    static Confirm(message: string, title: string = 'Confirm', okCallback: Function = null, cancelCallback: Function = null) {        
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
    }

    static callAlertCallback() {
        if (this.alertCallback)
            this.alertCallback();
        this.clearAlerts();
    }
    static callConfirmOkCallback() {
        if (this.confirmOkCallback)
            this.confirmOkCallback();
        this.clearAlerts();
    }
    static callConfirmCancelCallback() {
        if (this.confirmCancelCallback)
            this.confirmCancelCallback();
        this.clearAlerts();
    }

    private static clearAlerts() {
        this.alertCallback = null;
        this.confirmOkCallback = null;
        this.confirmCancelCallback = null;

        this.alertHeader.css('class', 'modal-header');
        this.alertBody.html('');
        this.alertTitle.html('Alert');

        this.confirmBody.css('class', 'modal-header');
        this.confirmBody.html('');
        this.confirmTitle.html('Confirm');
    }

    private static ifCustomAlerts() {
        return this.alertModal && this.confirmModal;
    }

    private static ShowAlert(messsage: string, title: string = null, colorClass: string, isConfirm = false) {
        if (!isConfirm) {
            this.alertBody.html(messsage);
            this.alertTitle.html(title || 'Alert');
            if (colorClass)
                this.alertHeader.addClass(`modal-header-${colorClass}`);
            this.alertModal.modal('show');
        }
        else {
            this.confirmBody.html(messsage);
            this.confirmTitle.html(title || 'Confirm');
            if (colorClass)
                this.confirmHeader.addClass(`modal-header-${colorClass}`);
            this.confirmModal.modal('show');
        }
    }
}

class NotificationService {
    notificationsModal = $('#notifications-list-modal');

    private notificationsUl = this.notificationsModal.find('#notifications-ul');
    private pagingContainer = $('#notifications-paging-container');
    private infoContainer = $('#apdt_notifications_info');
    private startFromElement = this.infoContainer.find('.apdt_startfrom');
    private endToElement = this.infoContainer.find('.apdt_endto');
    private totalElement = this.infoContainer.find('.apdt_total');

    constructor(private apiService: ApiService) {
        this.init();
    }
    setNotificationCount() {
        this.apiService.get(ApiUrl.NotificationsCount)
            .done((count: number) => {
                $('[pd-notifications-counter]').text(count);
            })
            .fail(() => console.log('Error in getting notifications count'));
    }
    loadNotifications(pno = 1, psize = Constants.DefaultPageSize) {
        MainLoader.show();
        this.apiService.get(ApiUrl.Notifications, { pno, psize })
            .done((ns: IPagingModel<INotification>) => {
                this.notificationsUl.empty();
                if (ns && ns.Data && ns.Data.length) {
                    ns.Data.forEach(n => {
                        let content = '';
                        if (n.Hyperlink) {
                            content = `<a href="${n.Hyperlink}">${n.Text} - [${Utils.JsonDateToStr(n.CreatedOn)}]</a>`;
                        }
                        else
                            content = `${n.Text} - [${Utils.JsonDateToStr(n.CreatedOn)}]`;
                        this.notificationsUl.append(`<li>${content}</li>`)
                    });
                    const pageModel: IPaginationModel = {
                        CurrentPageNumber: ns.CurrentPageNumber,
                        IsLastPage: ns.IsLastPage,
                        PageSize: ns.PageSize,
                        TotalPages: ns.Count,
                    };
                    const pagination = Pagination.Render(pageModel);
                    this.pagingContainer.html(`${pagination}`);

                    const startFrom = ((ns.CurrentPageNumber - 1) * ns.PageSize) + 1;
                    const endTo = startFrom + ns.Data.length - 1;

                    this.startFromElement.html(`${startFrom}`);
                    this.endToElement.html(`${endTo}`);
                    this.totalElement.html(`${ns.Count}`);
                }
                else {
                    Alerts.Info('No notifications found.', 'Empty');
                    this.pagingContainer.html('');

                    this.startFromElement.html(`0`);
                    this.endToElement.html(`0`);
                    this.totalElement.html(`0`);
                }
            })
            .always(() => MainLoader.hide());
    }
    init() {
        $('#top-notifications-btn').click(e => {
            const btn = $(e.target).closest('#top-notifications-btn');
            if (!btn.data('loaded')) {
                MainLoader.show();
                this.apiService.get(ApiUrl.Notifications, { psize: 5 })
                    .done((ns: IPagingModel<INotification>) => {
                        if (ns && ns.Data && ns.Data.length) {
                            const notificationsList = $('#top-notifications-list');
                            notificationsList.empty();
                            ns.Data.forEach(n => {
                                let content = '';
                                if (n.Hyperlink) {
                                    content = `<a href="${n.Hyperlink}">${n.Text} - [${Utils.JsonDateToStr(n.CreatedOn)}]</a>`;
                                }
                                else
                                    content = `${n.Text} - [${Utils.JsonDateToStr(n.CreatedOn)}]`;
                                notificationsList.append(`<li>${content}</li>`)
                            });
                            notificationsList.append('<li role="separator" class="divider"></li>');
                            notificationsList.append(' <li><a role="button" data-toggle="modal" data-target="#notifications-list-modal">All notifications</a></li>');
                            btn.data('loaded', true);
                            this.setNotificationCount();
                        }
                    })
                    .always(() => MainLoader.hide());
            }
        });

        this.notificationsModal.on('show.bs.modal', e => {
            this.loadNotifications();
        });
        this.notificationsModal.on('hide.bs.modal', e => {
            this.notificationsUl.empty();
            this.pagingContainer.html('');

            this.startFromElement.html(`0`);
            this.endToElement.html(`0`);
            this.totalElement.html(`0`);

        });
        $(document).on('click', '#notifications-paging-container a[data-pno]', (e) => {
            const btn = $(e.target).closest('a[data-pno]');
            const pNo: number = btn.data('pno') || 0;
            if (pNo > 0) {
                this.loadNotifications(pNo);
            }
        });
    }
}

$(function () {
    Alerts.alertModal = $('#CustomAlertModal');
    Alerts.confirmModal = $('#CustomConfirmModal');

    const confirmOkBtn = Alerts.confirmModal.find('.okbtn');
    const confirmCancelBtn = Alerts.confirmModal.find('.cancelbtn');

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
})

function IsLoginPage(): boolean {
    const url = location.pathname;
    return url.toLowerCase().indexOf('/login') > -1;
}

const ImageExtensions = ['png', 'jpg', 'jpeg'];
const AllowedExtensions = [...ImageExtensions, 'docx', 'doc', 'xlsx', 'xls', 'pdf', 'ppt', 'pptx', 'txt']

$(function () {
    const user: IProjectUser = UserTokenHandler.getUser();

    if (user) {
        $('[data-loggedin-username]').text(user.FullName);
        $('#pd-top-bar, #pd-body-container').show();
        MainLoader.hide();
    }
    else {
        MainLoader.hide();
        if (!IsLoginPage()) {
            Alerts.Info('Please login and continue.', 'Login Required', () => location.href = WebUrl.Login);
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

    const searchForm = $('#top-bar-search-form');
    const searchTxt = $('#top-bar-search-txt');
    const searchBtn = $('#top-bar-search-btn');

    function doSearch(e) {
        const term: string = searchTxt.val();
        if (term && term.length > 0) {
            if (term.length < 3)
                Alerts.Info('At-least 3 characters required in search term.', 'Search Term Requirement');
            else
                searchForm.submit();
        }
        return false
    }
    searchTxt.keydown(function (e) {
        const code = e.keyCode || e.which;
        if (code === 13)
            return doSearch(e);
    });
    searchBtn.click(doSearch);

    try {
        const apiService = new ApiService();
        const notificationService = new NotificationService(apiService);
        notificationService.setNotificationCount();
    }
    catch (ex) {
        console.error('Exception in notifications', ex);
    }

    $(document).on('keydown', '[pd-val-number]', function (e) {
        const code = e.keyCode || e.which;
       
        if ((code >= 48 && code <= 57) || (code >= 96 && code <= 105)   // Number keys
            || (code >= 37 && code <= 39)    // Arrow Keys
            || code === 8   // Backspace
            || code === 9  // Tab
            || code === 36  // Home
            || code === 35  // End
        ) {

        }
        else
            return false;
    });

    $('#theme-selector').change(function (e) {
        MainLoader.show();
        const selectedTheme = $(this).val();
        document.cookie = `${Constants.ThemeCookieName}=${selectedTheme}`;
        setTimeout(() => location.reload(), 100);
    });

    $.fn.select2.defaults.set("theme", "bootstrap");
    $(document).on('change', 'input[data-preview]', function () {
        const inputJq = $(this);
        const previewElement = $(inputJq.data('preview'));
        const nameElement = $(inputJq.data('file-name-target'));
        const selectedFileName = (inputJq.val() as string).split('\\').pop();
        const nameParts = selectedFileName.split('.');
        const extension = nameParts.pop();
        const fileNameWithoutExtension = nameParts;

        if (!AllowedExtensions.some(ext => ext.toLowerCase() === extension.toLowerCase())) {
            Alerts.Error(`This file type is not allowed. <br />Allowed file types are: ${AllowedExtensions.join(', ')}`, 'FIle Extension Error');
            inputJq.val('');
            return false;
        }

        if (nameElement) {
            if (!nameElement.val()) {
                nameElement.val(fileNameWithoutExtension);
            }
        }
        if (previewElement) {
            if (ImageExtensions.some(ex => ex.toLowerCase() === extension.toLowerCase())) {
                const input = this;
                if (input.files && input.files[0]) {
                    const file = input.files[0];
                    const reader = new FileReader();
                    reader.onload = function (e: ProgressEvent<FileReader>) {
                        const fileResult = e.target.result;
                        previewElement.attr('src', `${fileResult}`).removeClass('hidden');
                    }
                    reader.readAsDataURL(file);
                }
            }
            else {
                previewElement.removeAttr('src').addClass('hidden');
            }
        }
    });
});
