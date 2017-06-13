using System;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Mvc;
using TrackYourFlight.DataContext;
using TrackYourFlight.Services;

namespace TrackYourFlight.WebApiControllers
{
    public class GeoDataController : ApiController
    {
        [System.Web.Http.HttpGet]
        [System.Web.Http.AllowAnonymous]
        public async Task<JsonResult> Countries()
        {
                try
                {
                    //TODO: investigate error loading from EuCountries API
                    var countries = await new CountriesListService().GetCountries();

                    return new JsonResult
                    {
                        JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                        Data = countries
                    };
                }
                catch (Exception ex)
                {
                }

            return new JsonResult
            {
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        [System.Web.Http.HttpGet]
        [System.Web.Http.AllowAnonymous]
        public JsonResult GeoPoints(string country)
        {
            var dataContext = new GeoPointsDataContext();
            var pointsList = dataContext.GeoPoints.Where(point => point.Country.Equals(country)).ToList();

            return new JsonResult
            {
                JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                Data = pointsList
            };
        }

        // POST: Places/Create
        [System.Web.Http.HttpPost]
        public JsonResult CreatePlace(FormCollection collection)
        {
            try
            {
                // TODO: Add insert logic here

                return null;
            }
            catch
            {
                return null;
            }
        }

        // POST: Places/Edit/5
        [System.Web.Http.HttpPost]
        public JsonResult EditPlace(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add update logic here

                return null;
            }
            catch
            {
                return null;
            }
        }

        // POST: Places/Delete/5
        [System.Web.Http.HttpPost]
        public JsonResult Delete(int id)
        {
            try
            {
                // TODO: Add delete logic here

                return null;
            }
            catch
            {
                return null;
            }
        }
    }
}
