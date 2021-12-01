ALTER PROCEDURE PD_GetProjectStoriesReportData
AS  
BEGIN  
 SELECT StoryId,ps.ProjectId,p.ProjectName,StoryStatus,pl1.ListItemText as StoryStatusName,F1,F2,F3,AcceptanceCriteria,RequesterID,pu.FirstName+' '+pu.LastName as RequesterName,
 ps.RequestDate,ps.StartDate,EndDate,AssignedToUserID,pu1.FirstName+' '+pu1.LastName as AssignedToName,
Environment,ps.PriorityRanking,StoryTypeId,RequesterTargetDate,GroomingCompleteDate,ProdTargetDate,StoryName,
Note= (SELECT TOP 1 pn.Note FROM ProjectNotes pn WHERE pn.ParentId = ps.StoryId AND pn.NoteTypeId = 2)
FROM ProjectStories ps
INNER JOIN ProjectLists pl
	ON ps.StoryTypeId = pl.StatusId
INNER JOIN ProjectLists pl1
	ON ps.StoryStatus = pl1.StatusId
INNER JOIN Projects p
	ON ps.ProjectId	=	p.ProjectId
INNER JOIN ProjectUsers pu
	ON ps.RequesterID = pu.UserId
LEFT JOIN ProjectUsers pu1
	ON ps.AssignedToUserID = pu1.UserId
WHERE pl.ListItemText='Production Support'
ORDER by ps.RequestDate ASC
END

