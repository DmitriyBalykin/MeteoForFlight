using System.Data.Entity;
using MySql.Data.Entity;

namespace TrackYourFlight.Migrations
{
    public class MySqlConfiguration : DbConfiguration
    {
        public MySqlConfiguration()
        {
            this.SetHistoryContext("MySql.Data.MySqlClient", (connection, schema) => new MySqlHistoryContext(connection, schema));
            this.SetExecutionStrategy("MySql.Data.MySqlClient", () => new MySqlExecutionStrategy());
            this.SetMigrationSqlGenerator("MySql.Data.MySqlClient", () => new MySqlMigrationSqlGenerator());
        }
    }
}