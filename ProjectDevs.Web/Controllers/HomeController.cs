using System.Web.Mvc;

namespace ProjectDevs.Web.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Projects()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }
        public ActionResult ProjectDetails()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }
        public ActionResult UserStories()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }
        public ActionResult UserStoryDetails()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }
        public ActionResult UserStoryTasks()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }
        public ActionResult UserStoryTaskDetails()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }
        public ActionResult Sprints()
        {
            ViewBag.Message = "Your application description page.";
            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}