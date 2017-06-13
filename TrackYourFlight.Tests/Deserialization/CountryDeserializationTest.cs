using System;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Hosting;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using TrackYourFlight.Services;

namespace TrackYourFlight.Tests.Deserialization
{
    /// <summary>
    /// Summary description for CountryDeserializationTest
    /// </summary>
    [TestClass]
    public class CountryDeserializationTest
    {

        #region Additional test attributes

        //
        // You can use the following additional attributes as you write your tests:
        //
        // Use ClassInitialize to run code before running the first test in the class
        // [ClassInitialize()]
        // public static void MyClassInitialize(TestContext testContext) { }
        //
        // Use ClassCleanup to run code after all tests in a class have run
        // [ClassCleanup()]
        // public static void MyClassCleanup() { }
        //
        // Use TestInitialize to run code before running each test 
        // [TestInitialize()]
        // public void MyTestInitialize() { }
        //
        // Use TestCleanup to run code after each test has run
        // [TestCleanup()]
        // public void MyTestCleanup() { }
        //

        #endregion

        [TestMethod]
        public async Task Deserialization_Test()
        {
            try
            {
                var testFilePath = "../../../TrackYourFlight/App_Data/CountriesList.txt";

                var result = await new CountriesListService(testFilePath).GetCountries();

                Assert.IsNotNull(result);
                Assert.AreEqual(result.Count(), 250);
            }
            catch (Exception ex)
            {
                
                throw;
            }
            
        }
    }
}
