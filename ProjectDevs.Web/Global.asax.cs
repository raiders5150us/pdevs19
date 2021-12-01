using ProjectDevs.Web.Models;
using System;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace ProjectDevs.Web
{
    public class MvcApplication : HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
        }
        protected void Application_BeginRequest()
        {
            var themeCookie = Request.Cookies[Constants.ThemeCookieName];
            var cookieValue = Constants.ThemeCookieDefaultValue;
            if (!string.IsNullOrWhiteSpace(themeCookie?.Value))
                cookieValue = themeCookie.Value;
            var newCookie = new HttpCookie(Constants.ThemeCookieName, cookieValue)
            {
                Expires = DateTime.Now.AddYears(1)
            };
            Response.Cookies.Add(newCookie);
            Request.Cookies.Add(newCookie);
        }
    }
}
