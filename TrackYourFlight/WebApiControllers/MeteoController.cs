using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Mvc;
using TrackYourFlight.Dto.Requests;
using TrackYourFlight.Services;

namespace TrackYourFlight.WebApiControllers
{
    public class MeteoController : ApiController
    {
        [System.Web.Http.AllowAnonymous]
        [System.Web.Http.HttpPost]
        public async Task<ActionResult> Data([FromBody]ForecastDataRequest request)
        {
            var dataService = new ForecastDataService();
            var meteoData = await dataService.Get(request.Time, request.Point, request.Interval);

            var result = new JsonResult { JsonRequestBehavior = JsonRequestBehavior.AllowGet };

            if (meteoData == null || !meteoData.Any())
            {
                return result;
            }

            var commonPointData = meteoData.First();

            result.Data = new
            {
                Elevations = commonPointData.MeteoData.Select(meteo => meteo.Altitude),
                GeoPoint = commonPointData.GeoPoint,
                GridData = meteoData
            };

            return result;
        }
    }
}
