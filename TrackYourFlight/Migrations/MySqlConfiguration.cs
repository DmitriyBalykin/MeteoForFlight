using System.Data.Entity;
using System.Data.Entity.SqlServer;

namespace TrackYourFlight.Migrations
{
    public class MySqlConfiguration : DbConfiguration
    {
        public MySqlConfiguration()
        {
            this.SetHistoryContext("MySql.Data.MySqlClient", (connection, schema) => new MySqlHistoryContext(connection, schema));
            this.SetExecutionStrategy("MySql.Data.MySqlClient", () => new SqlAzureExecutionStrategy());
        }
    }
}