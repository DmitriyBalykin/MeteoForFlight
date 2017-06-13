using System;
using System.Data.Entity;
using TrackYourFlight.Dto;

namespace TrackYourFlight.DataContext
{
    public class GeoPointsDataContext : BaseDataContext
    {
        public DbSet<CoordinatePoint> GeoPoints { get; set; }
    }
}