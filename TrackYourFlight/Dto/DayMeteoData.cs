using System;
using System.Collections.Generic;

namespace TrackYourFlight.Dto
{
    public class DayMeteoData
    {
        public DateTime Date { get; set; }

        public IEnumerable<MeteoStateModel> MeteoForecasts { get; set; }
    }
}