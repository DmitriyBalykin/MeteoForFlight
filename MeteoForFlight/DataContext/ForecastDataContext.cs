using System.Data.Entity;
using MeteoForFlight.Models;

namespace MeteoForFlight.DataContext
{
    public class ForecastDataContext : BaseDataContext
    {
        public DbSet<ForecastModel> Forecast { get; set; }
    }
} 