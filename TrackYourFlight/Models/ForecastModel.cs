using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Globalization;
using TrackYourFlight.Dto;

namespace TrackYourFlight.Models
{
    public class ForecastModel
    {
        [Key]
        public string Id { get; set; }

        [ForeignKey("Point")]
        public int PointId { get; set; }

        [Required]
        [DisplayName("LoadTime")]
        public DateTime LoadTime { get; set; }

        [Required]
        [DisplayName("Point")]
        public CoordinatePoint Point { get; set; }

        [DisplayName("ForecastTime")]
        public DateTime Time { get; set; }

        [DisplayName("ForecastValue")]
        public string Value { get; set; }

        public static string GenerateId(CoordinatePoint point, DateTime time)
        {
            return time.ToString(CultureInfo.InvariantCulture) + "_" + point;
        }
    }
}