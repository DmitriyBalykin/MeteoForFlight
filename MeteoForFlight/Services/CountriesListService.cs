using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using System.Web.Hosting;
using Newtonsoft.Json;
using MeteoForFlight.Dto.Requests;

namespace MeteoForFlight.Services
{
    public class CountriesListService
    {
        private const string CountriesFilePath = @"~/App_Data/CountriesList.txt";
        private readonly string alternativeFilePath;

        public CountriesListService()
        {
            
        }

        public CountriesListService(string filePath)
        {
            alternativeFilePath = filePath;
        }

        public async Task<IEnumerable<Country>> GetCountries()
        {
            var fullPath = string.IsNullOrEmpty(this.alternativeFilePath) ? 
                HostingEnvironment.MapPath(CountriesFilePath) :
                this.alternativeFilePath;

            using (var reader = File.OpenText(fullPath))
            {
                var inputString = await reader.ReadToEndAsync();

                return JsonConvert.DeserializeObject<List<Country>>(inputString);
            }
        }
    }
}