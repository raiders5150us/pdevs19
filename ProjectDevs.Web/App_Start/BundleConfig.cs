using System.Collections.Generic;
using System.Web.Optimization;

namespace ProjectDevs.Web
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            BundleTable.EnableOptimizations = true;
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at https://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css"));

            var sharedScriptsBundle = new ScriptBundle("~/bundles/shared")
                .Include("~/Scripts/js/constants.js")
                .Include("~/Scripts/js/Models.js")
                .Include("~/Scripts/js/Common.js")
                .Include("~/Scripts/js/ApiService.js")
                .Include("~/Scripts/js/UserService.js")
                .Include("~/Scripts/js/DdlService.js");
            sharedScriptsBundle.Orderer = new FixOrderedBundleOrderer();
            bundles.Add(sharedScriptsBundle);
        }
    }
    public class FixOrderedBundleOrderer : IBundleOrderer
    {
        public IEnumerable<BundleFile> OrderFiles(BundleContext context, IEnumerable<BundleFile> files) => files;
    }
}
