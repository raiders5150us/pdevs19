/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/jqueryui/jqueryui.d.ts" />
/// <reference path="Models.ts" />
/// <reference path="Constants.ts" />
/// <reference path="Common.ts" />
var ApiLogService = /** @class */ (function () {
    function ApiLogService(apiService) {
        this.apiService = apiService;
        this.apiLogsTableBody = $('#apiLogs-table > tbody');
        this.apiLogsTableFooter = $('#apiLogs-table > tfoot');
        this.pagingContainer = $('#apiLogs-paging-container');
        this.infoContainer = $('#apdt_apiLogs_info');
        this.startFromElement = this.infoContainer.find('.apdt_startfrom');
        this.endToElement = this.infoContainer.find('.apdt_endto');
        this.totalElement = this.infoContainer.find('.apdt_total');
        this.apiLogModal = $('#api-log-details-modal');
        this.init();
    }
    ApiLogService.prototype.loadApiLogs = function (pno, psize) {
        var _this = this;
        if (pno === void 0) { pno = 1; }
        if (psize === void 0) { psize = 20; }
        MainLoader.show();
        this.apiService.get(ApiUrl.Logs, { pno: pno, psize: psize })
            .done(function (apiLogs) {
            _this.apiLogsTableBody.empty();
            if (apiLogs.Data && apiLogs.Data.length) {
                _this.apiLogsTableFooter.show();
                apiLogs.Data.forEach(function (p) {
                    var tr = $('<tr>');
                    tr.data('stack-trace', p.StackTrace);
                    tr.data('inner-exception', p.InnerException);
                    tr.append("<td class=\"text-center\">" + Utils.JsonDateTimeToStr(p.LoggedOnDate) + "</td>");
                    tr.append("<td>" + p.Level + "</td>");
                    var msg = p.StackTrace
                        ? "<a role=\"button\" data-toggle=\"modal\" data-target=\"#api-log-details-modal\" title=\"View details\"><u>" + p.Message + "</u></a>"
                        : p.Message;
                    tr.append("<td>" + msg + "</td>");
                    tr.append("<td>" + p.Type + "</td>");
                    tr.append("<td>" + p.AdditionalInfo + "</td>");
                    tr.append("<td>" + p.CallSite + "</td>");
                    var actionColumn = p.StackTrace
                        ? "<button type=\"button\" title=\"View details\" class=\"btn btn-xs btn-primary\" data-toggle=\"modal\" data-target=\"#api-log-details-modal\"><i class=\"fa fa-file-text-o\"></i></button>"
                        : '';
                    tr.append("<td class=\"text-center\">" + actionColumn + "</td>");
                    _this.apiLogsTableBody.append(tr);
                });
                var pageModel = {
                    CurrentPageNumber: apiLogs.CurrentPageNumber,
                    IsLastPage: apiLogs.IsLastPage,
                    PageSize: apiLogs.PageSize,
                    TotalPages: apiLogs.Count,
                };
                var pagination = Pagination.Render(pageModel);
                _this.pagingContainer.html("" + pagination);
                var startFrom = ((apiLogs.CurrentPageNumber - 1) * apiLogs.PageSize) + 1;
                var endTo = startFrom + apiLogs.Data.length - 1;
                _this.startFromElement.html("" + startFrom);
                _this.endToElement.html("" + endTo);
                _this.totalElement.html("" + apiLogs.Count);
            }
            else {
                //Alerts.Info('No Logs found.');
                _this.apiLogsTableFooter.hide();
                _this.pagingContainer.html('');
                _this.startFromElement.html("0");
                _this.endToElement.html("0");
                _this.totalElement.html("0");
            }
        })
            .always(function () { return MainLoader.hide(); });
    };
    ApiLogService.prototype.init = function () {
        var _this = this;
        $(document).on('click', '#apiLogs-paging-container a[data-pno]', function (e) {
            var btn = $(e.target).closest('a[data-pno]');
            var pNo = btn.data('pno') || 0;
            if (pNo > 0) {
                _this.loadApiLogs(pNo);
            }
        });
        this.apiLogModal.on('show.bs.modal', function (e) {
            var btn = $(e.relatedTarget).closest('[data-toggle="modal"]');
            var row = btn.closest('tr');
            var stackTrace = row.data('stack-trace');
            var innerException = row.data('inner-exception');
            $('#log-stack-trace').html(stackTrace);
            $('#log-inner-exception').html(innerException);
        });
        this.apiLogModal.on('hide.bs.modal', function (e) {
            $('#log-stack-trace').empty();
            $('#log-inner-exception').empty();
        });
    };
    return ApiLogService;
}());
$(function () {
    var u = UserTokenHandler.getUser();
    if (u && u.UserId) {
        if (u.IsDeveloper === 1) {
            new ApiLogService(new ApiService()).loadApiLogs();
        }
        else {
            Alerts.Error('You are not authorized to visit this page', 'Access Denied', function () { return location.href = WebUrl.Projects; });
            return false;
        }
    }
});
//# sourceMappingURL=ApiLogs.js.map