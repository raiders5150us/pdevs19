using NLog;
using ProjectDevs.Api.Helpers;
using ProjectDevs.Business.Extensions;
using ProjectDevs.Core.Constants;
using ProjectDevs.Core.Enumerations;
using ProjectDevs.Core.Interfaces.Repositories;
using ProjectDevs.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace ProjectDevs.Api.Controllers
{
    [RoutePrefix("api/files/type/{fileType}")]
    public class FilesController : BaseApiController
    {
        private static readonly Logger _logger = LogManager.GetCurrentClassLogger();
        private readonly IRepoFactory _repoFactory;

        public FilesController(IRepoFactory repoFactory)
        {
            _repoFactory = repoFactory;
        }

        [Route("")]
        public IHttpActionResult GetFiles(int fileType)
        {
            int? fileTypeId = null;
            if (fileType > 0)
                fileTypeId = fileType;

            var files = _repoFactory.Files.GetFiles(fileTypeId: fileTypeId);
            if (files?.Any() == true)
                return Ok(files);
            return Ok();
        }
        [Route("my")]
        public IHttpActionResult GetMyFiles(int fileType)
        {
            int? fileTypeId = null;
            if (fileType > 0)
                fileTypeId = fileType;

            var files = _repoFactory.Files.GetFiles(fileTypeId: fileTypeId, userId: base.UserId);
            if (files?.Any() == true)
                return Ok(files);
            return Ok();
        }

        [Route("~/api/files/project-files")]
        public IHttpActionResult GetProjectFiles(int projectId, string teamId, int pno = 1, int psize = PdConstants.DefaultPageSize)
        {
            var files = _repoFactory.Files.GetFilesOfProject(projectId, null, teamId);
            return GetFilesPaging(files, pno, psize);
        }
        [Route("~/api/files/my-project-files")]
        public IHttpActionResult GetMyProjectFiles(int projectId, string teamId, int pno = 1, int psize = PdConstants.DefaultPageSize)
        {
            var files = _repoFactory.Files.GetFilesOfProject(projectId, base.UserId, teamId);
            return GetFilesPaging(files, pno, psize);
        }
        private IHttpActionResult GetFilesPaging(IEnumerable<ProjectFile> files, int pno, int psize)
        {
            if (files?.Any() == true)
            {
                var paged = files.GetPagingModel(pno, psize);
                if (paged?.Data?.Any() == true)
                    return Ok(paged);
            }
            return Ok();
        }

        [Route("of/{recordId}")]
        public IHttpActionResult GetFilesOfRecord(FileType fileType, int recordId)
        {
            var files = _repoFactory.Files.GetFiles(fileTypeId: (int)fileType, associatedRecordId: recordId);
            if (files?.Any() == true)
                return Ok(files);
            return Ok();
        }

        [HttpPost]
        [Route("of/{recordId}")]
        public async Task<IHttpActionResult> UploadFilesToRecord(FileType fileType, string recordId)
        {
            int relatedRecordId = 0;
            bool isNonTempRecord = int.TryParse(recordId, out relatedRecordId);

            // Check if the request contains multipart/form-data.
            if (!Request.Content.IsMimeMultipartContent())
            {
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);
            }
            try
            {
                if (!System.IO.Directory.Exists(HttpContext.Current.Server.MapPath("~/ProjectFiles")))
                {
                    System.IO.Directory.CreateDirectory(HttpContext.Current.Server.MapPath("~/ProjectFiles"));
                }
                string root = HttpContext.Current.Server.MapPath("~/ProjectFiles");
                var provider = new CustomMultipartFormDataStreamProvider(root);
                // Read the form data  ( and saves the files in the providers root location)
                await Request.Content.ReadAsMultipartAsync(provider);

                var fileNameKey = provider.FormData.AllKeys.FirstOrDefault(k => k.Equals("filename", StringComparison.OrdinalIgnoreCase));
                var fileName = provider.FormData.GetValues(fileNameKey)?.FirstOrDefault();
                if (string.IsNullOrWhiteSpace(fileNameKey) || string.IsNullOrWhiteSpace(fileName))
                {
                    return BadRequest("File Name is required.");
                }

                var transaction = _repoFactory.BeginTransaction();
                try
                {
                    // Get the file names.
                    foreach (MultipartFileData file in provider.FileData)
                    {
                        //Trace.WriteLine(file.Headers.ContentDisposition.FileName);
                        //Trace.WriteLine("Server file path: " + file.LocalFileName);
                        var savedFileName = System.IO.Path.GetFileName(file.LocalFileName);

                        var f = new ProjectFile
                        {
                            AssociatedRecordId = relatedRecordId,
                            FileTypeId = (int)fileType,
                            CreatedByUserId = base.UserId,
                            FileName = fileName,
                            FileLocation = $"/ProjectFiles/{savedFileName}",
                            TempId = isNonTempRecord ? "" : recordId
                        };
                        _repoFactory.Files.CreateFile(f, transaction);
                    }
                    _repoFactory.CommitTransaction();
                    return Ok();
                }
                catch (Exception ex)
                {
                    _repoFactory.RollbackTransaction();
                    throw;
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex, Request.RequestUri.ToString());
                return InternalServerError(ex);
            }
        }

        [Route("of/{recordId}/file/{fileId}")]
        public IHttpActionResult GetFileById(FileType fileType, int recordId, int fileId)
        {
            var dbFile = _repoFactory.Files.GetFiles(fileId, (int)fileType, recordId)?.FirstOrDefault();
            if (dbFile != null)
                return Ok(dbFile);
            return NotFound();
        }

        [HttpPatch]
        [Route("of/{recordId}/file/{fileId}")]
        public IHttpActionResult UpdateFileName(FileType fileType, int recordId, int fileId, FileNameModel model)
        {
            if (string.IsNullOrWhiteSpace(model.FileName))
                return BadRequest("File Name is required.");
            var dbFile = _repoFactory.Files.GetFiles(fileId, (int)fileType, recordId)?.FirstOrDefault();
            if (dbFile != null)
            {
                dbFile.FileName = model.FileName;
                _repoFactory.Files.UpdateFile(dbFile);
                return Ok();
            }
            return NotFound();
        }

        [HttpPost]
        [Route("of/{recordId}/file/{fileId}")]
        public async Task<IHttpActionResult> UpdateFile(FileType fileType, int recordId, int fileId)
        {
            // Check if the request contains multipart/form-data.
            if (!Request.Content.IsMimeMultipartContent())
            {
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);
            }
            try
            {
                var dbFile = _repoFactory.Files.GetFiles(fileId, (int)fileType, recordId)?.FirstOrDefault();
                if (dbFile == null)
                    return NotFound();

                var previousFileLocation = dbFile.FileLocation;
                string root = HttpContext.Current.Server.MapPath("~/ProjectFiles");
                var provider = new CustomMultipartFormDataStreamProvider(root);
                // Read the form data  ( and saves the files in the providers root location)
                await Request.Content.ReadAsMultipartAsync(provider);

                var fileNameKey = provider.FormData.AllKeys.FirstOrDefault(k => k.Equals("filename", StringComparison.OrdinalIgnoreCase));
                var fileName = provider.FormData.GetValues(fileNameKey)?.FirstOrDefault();
                if (string.IsNullOrWhiteSpace(fileNameKey) || string.IsNullOrWhiteSpace(fileName))
                {
                    return BadRequest("File Name is required.");
                }

                try
                {
                    // Get the file names.
                    foreach (MultipartFileData file in provider.FileData)
                    {
                        //Trace.WriteLine(file.Headers.ContentDisposition.FileName);
                        //Trace.WriteLine("Server file path: " + file.LocalFileName);
                        var savedFileName = System.IO.Path.GetFileName(file.LocalFileName);

                        dbFile.FileName = fileName;
                        dbFile.FileLocation = $"/ProjectFiles/{savedFileName}";
                        _repoFactory.Files.UpdateFile(dbFile);
                    }
                    if (!string.IsNullOrWhiteSpace(previousFileLocation))
                    {
                        // Delete existing file from the Physical Location
                        var physiclFile = HttpContext.Current.Server.MapPath($"~/{previousFileLocation}");
                        if (System.IO.File.Exists(physiclFile))
                        {
                            System.IO.File.Delete(physiclFile);
                        }
                    }
                    return Ok();
                }
                catch (Exception)
                {
                    throw;
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex, Request.RequestUri.ToString());
                return InternalServerError(ex);
            }
        }
    }
}
