using System;

namespace TrackYourFlight.Dto.Requests
{
    public class ForecastDataRequest
    {
        public DateTime Time { get; set; }

        public int Interval { get; set; }

        public CoordinatePoint Point { get; set; }
    }
}