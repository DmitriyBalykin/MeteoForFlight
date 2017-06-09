var forecastData;
var elevations;

$(document).ready(function () {

    var time = Date();
    var interval = 9;

    var point = {
        Latitude: 50.5,
        Longitude: 30.5
    };

    var requestData = {
        Time: time,
        Point: point,
        Interval: interval
    };

    $.post('api/Meteo/Data', requestData).done(DataLoadedHandler);
});

var DataLoadedHandler = function (response) {
    forecastData = response.Data;

    elevations = forecastData.Elevations.map(function (value, index) {
            return { index: index, elevation: value };
    });

    var SelectedElevation = ko.observable(elevations[0]);

    var viewModel = {
        Elevations: elevations,
        SelectedElevation: SelectedElevation,
        GeoPoint: forecastData.GeoPoint,
        ForecastDays: forecastData.GridData,
        OnElevationSelected: function (data, event) {
            event.stopPropagation();

            SelectedElevation(data);
            ShowForecastTable(data);

            return true;
        }
    };

    ko.applyBindings(viewModel);
    ShowForecastTable();
}

var ShowForecastTable = function (elevation) {

    var data = GetForecastData(elevation);

    var PagedGridModel = function (items) {

        this.dayGridViewModel = new ko.simpleGrid.viewModel({
            data: items,
            columns: [
                { headerText: "Day", rowText: "Date" },
                { headerText: "", rowText: function (item) { return "nested grid" } }
            ]
        });

        //this.dataGridViewModel = new ko.simpleGrid.viewModel({
        //    data: items,
        //    columns: [
        //        { headerText: "Time", rowText: "Time" },
        //        { headerText: "Wind", rowText: "Wind" },
        //        { headerText: "Wind Gusts", rowText: "WindGusts" },
        //        { headerText: "Humidity", rowText: "Humidity" },
        //        { headerText: "Cloud Cover", rowText: "Clouds" },
        //        { headerText: "Precipitation", rowText: "Precipitation" },
        //        { headerText: "Pressure", rowText: "Pressure" },
        //        { headerText: "Boundary Layer", rowText: "Boundary" }
        //    ]
        //});
    };

    ko.applyBindings(new PagedGridModel(data));
}

var GetForecastData = function(elevation) {

    if (elevation == null) {
        elevation = elevations[0];
    }

    forecastData.DaysMeteoData.forEach(function (item) {

        var meteoData = item.MeteoForecasts.map(function (dayData) {

            return {
                Time: dayData.Time,
                CIN: dayData.CIN,
                Cape: dayData.Cape,
                Helic: dayData.Helic,
                PW: dayData.PW,
                ElevationForecast: dayData.AllElevationsMeteoData[elevation.index]
            };
        });

        return {
            Date: item.Date,
            MeteoForecasts: meteoData
        };
    });

    return forecastData.DaysMeteoData;
};