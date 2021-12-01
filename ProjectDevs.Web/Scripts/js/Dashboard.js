/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="Models.ts" />
/// <reference path="Constants.ts" />
/// <reference path="Common.ts" />
$(function () {
    var apiService = new ApiService();
    var templatePlaceholders = {
        ActiveProjects: '[t-active-projects]',
        AverageStoriesCompletedPerSprint: '[t-average-story-complete-sprint]',
        AverageTimeToCompletionPerStory: '[t-average-time-completion-story]',
        ProjectedHoursToActualHours: '[t-projected-to-actual-ratio]',
        TestScriptFirstAttemptPassRate: '[t-test-script-attempt-pass-rate]',
        IssuesReportedPerStory: '[t-issue-reported-story]'
    };
    function loadSummary() {
        MainLoader.show();
        apiService.get(ApiUrl.DashboardSummary)
            .done(function (summary) {
            if (summary) {
                $(templatePlaceholders.ActiveProjects).text("" + summary.ActiveProjects);
                $(templatePlaceholders.AverageStoriesCompletedPerSprint).text("" + summary.AverageStoriesCompletedPerSprint);
                $(templatePlaceholders.AverageTimeToCompletionPerStory).text("" + summary.AverageTimeToCompletionPerStory);
                $(templatePlaceholders.ProjectedHoursToActualHours).text(summary.ProjectedHoursToActualHours + "%");
                $(templatePlaceholders.TestScriptFirstAttemptPassRate).text(summary.TestScriptFirstAttemptPassRate + "%");
                $(templatePlaceholders.IssuesReportedPerStory).text("" + summary.IssuesReportedPerStory);
            }
            else
                Alerts.Error('Could not load summary.');
        })
            .always(function () { return MainLoader.hide(); });
    }
    $(".iframe_overview").height($("body").innerHeight() - 240);
    loadSummary();
});
//# sourceMappingURL=Dashboard.js.map