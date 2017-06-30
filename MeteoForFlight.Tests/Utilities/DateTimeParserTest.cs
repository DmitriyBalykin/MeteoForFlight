using Microsoft.VisualStudio.TestTools.UnitTesting;
using MeteoForFlight.Utilities;

namespace MeteoForFlight.Tests.Utilities
{
    [TestClass]
    public class DateTimeParserTest
    {
        [TestMethod]
        public void ParseEmpty_Value()
        {
            int targetValue = -1;
            int result = DateTimeParser.GetMonthNumber(null);

            Assert.AreEqual(result, targetValue);

            result = DateTimeParser.GetMonthNumber(string.Empty);

            Assert.AreEqual(result, targetValue);
        }

        [TestMethod]
        public void Parse3Letters_Value()
        {
            int result = DateTimeParser.GetMonthNumber("Aug");

            Assert.AreEqual(result, 8);
        }

        [TestMethod]
        public void ParseFull_Value()
        {
            var result = DateTimeParser.GetMonthNumber("January");

            Assert.AreEqual(result, 1);
        }
    }
}
