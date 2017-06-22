using System;
using System.Globalization;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using Common.Constants;
using Newtonsoft.Json;
using TrackYourFlight.DataContext;
using TrackYourFlight.Dto;
using TrackYourFlight.Interfaces;
using TrackYourFlight.Models;

namespace TrackYourFlight.Services
{
    public class DetailedForecastDataService : IForecastDataService
    {
        public async Task<ForecastDataModel> Get(DateTime time, CoordinatePoint point, int hoursInterval)
        {
            try
            {
                var dataContext = new ForecastDataContext();

                var id = ForecastModel.GenerateId(point, time, ForecastTypes.DetailedType);

                var forecastData = await dataContext.Forecast.FindAsync(id);

                if (forecastData == null)
                {
                    var httpClient = new HttpClient();
                    var uri = GetGfsDataUrl(point);
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
                    var uri = GetGfsDataUrl(point);
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

                var resultModel = JsonConvert.DeserializeObject<DetailedMeteoStateModel>(forecastData.Value);

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

        private static Uri GetGfsDataUrl(CoordinatePoint point)
        {
            var url = string.Format(
                ApiStrings.OpenMeteoForecastApiUrl,
                point.Latitude.ToString(CultureInfo.InvariantCulture),
                point.Longitude.ToString(CultureInfo.InvariantCulture));

            return new Uri(url);
        }
    }
}