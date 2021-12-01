using System.Configuration;

namespace ProjectDevs.Api.Helpers
{
    public static class UrlFactory
    {
        public static readonly string UIDomain = ConfigurationManager.AppSettings["UIDomain"];
        public static readonly string UserStoryDetail = UIDomain + "/Project/{0}/user-story/{1}";
        public static readonly string TestScriptDetail = UIDomain + "/User-Story/{0}/Test-Scripts/{1}";

        public static string GetUserStoryPageUrl(int projectId, int storyId) => string.Format(UserStoryDetail, projectId, storyId);
        public static string GetTestScriptPageUrl(int storyId, int testScriptId) => string.Format(TestScriptDetail, storyId, testScriptId);
    }
}