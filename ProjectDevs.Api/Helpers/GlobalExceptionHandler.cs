using NLog;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.ExceptionHandling;

namespace ProjectDevs.Api.Helpers
{
    public class GlobalExceptionHandler : ExceptionHandler
    {
        private static readonly Logger _logger = LogManager.GetCurrentClassLogger();
        public override void Handle(ExceptionHandlerContext context)
        {
            _logger.Error(context.Exception, context.Request.RequestUri.ToString());
            var result = new HttpResponseMessage(HttpStatusCode.InternalServerError)
            {
                Content = new StringContent("Internal Server Error Occurred"),
                ReasonPhrase = "Exception"
            };
            var request = context.Request;
            var origin = request.Headers.GetValues("Origin").FirstOrDefault();
            result.WriteCorsHeaders(new System.Web.Cors.CorsResult { AllowedOrigin = origin });

            context.Result = new ErrorMessageResult(context.Request, result);
        }

        public class ErrorMessageResult : IHttpActionResult
        {
            private HttpRequestMessage _request;
            private readonly HttpResponseMessage _httpResponseMessage;

            public ErrorMessageResult(HttpRequestMessage request, HttpResponseMessage httpResponseMessage)
            {
                _request = request;
                _httpResponseMessage = httpResponseMessage;
            }

            public Task<HttpResponseMessage> ExecuteAsync(CancellationToken cancellationToken)
            {
                return Task.FromResult(_httpResponseMessage);
            }
        }
    }
}