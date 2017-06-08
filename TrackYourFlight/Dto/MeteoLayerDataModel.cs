namespace TrackYourFlight.Dto
{
    public class MeteoLayerModel
    {
        public double Pressure { get; set; }

        public double Altitude { get; set; }

        public double Temperature { get; set; }

        public double DewPoint { get; set; }

        public int WindDirection { get; set; }

        public double WindSpeed { get; set; }
    }
}