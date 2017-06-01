using System;
using System.Collections.Generic;

namespace TrackYourFlight.Dto
{
    public class MeteoStateModel
    {
        public string ForecastModel { get; set; }

        public CoordinatePoint Coordinates { get; internal set; }

        public DateTime DateTime { get; set; }

        public IEnumerable<MeteoLayerModel> MeteoData { get; set; }

        public int Cape { get; set; }

        public int CIN { get; set; }

        public int Helic { get; set; }

        public int PW { get; set; }
    }
}