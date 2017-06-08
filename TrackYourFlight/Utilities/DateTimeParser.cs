using System;
using System.Globalization;

namespace TrackYourFlight.Utilities
{
    public class DateTimeParser
    {
        public static int GetMonthNumber(string monthName)
        {
            if (string.IsNullOrEmpty(monthName))
            {
                return -1;
            }

            string format = string.Empty;

            if (monthName.Length == 3)
            {
                format = "MMM";
            }
            else if (monthName.Length > 3)
            {
                format = "MMMM";
            }

            return DateTime.ParseExact(monthName, format, CultureInfo.InvariantCulture).Month;
        }
    }
}