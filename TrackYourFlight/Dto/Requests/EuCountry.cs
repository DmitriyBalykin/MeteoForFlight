using System.Collections.Generic;

namespace TrackYourFlight.Dto.Requests
{
    public class EuCountry
    {
        public string Name { get; set; }

        public string Capital { get; set; }

        public IEnumerable<string> AltSpellings { get; set; }

        public string Region { get; set; }

        public Translation Translations { get; set; }

        public string Flag { get; set; }
    }
}