using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using TrackYourFlight.DataContext;
using TrackYourFlight.Dto;
using TrackYourFlight.Interfaces;
using TrackYourFlight.Models;
using TrackYourFlight.Utilities;

namespace TrackYourFlight.Services
{
    public class ForecastDataService : IForecastDataService
    {
        private const string BaseUrl = "https://rucsoundings.noaa.gov/get_soundings.cgi?data_source=GFS&latest=latest";

        public async Task<List<MeteoStateModel>> Get(DateTime time, CoordinatePoint point, int hoursInterval)
        {
            try
            {
                var dataContext = new ForecastDataContext();

                var id = ForecastModel.GenerateId(point, time);

                var forecastData = dataContext.Forecast.Where(forecast => forecast.Id.Equals(id, StringComparison.InvariantCulture));
                string resultString;

                if (await forecastData.AnyAsync())
                {
                    resultString = (await forecastData.SingleAsync()).Value;
                }
                else
                {
                    var httpClient = new HttpClient();
                    var uri = GetGfsDataUrl(time, point, hoursInterval);
                    resultString = await httpClient.GetStringAsync(uri);

                    var forecastModel = new ForecastModel
                    {
                        LoadTime = DateTime.UtcNow,
                        Time = time,
                        Coordinates = point,
                        Value = resultString
                    };

                    dataContext.Forecast.Add(forecastModel);
                    await dataContext.SaveChangesAsync();
                }

                return DiagramForecastParser.Parse(resultString);
            }
            catch (Exception ex)
            {
            }
            return null;
        }

        private static Uri GetGfsDataUrl(DateTime time, CoordinatePoint point, int hoursInterval)
        {
            var url = BaseUrl +
                "&start_year=" + time.Year +
                "&start_month_name=" + $"{time:MM}" +
                "&start_mday=" + time.Day +
                "&start_hour=" + time.Hour +
                "&start_min=" + time.Minute +
                "&n_hrs=" + hoursInterval +
                "&fcst_len=shortest" +
                "&airport=" + point.Latitude + "%2C" + point.Longitude +
                "&text=Ascii%20text%20%28GSD%20format%29&hydrometeors=false&start=latest";

            return new Uri(url);
        }
    }
}