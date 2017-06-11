using System;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
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

        public async Task<ForecastDataModel> Get(DateTime time, CoordinatePoint point, int hoursInterval)
        {
            try
            {
                var dataContext = new ForecastDataContext();

                var id = ForecastModel.GenerateId(point, time);

                var forecastData = await dataContext.Forecast.FindAsync(id);

                if (forecastData == null)
                {
                    var httpClient = new HttpClient();
                    var uri = GetGfsDataUrl(time, point, hoursInterval);
                    var resultString = await httpClient.GetStringAsync(uri);

                    var newForecastData = new ForecastModel
                    {
                        Id = id,
                        LoadTime = DateTime.UtcNow,
                        Time = time,
                        Point = point,
                        Value = resultString
                    };

                    dataContext.Forecast.Add(newForecastData);
                    await dataContext.SaveChangesAsync();

                    forecastData = await dataContext.Forecast.FindAsync(id);
                }

                var resultModel = DiagramForecastParser.Parse(forecastData.Value);

                resultModel.GeoPoint = forecastData.Point;

                return resultModel;
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