using System.Data.Entity;

namespace TrackYourFlight.DataContext
{
	public class BaseDataContext : DbContext
	{
        public BaseDataContext(): base("MySqlConnection")
        {
            Database.SetInitializer(new MySqlInitializer());
        }
	}
}