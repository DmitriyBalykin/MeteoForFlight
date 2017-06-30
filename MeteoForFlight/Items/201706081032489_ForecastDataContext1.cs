namespace MeteoForFlight.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ForecastDataContext1 : DbMigration
    {
        public override void Up()
        {
            AddColumn("CoordinatePoints", "Name", c => c.String(unicode: false));
            AddColumn("CoordinatePoints", "Country", c => c.String(unicode: false));
        }
        
        public override void Down()
        {
            DropColumn("CoordinatePoints", "Country");
            DropColumn("CoordinatePoints", "Name");
        }
    }
}
