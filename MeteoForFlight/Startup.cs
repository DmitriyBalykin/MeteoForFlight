using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(MeteoForFlight.Startup))]
namespace MeteoForFlight
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
