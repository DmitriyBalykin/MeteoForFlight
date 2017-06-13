using System;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Mvc;
using TrackYourFlight.DataContext;
using TrackYourFlight.Dto;
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
        public JsonResult GeoPoints(string countryName)
        {
            using (var dataContext = new GeoPointsDataContext())
            {
                var pointsList = dataContext.GeoPoints.Where(point => point.Country.Equals(countryName)).ToList();

                return new JsonResult
                {
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                    Data = pointsList
                };
            }
        }

        // POST: Places/Create
        [System.Web.Http.HttpPost]
        [System.Web.Http.AllowAnonymous]
        public async Task<JsonResult> CreatePlace([FromBody]CoordinatePoint point)
        {
            using (var dataContext = new GeoPointsDataContext())
            {
                try
                {
                    dataContext.GeoPoints.Add(point);
                    await dataContext.SaveChangesAsync();
                }
                catch (Exception ex)
                {
                    
                }
                

                return null;
            }
        }

        // POST: Places/Edit/5
        [System.Web.Http.HttpPost]
        public async Task<JsonResult> EditPlace([FromBody]CoordinatePoint point)
        {
            using (var dataContext = new GeoPointsDataContext())
            {
                var existingPoint = await dataContext.GeoPoints.FindAsync(point.Id);

                //TODO: use automapper
                existingPoint.Country = point.Country;
                existingPoint.Name = point.Name;
                existingPoint.Latitude = point.Latitude;
                existingPoint.Longitude = point.Longitude;

                await dataContext.SaveChangesAsync();

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
