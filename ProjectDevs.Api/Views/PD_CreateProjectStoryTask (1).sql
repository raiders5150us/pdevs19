ALTER PROCEDURE [dbo].[PD_CreateProjectStoryTask]    
(    
 @StoryId int,    
 @TaskStatus int,    
 @TaskName varchar(100),    
 @TaskDescription varchar(1000),    
 @TaskType varchar(20),    
 @AssignedToUserID varchar(10),    
 @ProjectedHours float,    
 @ActualHours float,    
 @TicketNumber varchar (20),    
 @Changeset int ,  
 @HoursWorked float,
 @LOB VARCHAR(2000)
)    
AS    
BEGIN    
 INSERT INTO dbo.ProjectStoryTasks(StoryId,TaskStatus,TaskName,TaskDescription,TaskType,AssignedToUserID,ProjectedHours,ActualHours,TicketNumber,Changeset,HoursWorked,LOB)    
 VALUES (@StoryId,@TaskStatus,@TaskName,@TaskDescription,@TaskType,@AssignedToUserID,@ProjectedHours,@ActualHours,@TicketNumber,@Changeset,@HoursWorked,@LOB)    
    
 SELECT CAST(SCOPE_IDENTITY() AS int) AS ScopeId    
END 