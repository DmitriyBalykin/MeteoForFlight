using System.Data.Entity;

namespace TrackYourFlight.Migrations
{
    public class MySqlConfiguration : DbConfiguration
    {
        public MySqlConfiguration()
        {
            this.SetHistoryContext("MySql.Data.MySqlClient", (connection, schema) => new MySqlHistoryContext(connection, schema));
        }
    }
}