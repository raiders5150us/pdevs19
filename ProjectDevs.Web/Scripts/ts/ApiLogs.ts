/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/jqueryui/jqueryui.d.ts" />
/// <reference path="Models.ts" />
/// <reference path="Constants.ts" />
/// <reference path="Common.ts" />

class ApiLogService {
    apiLogsTableBody = $('#apiLogs-table > tbody');
    apiLogsTableFooter = $('#apiLogs-table > tfoot');

    pagingContainer = $('#apiLogs-paging-container');
    infoContainer = $('#apdt_apiLogs_info');
    startFromElement = this.infoContainer.find('.apdt_startfrom');
    endToElement = this.infoContainer.find('.apdt_endto');
    totalElement = this.infoContainer.find('.apdt_total');

    apiLogModal = $('#api-log-details-modal');

    constructor(private apiService: ApiService) {
        this.init();
    }

    loadApiLogs(pno = 1, psize = 20) {
        MainLoader.show();
        this.apiService.get(ApiUrl.Logs, { pno, psize })
            .done((apiLogs: IPagingModel<IApiLog>) => {
                this.apiLogsTableBody.empty();
                if (apiLogs.Data && apiLogs.Data.length) {
                    this.apiLogsTableFooter.show();
                    apiLogs.Data.forEach(p => {
                        const tr = $('<tr>');

                        tr.data('stack-trace', p.StackTrace);
                        tr.data('inner-exception', p.InnerException);

                        tr.append(`<td class="text-center">${Utils.JsonDateTimeToStr(p.LoggedOnDate)}</td>`);
                        tr.append(`<td>${p.Level}</td>`);
                        const msg = p.StackTrace
                            ? `<a role="button" data-toggle="modal" data-target="#api-log-details-modal" title="View details"><u>${p.Message}</u></a>`
                            : p.Message;
                        tr.append(`<td>${msg}</td>`);
                        tr.append(`<td>${p.Type}</td>`);
                        tr.append(`<td>${p.AdditionalInfo}</td>`);
                        tr.append(`<td>${p.CallSite}</td>`);

                        const actionColumn = p.StackTrace
                            ? `<button type="button" title="View details" class="btn btn-xs btn-primary" data-toggle="modal" data-target="#api-log-details-modal"><i class="fa fa-file-text-o"></i></button>`
                            : '';

                        tr.append(`<td class="text-center">${actionColumn}</td>`);

                        this.apiLogsTableBody.append(tr);
                    });
                    const pageModel: IPaginationModel = {
                        CurrentPageNumber: apiLogs.CurrentPageNumber,
                        IsLastPage: apiLogs.IsLastPage,
                        PageSize: apiLogs.PageSize,
                        TotalPages: apiLogs.Count,
                    };
                    const pagination = Pagination.Render(pageModel);
                    this.pagingContainer.html(`${pagination}`);

                    const startFrom = ((apiLogs.CurrentPageNumber - 1) * apiLogs.PageSize) + 1;
                    const endTo = startFrom + apiLogs.Data.length - 1;

                    this.startFromElement.html(`${startFrom}`);
                    this.endToElement.html(`${endTo}`);
                    this.totalElement.html(`${apiLogs.Count}`);
                }
                else {
                    //Alerts.Info('No Logs found.');
                    this.apiLogsTableFooter.hide();

                    this.pagingContainer.html('');

                    this.startFromElement.html(`0`);
                    this.endToElement.html(`0`);
                    this.totalElement.html(`0`);
                }
            })
            .always(() => MainLoader.hide());
    }
    private init() {
        $(document).on('click', '#apiLogs-paging-container a[data-pno]', e => {
            const btn = $(e.target).closest('a[data-pno]');
            const pNo: number = btn.data('pno') || 0;
            if (pNo > 0) {
                this.loadApiLogs(pNo);
            }
        });
        this.apiLogModal.on('show.bs.modal', e => {
            const btn = $(e.relatedTarget).closest('[data-toggle="modal"]');
            const row = btn.closest('tr');
            const stackTrace = row.data('stack-trace');
            const innerException = row.data('inner-exception');

            $('#log-stack-trace').html(stackTrace);
            $('#log-inner-exception').html(innerException);
        });
        this.apiLogModal.on('hide.bs.modal', e => {
            $('#log-stack-trace').empty();
            $('#log-inner-exception').empty();
        });
    }
}

$(function () {
    const u = UserTokenHandler.getUser();
    if (u && u.UserId) {
        if (u.IsDeveloper === 1) {
            new ApiLogService(new ApiService()).loadApiLogs();
        }
        else {
            Alerts.Error('You are not authorized to visit this page', 'Access Denied', () => location.href = WebUrl.Projects);
            return false;
        }
    }
});