using System;
using System.Threading.Tasks;
using MeteoForFlight.Dto;
using MeteoForFlight.Models;

namespace MeteoForFlight.Interfaces
{
    public interface IForecastDataService
    {
        Task<ForecastDataModel> Get(DateTime time, CoordinatePoint point, int hoursInterval);
    }
}
