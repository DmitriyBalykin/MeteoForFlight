using System.Web.Http;
using System.Web.Mvc;
using TrackYourFlight.Models;

namespace TrackYourFlight.WebApi
{
    public class MeteoController : ApiController
    {
        public ActionResult Data(MeteoDataModel model)
        {
            return new JsonResult();
        }
    }
}
