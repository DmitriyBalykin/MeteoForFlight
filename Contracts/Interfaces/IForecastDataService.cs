using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Contracts.Interfaces
{
    public interface IForecastDataService
    {
        Task<List<MeteoStateModel>> Get(DateTime time, CoordinatePoint point, int hoursInterval);
    }
}
