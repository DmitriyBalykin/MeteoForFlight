using System;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using MeteoForFlight.Dto;
using MeteoForFlight.Utilities;

namespace MeteoForFlight.Tests.Utilities
{
    [TestClass]
    public class DiagramForecastParserTest
    {
        private const string ReturnValue6hours = "GFS analysis valid for grid point 0.0 nm / 360 deg from 50.5,30.5:\nGFS         6      1      Jun    2017\n CAPE     69    CIN     -1  Helic  99999     PW     18\n      1  23062  99999  50.50 -30.50  99999  99999\n      2  99999  99999  99999     35  99999  99999\n      3           50.5,30.5             12     kt\n      9  10000     89    180    110    276     13\n      4   9750    305    157     97    277     17\n      4   9500    525    136     87    278     19\n      4   9250    749    116     77    280     21\n      4   9000    978     96     63    283     22\n      4   8500   1449     58     18    291     24\n      4   8000   1943     26    -34    296     28\n      4   7500   2463     17   -288    299     37\n      4   7000   3018      7   -264    295     42\n      4   6500   3610    -13   -155    290     45\n      4   6000   4244    -51   -158    286     47\n      4   5500   4921   -100   -211    283     49\n      4   5000   5647   -155   -270    282     53\n      4   4500   6433   -218   -309    284     56\n      4   4000   7287   -288   -323    285     59\n      4   3500   8227   -365   -373    284     59\n      4   3000   9276   -450   -467    283     60\n      4   2500  10469   -538   -547    285     64\n      4   2000  11885   -574   -657    283     55\n      4   1500  13714   -546   -824    282     37\n      4   1000  16300   -561   -829    277     22\n      4    700  18575   -541   -831    271     16\n      4    500  20735   -538   -852    273     11\n      4    300  24022   -525   -849    299      1\n      4    200  26658   -490   -858     85      7\n      4    100  31309   -386   -885    103     17\n      4     70  33787   -328  99999    113     17\n      4     50  36187   -260   -905    115     15\n      4     30  39962   -154  99999     99     16\n      4     20  43056   -101  99999     96     21\n      4     10  48421    -83  99999    102     37\n\nGFS 09 h forecast valid for grid point 0.0 nm / 360 deg from 50.5,30.5:\nGFS         9      1      Jun    2017\n CAPE     10    CIN      0  Helic  99999     PW     16\n      1  23062  99999  50.50 -30.50  99999  99999\n      2  99999  99999  99999     35  99999  99999\n      3           50.5,30.5             12     kt\n      9  10000     90    202     55    286     15\n      4   9750    307    178     44    287     20\n      4   9500    528    156     37    287     22\n      4   9250    753    133     31    287     23\n      4   9000    983    111     25    287     24\n      4   8500   1456     66      8    288     25\n      4   8000   1950     21    -23    290     28\n      4   7500   2469     12   -301    300     35\n      4   7000   3021     -4   -275    294     40\n      4   6500   3611    -25   -149    288     45\n      4   6000   4242    -59   -138    284     49\n      4   5500   4918   -105   -173    280     52\n      4   5000   5644   -159   -222    278     56\n      4   4500   6428   -220   -277    278     58\n      4   4000   7283   -290   -334    278     61\n      4   3500   8221   -370   -392    278     65\n      4   3000   9268   -455   -479    280     69\n      4   2500  10460   -538   -567    282     71\n      4   2000  11878   -566   -692    280     60\n      4   1500  13715   -539   -819    281     38\n      4   1000  16304   -561   -823    276     23\n      4    700  18579   -543   -836    272     15\n      4    500  20738   -536   -851    273     10\n      4    300  24028   -523   -847    228      3\n      4    200  26665   -491   -860    115      6\n      4    100  31309   -390   -886    113     14\n      4     70  33785   -328  99999    114     14\n      4     50  36187   -258   -903    102     14\n      4     30  39972   -144  99999     99     20\n      4     20  43082    -84  99999    104     24\n      4     10  48482    -66  99999    111     34\n\n";

        [TestMethod]
        public void EmptyInput_EmptyOutput_Test()
        {
            string result = null;
            var parseResult = DiagramForecastParser.Parse(result);

            Assert.IsNull(parseResult);

            result = string.Empty;
            parseResult = DiagramForecastParser.Parse(result);

            Assert.IsNull(parseResult);
        }

        [TestMethod]
        public void ValueInput_CorrectOutput_Test()
        {
            var forecastDataModel = DiagramForecastParser.Parse(ReturnValue6hours);

            Assert.IsNotNull(forecastDataModel);

            Assert.AreEqual(forecastDataModel.DaysMeteoData.Count, 1);
            Assert.AreEqual(forecastDataModel.DaysMeteoData.First().MeteoForecasts.Count(), 2);
            Assert.AreEqual(forecastDataModel.Model, "GFS");
            Assert.AreEqual(forecastDataModel.GeoPoint, new CoordinatePoint { Latitude = 50.5, Longitude = 30.5 });

            Assert.AreEqual(forecastDataModel.Elevations.Count(), 31);

            var elevations = new []{27.1272, 92.964, 160.02, 228.2952, 298.0944, 441.6552, 592.2264, 750.7224, 919.8864, 1100.328, 1293.5712, 1499.9208, 1721.2056, 1960.7784, 2221.0776, 2507.5896, 2827.3248, 3190.9512, 3622.548, 4180.0272, 4968.24, 5661.66, 6320.028, 7321.9056, 8125.3584, 9542.9832, 10298.2776, 11029.7976, 12180.4176, 13123.4688, 14758.7208 };

            Assert.IsTrue(elevations
                .Zip(forecastDataModel.Elevations, (elev1, elev2) => new Tuple<double, double>(elev1, elev2))
                .All(tuple => tuple.Item1 == tuple.Item2));

            var firstForecastData = forecastDataModel.DaysMeteoData.First().MeteoForecasts.First();

            Assert.AreEqual(firstForecastData.Time, new DateTime(2017, 6, 1, 6, 0, 0));
            Assert.AreEqual(firstForecastData.Cape, 69);
            Assert.AreEqual(firstForecastData.CIN, -1);
            Assert.AreEqual(firstForecastData.Helic, 99999);
            Assert.AreEqual(firstForecastData.PW, 18);

            Assert.AreEqual(firstForecastData.AllElevationsMeteoData.Count(), 31);

            var firstGridLine = firstForecastData.AllElevationsMeteoData.First();

            Assert.AreEqual(firstGridLine.Altitude, 27.1272);
            Assert.AreEqual(firstGridLine.Pressure, 10000);
            Assert.AreEqual(firstGridLine.Temperature, 18.0);
            Assert.AreEqual(firstGridLine.DewPoint, 11.0);
            Assert.AreEqual(firstGridLine.WindDirection, 276);
            Assert.AreEqual(firstGridLine.WindSpeed, 6.6878);

            var lastGridLine = firstForecastData.AllElevationsMeteoData.Last();

            Assert.AreEqual(lastGridLine.Altitude, 14758.7208);
            Assert.AreEqual(lastGridLine.Pressure, 10);
            Assert.AreEqual(lastGridLine.Temperature, -8.3);
            Assert.AreEqual(lastGridLine.DewPoint, 9999.9);
            Assert.AreEqual(lastGridLine.WindDirection, 102);
            Assert.AreEqual(lastGridLine.WindSpeed, 19.0344);
        }
    }
}
