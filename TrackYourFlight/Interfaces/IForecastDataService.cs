using System;
using System.Threading.Tasks;
using TrackYourFlight.Dto;
using TrackYourFlight.Models;

namespace TrackYourFlight.Interfaces
{
    public interface IForecastDataService
    {
        Task<ForecastDataModel> Get(DateTime time, CoordinatePoint point, int hoursInterval);
    }
}
