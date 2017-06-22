using System;
using System.Globalization;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using Common.Constants;
using TrackYourFlight.DataContext;
using TrackYourFlight.Dto;
using TrackYourFlight.Interfaces;
using TrackYourFlight.Models;
using TrackYourFlight.Utilities;

namespace TrackYourFlight.Services
{
    public class SoundingForecastDataService : IForecastDataService
    {
        public async Task<ForecastDataModel> Get(DateTime time, CoordinatePoint point, int hoursInterval)
        {
            try
            {
                var dataContext = new ForecastDataContext();

                var id = ForecastModel.GenerateId(point, time, ForecastTypes.SoundingType);

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

                    dataContext.Forecast.Add(newForecastData); // AddOrUpdate
                    await dataContext.SaveChangesAsync();
                    forecastData = await dataContext.Forecast.FindAsync(id);
                }
                else if (string.IsNullOrEmpty(forecastData.Value))
                {
                    var httpClient = new HttpClient();
                    var uri = GetGfsDataUrl(time, point, hoursInterval);
                    var response = await httpClient.GetAsync(uri);

                    if (response.IsSuccessStatusCode)
                    {
                        forecastData.Value = await response.Content.ReadAsStringAsync();
                    }
                    else
                    {
                        throw new HttpException("Cannot load forecast data from server");
                    }

                    //Consider case when incorrect unparseble data was received

                    await dataContext.SaveChangesAsync();

                    forecastData = await dataContext.Forecast.FindAsync(id);
                }

                if (forecastData == null)
                {
                    throw new OperationCanceledException("Cannot fetch forecast data");
                }

                var resultModel = DiagramForecastParser.Parse(forecastData.Value);

                resultModel.GeoPoint = forecastData.Point;

                return resultModel;
            }
            catch (HttpException ex)
            {
            }
            catch (OperationCanceledException ex)
            {
            }
            catch (Exception ex)
            {
            }

            return null;
        }

        private static Uri GetGfsDataUrl(DateTime time, CoordinatePoint point, int hoursInterval)
        {
            var url = ApiStrings.RucSoundingApiUrl +
                "&start_year=" + time.Year +
                "&start_month_name=" + $"{time:MM}" +
                "&start_mday=" + time.Day +
                "&start_hour=" + time.Hour +
                "&start_min=" + time.Minute +
                "&n_hrs=" + hoursInterval +
                "&fcst_len=shortest" +
                "&airport=" + point.Latitude.ToString(CultureInfo.InvariantCulture) + "%2C" + point.Longitude.ToString(CultureInfo.InvariantCulture) +
                "&text=Ascii%20text%20%28GSD%20format%29&hydrometeors=false&start=latest";

            return new Uri(url);
        }
    }
}