using NLog;
using ProjectDevs.Business.Extensions;
using ProjectDevs.Core.Constants;
using ProjectDevs.Core.DTO;
using ProjectDevs.Core.Enumerations;
using ProjectDevs.Core.Interfaces.Repositories;
using ProjectDevs.Core.Interfaces.Services;
using ProjectDevs.Core.Models;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace ProjectDevs.Api.Controllers
{
    [RoutePrefix("api/projects")]
    public class ProjectsController : BaseApiController
    {
        private static readonly Logger _logger = LogManager.GetCurrentClassLogger();
        private readonly IRepoFactory _repoFactory;

        private readonly ICacheService _cacheService;

        public ProjectsController(IRepoFactory repoFactory, ICacheService cacheService)
        {
            _repoFactory = repoFactory;
            _cacheService = cacheService;
        }

        [Route("list")]
        public IHttpActionResult GetProjects(string storyTeamId = "", string statusId = "", int pno = 1, int psize = PdConstants.DefaultPageSize)
        {
            var projects = _repoFactory.Projects.GetProjects();

            return GetProjectsPaging(projects, storyTeamId, statusId, pno, psize);
        }

        [Route("my")]
        public IHttpActionResult GetMyProjects(string storyTeamId = "", string statusId = "", int pno = 1, int psize = PdConstants.DefaultPageSize)
        {
            var projects = _repoFactory.Projects.GetMyProjects(base.UserId);
            return GetProjectsPaging(projects, storyTeamId, statusId, pno, psize);
        }
        private IHttpActionResult GetProjectsPaging(IEnumerable<Project> projects, string storyTeamId, string statusId, int pno, int psize)
        {
            List<int> teamIds = new List<int>();
            if (!string.IsNullOrEmpty(storyTeamId))
            {
                teamIds = storyTeamId.Split(',').Select(a => int.Parse(a)).ToList();
                projects = projects.Where(a => teamIds.Contains(a.TeamID));
            }

            List<int> statusIds = new List<int>();
            if (!string.IsNullOrEmpty(statusId))
            {
                statusIds = statusId.Split(',').Select(a => int.Parse(a)).ToList();
                projects = projects.Where(a => statusIds.Contains(a.ProjectStatus));
            }


            if (projects?.Any() == true)
            {
                var paged = projects.GetPaged(pno, psize);
                if (paged?.Any() == true)
                {
                    var projectRoles = _repoFactory.Projects.ProjectRoleAssignment();
                    var pagedDisplay = paged.Select(p => ConvertToProjectDisplayDto(p, projectRoles));
                    var pagingData = new PagingModel<ProjectDto>(pagedDisplay, projects.Count(), pno, psize);
                    return Ok(pagingData);
                }
            }
            return Ok();
        }

        [Route("{projectId}")]
        public IHttpActionResult GetProjectById(int projectId)
        {
            var project = _repoFactory.Projects.GetProjects(projectId)?.FirstOrDefault();
            if (project != null)
            {
                var projectRoles = _repoFactory.Projects.ProjectRoleAssignment(projectId);
                var projectDisplayDto = ConvertToProjectDisplayDto(project, projectRoles);
                projectDisplayDto.ProjectStatusId = project.ProjectStatus;

                if (projectRoles?.Any() == true)
                {
                    var projectManagerId = projectRoles.FirstOrDefault(r => r.RoleId == (int)RoleType.ProjectManager)?.UserId;

                    var businessAnalystId = projectRoles.FirstOrDefault(r => r.RoleId == (int)RoleType.BusinessAnalyst)?.UserId;
                    var stakeHolderIds = projectRoles.Where(r => r.RoleId == (int)RoleType.Stakeholder)
                        .Select(r => r.UserId);

                    projectDisplayDto.BusinessAnalystId = businessAnalystId;
                    projectDisplayDto.ProjectManagerId = projectManagerId;
                    projectDisplayDto.StakeHolderIds = stakeHolderIds;

                    if (!string.IsNullOrWhiteSpace(projectManagerId))
                        projectDisplayDto.ProjectManager = _cacheService.GetUserName(projectManagerId);
                    if (!string.IsNullOrWhiteSpace(businessAnalystId))
                        projectDisplayDto.BusinessAnalyst = _cacheService.GetUserName(businessAnalystId);
                    if (stakeHolderIds?.Any() == true)
                        projectDisplayDto.Stakeholders = stakeHolderIds.Select(userId => _cacheService.GetUserName(userId));//.MergeStrings();

                    if (projectDisplayDto.StakeHolderIds?.Any() == true && projectDisplayDto.Stakeholders?.Any() == true)
                    {
                        projectDisplayDto.StakeholderIdNames = projectDisplayDto.StakeHolderIds?
                            .Zip(projectDisplayDto.Stakeholders, (id, name) => new { id, name })
                            .ToDictionary(s => s.id, s => s.name);
                    }
                }
                return Ok(projectDisplayDto);
            }
            return NotFound();
        }
        [HttpPost, Route("create")]
        public IHttpActionResult CreateProject(ProjectCreateDto dto) => SaveProject(dto);

        [HttpPut, Route("{projectId}")]
        public IHttpActionResult UpdateProject(int projectId, ProjectCreateDto dto)
        {
            if (projectId != dto.ProjectId)
                return BadRequest("Invalid request");
            return SaveProject(dto);
        }

        [HttpGet, Route("{projectId}/stories-max-rank")]
        public int GetStoriesMaxPriority(int projectId)
        {
            return _repoFactory.Projects.GetProjectStoriesMaxPriority(projectId);
        }

        private ProjectDto ConvertToProjectDisplayDto(Project p, IEnumerable<ProjectRoleAssignment> projectRoles)
        {
            var dto = new ProjectDto
            {
                ProjectId = p.ProjectId,
                ProjectName = p.ProjectName,
                CompletedDate = p.CompletedDate,
                StartDate = p.StartDate,
                MeetingSchedule = p.MeetingSchedule,
                PriorityRanking = p.PriorityRanking,
                ProjectStatus = _cacheService.GetProjectStatusName(p.ProjectStatus),
                ProjectType = p.ProjectType,
                RequestDate = p.RequestDate,
                RequestedByDate = p.RequestedByDate,
                TeamID = p.TeamID,
                TeamName = _cacheService.GetProjectTeamName(p.TeamID),
                ProjectAbbreviation=p.ProjectAbbreviation,
                NextNumber=p.NextNumber
            };
            projectRoles = projectRoles.Where(r => r.ProjectId == p.ProjectId);

            var productOwnerId = projectRoles.FirstOrDefault(r => r.RoleId == (int)RoleType.ProductOwner)?.UserId;
            var leadDeveloperId = projectRoles.FirstOrDefault(r => r.RoleId == (int)RoleType.LeadDeveloper)?.UserId;

            dto.ProductOwnerId = productOwnerId;
            dto.LeadDeveloperId = leadDeveloperId;

            if (!string.IsNullOrWhiteSpace(productOwnerId))
                dto.ProductOwner = _cacheService.GetUserName(productOwnerId);
            if (!string.IsNullOrWhiteSpace(leadDeveloperId))
                dto.LeadDeveloper = _cacheService.GetUserName(leadDeveloperId);
            return dto;
        }

        private IEnumerable<ProjectRoleAssignment> GetProjectRoleAssignmentsFromDto(int projectId, ProjectCreateDto dto)
        {
            var projectRoleAssignments = new List<ProjectRoleAssignment>();
            if (!string.IsNullOrWhiteSpace(dto.ProductOwnerId))
                projectRoleAssignments.Add(new ProjectRoleAssignment
                {
                    ProjectId = projectId,
                    UserId = dto.ProductOwnerId,
                    RoleId = (int)RoleType.ProductOwner
                });
            if (!string.IsNullOrWhiteSpace(dto.ProjectManagerId))
                projectRoleAssignments.Add(new ProjectRoleAssignment
                {
                    ProjectId = projectId,
                    UserId = dto.ProjectManagerId,
                    RoleId = (int)RoleType.ProjectManager
                });
            if (!string.IsNullOrWhiteSpace(dto.LeadDeveloperId))
                projectRoleAssignments.Add(new ProjectRoleAssignment
                {
                    ProjectId = projectId,
                    UserId = dto.LeadDeveloperId,
                    RoleId = (int)RoleType.LeadDeveloper
                });
            if (!string.IsNullOrWhiteSpace(dto.BusinessAnalystId))
                projectRoleAssignments.Add(new ProjectRoleAssignment
                {
                    ProjectId = projectId,
                    UserId = dto.BusinessAnalystId,
                    RoleId = (int)RoleType.BusinessAnalyst
                });
            if (!string.IsNullOrWhiteSpace(dto.StakeHolderIds))
            {
                var stakehlderRoleId = (int)RoleType.Stakeholder;
                var stakeholderMappings = dto.StakeHolderIds
                    .Split(',')
                    .Select(stakeholderId =>
                        new ProjectRoleAssignment
                        {
                            ProjectId = projectId,
                            UserId = stakeholderId,
                            RoleId = stakehlderRoleId
                        });
                projectRoleAssignments.AddRange(stakeholderMappings);
            }
            return projectRoleAssignments;
        }

        private IHttpActionResult SaveProject(ProjectCreateDto dto)
        {
            var projectModel = new Project
            {
                CompletedDate = dto.CompletedDate,
                MeetingSchedule = dto.MeetingSchedule,
                PriorityRanking = dto.PriorityRanking,
                ProjectId = dto.ProjectId,
                ProjectName = dto.ProjectName,
                ProjectStatus = dto.ProjectStatusId,
                ProjectType = dto.ProjectType,
                RequestDate = dto.RequestDate,
                RequestedByDate = dto.RequestedByDate,
                StartDate = dto.StartDate,
                TeamID = dto.TeamID
            };

            Validate(projectModel);
            if (ModelState.IsValid)
            {
                var transaction = _repoFactory.BeginTransaction();
                try
                {
                    var isProjectSaved = false;
                    if (projectModel.ProjectId > 0)
                    {
                        isProjectSaved = _repoFactory.Projects.UpdateProject(projectModel, transaction) > 0;
                        _repoFactory.Projects.DeleteProjectRoleAssignment(projectModel.ProjectId, transaction);
                    }
                    else
                    {
                        var newProjectId = _repoFactory.Projects.CreateProject(projectModel, transaction);
                        isProjectSaved = newProjectId.HasValue && newProjectId.Value > 0;
                        if (isProjectSaved)
                            projectModel.ProjectId = newProjectId.Value;

                    }
                    if (isProjectSaved)
                    {
                        var projectRoleAssignments = GetProjectRoleAssignmentsFromDto(projectModel.ProjectId, dto);
                        if (projectRoleAssignments?.Any() == true)
                        {
                            _repoFactory.Projects.CreateProjectRoleAssignments(projectRoleAssignments, transaction);
                        }
                        if (dto.ProjectId == 0)
                        {
                            var notifications = new List<ProjectNotification>();
                            if (!string.IsNullOrWhiteSpace(dto.BusinessAnalystId))
                                notifications.Add(new ProjectNotification
                                {
                                    Text = $"<strong>{base.DisplayName}</strong> has created a new project <strong>{dto.ProjectName}</strong> and added you as a <strong>Business Analyst</strong>",
                                    Hyperlink = $"/Projects/{projectModel.ProjectId}",
                                    UserId = dto.BusinessAnalystId,
                                });
                            if (!string.IsNullOrWhiteSpace(dto.LeadDeveloperId))
                                notifications.Add(new ProjectNotification
                                {
                                    Text = $"<strong>{base.DisplayName}</strong> has created a new project <strong>{dto.ProjectName}</strong> and added you as a <strong>Lead Developer</strong>",
                                    Hyperlink = $"/Projects/{projectModel.ProjectId}",
                                    UserId = dto.LeadDeveloperId,
                                });
                            if (!string.IsNullOrWhiteSpace(dto.ProductOwnerId))
                                notifications.Add(new ProjectNotification
                                {
                                    Text = $"<strong>{base.DisplayName}</strong> has created a new project <strong>{dto.ProjectName}</strong> and added you as a <strong>Product Owner</strong>",
                                    Hyperlink = $"/Projects/{projectModel.ProjectId}",
                                    UserId = dto.ProductOwnerId,
                                });
                            if (!string.IsNullOrWhiteSpace(dto.ProjectManagerId))
                                notifications.Add(new ProjectNotification
                                {
                                    Text = $"<strong>{base.DisplayName}</strong> has created a new project <strong>{dto.ProjectName}</strong> and added you as a <strong>Project Manager</strong>",
                                    Hyperlink = $"/Projects/{projectModel.ProjectId}",
                                    UserId = dto.ProjectManagerId,
                                });
                            if (!string.IsNullOrWhiteSpace(dto.StakeHolderIds))
                                notifications.AddRange(
                                    dto.StakeHolderIds?.Split(',').Select(userId => new ProjectNotification
                                    {
                                        Text = $"<strong>{base.DisplayName}</strong> has created a new project <strong>{dto.ProjectName}</strong> and added you as a <strong>Stakeholder</strong>",
                                        Hyperlink = $"/Projects/{projectModel.ProjectId}",
                                        UserId = UserId,
                                    })
                                    );
                            if (notifications.Any())
                            {
                                notifications = notifications.Where(n => !n.UserId.Equals(base.UserId, System.StringComparison.OrdinalIgnoreCase)).ToList();
                                if (notifications.Any())
                                    _repoFactory.Notifications.CreateNotifications(notifications, transaction);
                            }
                        }
                        _repoFactory.CommitTransaction();
                        _cacheService.PurgeProjectNames();
                    }
                    if (dto.ProjectId == 0)
                        return Created($"/api/projects/{projectModel.ProjectId}", projectModel);
                    return Ok();
                }
                catch (System.Exception ex)
                {
                    _repoFactory.RollbackTransaction();
                    _logger.Error(ex, Request.RequestUri.ToString());
                    return InternalServerError(ex);
                }
            }
            return BadRequest(ModelState);
        }


        //------------------------

        [Route("{projectId}/meetings")]
        public IHttpActionResult GetProjectMeetings(int projectId, string storyTeamId, int pno = 1, int psize = PdConstants.DefaultPageSize)
        {
            int? projectIdParam = null;
            if (projectId > 0)
                projectIdParam = projectId;

            var meetings = _repoFactory.ProjectMeetings.GetProjectMeetings(projectIdParam, storyTeamId);
            return GetMyMeetings(meetings, pno, psize);
        }
        [Route("{projectId}/meetings/my")]
        public IHttpActionResult GetMyMeetings(int projectId, string storyTeamId, int pno = 1, int psize = PdConstants.DefaultPageSize)
        {
            int? projectIdParam = null;
            if (projectId > 0)
                projectIdParam = projectId;

            var meetings = _repoFactory.ProjectMeetings.GetProjectMeetings(projectIdParam, storyTeamId);
            meetings = meetings.Where(m => m.AttendeeIdsList?.Any(attendeeId => attendeeId.Equals(base.UserId, System.StringComparison.OrdinalIgnoreCase)) == true);
            return GetMyMeetings(meetings, pno, psize);
        }
        private IHttpActionResult GetMyMeetings(IEnumerable<ProjectMeeting> meetings, int pno, int psize)
        {
            if (meetings?.Any() == true)
            {
                var pagedData = meetings.GetPaged(pno, psize);

                var pagedDisplay = pagedData?.Select(m => ConvertToMeetingDto(m));
                var pagingData = new PagingModel<ProjectMeetingDto>(pagedDisplay, meetings.Count(), pno, psize);
                if (pagingData.Data?.Any() == true)
                    return Ok(pagingData);
            }
            return Ok();
        }

        [Route("{projectId}/meetings/{meetingId}")]
        public IHttpActionResult GetProjectMeetingById(int projectId, int meetingId)
        {
            var meeting = _repoFactory.ProjectMeetings.GetProjectMeetings(projectId, null, meetingId)?.FirstOrDefault();
            if (meeting != null)
            {
                var meetingDisplay = ConvertToMeetingDto(meeting);
                return Ok(meetingDisplay);
            }
            return NotFound();
        }
        private ProjectMeetingDto ConvertToMeetingDto(ProjectMeeting m)
        {
            var dto = new ProjectMeetingDto
            {
                MeetingId = m.MeetingId,
                MeetingDate = m.MeetingDate,
                MeetingTime = m.MeetingTime,
                Purpose = m.Purpose,
                AttendeeNames = m.AttendeeIdsList?.Select(userId => _cacheService.GetUserName(userId)),//?.MergeStrings(),
                AttendeeIds = m.AttendeeIdsList,
                CreatedByUserId = m.CreatedByUserId,
                CreatedByUserName = _cacheService.GetUserName(m.CreatedByUserId),
                ProjectId = m.ProjectId,
                ProjectName = _cacheService.GetProjectName(m.ProjectId)
            };
            dto.AttendeeIdNames = m.AttendeeIdsList?
                        .Zip(dto.AttendeeNames, (id, name) => new { id, name })
                        .ToDictionary(s => s.id, s => s.name);
            return dto;
        }

        [HttpPost, Route("{projectId}/meetings/create")]
        public IHttpActionResult CreateProjectMeeting(int projectId, ProjectMeetingCreate dto)
        {
            var meetingModel = new ProjectMeeting
            {
                MeetingId = dto.MeetingId,
                ProjectId = dto.ProjectId,
                MeetingDate = dto.MeetingDate,
                MeetingTime = dto.MeetingTime,
                Purpose = dto.Purpose,
                Attendees = dto.AttendeeIds,
                CreatedByUserId = base.UserId
            };
            Validate(meetingModel);

            if (ModelState.IsValid)
            {
                var meetingId = _repoFactory.ProjectMeetings.CreateMeeting(meetingModel);
                if (meetingId.HasValue)
                {
                    dto.MeetingId = meetingId.Value;
                    return Created($"/api/projects/{projectId}/meetings/{dto.MeetingId}", dto);
                }
                return BadRequest("Meeting could not be created");
            }
            return BadRequest(ModelState);
        }

        [HttpPut, Route("{projectId}/meetings/{meetingId}")]
        public IHttpActionResult UpdateProjectMeeting(int projectId, int meetingId, ProjectMeetingCreate dto)
        {
            if (projectId != dto.ProjectId || meetingId != dto.MeetingId)
                return BadRequest("Invalid request");
            var meetingModel = new ProjectMeeting
            {
                MeetingId = dto.MeetingId,
                ProjectId = dto.ProjectId,
                MeetingDate = dto.MeetingDate,
                MeetingTime = dto.MeetingTime,
                Purpose = dto.Purpose,
                Attendees = dto.AttendeeIds,
                CreatedByUserId = base.UserId
            };
            Validate(meetingModel);

            if (ModelState.IsValid)
            {
                _repoFactory.ProjectMeetings.UpdateMeeting(meetingModel);
                return Ok();
            }
            return BadRequest(ModelState);
        }

        [Route("master/status")]
        public IHttpActionResult GetProjectStatus() => Ok(_cacheService.ProjectStatusNames.Select(s => new { Value = s.Key, Text = s.Value }));

        [Route("master/team")]
        public IHttpActionResult GetTeams() => Ok(_cacheService.TeamNames.Select(s => new { Value = s.Key, Text = s.Value }));

        [Route("ddl")]
        public IHttpActionResult GetProjectsDdl(string teamId = "")
        {
            if (!string.IsNullOrEmpty(teamId))
            {
                List<int> teamIds = new List<int>();
                teamIds = teamId.Split(',').Select(a => int.Parse(a)).ToList();                
                var projects = _repoFactory.Projects.GetProjects();
                if (teamIds.Count > 0)
                {
                    projects = projects.Where(a => teamIds.Contains(a.TeamID));
                }

                var ret = projects?.Select(s => new { Value = s.ProjectId, Text = s.ProjectName});
                return Ok(ret);
            }
            else
            {
                var projects = _cacheService.ProjectNames.Select(s => new { Value = s.Key, Text = s.Value });
                return Ok(projects);
            }
           
        }
    }
}
