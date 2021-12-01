ALTER PROCEDURE [dbo].[PD_UpdateProjectStoryTask]    
(    
 @TaskId int,    
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
 UPDATE a SET TaskStatus = @TaskStatus    
 ,TaskName = @TaskName    
 ,TaskDescription = @TaskDescription    
 ,TaskType = @TaskType    
 ,AssignedToUserID = @AssignedToUserID    
 ,ProjectedHours = @ProjectedHours    
 ,ActualHours = @ActualHours    
 ,TicketNumber = @TicketNumber    
 ,Changeset = @Changeset  
 ,HoursWorked=@HoursWorked ,
 LOB= @LOB
 FROM dbo.ProjectStoryTasks a    
 WHERE a.TaskId = @TaskId    
END 