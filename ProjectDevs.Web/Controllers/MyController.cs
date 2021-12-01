using System.Web.Mvc;

namespace ProjectDevs.Web.Controllers
{
    [RoutePrefix("My")]
    public class MyController : Controller
    {
        [Route("Projects")]
        public ActionResult Projects()
        {
            ViewBag.My = true;
            return View("~/Views/ProjectDevs/Projects.cshtml");
        }

        [Route("User-Stories")]
        public ActionResult UserStories()
        {
            ViewBag.My = true;
            return View("~/Views/ProjectDevs/ProjectStories.cshtml");
        }

        [Route("Story-Tasks")]
        public ActionResult StoryTasks()
        {
            ViewBag.My = true;
            return View("~/Views/ProjectDevs/UserStoryTasks.cshtml");
        }

        [Route("Meetings")]
        public ActionResult Meetings()
        {
            ViewBag.My = true;
            return View("~/Views/ProjectDevs/Meetings.cshtml");
        }

        [Route("Notes")]
        public ActionResult Notes()
        {
            ViewBag.My = true;
            return View("~/Views/ProjectDevs/Notes.cshtml");
        }

        [Route("Files")]
        public ActionResult Files()
        {
            ViewBag.My = true;
            return View("~/Views/ProjectDevs/Files.cshtml");
        }
    }
}