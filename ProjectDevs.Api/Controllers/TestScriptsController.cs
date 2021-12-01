using iTextSharp.text;
using iTextSharp.text.html.simpleparser;
using iTextSharp.text.pdf;
using NLog;
using ProjectDevs.Api.Helpers;
using ProjectDevs.Business.Extensions;
using ProjectDevs.Core.Constants;
using ProjectDevs.Core.DTO;
using ProjectDevs.Core.Enumerations;
using ProjectDevs.Core.Interfaces.Repositories;
using ProjectDevs.Core.Interfaces.Services;
using ProjectDevs.Core.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Web.Http;

namespace ProjectDevs.Api.Controllers
{
    [RoutePrefix("api/test-scripts")]
    [AllowAnonymous]
    public class TestScriptsController : BaseApiController
    {
        private static readonly Logger _logger = LogManager.GetCurrentClassLogger();
        private readonly IRepoFactory _repoFactory;
        private readonly ICacheService _cacheService;
        private readonly IEmailService _emailService;

        public TestScriptsController(IRepoFactory repoFactory, ICacheService cacheService, IEmailService emailService)
        {
            _repoFactory = repoFactory;
            _cacheService = cacheService;
            _emailService = emailService;
        }

        [Route("")]
        public IHttpActionResult GetTestScripts(int storyId = 0, int projectId = 0, string teamIds = "", int pno = 1, int psize = PdConstants.DefaultPageSize)
        {
            int? storyIdParam = null;
            if (storyId > 0)
                storyIdParam = storyId;

            var scripts = _repoFactory.TestScripts.GetTestScripts(storyIdParam, null, teamIds);
            if (scripts?.Any() == true)
            {
                if (projectId > 0)
                {
                    scripts = scripts.Where(s => s.ProjectId == projectId);
                }

                var paged = scripts.GetPaged(pno, psize);
                if (paged?.Any() == true)
                {
                    var pagedDisplay = paged.Select(sp => ConvertToScriptDto(sp));
                    var pagingData = new PagingModel<TestScriptDto>(pagedDisplay, scripts.Count(), pno, psize);
                    return Ok(pagingData);
                }
            }
            return Ok();
        }
        [Route("{testScriptId}")]
        public IHttpActionResult GetTestScriptById(int testScriptId, int storyId = 0)
        {
            int? storyIdParam = null;
            if (storyId > 0)
                storyIdParam = storyId;

            var script = _repoFactory.TestScripts.GetTestScripts(storyIdParam, testScriptId)?.FirstOrDefault();
            if (script != null)
            {
                var mappings = _repoFactory.TestScripts.GetTestScriptAssigneeMappings(testScriptId).ToList();
                var dto = ConvertToScriptDto(script);
                dto.AssigneeMappings = ConvertToScriptAssigneeMappingDto(mappings);
                return Ok(dto);
            }
            return NotFound();
        }

        [HttpPost, Route("create")]
        public IHttpActionResult CreateTestScript(TestScript model)
        {
            model.CreatedByUserId = base.UserId;
            if (model.StoryId <= 0)
            {
                ModelState.AddModelError("Story", "StoryId is required");
            }
            if (ModelState.IsValid)
            {
                var newScriptId = _repoFactory.TestScripts.CreateTestScript(model);
                if (newScriptId.HasValue)
                {
                    CreateTestScriptAssigneeMapping(newScriptId.Value, model.AssignedToDeveloperId, model.AssignedToDevManagerId, model.AssignedToBusinessAnalystId,
                        model.AssignedToBusinessStakeholderId, model.TestScriptStatus);

                    model.TestScriptId = newScriptId.Value;

                    if (!string.IsNullOrWhiteSpace(model.AssignedToDeveloperId)
                        && !string.Equals(model.AssignedToDeveloperId, UserId, System.StringComparison.OrdinalIgnoreCase))
                    {
                        var receipientName = _cacheService.GetUserName(model.AssignedToDeveloperId);
                        if (!string.IsNullOrWhiteSpace(receipientName))
                        {
                            var receipient = new MailUser(model.AssignedToDeveloperId, receipientName);
                            var actor = new MailUser(UserId, DisplayName);
                            var testScriptLink = UrlFactory.GetTestScriptPageUrl(model.StoryId, model.TestScriptId);
                            _emailService.SendMail(receipient, Core.Enumerations.EmailType.TestScriptAssigned, actor, testScriptLink);
                        }
                    }

                    //Notifications
                    var notifications = new List<ProjectNotification>();
                    if (!string.IsNullOrWhiteSpace(model.AssignedToDeveloperId))
                    {
                        notifications.Add(new ProjectNotification
                        {
                            Text = $"<strong>{base.DisplayName}</strong> has created a new test script and assigned it to you.",
                            Hyperlink = $"/User-Story/{model.StoryId}/Test-Scripts/{newScriptId}",
                            UserId = model.AssignedToDeveloperId,
                        });
                    }

                    if (notifications.Any())
                    {
                        notifications = notifications.Where(n => !n.UserId.Equals(base.UserId, System.StringComparison.OrdinalIgnoreCase)).ToList();
                        if (notifications.Any())
                            _repoFactory.Notifications.CreateNotifications(notifications);
                    }

                    return Created($"/api/test-scripts/{model.TestScriptId}", model);
                }
            }
            return BadRequest(ModelState);
        }

        [HttpPost, Route("updateassigneestatus")]
        public IHttpActionResult UpdateAssigneeStatus([FromBody] TestScriptUpdateAssigneeStatusInputDto input)
        {
            _repoFactory.TestScripts.TestScriptAssigneeMappingStatusUpdate(input.testScriptId, input.userId, input.statusId, input.userType);
            return Ok();
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("exporttestscriptdetail/{Id}")]
        public IHttpActionResult ExportTestScriptDetail(int Id)
        {
            string html = GetTestScriptDetailAsHtml(Id);
            //return Ok(html);

            StringReader sr = new StringReader(html);
            Document pdfDoc = new Document(PageSize.A4, 10f, 10f, 10f, 0f);
            HTMLWorker htmlparser = new HTMLWorker(pdfDoc);
            using (MemoryStream memoryStream = new MemoryStream())
            {
                string fileName = "TestScript_" + DateTime.Now.Ticks.ToString().Substring(DateTime.Now.Ticks.ToString().Length - 8, 8) + ".pdf";
                string filePath = Path.Combine(Path.GetTempPath(), fileName);
                PdfWriter writer = PdfWriter.GetInstance(pdfDoc, memoryStream);
                pdfDoc.Open();

                htmlparser.Parse(sr);
                pdfDoc.Close();

                byte[] bytes = memoryStream.ToArray();
                memoryStream.Close();

                File.WriteAllBytes(filePath, bytes);

                return Ok(new
                {
                    success = true,
                    fileName = fileName.Replace(".", "^")
                });
            }
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("downloadtestscriptpdf/{fileName}")]
        public IHttpActionResult DownloadTestScriptPdf(string fileName)
        {
            fileName = fileName.Replace("^", ".");
            string filePath = Path.Combine(Path.GetTempPath(), fileName);
            if (File.Exists(filePath))
            {
                var bytes = File.ReadAllBytes(filePath);
                IHttpActionResult response;
                HttpResponseMessage responseMsg = new HttpResponseMessage(HttpStatusCode.OK);
                responseMsg.Content = new ByteArrayContent(bytes);
                responseMsg.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment");
                responseMsg.Content.Headers.ContentDisposition.FileName = fileName;
                responseMsg.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
                response = ResponseMessage(responseMsg);
                return response;
            }
            else
            {
                return BadRequest("Error occured while processing your request!");
            }
        }

        private string GetTestScriptDetailAsHtml(int id)
        {
            var script = _repoFactory.TestScripts.GetTestScripts(null, id)?.FirstOrDefault();
            if (script != null)
            {
                var mappings = _repoFactory.TestScripts.GetTestScriptAssigneeMappings(id).ToList();
                var dto = ConvertToScriptDto(script);
                dto.AssigneeMappings = ConvertToScriptAssigneeMappingDto(mappings);



                string filePath = System.Web.Hosting.HostingEnvironment.MapPath("~/Content/TestScriptExportAsPdf.html");
                string html = File.ReadAllText(filePath);

                var developer = dto.AssigneeMappings.Where(a => a.UserType == "Developer").Select(a => a.FullName).FirstOrDefault();
                var devManager = dto.AssigneeMappings.Where(a => a.UserType == "DevManager").Select(a => a.FullName).FirstOrDefault();
                var businessAnalyst = dto.AssigneeMappings.Where(a => a.UserType == "BusinessAnalyst").Select(a => a.FullName).FirstOrDefault();
                var businessStakeholder = dto.AssigneeMappings.Where(a => a.UserType == "BusinessStakeholder").Select(a => a.FullName).FirstOrDefault();


                html = html.Replace("@@v0@@", dto.ProjectName);
                html = html.Replace("@@v1@@", dto.CreatedByUserName);
                html = html.Replace("@@v2@@", developer);
                html = html.Replace("@@v3@@", dto.TestScriptStatusName);
                html = html.Replace("@@v4@@", string.Format("{0:MM/dd/yyyy}", dto.RequestDate));
                html = html.Replace("@@v5@@", devManager);

                html = html.Replace("@@v7@@", dto.StoryName);
                html = html.Replace("@@v8@@", dto.StoryF1);
                html = html.Replace("@@v9@@", string.Format("{0:MM/dd/yyyy}", dto.RequestedByDate));
                html = html.Replace("@@v10@@", businessAnalyst);
                html = html.Replace("@@v11@@", dto.StoryF2);
                html = html.Replace("@@v12@@", businessStakeholder);
                html = html.Replace("@@v13@@", dto.StoryF3);

                string stepsHtml = string.Empty;
                var steps = _repoFactory.TestScripts.GetTestScriptSteps(id).Select(a => a).ToList();

                if (steps != null)
                {
                    stepsHtml = "";
                    for (int i = 0; i < steps.Count; i++)
                    {
                        var step = ConvertToScriptStepDto(steps[i]);
                        int passId = _cacheService.TestScriptStepsStatusNames.Where(a => a.Value.ToLower() == "pass").Select(a => a.Key).FirstOrDefault();
                        int failId = _cacheService.TestScriptStepsStatusNames.Where(a => a.Value.ToLower() == "fail").Select(a => a.Key).FirstOrDefault();

                        string devStatus = step.DeveloperStepStatusId == null ? "Fail" : step.DeveloperStepStatusId.Value == passId ? "Pass" : "Fail";
                        string devMgrStatus = step.DevMgrStepStatusId == null ? "Fail" : step.DevMgrStepStatusId.Value == passId ? "Pass" : "Fail";
                        string bizAnalystStatus = step.BizAnalystStepStatusId == null ? "Fail" : step.BizAnalystStepStatusId.Value == passId ? "Pass" : "Fail";
                        string bizRequesterStatus = step.BizRequesterStepStatusId == null ? "Fail" : step.BizRequesterStepStatusId.Value == passId ? "Pass" : "Fail";

                        var tr = "<tr><td class='text-center v-middle'>" + step.StepNumber + "</td>";
                        tr += "<td class='v-middle' style='max-width: 200px;word-break: break-all;word-wrap: break-word;'>" + step.Action + "</td>";
                        tr += "<td class='v-middle' style='max-width: 200px;word-break: break-all;word-wrap: break-word;'>" + step.ExpectedResults + "</td>";
                        tr += "<td class='v-middle' style='max-width: 200px;word-break: break-all;word-wrap: break-word;'>" + step.Notes + "</td>";
                        tr += $"<td class='text-center'><div><label>{devStatus}</label></div></td>";
                        tr += $"<td class='text-center'><div><label>{devMgrStatus}</label></div></td>";
                        tr += $"<td class='text-center'><div><label>{bizAnalystStatus}</label></div></td>";
                        tr += $"<td class='text-center'><div><label>{bizRequesterStatus}</label></div></td>";
                        tr += "</tr>";
                        stepsHtml += tr;
                        tr = string.Empty;
                    }

                    html = html.Replace("@@v14@@", stepsHtml);
                }
                return html;
            }

            return "";

        }

        private void CreateTestScriptAssigneeMapping(int testScriptId, string DeveloperId, string DevManagerId, string BusinessAnalystId, string BusinessStakeholderId, int passStatusId)
        {
            _repoFactory.TestScripts.CreateTestScriptAssigneeMapping(testScriptId, DeveloperId, passStatusId, TestScriptUserTypes.Developer.ToString());
            _repoFactory.TestScripts.CreateTestScriptAssigneeMapping(testScriptId, DevManagerId, passStatusId, TestScriptUserTypes.DevManager.ToString());
            _repoFactory.TestScripts.CreateTestScriptAssigneeMapping(testScriptId, BusinessAnalystId, passStatusId, TestScriptUserTypes.BusinessAnalyst.ToString());
            _repoFactory.TestScripts.CreateTestScriptAssigneeMapping(testScriptId, BusinessStakeholderId, passStatusId, TestScriptUserTypes.BusinessStakeholder.ToString());
        }

        private void UpdateTestScriptAssigneeMapping(int testScriptId, string DeveloperId, string DevManagerId, string BusinessAnalystId, string BusinessStakeholderId)
        {
            _repoFactory.TestScripts.UpdateTestScriptAssigneeMapping(testScriptId, DeveloperId, TestScriptUserTypes.Developer.ToString());
            _repoFactory.TestScripts.UpdateTestScriptAssigneeMapping(testScriptId, DevManagerId, TestScriptUserTypes.DevManager.ToString());
            _repoFactory.TestScripts.UpdateTestScriptAssigneeMapping(testScriptId, BusinessAnalystId, TestScriptUserTypes.BusinessAnalyst.ToString());
            _repoFactory.TestScripts.UpdateTestScriptAssigneeMapping(testScriptId, BusinessStakeholderId, TestScriptUserTypes.BusinessStakeholder.ToString());
        }

        [HttpPut, Route("{testScriptId}")]
        public IHttpActionResult UpdateTestScript(int testScriptId, TestScript model)
        {
            model.CreatedByUserId = base.UserId;
            if (testScriptId != model.TestScriptId)
                return NotFound();
            if (model.StoryId <= 0)
                ModelState.AddModelError("Story", "StoryId is required");

            if (ModelState.IsValid)
            {
                var dbScript = _repoFactory.TestScripts.GetTestScripts(model.StoryId, testScriptId)?.FirstOrDefault();
                if (dbScript == null)
                    return BadRequest();

                model.LastModifiedBy = base.UserId;
                model.LastModifiedOn = DateTime.Now;

                _repoFactory.TestScripts.UpdateTestScript(model);

                UpdateTestScriptAssigneeMapping(testScriptId, model.AssignedToDeveloperId, model.AssignedToDevManagerId, model.AssignedToBusinessAnalystId,
                        model.AssignedToBusinessStakeholderId);

                if (!string.IsNullOrWhiteSpace(model.AssignedToDeveloperId)
                    && !string.Equals(model.AssignedToDeveloperId, UserId, StringComparison.OrdinalIgnoreCase)
                    && !string.Equals(dbScript.DeveloperId, model.AssignedToDeveloperId, StringComparison.OrdinalIgnoreCase))
                {
                    var receipientName = _cacheService.GetUserName(model.AssignedToDeveloperId);
                    if (!string.IsNullOrWhiteSpace(receipientName))
                    {
                        var receipient = new MailUser(model.AssignedToDeveloperId, receipientName);
                        var actor = new MailUser(UserId, DisplayName);
                        var testScriptLink = UrlFactory.GetTestScriptPageUrl(model.StoryId, model.TestScriptId);
                        _emailService.SendMail(receipient, Core.Enumerations.EmailType.TestScriptAssigned, actor, testScriptLink);
                    }
                }
                var approveStatusId = GetTestScriptApproveStatusId();
                if (dbScript.TestScriptStatus != approveStatusId && model.TestScriptStatus == approveStatusId
                    && !string.IsNullOrWhiteSpace(model.AssignedToDeveloperId)
                    && !string.Equals(model.AssignedToDeveloperId, UserId, StringComparison.OrdinalIgnoreCase))
                {
                    var receipientName = _cacheService.GetUserName(model.AssignedToDeveloperId);
                    if (!string.IsNullOrWhiteSpace(receipientName))
                    {
                        var receipient = new MailUser(model.AssignedToDeveloperId, receipientName);
                        var actor = new MailUser(UserId, DisplayName);
                        var testScriptLink = UrlFactory.GetTestScriptPageUrl(model.StoryId, model.TestScriptId);
                        _emailService.SendMail(receipient, Core.Enumerations.EmailType.TestScriptApproved, actor, testScriptLink);
                    }
                }

                return Ok();
            }
            return BadRequest(ModelState);
        }
        [HttpPatch, Route("{testScriptId}")]
        public IHttpActionResult OneClickApproval(int testScriptId)
        {
            var dbTestScript = _repoFactory.TestScripts.GetTestScripts(testScriptId: testScriptId)?.FirstOrDefault();
            if (dbTestScript?.StoryId > 0)
            {
                if (base.UserId.Equals(dbTestScript.DeveloperId, StringComparison.OrdinalIgnoreCase))
                {
                    var passStatusId = GetTestScriptApproveStatusId();

                    _repoFactory.TestScripts.ApproveTestScript(testScriptId, passStatusId, base.UserId, DateTime.Now);
                    return Ok();
                }
                return StatusCode(HttpStatusCode.Forbidden);
            }
            return NotFound();
        }

        private TestScriptDto ConvertToScriptDto(TestScriptSpResult sp) =>
            new TestScriptDto
            {
                AssignedToDeveloperId = sp.DeveloperId,
                CreatedByUserId = sp.CreatedByUserId,
                RequestDate = sp.RequestDate,
                RequestedByDate = sp.RequestedByDate,
                TestScriptId = sp.TestScriptId,
                TestScriptStatus = sp.TestScriptStatus,
                StoryId = sp.StoryId,
                CreatedByUserName = _cacheService.GetUserName(sp.CreatedByUserId),
                DeveloperName = _cacheService.GetUserName(sp.DeveloperId),
                DevManagerName = _cacheService.GetUserName(sp.DevManagerId),
                BusinessAnalystName = _cacheService.GetUserName(sp.BusinessAnalystId),
                BusinessStakeholderName = _cacheService.GetUserName(sp.BusinessStakeholderId),
                TestScriptStatusName = _cacheService.GetTestScriptStatusName(sp.TestScriptStatus),
                ProjectId = sp.ProjectId,
                ProjectName = _cacheService.GetProjectName(sp.ProjectId),
                StoryF1 = sp.F1,
                StoryF2 = sp.F2,
                StoryF3 = sp.F3,
                LastModifiedOn = sp.LastModifiedOn,
                LastModifiedBy = sp.LastModifiedBy,
                LastModifiedByName = _cacheService.GetUserName(sp.LastModifiedBy),
                StoryName = sp.StoryName
            };

        private ProjectTestScriptsAssigneeMappingDto[] ConvertToScriptAssigneeMappingDto(List<ProjectTestScriptsAssigneeMapping> sp)
        {
            return sp.Select(a => new ProjectTestScriptsAssigneeMappingDto()
            {
                AssignedToUserId = a.AssignedToUserId,
                FullName = _cacheService.GetUserName(a.AssignedToUserId),
                Id = a.Id,
                TestScriptId = a.TestScriptId,
                TestScriptStatus = a.TestScriptStatus,
                UserType = a.UserType
            }).ToArray();
        }

        private int GetTestScriptApproveStatusId() => _cacheService.TestScriptStatusNames
                        .SingleOrDefault(k => k.Value.Equals("approve", StringComparison.OrdinalIgnoreCase)
                                || k.Value.Equals("pass", StringComparison.OrdinalIgnoreCase))
                        .Key;



        #region ------------- Test Script Steps -----------

        [Route("{testScriptId}/steps")]
        public IHttpActionResult GetTestScriptSteps(int testScriptId, int pno = 1, int psize = PdConstants.DefaultPageSize)
        {
            var steps = _repoFactory.TestScripts.GetTestScriptSteps(testScriptId);
            if (steps?.Any() == true)
            {
                var paged = steps.GetPaged(pno, psize);
                if (paged?.Any() == true)
                {
                    var pagedDisplay = paged.Select(sp => ConvertToScriptStepDto(sp));
                    var pagingData = new PagingModel<TestScriptStepDto>(pagedDisplay, steps.Count(), pno, psize);
                    return Ok(pagingData);
                }
            }
            return Ok();
        }
        [Route("{testScriptId}/steps/{stepId}")]
        public IHttpActionResult GetTestScriptStepById(int testScriptId, int stepId)
        {
            var step = _repoFactory.TestScripts.GetTestScriptSteps(testScriptId, stepId)?.FirstOrDefault();
            if (step != null)
            {
                var dto = ConvertToScriptStepDto(step);
                return Ok(dto);
            }
            return NotFound();
        }

        [HttpPost, Route("{testScriptId}/steps/create")]
        public IHttpActionResult CreateTestScriptStep(int testScriptId, TestScriptStep model)
        {
            if (model.TestScriptId != testScriptId)
                return NotFound();
            if (ModelState.IsValid)
            {
                var newStepId = _repoFactory.TestScripts.CreateTestScriptStep(model);
                if (newStepId.HasValue)
                {
                    model.StepId = newStepId.Value;
                    return Created($"/api/test-scripts/${model.TestScriptId}/steps/{model.StepId}", model);
                }
            }
            return BadRequest(ModelState);
        }

        [HttpPut, Route("{testScriptId}/steps/{stepId}")]
        public IHttpActionResult UpdateTestScriptStep(int testScriptId, int stepId, TestScriptStep model)
        {
            if (testScriptId != model.TestScriptId || stepId != model.StepId)
                return NotFound();

            if (ModelState.IsValid)
            {
                _repoFactory.TestScripts.UpdateTestScriptStep(model);
                return Ok();
            }
            return BadRequest(ModelState);
        }

        [HttpPost, Route("{testScriptId}/steps_bulk")]
        public IHttpActionResult UpdateBulkTestScriptSteps(int testScriptId, UpdateBulkTestScriptStepWrapperDto data)
        {

            if (data != null && data.Steps != null && data.Steps.Count > 0)
            {
                if (data.Steps.Where(a => string.IsNullOrEmpty(a.Action) || string.IsNullOrEmpty(a.ExpectedResults)).Count() > 0)
                {
                    return BadRequest("Action or Expected Results or Notes missing for one or more steps !");
                }
                foreach (var step in data.Steps)
                {
                    if (step.StepId > 0)
                    {
                        _repoFactory.TestScripts.UpdateTestScriptStep(step);
                    }
                    else
                    {
                        _repoFactory.TestScripts.CreateTestScriptStep(step);
                    }
                }
                return Ok();
            }
            //if (testScriptId != model.TestScriptId || stepId != model.StepId)
            //    return NotFound();

            //if (ModelState.IsValid)
            //{
            //    _repoFactory.TestScripts.UpdateTestScriptStep(model);
            //    return Ok();
            //}
            return BadRequest(ModelState);
        }

        private TestScriptStepDto ConvertToScriptStepDto(TestScriptStep sp) =>
            new TestScriptStepDto
            {
                StepId = sp.StepId,
                TestScriptId = sp.TestScriptId,
                TestScriptStatus = sp.TestScriptStatus,
                TestScriptStatusName = _cacheService.GetTestScriptStatusName(sp.TestScriptStatus ?? 0),
                Action = sp.Action,
                ExpectedResults = sp.ExpectedResults,
                Notes = sp.Notes,
                StepNumber = sp.StepNumber,
                BizAnalystStepStatusId = sp.BizAnalystStepStatusId,
                BizRequesterStepStatusId = sp.BizRequesterStepStatusId,
                DeveloperStepStatusId = sp.DeveloperStepStatusId,
                DevMgrStepStatusId = sp.DevMgrStepStatusId
            };

        [HttpPost, Route("steps/addnote")]
        public IHttpActionResult AddStepNote([FromBody] TestScriptStepNoteAddDto data)
        {
            _repoFactory.TestScripts.AddTestScriptStepNote(data);
            return Ok();
        }


        #endregion

        [Route("master/status")]
        public IHttpActionResult GetTestScriptStatuses() => Ok(_cacheService.TestScriptStatusNames.Select(s => new { Value = s.Key, Text = s.Value }));

        [Route("master/status_steps")]
        public IHttpActionResult GetTestScriptStepsStatuses() => Ok(_cacheService.TestScriptStepsStatusNames.Select(s => new { Value = s.Key, Text = s.Value }));
    }
}
