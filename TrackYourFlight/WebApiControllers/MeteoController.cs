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

            var data = await dataService.Get(request.Time, request.Point, request.Interval);

            return new JsonResult { Data = data, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }
    }
}
