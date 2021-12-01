using ProjectDevs.Api.App_Start;
using ProjectDevs.Api.Helpers;
using System.Web.Http;
using System.Web.Http.ExceptionHandling;

namespace ProjectDevs.Api
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            config.MessageHandlers.Add(new CorsDelegatingHandler());

            // Web API configuration and services
            UnityConfig.RegisterComponents();

            config.EnableCors();

            config.Services.Replace(typeof(IExceptionHandler), new GlobalExceptionHandler());

            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
        }
    }
}
