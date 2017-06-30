using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Globalization;

namespace MeteoForFlight.Dto
{
    public class CoordinatePoint
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public string Name { get; set; }

        public string Country { get; set; }

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

        public override string ToString()
        {
            return Latitude.ToString(CultureInfo.InvariantCulture) + "_" + Longitude.ToString(CultureInfo.InvariantCulture);
        }
    }
}