using Microsoft.IdentityModel.Tokens;
using ProjectDevs.Core.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;

namespace ProjectDevs.Api
{
    public class JwtHandler
    {
        private static string JwtKey => ConfigurationManager.AppSettings["jwt:key"];
        private static string JwtIssuer => ConfigurationManager.AppSettings["jwt:issuer"] ?? "https://projectdevs.com";
        private static string JwtAudience => ConfigurationManager.AppSettings["jwt:audience"];
        private static int ExpiryMinutes => Convert.ToInt32(ConfigurationManager.AppSettings["jwt:expiryMinutes"] ?? "60");
        private static DateTime JwtExpiry => DateTime.Now.AddMinutes(ExpiryMinutes);

        private static SymmetricSecurityKey GetSigningKey() => new SymmetricSecurityKey(Encoding.UTF8.GetBytes(JwtKey));

        public static TokenModel GenerateJwt(IEnumerable<Claim> additionalClaims)
        {
            var credentials = new SigningCredentials(GetSigningKey(), SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            if (additionalClaims?.Any() == true)
                claims.AddRange(additionalClaims);
            var absoluteExpiry = JwtExpiry;
            var token = new JwtSecurityToken(JwtIssuer,
                            JwtAudience,
                            claims,
                            expires: absoluteExpiry,
                            signingCredentials: credentials);
            var jwt = new JwtSecurityTokenHandler().WriteToken(token);
            var jsGetTimeMiliseconds = (long)absoluteExpiry.ToUniversalTime()
                        .Subtract(new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc))
                        .TotalMilliseconds;
            return new TokenModel(jwt, jsGetTimeMiliseconds);
        }

        public static TokenValidationParameters GetTokenValidationParameters()
        {
            return new TokenValidationParameters()
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = JwtIssuer,
                ValidAudience = JwtAudience,
                IssuerSigningKey = GetSigningKey()
            };
        }
    }
}