using System.Web.Mvc;
using TrackYourFlight.Utilities;

namespace TrackYourFlight.Controllers
{
    public class MeteoController : Controller
    {
        // GET: Meteo
        public ActionResult Index()
        {
            return View();
        }
    }
}