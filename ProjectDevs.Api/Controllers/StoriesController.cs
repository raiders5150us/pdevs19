using NLog;
using ProjectDevs.Api.Helpers;
using ProjectDevs.Business.Extensions;
using ProjectDevs.Core.Constants;
using ProjectDevs.Core.DTO;
using ProjectDevs.Core.Interfaces.Repositories;
using ProjectDevs.Core.Interfaces.Services;
using ProjectDevs.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace ProjectDevs.Api.Controllers
{
    [RoutePrefix("api/{projectId}/projectstories")]
    public class StoriesController : BaseApiController
    {
        private static readonly Logger _logger = LogManager.GetCurrentClassLogger();
        private readonly IRepoFactory _repoFactory;
        private readonly ICacheService _cacheService;
        private readonly IEmailService _emailService;
       

        public StoriesController(IRepoFactory repoFactory, ICacheService cacheService, IEmailService emailService)
        {
            _repoFactory = repoFactory;
            _cacheService = cacheService;
            _emailService = emailService;
        }

        [Route("")]
        public IHttpActionResult GetProjectStories(int projectId, string requesterId = null, string assignedToUserId = null, string storyStatusId = "", string storyTeamId = "", int pno = 1, int psize = PdConstants.DefaultPageSize)
        {
            int? projectIdParam = null;
            if (projectId > 0)
                projectIdParam = projectId;

            var stories = _repoFactory.ProjectStories.GetProjectStories(projectIdParam, requesterId, assignedToUserId, storyTeamId);
            if (!string.IsNullOrEmpty(storyStatusId))
            {
                List<int> statusIds = storyStatusId.Split(',').Select(a => int.Parse(a)).Where(a => a != 0).ToList();
                if (statusIds.Count > 0)
                {
                    stories = stories.Where(s => statusIds.Contains(s.StoryStatus));
                }
            }

            var notes = _repoFactory.Notes.GetNotesOfProject(projectId, null, storyTeamId);
            return GetStoriesPaging(stories, notes, pno, psize);
        }
        [Route("my")]
        public IHttpActionResult GetMyProjectStories(int pno = 1, int psize = PdConstants.DefaultPageSize)
        {
            var stories = _repoFactory.ProjectStories.GetMyStories(base.UserId);
            var notes = _repoFactory.Notes.GetNotes(null, 2, null, base.UserId);
            return GetStoriesPaging(stories, notes, pno, psize);
        }
        private IHttpActionResult GetStoriesPaging(IEnumerable<UserStory> stories, IEnumerable<ProjectNote> notes, int pno, int psize)
        {
            if (stories?.Any() == true)
            {
                var paged = stories.GetPaged(pno, psize);
                if (paged?.Any() == true)
                {
                    var pagedDisplay = paged.Select(s => ConvertToDto(s, notes));
                    var pagingData = new PagingModel<ProjectStoryDisplayDto>(pagedDisplay, stories.Count(), pno, psize);
                    return Ok(pagingData);
                }
            }
            return Ok();
        }

        [Route("{storyId}")]
        public IHttpActionResult GetProjectStoryById(int projectId, int storyId)
        {
            var story = _repoFactory.ProjectStories.GetProjectStories(projectId)?.FirstOrDefault(p => p.StoryId == storyId);
            if (story == null && storyId > 0)
            {
                story = _repoFactory.ProjectStories.GetProjectStories()?.FirstOrDefault(p => p.StoryId == storyId);
            }

            if (story != null)
            {
                //var notes = _repoFactory.Notes.GetNotes(storyId).ToList();
                var dto = ConvertToDto(story);

                //if (notes != null && notes.Count > 0)
                //{
                //    dto.Notes = notes
                //        .OrderByDescending(a => a.CreatedOn)
                //        .Take(1)
                //        .Select(a => a.Note).ToList();
                //}

                //dto.AcceptanceCriteria = dto.AcceptanceCriteria;
                var sprint = _repoFactory.Sprints.GetStorySprintMappings(projectStoryId: storyId);
                if (sprint?.Any() == true)
                {
                    dto.SprintIdNames = sprint.Select(s => new { s.SprintId, s.SprintName })
                            .ToDictionary(s => s.SprintId, s => s.SprintName);
                }
                return Ok(dto);
            }

            return NotFound();
        }



        [HttpPost, Route("create")]
        public IHttpActionResult CreateProjectStory(int projectId, UserStory model)
        {
            if (projectId != model.ProjectId)
                return NotFound();
            if (ModelState.IsValid)
            {
                var transaction = _repoFactory.BeginTransaction();
                try
                {
                    var newStoryId = _repoFactory.ProjectStories.CreateProjectStory(model, transaction);
                    if (newStoryId.HasValue)
                    {
                        model.StoryId = newStoryId.Value;
                        if (!string.IsNullOrWhiteSpace(model.SprintIds))
                        {
                            var sprintIds = model.SprintIds.Split(',');
                            foreach (var s in sprintIds)
                            {
                                if (int.TryParse(s, out var sprintId))
                                    _repoFactory.Sprints.AddStoryToSprint(sprintId, model.StoryId, transaction);
                            }
                        }



                        if (!string.IsNullOrWhiteSpace(model.AssignedToUserId)
                            && !string.Equals(model.AssignedToUserId, UserId, System.StringComparison.OrdinalIgnoreCase))
                        {
                            var receipientName = _cacheService.GetUserName(model.AssignedToUserId);
                            if (!string.IsNullOrWhiteSpace(receipientName))
                            {
                                var receipient = new MailUser(model.AssignedToUserId, receipientName);
                                var actor = new MailUser(UserId, DisplayName);
                                var userStoryLink = UrlFactory.GetUserStoryPageUrl(projectId, model.StoryId);
                                _emailService.SendMail(receipient, Core.Enumerations.EmailType.UserStoryAssigned, actor, userStoryLink);
                            }
                        }

                        //Notifications
                        var notifications = new List<ProjectNotification>();
                        if (!string.IsNullOrWhiteSpace(model.AssignedToUserId))
                        {
                            notifications.Add(new ProjectNotification
                            {
                                Text = $"<strong>{base.DisplayName}</strong> has created a new user story <strong>{model.StoryName}</strong> and assigned it to you.",
                                Hyperlink = $"/Project/{model.ProjectId}/User-Story/{newStoryId}",
                                UserId = model.AssignedToUserId,
                            });
                        }

                        if (notifications.Any())
                        {
                            notifications = notifications.Where(n => !n.UserId.Equals(base.UserId, System.StringComparison.OrdinalIgnoreCase)).ToList();
                            if (notifications.Any())
                                _repoFactory.Notifications.CreateNotifications(notifications, transaction);
                        }

                        _repoFactory.CommitTransaction();
                        return Created($"/api/{projectId}/projectstories/{model.StoryId}", model);
                    }
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

        [HttpPost, Route("create_quick/{tempGuid}")]
        public IHttpActionResult CreateQuickProjectStory(int projectId, string tempGuid, UserStory model)
        {
            if (projectId != model.ProjectId)
                return NotFound();

            model.RequestDate = DateTime.Now;

            if (ModelState.IsValid)
            {
                var transaction = _repoFactory.BeginTransaction();
                try
                {
                    var newStoryId = _repoFactory.ProjectStories.CreateProjectStory(model, transaction);
                    _repoFactory.Files.MoveTemporaryFile(tempGuid, (int)Core.Enumerations.FileType.UserStories, newStoryId.Value,transaction);

                    if (newStoryId.HasValue)
                    {
                        model.StoryId = newStoryId.Value;
                        if (!string.IsNullOrWhiteSpace(model.SprintIds))
                        {
                            var sprintIds = model.SprintIds.Split(',');
                            foreach (var s in sprintIds)
                            {
                                if (int.TryParse(s, out var sprintId))
                                    _repoFactory.Sprints.AddStoryToSprint(sprintId, model.StoryId, transaction);
                            }
                        }
                        _repoFactory.CommitTransaction();

                        if (!string.IsNullOrWhiteSpace(model.AssignedToUserId)
                            && !string.Equals(model.AssignedToUserId, UserId, System.StringComparison.OrdinalIgnoreCase))
                        {
                            var receipientName = _cacheService.GetUserName(model.AssignedToUserId);
                            if (!string.IsNullOrWhiteSpace(receipientName))
                            {
                                var receipient = new MailUser(model.AssignedToUserId, receipientName);
                                var actor = new MailUser(UserId, DisplayName);
                                var userStoryLink = UrlFactory.GetUserStoryPageUrl(projectId, model.StoryId);
                                _emailService.SendMail(receipient, Core.Enumerations.EmailType.UserStoryAssigned, actor, userStoryLink);
                            }
                        }

                        return Created($"/api/{projectId}/projectstories/{model.StoryId}", model);
                    }
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

        [HttpPut, Route("{storyId}")]
        public IHttpActionResult UpdateProjectStory(int projectId, int storyId, UserStory model)
        {
            if (projectId != model.ProjectId || storyId != model.StoryId)
                return NotFound();
            if (ModelState.IsValid)
            {
                var dbStory = _repoFactory.ProjectStories.GetProjectStories(projectId)
                        ?.SingleOrDefault(s => s.StoryId == storyId);
                if (dbStory == null)
                    return BadRequest();

                var transaction = _repoFactory.BeginTransaction();
                try
                {
                    _repoFactory.ProjectStories.UpdateProjectStory(model, transaction);

                    _repoFactory.Sprints.DeleteStorySprintMapping(model.StoryId, transaction);
                    if (!string.IsNullOrWhiteSpace(model.SprintIds))
                    {
                        var sprintIds = model.SprintIds.Split(',');
                        foreach (var s in sprintIds)
                        {
                            if (int.TryParse(s, out var sprintId))
                                _repoFactory.Sprints.AddStoryToSprint(sprintId, model.StoryId, transaction);
                        }
                    }

                    _repoFactory.CommitTransaction();

                    if (!string.IsNullOrWhiteSpace(model.AssignedToUserId)
                        && !string.Equals(model.AssignedToUserId, UserId, System.StringComparison.OrdinalIgnoreCase)
                        && !string.Equals(dbStory.AssignedToUserId, model.AssignedToUserId, System.StringComparison.OrdinalIgnoreCase))
                    {
                        var receipientName = _cacheService.GetUserName(model.AssignedToUserId);
                        if (!string.IsNullOrWhiteSpace(receipientName))
                        {
                            var receipient = new MailUser(model.AssignedToUserId, receipientName);
                            var actor = new MailUser(UserId, DisplayName);
                            var userStoryLink = UrlFactory.GetUserStoryPageUrl(projectId, model.StoryId);
                            _emailService.SendMail(receipient, Core.Enumerations.EmailType.UserStoryAssigned, actor, userStoryLink);
                        }
                    }
                }
                catch (System.Exception ex)
                {
                    _repoFactory.RollbackTransaction();
                    _logger.Error(ex, Request.RequestUri.ToString());
                    return InternalServerError(ex);
                }
                return Ok();
            }
            return BadRequest(ModelState);
        }

        [HttpPost, Route("projectstorybulkorderupdate")]
        public IHttpActionResult ProjectStoryBulkOrderUpdate(int projectId, [FromBody] ProjectStoryBulkOrderUpdateWrapperDto data)
        {
            var transaction = _repoFactory.BeginTransaction();
            try
            {
                if (data != null && data.Stories != null && data.Stories.Count > 0)
                {
                    data.Stories.ForEach(a =>
                    {
                        _repoFactory.ProjectStories.UpdateProjectStoryOrder(a.Id, a.Order, transaction);
                    });
                }

                _repoFactory.CommitTransaction();
            }
            catch (System.Exception ex)
            {
                _repoFactory.RollbackTransaction();
                _logger.Error(ex, Request.RequestUri.ToString());
                return InternalServerError(ex);
            }
            return Ok();
        }

        [HttpPost, Route("{storyId}/projectstorycopytonextsprint/{sprintId}")]
        public IHttpActionResult ProjectStoryCopyToNextSprint(int projectId, int sprintId, int storyId)
        {
            try
            {
                _repoFactory.ProjectStories.ProjectStoryCopyToNextSprint(projectId, sprintId, storyId);

            }
            catch (System.Exception ex)
            {
                _logger.Error(ex, Request.RequestUri.ToString());
                return InternalServerError(ex);
            }
            return Ok();
        }

        private ProjectStoryDisplayDto ConvertToDto(UserStory s, IEnumerable<ProjectNote> projectNotes = null)
        {
            var dto = new ProjectStoryDisplayDto
            {
                AcceptanceCriteria = s.AcceptanceCriteria,
                AssigneeName = _cacheService.GetUserName(s.AssignedToUserId),
                EndDate = s.EndDate,
                ProjectName = _cacheService.GetProjectName(s.ProjectId),
                Environment = s.Environment,
                F1 = s.F1,
                F2 = s.F2,
                F3 = s.F3,
                PriorityRanking = s.PriorityRanking,
                RequestDate = s.RequestDate,
                StoryName = s.StoryName,
                RequesterTargetDate = s.RequesterTargetDate,
                GroomingCompleteDate = s.GroomingCompleteDate,
                ProdTargetDate = s.ProdTargetDate,

                RequesterName = _cacheService.GetUserName(s.RequesterId),
                StartDate = s.StartDate,
                StoryId = s.StoryId,
                ProjectId = s.ProjectId,
                StoryStatusName = _cacheService.GetStoryStatusName(s.StoryStatus),
                AssigneeId = s.AssignedToUserId,
                RequesterId = s.RequesterId,
                StoryStatusId = s.StoryStatus,
                StoryTypeId = s.StoryTypeId,
                StoryTypeName = _cacheService.GetStoryTypeName(s.StoryTypeId ?? 0),
                ProjectedHours = s.ProjectedHours,
                ActualHours = s.ActualHours
            };
            if (projectNotes != null && projectNotes.Any())
            {
                dto.Notes = projectNotes.Where(a => a.ParentId == dto.StoryId && a.NoteTypeId == 2)
                    .OrderByDescending(a => a.CreatedOn)
                    .Take(1)
                    .Select(a => a.Note).ToList();
            }
            return dto;
        }

        [Route("~/api/stories-without-enddate")]
        public IHttpActionResult GetStoriesWithoutEndDate(int pno = 1, int? projectId = null, string assignedToUserId = null, int? sprintId = null, int psize = PdConstants.DefaultPageSize)
        {
            var stories = _repoFactory.ProjectStories.GetStoriesWithoutEndDate();
            if (stories?.Any() == true)
            {
                if (sprintId.HasValue)
                {
                    var sprint = _repoFactory.Sprints.GetSprints(sprintId.Value).FirstOrDefault();
                    if (sprint != null && sprint.TeamID > 0)
                    {
                        stories = stories.Where(a => a.TeamId == sprint.TeamID);
                    }
                }
                if (projectId.HasValue && projectId > 0)
                {
                    stories = stories.Where(a => a.ProjectId == projectId);
                }

                if (!string.IsNullOrEmpty(assignedToUserId))
                {
                    stories = stories.Where(a => a.AssignedToUserId == assignedToUserId);
                }

                var paged = stories.GetPagingModel(pno, psize);
                if (paged.Data?.Any() == true)
                {
                    paged.Data?.ToList().ForEach(s =>
                    {
                        s.AssignedToUserName = _cacheService.GetUserName(s.AssignedToUserId);
                        s.StoryStatusName = _cacheService.GetStoryStatusName(s.StoryStatus);
                    });
                    return Ok(paged);
                }
            }
            return Ok();
        }

        [Route("master/status")]
        public IHttpActionResult GetProjectStatus(int? projectId)
        {
            if (projectId == 0)
                projectId = null;

            var statuses = _repoFactory.ProjectStories.GetProjectStoriesStatuses(projectId);
            var options = statuses?.Select(s => new { Value = s.StatusId, Text = s.ListItemText });
            return Ok(options);
        }

        [Route("ddl/{statusIds}")]
        public IHttpActionResult GetProjectStoriesDdl(int projectId, string statusIds, string q = null)
        {
            var stories = _repoFactory.ProjectStories.GetProjectStories(projectId);

            if (!string.IsNullOrEmpty(statusIds))
            {
                List<int> filterIds = statusIds.Split(',').Select(a => int.Parse(a)).Where(a => a != 0).ToList();
                if (filterIds.Count > 0)
                {
                    stories = stories.Where(s => filterIds.Contains(s.StoryStatus));
                }
            }

            if (!string.IsNullOrEmpty(q))
            {
                stories = stories.Where(s => s.StoryName.ToLower().Contains(q.ToLower()));
            }
            var options = stories?.Select(s => new { Value = s.StoryId, Text = $"{s.StoryName} - As a {s.F1}, I want to {s.F2}, So I can {s.F3}" });
            return Ok(options);
        }

        [Route("master/types")]
        public IHttpActionResult GetStoryTypes() => Ok(_cacheService.StoryTypes.Select(s => new { Value = s.Key, Text = s.Value }));
    }
}
