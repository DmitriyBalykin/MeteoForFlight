using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MeteoForFlight.Dto;

namespace MeteoForFlight.Models
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
        public virtual CoordinatePoint Point { get; set; }

        [DisplayName("ForecastTime")]
        public DateTime Time { get; set; }

        [DisplayName("ForecastValue")]
        public string Value { get; set; }

        public static string GenerateId(CoordinatePoint point, DateTime time)
        {
            return $"{time:yyyy.MM.dd}_{point}";
        }
    }
}