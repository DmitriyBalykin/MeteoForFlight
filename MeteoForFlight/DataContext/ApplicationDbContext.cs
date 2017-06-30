using System.Data.Entity;
using Microsoft.AspNet.Identity.EntityFramework;
using MeteoForFlight.Models;

namespace MeteoForFlight.DataContext
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext() : base("MySqlConnection", throwIfV1Schema: false)
        {
            Database.SetInitializer(new MySqlInitializer());
        }

        public static ApplicationDbContext Create()
        {
            return new ApplicationDbContext();
        }
    }
}