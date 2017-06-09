using System;
using System.Collections.Generic;

namespace TrackYourFlight.Dto
{
    public class MeteoStateModel
    {
        public DateTime Time { get; set; }

        public IEnumerable<MeteoLayerModel> AllElevationsMeteoData { get; set; }

        public int Cape { get; set; }

        public int CIN { get; set; }

        public int Helic { get; set; }

        public int PW { get; set; }
    }
}