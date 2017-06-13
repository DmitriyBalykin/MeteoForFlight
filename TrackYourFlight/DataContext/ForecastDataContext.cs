using System.Data.Entity;
using TrackYourFlight.Models;

namespace TrackYourFlight.DataContext
{
    public class ForecastDataContext : BaseDataContext
    {
        public DbSet<ForecastModel> Forecast { get; set; }
    }
} 