using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using TrackYourFlight.Dto;
using TrackYourFlight.Models;

namespace TrackYourFlight.Utilities
{
    public class DiagramForecastParser
    {
        private const string SpacesTab = "  ";
        private const double FootLength = 0.3048;
        private const double KnotLength = 0.514444;
        private const int Precision = 4;

        public static ForecastDataModel Parse(string input)
        {
            if (string.IsNullOrEmpty(input))
            {
                return null;
            }

            var timeStopsData = GetDataPerHour(input);

            var daysData = timeStopsData.GroupBy(lines =>
            {
                var time = GetForecastTime(lines);

                return new DateTime(time.Year, time.Month, time.Day);
            });

            var daysMeteoData = new List<DayMeteoData>();

            foreach (var dayData in daysData)
            {

                var perHourForecasts = new List<MeteoStateModel>();

                foreach (var hourData in dayData)
                {
                    var parameters = GetForecastColumnHeaders(hourData);

                    perHourForecasts.Add(new MeteoStateModel
                    {
                        Time = GetForecastTime(hourData),
                        AllElevationsMeteoData = GetForecastGridData(hourData),
                        Cape = GetParameter(parameters, 1),
                        CIN = GetParameter(parameters, 3),
                        Helic = GetParameter(parameters, 5),
                        PW = GetParameter(parameters, 7)
                    });
                }

                daysMeteoData.Add(new DayMeteoData
                {
                    Date = dayData.Key,
                    MeteoForecasts = perHourForecasts
                });
            }

            var elevations = daysMeteoData
                .First()
                .MeteoForecasts
                .First()
                .AllElevationsMeteoData
                .Select(data => data.Altitude);

            var result = new ForecastDataModel
            {
                GeoPoint = GetGeoPoint(timeStopsData.First()),
                Model = GetModel(timeStopsData.First()),
                Elevations = elevations,
                DaysMeteoData = daysMeteoData
            };

            return result;
        }

        private static IEnumerable<MeteoLayerModel> GetForecastGridData(IEnumerable<string> hourData)
        {

            var meteoLayersList = new List<MeteoLayerModel>();
            var rawGridData = hourData.Skip(6);

            foreach (var gridLine in rawGridData)
            {
                var lineElements = gridLine.Trim().Split(new[] {SpacesTab}, StringSplitOptions.RemoveEmptyEntries);

                meteoLayersList.Add(new MeteoLayerModel
                {
                    Pressure = GetDouble(lineElements.GetValue(1)),
                    Altitude = GetMetricAltitude(lineElements.GetValue(2)),
                    Temperature = GetCelciusTemperature(lineElements.GetValue(3)),
                    DewPoint = GetCelciusTemperature(lineElements.GetValue(4)),
                    WindDirection = GetInt(lineElements.GetValue(5)),
                    WindSpeed = GetMetricSpeed(lineElements.GetValue(6))
                });
            }

            return meteoLayersList;
        }



        private static DateTime GetForecastTime(IEnumerable<string> hourData)
        {
            var timeLine = hourData.Skip(1).First();

            var elements = timeLine.Split(new[] {SpacesTab}, StringSplitOptions.RemoveEmptyEntries);

            var hour = int.Parse(elements.GetValue(1).ToString().Trim());
            var day = int.Parse(elements.GetValue(2).ToString().Trim());
            var month = DateTimeParser.GetMonthNumber(elements.GetValue(3).ToString().Trim());
            var year = int.Parse(elements.GetValue(4).ToString().Trim());

            var time = new DateTime(year, month, day, hour, 0, 0);

            return time;
        }

        private static List<string> GetForecastColumnHeaders(IEnumerable<string> hourData)
        {
            var headersLine = hourData.Skip(2).First();

            var headers = headersLine.Split(new[] {SpacesTab}, StringSplitOptions.RemoveEmptyEntries).ToList();

            return headers;
        }

        private static string GetModel(IEnumerable<string> hoursData)
        {
            var firstLine = hoursData.First().Split(' ');

            var model = firstLine.First().Trim();

            return model;
        }

        private static int GetParameter(IEnumerable<string> parameters, int index)
        {
            var cape = GetInt(parameters.Skip(index).First());

            return cape;
        }

        private static CoordinatePoint GetGeoPoint(IEnumerable<string> hoursData)
        {
            var coordinatesString = hoursData.First().Split(' ').Last().Trim().Trim(':');
            var coordinates = coordinatesString.Split(',');

            var latitude = GetDouble(coordinates.GetValue(0));
            var longitude = GetDouble(coordinates.GetValue(1));

            return new CoordinatePoint
            {
                Latitude = latitude,
                Longitude = longitude
            };
        }

        private static List<List<string>> GetDataPerHour(string result)
        {
            var perHourBlocks = result.Split(new []{ "\n\n" }, StringSplitOptions.RemoveEmptyEntries);
            var lines = perHourBlocks.Select(block => block.Split('\n').ToList()).ToList();

            return lines;
        }

        private static double GetDouble(object v)
        {
            var value = Math.Round(double.Parse(v.ToString().Trim(), CultureInfo.InvariantCulture), Precision);

            return value;
        }

        private static int GetInt(object v)
        {
            var value = int.Parse(v.ToString().Trim());

            return value;
        }

        private static double GetMetricAltitude(object v)
        {
            //received data is meters
            //var value = Math.Round(GetDouble(v) * FootLength, Precision); 
            var value = Math.Round(GetDouble(v), Precision);

            return value;
        }

        private static double GetMetricSpeed(object v)
        {
            var value = Math.Round(GetDouble(v) * KnotLength, Precision);

            return value;
        }

        private static double GetCelciusTemperature(object v)
        {
            var value = Math.Round(GetDouble(v) / 10, Precision);

            return value;
        }
    }
}