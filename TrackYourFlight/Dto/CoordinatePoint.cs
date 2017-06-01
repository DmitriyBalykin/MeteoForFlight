namespace TrackYourFlight.Dto
{
    public class CoordinatePoint
    {
        public double Latitude { get; set; }

        public double Longitude { get; set; }

        public override bool Equals(object obj)
        {
            var that = obj as CoordinatePoint;

            return
                that != null &&
                Latitude.Equals(that.Latitude) &&
                Longitude.Equals(that.Longitude);
        }

        public override int GetHashCode()
        {
            unchecked
            {
                int hash = 17;
                hash = hash ^ 397 + Latitude.GetHashCode();
                hash = hash ^ 397 + Longitude.GetHashCode();

                return hash;
            }
        }
    }
}