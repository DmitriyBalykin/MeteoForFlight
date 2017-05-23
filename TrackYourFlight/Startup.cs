using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(TrackYourFlight.Startup))]
namespace TrackYourFlight
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
