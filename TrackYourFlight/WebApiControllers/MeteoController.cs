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
        public async Task<ActionResult> SoundingData([FromBody]ForecastDataRequest request)
        {
            var dataService = new SoundingForecastDataService();
            var meteoData = await dataService.Get(request.Time, request.Point, request.Interval);

            return new JsonResult
            {
                JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                Data = meteoData
            };
        }

        [System.Web.Http.AllowAnonymous]
        [System.Web.Http.HttpPost]
        public async Task<ActionResult> DetailedData([FromBody]ForecastDataRequest request)
        {
            var dataService = new DetailedForecastDataService();
            var meteoData = await dataService.Get(request.Time, request.Point, request.Interval);

            return new JsonResult
            {
                JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                Data = meteoData
            };
        }
    }
}
