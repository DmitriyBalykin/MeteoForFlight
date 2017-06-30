using System.Web.Mvc;

namespace MeteoForFlight.Controllers
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