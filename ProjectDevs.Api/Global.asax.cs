using NLog;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;

namespace ProjectDevs.Api
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        private static readonly Logger _logger = LogManager.GetCurrentClassLogger();
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
        }
        protected void Application_BeginRequest()
        {
        }
        protected void Application_EndRequest()
        {
        }
        protected void Application_Error()
        {
            var exception = Server.GetLastError();
            if (exception != null)
            {
                if (Request.RawUrl != "/")
                    _logger.Error(exception, Request.RawUrl);
            }
        }
    }
}
