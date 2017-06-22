using System;
using System.IO;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;
using TrackYourFlight.Dto;
using TrackYourFlight.Utilities;

namespace TrackYourFlight.Tests.Utilities
{
    [TestClass]
    public class DetailedForecastParserTest
    {
        private const string DataFilePath = "../TestData/DetailedForecastData.txt";


        [TestMethod]
        public void ValueInput_CorrectOutput_Test()
        {
            var fileContent = File.ReadAllText(DataFilePath);

            var forecastDataModel = JsonConvert.DeserializeObject<DetailedMeteoStateModel>(fileContent);



            Assert.AreEqual(lastGridLine.Altitude, 14758.7208);
            Assert.AreEqual(lastGridLine.Pressure, 10);
            Assert.AreEqual(lastGridLine.Temperature, -8.3);
            Assert.AreEqual(lastGridLine.DewPoint, 9999.9);
            Assert.AreEqual(lastGridLine.WindDirection, 102);
            Assert.AreEqual(lastGridLine.WindSpeed, 19.0344);
        }
    }
}
