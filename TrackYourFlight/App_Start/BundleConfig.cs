using System.Web.Optimization;

namespace TrackYourFlight
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));
            bundles.Add(new ScriptBundle("~/bundles/knockout").Include(
                        "~/Scripts/knockout-{version}.js",
                        "~/Scripts/libs/knockout.simpleGrid.1.3.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js"));

            bundles.Add(new ScriptBundle("~/bundles/meteo").Include(
                      "~/Scripts/site/meteo.js"));

            bundles.Add(new ScriptBundle("~/bundles/site-common").Include(
                      "~/Scripts/site/common.js",
                      "~/Scripts/site/utils.js"));

            bundles.Add(new ScriptBundle("~/bundles/placesEditor").Include(
                      "~/Scripts/site/placesEditor.js"));

            bundles.Add(new ScriptBundle("~/bundles/placesSelector").Include(
                      "~/Scripts/site/placesSelector.js"));

            bundles.Add(new ScriptBundle("~/bundles/google").Include(
                      "~/Scripts/google/googleanalytics.js"));

            bundles.Add(new ScriptBundle("~/bundles/google").Include(
                      "~/Scripts/google/googleanalytics.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css"));
        }
    }
}
