using DocumentFormat.OpenXml.Packaging;
using NLog;
using ProjectDevs.Api.Helpers;
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
using System.Web;
using System.Web.Http;

namespace ProjectDevs.Api.Controllers
{
    [RoutePrefix("api/reports")]
    public class ReportsController : BaseApiController
    {
        private static readonly Logger _logger = LogManager.GetCurrentClassLogger();
        private readonly IRepoFactory _repoFactory;
        private readonly ICacheService _cacheService;

        public ReportsController(IRepoFactory repoFactory, ICacheService cacheService)
        {
            _repoFactory = repoFactory;
            _cacheService = cacheService;
        }

        [HttpGet]
        [Route("reportdata/{reportId}/{sprintId}/{startDate}/{endDate}")]
        public IHttpActionResult GetReportData(int reportId, int? sprintId, DateTime? startDate, DateTime? endDate)
        {
            var reportType = _cacheService.ReportTypes.Where(a => a.Key == reportId).FirstOrDefault();
            switch (reportType.Value)
            {
                case "Sprint Close Story Hours":
                    var reportData = _repoFactory.Sprints.GetProjectSprintCloseReportData(sprintId)?.ToList();
                    reportData.ForEach(a =>
                    {
                        if (a.StartDate == DateTime.MinValue)
                        {
                            a.StartDate = null;
                        }

                        if (a.EndDate == DateTime.MinValue)
                        {
                            a.EndDate = null;
                        }
                    });
                    return Ok(reportData);
                case "Production Support":
                    var reportData_PS = _repoFactory.Sprints.GetProjectStoriesReportData()?.ToList();

                    reportData_PS.ForEach(a =>
                    {
                        if (a.StartDate == DateTime.MinValue)
                        {
                            a.StartDate = null;
                        }

                        if (a.EndDate == DateTime.MinValue)
                        {
                            a.EndDate = null;
                        }
                    });
                    return Ok(reportData_PS);
                case "Production Release":
                    //DateTime dt_Start = DateTime.ParseExact(startDate, "MM/dd/yyyy", System.Globalization.CultureInfo.CurrentUICulture.DateTimeFormat, System.Globalization.DateTimeStyles.None);
                    //DateTime dt_End = DateTime.ParseExact(endDate, "MM/dd/yyyy", System.Globalization.CultureInfo.CurrentUICulture.DateTimeFormat, System.Globalization.DateTimeStyles.None);
                    var reportData_PR = _repoFactory.Sprints.GetProductionReleaseReportData(startDate.Value, endDate.Value)?.ToList();

                    reportData_PR.ForEach(a =>
                    {
                        if (a.StartDate == DateTime.MinValue)
                        {
                            a.StartDate = null;
                        }

                        if (a.EndDate == DateTime.MinValue)
                        {
                            a.EndDate = null;
                        }
                    });
                    return Ok(reportData_PR);
                default:
                    break;
            }
            return NotFound();
        }

        [HttpGet]
        [Route("exportreportdata/{reportId}/{sprintId}/{startDate}/{endDate}")]
        public IHttpActionResult ExportReportData(int reportId, int? sprintId, DateTime? startDate, DateTime? endDate)
        {
            var reportType = _cacheService.ReportTypes.Where(a => a.Key == reportId).FirstOrDefault();
            switch (reportType.Value)
            {
                case "Sprint Close Story Hours":
                    string fileName = "SprintCloseStoryHoursReport_" + DateTime.Now.Ticks.ToString().Substring(DateTime.Now.Ticks.ToString().Length - 8, 8) + ".xlsx";
                    var reportData = _repoFactory.Sprints.GetProjectSprintCloseReportData(sprintId)?.ToList();
                    reportData.ForEach(a =>
                    {
                        if (a.StartDate == DateTime.MinValue)
                        {
                            a.StartDate = null;
                        }

                        if (a.EndDate == DateTime.MinValue)
                        {
                            a.EndDate = null;
                        }
                    });

                    if (ExportSprintCloseStoryHoursReport(fileName, reportData))
                    {
                        return Ok(new
                        {
                            success = true,
                            fileName = fileName.Replace(".", "^")
                        });
                    }
                    else
                    {
                        return Ok(new
                        {
                            success = false
                        });
                    }
                case "Production Support":
                    string fileName_PS = "ProductionSupportReport_" + DateTime.Now.Ticks.ToString().Substring(DateTime.Now.Ticks.ToString().Length - 8, 8) + ".xlsx";
                    var reportData_PS = _repoFactory.Sprints.GetProjectStoriesReportData()?.ToList();
                    reportData_PS.ForEach(a =>
                    {
                        if (a.StartDate == DateTime.MinValue)
                        {
                            a.StartDate = null;
                        }

                        if (a.EndDate == DateTime.MinValue)
                        {
                            a.EndDate = null;
                        }
                    });

                    if (ExportProductionSupportReport(fileName_PS, reportData_PS))
                    {
                        return Ok(new
                        {
                            success = true,
                            fileName = fileName_PS.Replace(".", "^")
                        });
                    }
                    else
                    {
                        return Ok(new
                        {
                            success = false
                        });
                    }
                case "Production Release":
                    string fileName_PR = "ProductionReleaseReport_" + DateTime.Now.Ticks.ToString().Substring(DateTime.Now.Ticks.ToString().Length - 8, 8) + ".xlsx";
                    var reportData_PR = _repoFactory.Sprints.GetProductionReleaseReportData(startDate.Value, endDate.Value)?.ToList();
                    reportData_PR.ForEach(a =>
                    {
                        if (a.StartDate == DateTime.MinValue)
                        {
                            a.StartDate = null;
                        }

                        if (a.EndDate == DateTime.MinValue)
                        {
                            a.EndDate = null;
                        }
                    });

                    if (ExportProductionReleaseReport(fileName_PR, reportData_PR))
                    {
                        return Ok(new
                        {
                            success = true,
                            fileName = fileName_PR.Replace(".", "^")
                        });
                    }
                    else
                    {
                        return Ok(new
                        {
                            success = false
                        });
                    }
                default:
                    break;
            }
            return NotFound();
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("downloadreport/{fileName}")]
        public IHttpActionResult DownloadReport(string fileName)
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

        private bool ExportSprintCloseStoryHoursReport(string fileName, List<ProjectSprintCloseResult> data)
        {
            string FilePath = Path.Combine(Path.GetTempPath(), fileName);
            bool ret = ExcelExport.ExportSprintCloseStoryHoursReport(FilePath, data);

            return ret;

        }

        private bool ExportProductionSupportReport(string fileName, List<ProjectStoriesReportDataResult> data)
        {
            string FilePath = Path.Combine(Path.GetTempPath(), fileName);
            bool ret = ExcelExport.ExportProductionSupportReport(FilePath, data);

            return ret;

        }

        private bool ExportProductionReleaseReport(string fileName, List<ProductionReleaseReportDataResult> data)
        {
            string FilePath = Path.Combine(Path.GetTempPath(), fileName);
            bool ret = ExcelExport.ExportProductionReleaseReport(FilePath, data);

            return ret;

        }


        [Route("master/types")]
        public IHttpActionResult GetReportTypes() => Ok(_cacheService.ReportTypes.Select(s => new { Value = s.Key, Text = s.Value }));
    }
}