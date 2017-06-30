﻿using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Mvc;
using MeteoForFlight.Dto.Requests;
using MeteoForFlight.Services;

namespace MeteoForFlight.WebApiControllers
{
    public class MeteoController : ApiController
    {
        [System.Web.Http.AllowAnonymous]
        [System.Web.Http.HttpPost]
        public async Task<ActionResult> Data([FromBody]ForecastDataRequest request)
        {
            var dataService = new ForecastDataService();
            var meteoData = await dataService.Get(request.Time, request.Point, request.Interval);

            return new JsonResult
            {
                JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                Data = meteoData
            };
        }
    }
}