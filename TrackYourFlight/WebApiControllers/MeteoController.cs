using System;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Mvc;
using TrackYourFlight.Utilities;

namespace TrackYourFlight.WebApiControllers
{
    public class MeteoController : ApiController
    {
        private const string BaseUrl = "https://rucsoundings.noaa.gov/get_soundings.cgi?data_source=GFS&latest=latest";

        [System.Web.Http.HttpGet]
        public async Task<ActionResult> Data()
        {
            var httpClient = new HttpClient();
            var uri = GetGfsDataUrl(2017, "Jun", 1, 10, 0, 36, 50.5, 30.5);

            var result = await httpClient.GetStringAsync(uri);

            var data = DiagramForecastParser.Parse(result);

            return new JsonResult { Data = data, JsonRequestBehavior = JsonRequestBehavior.AllowGet};
        }

        private static Uri GetGfsDataUrl(int year, string monthName, int day, int hour, int minute, int hoursInterval, double latitude, double longitude)
        {
            var url = BaseUrl +
                "&start_year=" + year +
                "&start_month_name=" + monthName +
                "&start_mday=" + day +
                "&start_hour=" + hour +
                "&start_min=" + minute +
                "&n_hrs=" + hoursInterval +
                "&fcst_len=shortest" +
                "&airport=" + latitude + "%2C" + longitude +
                "&text=Ascii%20text%20%28GSD%20format%29&hydrometeors=false&start=latest";

            return new Uri(url);
        }
    }
}
