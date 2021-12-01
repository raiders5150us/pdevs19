ALTER PROCEDURE [dbo].[PD_SelectProjectStoryTasks]      
(      
 @TaskId int=null,      
 @StoryId int=null,      
 @AssignedToUserID varchar(10),    
 @TeamId VARCHAR(1000) = null    
)      
AS      
BEGIN      
 SELECT TaskId,t.StoryId,TaskStatus,TaskName,TaskDescription,TaskType,t.AssignedToUserID,ProjectedHours,ActualHours,
 TicketNumber,Changeset,s.ProjectId,t.HoursWorked,LOB      
 FROM dbo.ProjectStoryTasks t      
 JOIN dbo.ProjectStories s ON t.StoryId= s.StoryId      
 WHERE     
  1 = CASE WHEN (@StoryId IS NULL OR @StoryId = 0) AND (@TeamId IS NULL OR @TeamId = '') THEN 0    
    ELSE 1    
  END    
 AND (@TaskID IS NULL OR TaskID = @TaskID)      
 AND (@StoryId IS NULL OR t.StoryId = @StoryId)      
 AND (@AssignedToUserID IS NULL OR t.AssignedToUserID = @AssignedToUserID)     
 AND 1 = CASE WHEN @TeamId IS NULL OR @TeamId = '' THEN 1    
     WHEN @TeamId IS NOT NULL AND s.ProjectId IN (SELECT p.ProjectId  FROM Projects p WHERE p.TeamID IN(SELECT item FROM [dbo].[fn_SplitString](@TeamId,','))) THEN 1    
     ELSE 0    
   END    
 ORDER BY StoryId,AssignedToUserId            
END 