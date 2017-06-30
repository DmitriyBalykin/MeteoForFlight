using System;
using System.Data.Entity;
using MeteoForFlight.Dto;

namespace MeteoForFlight.DataContext
{
    public class GeoPointsDataContext : BaseDataContext
    {
        public DbSet<CoordinatePoint> GeoPoints { get; set; }
    }
}