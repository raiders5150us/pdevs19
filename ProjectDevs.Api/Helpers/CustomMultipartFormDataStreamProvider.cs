using System;
using System.Net.Http;
using System.Text.RegularExpressions;

namespace ProjectDevs.Api.Helpers
{
    public class CustomMultipartFormDataStreamProvider : MultipartFormDataStreamProvider
    {
        public CustomMultipartFormDataStreamProvider(string path) : base(path)
        { }

        public override string GetLocalFileName(System.Net.Http.Headers.HttpContentHeaders headers)
        {
            // override the filename which is stored by the provider (by default is bodypart_x)
            string actualFileName = headers.ContentDisposition.FileName.Trim('\"');
            var fileNameWithoutExtension = System.IO.Path.GetFileNameWithoutExtension(actualFileName);
            var extension = System.IO.Path.GetExtension(actualFileName);
            var newFileName = $"{fileNameWithoutExtension}_{Guid.NewGuid().ToString().Substring(0, 8)}{extension}";
            return Regex.Replace(newFileName, @"[^a-zA-Z0-9_\.]", "-")
                ?.Trim('-');
        }
    }
}