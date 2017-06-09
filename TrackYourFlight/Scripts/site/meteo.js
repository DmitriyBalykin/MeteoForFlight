$(document).ready(function () {

    var time = new Date().toISOString();

    var interval = 120;

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

    $.post('api/Meteo/Data', requestData).done(OnDataLoaded);
});

var OnDataLoaded = function (response) {

    var pageContext = this;

    this.forecastData = response.Data;
    this.elevations = this.forecastData.Elevations.map(function (value, index) {
            return { index: index, elevation: value };
    });

    this.GetForecastData = function (elevation) {

        if (elevation == null) {
            elevation = this.elevations[0];
        }

        var elevationForecastData = this.forecastData.DaysMeteoData.map(function (item) {

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

        return elevationForecastData;
    };

    this.SelectedElevation = ko.observable(this.elevations[0]);

    var ViewModel = function () {

        this.Elevations = pageContext.elevations;
        this.SelectedElevation = pageContext.SelectedElevation;
        this.GeoPoint = pageContext.forecastData.GeoPoint;

        var data = pageContext
            .GetForecastData()
            .map(function (dayItem) {
                return {
                    Day: new Date(dayItem.Date).toDateString(),
                    DayGridViewModel: new ko.simpleGrid.viewModel({
                        data: dayItem.MeteoForecasts,
                        columns: [
                            { headerText: "Time", rowText: function (item) { return new Date(item.Time).toLocaleTimeString(); } },
                            { headerText: "Wind Direction", rowText: function (item) { return item.ElevationForecast.WindDirection; } },
                            { headerText: "Wind Speed", rowText: function (item) { return item.ElevationForecast.WindSpeed; } },
                            { headerText: "Temperature", rowText: function (item) { return item.ElevationForecast.Temperature; } },
                            { headerText: "Dew Point", rowText: function (item) { return item.ElevationForecast.DewPoint; } },
                            { headerText: "Pressure", rowText: function (item) { return item.ElevationForecast.Pressure; } }
                        ]
                    })
                };
            });

        pageContext.ForecastGridData = ko.observableArray(data);

        this.ForecastListViewModel = pageContext.ForecastGridData();

        this.OnElevationSelected = function (elevation, event) {
            event.stopPropagation();

            pageContext.SelectedElevation(elevation);
            pageContext.ShowForecastTable(elevation);

            return true;
        };
    };

    this.ShowForecastTable = function (elevation) {

        var data = this.GetForecastData(elevation);
        this.ForecastGridData(data);
    };

    ko.applyBindings(new ViewModel());
}

function RenderTemplate(data, templateName)
{
    var template = $('#' + templateName)[0].innerHTML;
    var node = document.createElement('div');
    node.innerHTML = template;
    ko.cleanNode(node);

    var ViewModel = function () {

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
        //};

        this.DayGridViewModel = new ko.simpleGrid.viewModel({
            data: data.MeteoForecasts,
            columns: [
                { headerText: "Time", rowText: function (item) { return item.Time; } },
                { headerText: "Wind Direction", rowText: function (item) { return item.ElevationForecast.WindDirection; } },
                { headerText: "Wind Speed", rowText: function (item) { return item.ElevationForecast.WindSpeed; } },
                { headerText: "Temperature", rowText: function (item) { return item.ElevationForecast.Temperature; } },
                { headerText: "Dew Point", rowText: function (item) { return item.ElevationForecast.DewPoint; } },
                { headerText: "Pressure", rowText: function (item) { return item.ElevationForecast.Pressure; } },
            ]
        });

        return {
            Date: item.Date,
            MeteoForecasts: meteoData
        };
    });

    ko.applyBindings(new ViewModel(), node);

    return node.innerHTML;
}