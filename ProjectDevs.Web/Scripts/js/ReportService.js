/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="Models.ts" />
/// <reference path="Constants.ts" />
/// <reference path="Common.ts" />
/// <reference path="UserService.ts" />
var ReportService = /** @class */ (function () {
    function ReportService(apiService) {
        this.apiService = apiService;
        this.templateLi = $('#report-list-table-template > tbody > tr').first();
        this.reportTable = $('#tbl_SprintCloseStoryHours_ReportTable').first();
        this.templateLi_ProductionSupport = $('#production-support-report-list-table-template > tbody > tr').first();
        this.reportTable_ProductionSupport = $('#tbl_ProductionSupport_ReportTable').first();
        this.templateLi_ProductionRelease = $('#production-release-report-list-table-template > tbody > tr').first();
        this.reportTable_ProductionRelease = $('#tbl_ProductionRelease_ReportTable').first();
        this.templateTable_TBody = null;
        this.reportContainerUl = $('#report-list');
        this.reportFilterModel = {
            teamId: "",
            reportId: null,
            sprintId: null,
            startDate: null,
            endDate: null
        };
        this.init();
        this.templateLi = $('#report-list-table-template > tbody > tr').first();
        this.reportTable = $('#tbl_SprintCloseStoryHours_ReportTable').first();
        this.templateLi_ProductionSupport = $('#production-support-report-list-table-template > tbody > tr').first();
        this.reportTable_ProductionSupport = $('#tbl_ProductionSupport_ReportTable').first();
        this.reportContainerUl = $('#report-list');
    }
    ReportService.prototype.loadReport = function (type) {
        var _this = this;
        var reportUrl = UrlHelper.GetSprintCloseStoryHoursReportDataUrl(ApiUrl.ReportData, this.reportFilterModel.reportId, this.reportFilterModel.sprintId, this.reportFilterModel.startDate, this.reportFilterModel.endDate);
        MainLoader.show();
        this.apiService.get(reportUrl)
            .done(function (data) {
            if (type == ReportTypes.SprintCloseStoryHours)
                _this.setReportsListSprintCloseStoryHours(data);
            else if (type == ReportTypes.ProductionSupport)
                _this.setReportsListProductionSupport(data);
            else if (type == ReportTypes.ProductionRelease)
                _this.setReportsListProductionRelease(data);
        })
            .always(function () { return MainLoader.hide(); });
    };
    ReportService.prototype.exportReport = function (type) {
        var reportExportUrl = UrlHelper.GetSprintCloseStoryHoursReportDataUrl(ApiUrl.ExportReportData, this.reportFilterModel.reportId, this.reportFilterModel.sprintId, this.reportFilterModel.startDate, this.reportFilterModel.endDate);
        MainLoader.show();
        this.apiService.get(reportExportUrl)
            .done(function (data) {
            if (data) {
                var reportDownloadUrl = UrlHelper.GetReportDownloadUrl(ApiUrl.DownloadReport, data.fileName);
                reportDownloadUrl = ApiUrl.BaseUrl + "/" + reportDownloadUrl;
                window.location.href = reportDownloadUrl;
            }
        })
            .always(function () { return MainLoader.hide(); });
    };
    ReportService.prototype.clearReport = function () {
        this.reportContainerUl.empty();
    };
    ReportService.prototype.setReportsListSprintCloseStoryHours = function (report) {
        var _this = this;
        this.reportContainerUl.empty();
        this.reportContainerUl.append(this.reportTable);
        this.reportContainerUl.find("table").removeClass("hidden");
        this.templateTable_TBody = this.reportContainerUl.find("table>tbody");
        this.templateTable_TBody.empty();
        if (report && report.length) {
            report.forEach(function (n) {
                var tr = _this.templateLi.clone();
                tr.find('[t-firstname]').text(n.FirstName);
                tr.find('[t-storyname]').text(n.StoryName);
                tr.find('[t-startdate]').text("" + Utils.JsonDateToStr(n.StartDate));
                tr.find('[t-enddate]').text("" + Utils.JsonDateToStr(n.EndDate));
                tr.find('[t-f1]').text(n.F1);
                tr.find('[t-f2]').text(n.F2);
                tr.find('[t-f3]').text(n.F3);
                if (n.TaskName && n.TaskName != "")
                    tr.find('[t-taskname]').text(n.TaskName);
                else
                    tr.find('[t-taskname]').text("N/A");
                tr.find('[t-projected-hours]').text(n.ProjectedHours);
                tr.find('[t-hoursworked]').text(n.HoursWorked);
                tr.find('[t-totalactualhours]').text(n.TotalActualHours);
                _this.templateTable_TBody.append(tr);
            });
        }
        else {
            var tr = this.templateLi.clone();
            tr.empty();
            tr.append("<td colspan='11' align='center'>No Data Found</td>");
            this.templateTable_TBody.append(tr);
        }
    };
    ReportService.prototype.setReportsListProductionSupport = function (report) {
        var _this = this;
        this.reportContainerUl.empty();
        this.reportContainerUl.append(this.reportTable_ProductionSupport);
        this.reportContainerUl.find("table").removeClass("hidden");
        this.templateTable_TBody = this.reportContainerUl.find("table>tbody");
        this.templateTable_TBody.empty();
        if (report && report.length) {
            report.forEach(function (n) {
                var tr = _this.templateLi_ProductionSupport.clone();
                tr.find('[t-note]').text(n.Note);
                tr.find('[t-storyid]').text(n.StoryId);
                tr.find('[t-projectname]').text(n.ProjectName);
                tr.find('[t-storyname]').text(n.StoryName);
                tr.find('[t-f1]').text(n.F1);
                tr.find('[t-f2]').text(n.F2);
                tr.find('[t-f3]').text(n.F3);
                tr.find('[t-acceptancecriteria]').text(n.AcceptanceCriteria);
                tr.find('[t-requester]').text(n.RequesterName);
                tr.find('[t-status]').text(n.StoryStatusName);
                tr.find('[t-requestdate]').text("" + Utils.JsonDateToStr(n.RequestDate));
                tr.find('[t-startdate]').text("" + Utils.JsonDateToStr(n.StartDate));
                tr.find('[t-enddate]').text("" + Utils.JsonDateToStr(n.EndDate));
                tr.find('[t-assignedto]').text(n.AssignedToName);
                tr.find('[t-environment]').text(n.Environment);
                tr.find('[t-priority]').text(n.PriorityRanking);
                tr.find('[t-requestertargetdate]').text("" + Utils.JsonDateToStr(n.RequesterTargetDate));
                tr.find('[t-groomingcompletedate]').text("" + Utils.JsonDateToStr(n.GroomingCompleteDate));
                tr.find('[t-prodtargetdate]').text("" + Utils.JsonDateToStr(n.ProdTargetDate));
                //if (n.TaskName && n.TaskName != "")
                //    tr.find('[t-taskname]').text(n.TaskName);
                //else
                //    tr.find('[t-taskname]').text("N/A");
                _this.templateTable_TBody.append(tr);
            });
        }
        else {
            var tr = this.templateLi_ProductionSupport.clone();
            tr.empty();
            tr.append("<td colspan='12' align='center'>No Data Found</td>");
            this.templateTable_TBody.append(tr);
        }
    };
    ReportService.prototype.setReportsListProductionRelease = function (report) {
        var _this = this;
        this.reportContainerUl.empty();
        this.reportContainerUl.append(this.reportTable_ProductionRelease);
        this.reportContainerUl.find("table").removeClass("hidden");
        this.templateTable_TBody = this.reportContainerUl.find("table>tbody");
        this.templateTable_TBody.empty();
        if (report && report.length) {
            report.forEach(function (n) {
                var tr = _this.templateLi_ProductionRelease.clone();
                tr.find('[t-note]').text(n.Note);
                tr.find('[t-storyid]').text(n.StoryId);
                tr.find('[t-projectname]').text(n.ProjectName);
                tr.find('[t-storyname]').text(n.StoryName);
                tr.find('[t-f1]').text(n.F1);
                tr.find('[t-f2]').text(n.F2);
                tr.find('[t-f3]').text(n.F3);
                tr.find('[t-acceptancecriteria]').text(n.AcceptanceCriteria);
                tr.find('[t-requester]').text(n.RequesterName);
                tr.find('[t-status]').text(n.StoryStatusName);
                tr.find('[t-requestdate]').text("" + Utils.JsonDateToStr(n.RequestDate));
                tr.find('[t-startdate]').text("" + Utils.JsonDateToStr(n.StartDate));
                tr.find('[t-enddate]').text("" + Utils.JsonDateToStr(n.EndDate));
                tr.find('[t-assignedto]').text(n.AssignedToName);
                tr.find('[t-environment]').text(n.Environment);
                tr.find('[t-priority]').text(n.PriorityRanking);
                tr.find('[t-requestertargetdate]').text("" + Utils.JsonDateToStr(n.RequesterTargetDate));
                tr.find('[t-groomingcompletedate]').text("" + Utils.JsonDateToStr(n.GroomingCompleteDate));
                tr.find('[t-prodtargetdate]').text("" + Utils.JsonDateToStr(n.ProdTargetDate));
                //if (n.TaskName && n.TaskName != "")
                //    tr.find('[t-taskname]').text(n.TaskName);
                //else
                //    tr.find('[t-taskname]').text("N/A");
                _this.templateTable_TBody.append(tr);
            });
        }
        else {
            var tr = this.templateLi_ProductionRelease.clone();
            tr.empty();
            tr.append("<td colspan='12' align='center'>No Data Found</td>");
            this.templateTable_TBody.append(tr);
        }
    };
    ReportService.prototype.init = function () {
    };
    return ReportService;
}());
//# sourceMappingURL=ReportService.js.map