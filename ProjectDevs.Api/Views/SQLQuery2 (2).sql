-- PD_GetProductionReleaseReportData '2021-11-01','2021-11-24'
ALTER PROCEDURE PD_GetProductionReleaseReportData(@StartDate DATETIME,@EndDate DATETIME) 
AS    
BEGIN    
	 SELECT StoryId,ps.ProjectId,p.ProjectName,StoryStatus,pl1.ListItemText as StoryStatusName,F1,F2,F3,AcceptanceCriteria,RequesterID,pu.FirstName+' '+pu.LastName as RequesterName,  
	 ps.RequestDate,ps.StartDate,EndDate,AssignedToUserID,pu1.FirstName+' '+pu1.LastName as AssignedToName,  
	Environment,ps.PriorityRanking,StoryTypeId,RequesterTargetDate,GroomingCompleteDate,ProdTargetDate,StoryName,  
	Note= (SELECT TOP 1 pn.Note FROM ProjectNotes pn WHERE pn.ParentId = ps.StoryId AND pn.NoteTypeId = 2)  
	FROM ProjectStories ps  
	LEFT JOIN ProjectLists pl  
	 ON ps.StoryTypeId = pl.StatusId  
	LEFT JOIN ProjectLists pl1  
	 ON ps.StoryStatus = pl1.StatusId  
	LEFT JOIN Projects p  
	 ON ps.ProjectId = p.ProjectId  
	LEFT JOIN ProjectUsers pu  
	 ON ps.RequesterID = pu.UserId  
	LEFT JOIN ProjectUsers pu1  
	 ON ps.AssignedToUserID = pu1.UserId  
	WHERE pl1.ListItemText='In Production' 
	AND ps.EndDate BETWEEN @StartDate AND @EndDate
	ORDER by ps.RequestDate ASC  
END  
  