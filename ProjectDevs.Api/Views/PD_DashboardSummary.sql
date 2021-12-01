CREATE PROC PD_DashboardSummary
AS
BEGIN
	SELECT Date = GETDATE(),
                ActiveProjects = 15,
                AverageStoriesCompletedPerSprint = 24,
                AverageTimeToCompletionPerStory = 7.5,
                IssuesReportedPerStory = 1.25,
                ProjectedHoursToActualHours = 128,
                TestScriptFirstAttemptPassRate = 77
END