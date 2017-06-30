using System.Collections.Generic;

namespace MeteoForFlight.Dto.Requests
{
    public class Country
    {
        public string Name { get; set; }

        public string Capital { get; set; }

        public IEnumerable<string> AltSpellings { get; set; }

        public string Region { get; set; }

        public Translation Translations { get; set; }

        public string Flag { get; set; }

        public double[] LatLng { get; set; }

        public double? Area { get; set; }
    }
}