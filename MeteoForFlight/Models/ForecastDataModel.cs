﻿using System.Collections.Generic;
using MeteoForFlight.Dto;

namespace MeteoForFlight.Models
{
    public class ForecastDataModel
    {
        public string Model { get; set; }

        public IEnumerable<double> Elevations { get; internal set; }

        public CoordinatePoint GeoPoint { get; internal set; }

        public List<DayMeteoData> DaysMeteoData { get; internal set; }
    }
}