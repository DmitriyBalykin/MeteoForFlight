using System.Data.Entity;
using TrackYourFlight.Dto;
using TrackYourFlight.Models;

namespace TrackYourFlight.DataContext
{
    public class ForecastDataContext : BaseDataContext
    {
        public ForecastDataContext()
        {
            var fc = this.Forecast.Create();

            fc.Id = "test_id_001";

            var point = new CoordinatePoint
            {
                Latitude = 50.5,
                Longitude = 30.5
            };

            fc.Point = point;


            this.Forecast.Add(fc);
            this.SaveChanges();
        }

        public DbSet<ForecastModel> Forecast { get; set; }
    }
} 