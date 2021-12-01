using System.Web;

namespace ProjectDevs.Web.Models
{
    public class Helpers
    {
        public static string GetSelectedThemeValue() =>
            HttpContext.Current.Request.Cookies[Constants.ThemeCookieName]?.Value ?? Constants.ThemeCookieDefaultValue;
    }
}