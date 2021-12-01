/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/jqueryui/jqueryui.d.ts" />
/// <reference path="Models.ts" />
/// <reference path="Constants.ts" />
/// <reference path="Common.ts" />
/// <reference path="UserService.ts" />

$(function () {
    const apiService = new ApiService();
    const ddlService = new DdlService(apiService);
    const reportService = new ReportService(apiService);

    const cookieUtils = new CookieUtils(apiService);
    const selectedTeams = cookieUtils.getCookie(Constants.TeamSelectionCookieName);

    ddlService.setReportTypeDdl();

    ddlService.setTeamsDdl(false, function () {
        if (selectedTeams)
            ddlService.setSprintsDdl(false, false, null, selectedTeams);
    }, selectedTeams);

    $('#filter-team-id').select2({
        placeholder: 'Select',
        width: null,
        containerCssClass: ':all:'
    });
    $(document).on('change', '#filter-team-id', function (e) {
        let teamId: string = "0";

        if ($('#filter-team-id').select2('data')) {
            teamId = $('#filter-team-id').select2('data').map(a => a.id).toString();
            cookieUtils.setCookie(Constants.TeamSelectionCookieName, teamId);

            $("#filter-sprint-id").empty();
            reportService.clearReport();
            setTimeout(() => {
                if (teamId) {
                    ddlService.setSprintsDdl(false, false, () => {
                        $("#filter-sprint-id option:first").removeAttr("disabled");
                        $("#filter-sprint-id").val("0");
                    }, teamId);
                }
            }, 200);
        }

        reportService.reportFilterModel.teamId = teamId;
    });

    $(document).on('change', '#filter-report-type-id', function (e) {
        reportService.reportFilterModel.reportId = $('#filter-report-type-id option:selected').val();
        const selectedText = $('#filter-report-type-id option:selected').text() || "";
        $("#filter-sprint-id").val("");
        if (selectedText == "Sprint Close Story Hours") {
            $("#dvSprintDdl").show();
        }
        else {
            $("#dvSprintDdl").hide();
        }

        if (selectedText == "Production Release") {
            $("#dvStartDate").show();
            $("#dvEndDate").show();
        }
        else {
            $("#dvStartDate").hide();
            $("#dvEndDate").hide();
        }
        CheckButtonVisibility();
    });
    $(document).on('change', '#filter-sprint-id', function (e) {
        reportService.reportFilterModel.sprintId = $('#filter-sprint-id').val();
        CheckButtonVisibility();
    });
    $(document).on('click', '[report-list-ap-action-button]', function (e) {

        const selectedText = $('#filter-report-type-id option:selected').text() || "";
        if (selectedText == "Production Support") {
            reportService.loadReport(ReportTypes.ProductionSupport);
        }
        else if (selectedText == "Production Release") {
            reportService.loadReport(ReportTypes.ProductionRelease);
        }
        else if (selectedText == "Sprint Close Story Hours") {
            reportService.loadReport(ReportTypes.SprintCloseStoryHours);
        }
    });
    $(document).on('click', '[report-list-ap-export-button]', function (e) {
        reportService.exportReport(ReportTypes.SprintCloseStoryHours);
    });

    $(document).on('change', '#start-date', function (e) {
        reportService.reportFilterModel.startDate = $("#start-date").val();
        CheckButtonVisibility();
    });
    $(document).on('change', '#end-date', function (e) {
        reportService.reportFilterModel.endDate = $("#end-date").val();
        CheckButtonVisibility();
    });
    function CheckButtonVisibility() {
        const selectedText = $('#filter-report-type-id option:selected').text() || "";
        if (selectedText == undefined || selectedText == "") {
            $("[report-list-ap-action-button]").hide();
            $("[report-list-ap-export-button]").hide();
        }
        else {
            if (selectedText == "Production Release") {
                if ($("#start-date").val() != null && $("#start-date").val() != "" && $("#end-date").val() != "" && $("#end-date").val() != null) {
                    $("[report-list-ap-action-button]").show();
                    $("[report-list-ap-export-button]").show();
                }
            }
            else if (selectedText == "Production Support") {
                $("[report-list-ap-action-button]").show();
                $("[report-list-ap-export-button]").show();
            }
            else if ($('#filter-report-type-id').val() != "0" && ($("#filter-sprint-id").is(":visible") && $("#filter-sprint-id").val() != null)) {
                $("[report-list-ap-action-button]").show();
                $("[report-list-ap-export-button]").show();
            }
            else {
                $("[report-list-ap-action-button]").hide();
                $("[report-list-ap-export-button]").hide();
            }
        }

    }

});