using NLog;
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
    [RoutePrefix("api/sprints")]
    public class SprintsController : BaseApiController
    {
        private static readonly Logger _logger = LogManager.GetCurrentClassLogger();
        private readonly IRepoFactory _repoFactory;
        private readonly ICacheService _cacheService;

        public SprintsController(IRepoFactory repoFactory, ICacheService cacheService)
        {
            _repoFactory = repoFactory;
            _cacheService = cacheService;
        }
        [Route("")]
        public IHttpActionResult GetSprints(string storyTeamId = "", int pno = 1, int psize = PdConstants.DefaultPageSize)
        {
            var sprints = _repoFactory.Sprints.GetSprints();

            List<int> teamIds = new List<int>();
            if (!string.IsNullOrEmpty(storyTeamId))
            {
                teamIds = storyTeamId.Split(',').Select(a => int.Parse(a)).ToList();
                sprints = sprints.Where(a => teamIds.Contains(a.TeamID));
            }

            if (sprints?.Any() == true)
            {
                var paged = sprints.GetPaged(pno, psize);
                if (paged?.Any() == true)
                {
                    var pagedDisplay = paged.Select(p => ConvertToSprintDisplayDto(p));
                    var pagingData = new PagingModel<SprintDto>(pagedDisplay, sprints.Count(), pno, psize);
                    return Ok(pagingData);
                }
            }
            return Ok();
        }

        [Route("{sprintId}")]
        public IHttpActionResult GetSprintById(int sprintId)
        {
            var sprint = _repoFactory.Sprints.GetSprints(sprintId)?.FirstOrDefault();
            if (sprint != null)
            {
                var dto = ConvertToSprintDisplayDto(sprint);
                return Ok(dto);
            }

            return NotFound();
        }

        [HttpPost]
        [Route("create")]
        public IHttpActionResult CreateSprint(Sprint model)
        {
            if (ModelState.IsValid)
            {
                var newSprintId = _repoFactory.Sprints.CreateSprint(model);
                if (newSprintId.HasValue)
                {
                    model.SprintId = newSprintId.Value;
                    _cacheService.PurgeSprintNames();
                    return Created($"/api/sprints/{model.SprintId}", model);
                }
                return BadRequest("Sprint could not be created.");
            }
            return BadRequest(ModelState);
        }
        [HttpPut]
        [Route("{sprintId}")]
        public IHttpActionResult UpdateSprint(int sprintId, Sprint model)
        {
            if (sprintId != model.SprintId)
                return NotFound();
            if (ModelState.IsValid)
            {
                bool addtnDetails = !string.IsNullOrEmpty(model.ChangeNumber) || !string.IsNullOrEmpty(model.SprintRetrospective);

                _repoFactory.Sprints.UpdateSprint(model, null, addtnDetails);
                _cacheService.PurgeSprintNames();
                return Ok();
            }
            return BadRequest(ModelState);
        }

        [Route("{sprintId}/projectstories")]
        public IHttpActionResult GetSprintStories(int sprintId, int projectId = 0, string assignedToUserId = null, int pno = 1, int psize = PdConstants.DefaultPageSize)
        {
            var sprintStories = _repoFactory.Sprints.GetStorySprintMappings(sprintId);
            var sprint = _repoFactory.Sprints.GetSprints(sprintId).FirstOrDefault();
            if (sprintStories?.Any() == true)
            {
                var notes = _repoFactory.Notes.GetNotesOfProject(projectId, null, sprint.TeamID.ToString());

                if (projectId > 0)
                    sprintStories = sprintStories.Where(s => s.ProjectId == projectId);
                if (!string.IsNullOrWhiteSpace(assignedToUserId))
                    sprintStories = sprintStories.Where(s => s.AssignedToUserId?.Equals(assignedToUserId, StringComparison.OrdinalIgnoreCase) == true);
                if (sprintStories.Any())
                {
                    var paged = sprintStories.GetPaged(pno, psize);
                    if (paged?.Any() == true)
                    {
                        var pagedDisplay = paged.Select(s => new ProjectStoryDisplayDto
                        {
                            AcceptanceCriteria = s.AcceptanceCriteria,
                            AssigneeName = _cacheService.GetUserName(s.AssignedToUserId),
                            EndDate = s.StoryEndDate,
                            ProjectName = _cacheService.GetProjectName(s.ProjectId),
                            Environment = s.Environment,
                            F1 = s.F1,
                            F2 = s.F2,
                            F3 = s.F3,
                            StoryName = s.StoryName,
                            PriorityRanking = s.PriorityRanking,
                            RequestDate = s.RequestDate,
                            RequesterName = _cacheService.GetUserName(s.RequesterId),
                            StartDate = s.StoryStartDate,
                            StoryId = s.StoryId,
                            ProjectId = s.ProjectId,
                            StoryStatusName = _cacheService.GetStoryStatusName(s.StoryStatus),
                            StoryTypeId = s.StoryTypeId,
                            StoryTypeName = _cacheService.GetStoryTypeName(s.StoryTypeId ?? 0),
                            ProjectedHours = s.ProjectedHours,
                            ActualHours = s.ActualHours,
                            Notes = notes.Where(a => a.ParentId == s.StoryId && a.NoteTypeId == 2)
                                    .OrderByDescending(a => a.CreatedOn)
                                    .Take(1)
                                    .Select(a => a.Note).ToList()
                        });
                        var storyHours = new StoryHour(sprintStories.Sum(s => s.ProjectedHours ?? 0), sprintStories.Sum(s => s.ActualHours ?? 0));

                        var pagingData = new PagingModel<ProjectStoryDisplayDto>(pagedDisplay, sprintStories.Count(), pno, psize, storyHours);
                        return Ok(pagingData);
                    }
                }
            }
            return Ok();
        }

        [HttpPost]
        [Route("{sprintId}/addstories")]
        public IHttpActionResult AddStoriesToSprint(int sprintId, IEnumerable<int> storyIds)
        {
            if (storyIds?.Any() == true)
            {
                var dbSprint = _repoFactory.Sprints.GetSprints(sprintId)?.FirstOrDefault();
                if (dbSprint != null)
                {
                    var transaction = _repoFactory.BeginTransaction();
                    try
                    {
                        foreach (var storyId in storyIds)
                        {
                            _repoFactory.Sprints.AddStoryToSprint(sprintId, storyId, transaction);
                        }
                        _repoFactory.CommitTransaction();
                        return Ok();
                    }
                    catch (Exception ex)
                    {
                        _repoFactory.RollbackTransaction();
                        _logger.Error(ex, Request.RequestUri.ToString());
                        return InternalServerError(ex);
                    }
                }
                return NotFound();
            }
            return BadRequest("StoryIds are required.");
        }

        [Route("ddl/{teamId}")]
        public IHttpActionResult GetSprintsDdl(string teamId)
        {
            if (!string.IsNullOrEmpty(teamId) && teamId != "null")
            {
                var sprints = _repoFactory.Sprints.GetSprints();
                List<int> filterIds = teamId.Split(',').Select(a => int.Parse(a)).Where(a => a != 0).ToList();
                if (filterIds.Count > 0)
                {
                    sprints = sprints.Where(s => filterIds.Contains(s.TeamID)).ToList();
                }

                return Ok(sprints.Select(s => new { Value = s.SprintId, Text = s.SprintName }));
            }
            return Ok(_cacheService.SprintNames.Select(s => new { Value = s.Key, Text = s.Value }));
        }

        private SprintDto ConvertToSprintDisplayDto(SprintResult p)
        {
            var dto = new SprintDto
            {
                SprintId = p.SprintId,
                EndDate = p.EndDate,
                StartDate = p.StartDate,
                SprintName = p.SprintName,
                CompletedStories = p.CompletedStories,
                TotalStories = p.TotalStories,
                TeamID = p.TeamID,
                TeamName = _cacheService.GetProjectTeamName(p.TeamID),
                ChangeNumber = p.ChangeNumber,
                SprintRetrospective = p.SprintRetrospective,
                IsClosed = p.IsClosed,
                DateClosed = p.DateClosed
            };
            return dto;
        }

        [HttpGet]
        [Route("{sprintId}/close")]
        public IHttpActionResult CloseSprint(int sprintId)
        {
            _repoFactory.Sprints.CloseSprint(sprintId);
            _cacheService.PurgeSprintNames();
            return Ok();
        }
    }
}
