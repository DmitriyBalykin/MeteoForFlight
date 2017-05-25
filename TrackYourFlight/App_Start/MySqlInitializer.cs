using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using TrackYourFlight.Models;

namespace TrackYourFlight
{
    public class MySqlInitializer : IDatabaseInitializer<ApplicationDbContext>
    {
        public void InitializeDatabase(ApplicationDbContext context)
        {
            if (!context.Database.Exists())
            {
                context.Database.Create();
            }
            else
            {
                var targetTableName = "AspNetUsers";

                var isMigrationHistoryTableExists =
                    ((IObjectContextAdapter) context).ObjectContext.ExecuteStoreQuery<int>(
                        $"SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = '{targetTableName}' AND table_name = '__MigrationHistory'");

                if (isMigrationHistoryTableExists.FirstOrDefault() == 0)
                {
                    context.Database.Delete();
                    context.Database.Create();
                }
            }
        }
    }
}