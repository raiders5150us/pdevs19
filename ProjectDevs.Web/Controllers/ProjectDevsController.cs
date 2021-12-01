using ProjectDevs.Web.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Security.Principal;
using System.Threading;
using System.Web;
using System.Web.Mvc;

namespace ProjectDevs.Web.Controllers
{
    public class ProjectDevsController : Controller
    {
        [Route("Login")]
        public ActionResult Login()
        {            
            string userName = Environment.GetEnvironmentVariable("USERNAME");
            
            ViewBag.userName = userName.Replace("$","");
            return View();
        }

        [Route("dashboard")]
        [Route("")]
        public ActionResult Dashboard()
        {
            return View();
        }

        [Route("projects")]
        public ActionResult Projects() => View();

        [Route("projects/{projectId}")]
        public ActionResult ProjectDetail(int projectId)
        {
            if (projectId <= 0)
                return HttpNotFound();
            ViewBag.ProjectId = projectId;
            return View();
        }
        [Route("user-stories")]
        public ActionResult ProjectStories(int? projectId)
        {
            if (projectId == null || (projectId.HasValue && projectId.Value > 0))
            {
                ViewBag.ShowNextSprintOption = false;
                return View();
            }
            return HttpNotFound();
        }

        [Route("Project/{projectId}/user-story/{storyId}")]
        public ActionResult UserStoryDetail(int projectId, int storyId)
        {
            if (projectId <= 0 || storyId <= 0)
                return HttpNotFound();

            ViewBag.ProjectId = projectId;
            ViewBag.StoryId = storyId;
            return View();
        }

        [Route("User-Story/{storyId}/Tasks")]
        [Route("Project/{projectId}/User-Story/{storyId}/Tasks")]
        [Route("Story-Tasks")]
        public ActionResult UserStoryTasks(int projectId = 0, int storyId = 0)
        {
            ViewBag.StoryId = storyId;
            ViewBag.ProjectId = projectId;
            return View();
        }
        [Route("User-Story/{storyId}/Tasks/{taskId}")]
        public ActionResult UserStoryTaskDetails(int storyId, int taskId)
        {
            if (taskId <= 0 || storyId <= 0)
                return HttpNotFound();

            ViewBag.StoryId = storyId;
            ViewBag.TaskId = taskId;
            return View();
        }

        [Route("Sprints")]
        public ActionResult Sprints() => View();

        [Route("Sprint/{sprintId}")]
        public ActionResult SprintDetail(int sprintId)
        {
            ViewBag.SprintId = sprintId;
            return View();
        }

        [Route("Sprint/{sprintId}/User-Stories")]
        public ActionResult SprintStories(int sprintId)
        {
            ViewBag.SprintId = sprintId;
            ViewBag.ShowNextSprintOption = true;
            return View();
        }

        

        [Route("Meetings")]
        [Route("Project/{projectId}/Meetings")]
        public ActionResult Meetings(int projectId = 0)
        {
            ViewBag.ProjectId = projectId;
            return View();
        }

        [Route("Notes")]
        [Route("Project/{projectId}/Notes/type/{noteType}/of/{recordId}")]
        public ActionResult Notes(int projectId = 0, int noteType = 0, int recordId = 0)
        {
            ViewBag.NoteType = noteType;
            ViewBag.RecordId = recordId;
            ViewBag.ProjectId = projectId;
            return View();
        }

        [Route("Files")]
        [Route("Project/{projectId}/Files/type/{fileType}/of/{recordId}")]
        public ActionResult Files(int projectId = 0, int fileType = 0, int recordId = 0)
        {
            ViewBag.FileType = fileType;
            ViewBag.RecordId = recordId;
            ViewBag.ProjectId = projectId;
            return View();
        }

        [Route("Users")]
        public ActionResult Users() => View();

        [Route("Test-Scripts")]
        [Route("User-Story/{storyId}/Test-Scripts")]
        public ActionResult TestScripts(int storyId = 0)
        {
            ViewBag.StoryId = storyId;
            return View();
        }

        [Route("User-Story/{storyId}/Test-Scripts/{testScriptId}")]
        public ActionResult TestScriptDetails(int storyId, int testScriptId)
        {
            if (storyId <= 0 || testScriptId <= 0)
                return HttpNotFound();

            ViewBag.StoryId = storyId;
            ViewBag.TestScriptId = testScriptId;
            return View();
        }

        [Route("search")]
        public ActionResult Search(string q)
        {
            ViewBag.Search = HttpUtility.UrlDecode(q);
            return View();
        }
        [HttpPost, Route("search")]
        public ActionResult Search(string query, string _) => Redirect("/Search?q=" + HttpUtility.UrlEncode(query));

        [Route("ApiLogs")]
        public ActionResult Logs() => View();

        [Route("RotaSupp")]
        public ActionResult RotaSupp() => View();

        [Route("GetCalendarData")]
        public ActionResult GetCalendarData()
        {
            // Initialization.
            JsonResult result = new JsonResult();

            try
            {
                // Loading.
                List<RotaSuppData> data = this.LoadData();

                // Processing.
                result = this.Json(data, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                // Info
                Console.Write(ex);
            }

            // Return info.
            return result;
        }

        #region Helpers

        #region Load Data       
        private List<RotaSuppData> LoadData()
        {
            // Initialization.
            List<RotaSuppData> lst = new List<RotaSuppData>();

            try
            {
                // Initialization.
                string line = string.Empty;
                string srcFilePath = "files/PublicHoliday.txt";                
                var fullPath = Path.Combine(Server.MapPath("~/Content"), srcFilePath);
                string filePath = new Uri(fullPath).LocalPath;
                
                StreamReader sr = new StreamReader(new FileStream(filePath, FileMode.Open, FileAccess.Read));

                // Read file.
                while ((line = sr.ReadLine()) != null)
                {
                    // Initialization.
                    RotaSuppData infoObj = new RotaSuppData();
                    string[] info = line.Split(',');

                    // Setting.
                    infoObj.Sr = Convert.ToInt32(info[0].ToString());
                    infoObj.Title = info[1].ToString();
                    infoObj.Desc = info[2].ToString();
                    infoObj.Start_Date = info[3].ToString();
                    infoObj.End_Date = info[4].ToString();

                    // Adding.
                    lst.Add(infoObj);
                }

                // Closing.
                sr.Dispose();
                sr.Close();
            }
            catch (Exception ex)
            {
                // info.
                Console.Write(ex);
            }

            // info.
            return lst;
        }

        #endregion

        #endregion

        #region Reports
        [Route("Reports")]        
        public ActionResult Reports()
        {           
            return View();
        }

        #endregion
    }
}