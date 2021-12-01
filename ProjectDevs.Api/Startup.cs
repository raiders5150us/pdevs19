using Microsoft.Owin;
using Microsoft.Owin.Security.Jwt;
using Owin;

[assembly: OwinStartup(typeof(ProjectDevs.Api.Startup))]
namespace ProjectDevs.Api
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.UseJwtBearerAuthentication(
                new JwtBearerAuthenticationOptions
                {
                    TokenValidationParameters = JwtHandler.GetTokenValidationParameters()
                });
        }
    }
}
