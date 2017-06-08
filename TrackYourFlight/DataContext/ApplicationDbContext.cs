using System.Data.Entity;
using Microsoft.AspNet.Identity.EntityFramework;
using TrackYourFlight.Models;

namespace TrackYourFlight.DataContext
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