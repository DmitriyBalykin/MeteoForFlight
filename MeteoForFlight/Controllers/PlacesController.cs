using System.Web.Mvc;

namespace MeteoForFlight.Controllers
{
    public class PlacesController : Controller
    {
        // GET: Places
        [RequireHttps]
        public ActionResult Index()
        {
            return View();
        }
    }
}
