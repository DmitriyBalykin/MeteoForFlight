$(document).ready(function () {

    var ViewModel = function () {

        var self = this;

        this.RawForecastData = {};
        this.Elevations = ko.observable([]);
        this.SelectedElevation = ko.observable(0);
        this.ForecastGridData = ko.observableArray([]);

        this.OnElevationSelected = function (elevation, event) {
            event.stopPropagation();

            self.SelectedElevation(elevation);
            self.ShowForecastTable(elevation);

            return true;
        };

        this.SetRawData = function(rawData) {
            self.RawForecastData = rawData;
            self.ShowForecastTable();
        };

        this.ShowForecastTable = function(elevation) {
            var data = GetForecastForElevation(self.Elevations(), self.RawForecastData, elevation);
            var gridData = GetShortGridData(data);
            self.ForecastGridData(gridData);
        };
    };

    var meteo = new ViewModel();

    RootVM().RegisterChild(meteo, 'Meteo');

    ko.applyBindings(meteo, $('#MeteoPage')[0]);

    RootVM().OnReady.subscribe(OnSelectorReady);
});

function OnSelectorReady() {
    RootVM().PlaceSelector.PlaceSelected.subscribe(OnPlaceSelected);
}

function OnPlaceSelected() {
    LoadForecastData();
}

function LoadForecastData() {

    ToggleLoadingSpinner(true);

    var time = new Date().toISOString();

    var interval = 120;

    var point = RootVM().PlaceSelector.SelectedPlace();

    var requestData = {
        Time: time,
        Point: point,
        Interval: interval
    };

    $.post('api/Meteo/Data', requestData)
        .done(OnDataLoaded)
        .fail(ReportError);
}

function OnDataLoaded(response) {

    var meteoVM = RootVM().Meteo;

    var forecastData = response.Data;

    var elevations = forecastData.Elevations.map(function (value, index) {
        return {
            index: index,
            elevation: value.toFixed(0)
        };
    });

    meteoVM.Elevations(elevations);
    meteoVM.SelectedElevation(elevations[0]);
    meteoVM.SetRawData(forecastData);

    ToggleLoadingSpinner(false);
}

function GetForecastForElevation(elevations, rawData, elevation) {

    if (elevation == null) {
        elevation = elevations[0];
    }

    var elevationForecastData = rawData.DaysMeteoData.map(function (item) {

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

function GetShortGridData(rawData) {
    return rawData.map(function (dayItem) {
        return {
            Day: new Date(dayItem.Date).toDateString(),
            DayGridViewModel: new ko.simpleGrid.viewModel({
                data: dayItem.MeteoForecasts,
                columns: [
                    { headerText: "Time", rowText: function (item) { return new Date(item.Time).getHours(); } },
                    { headerText: "Wind Direction", rowText: function (item) { return item.ElevationForecast.WindDirection; } },
                    { headerText: "Wind Speed", rowText: function (item) { return item.ElevationForecast.WindSpeed.toFixed(1); } },
                    { headerText: "Temperature", rowText: function (item) { return item.ElevationForecast.Temperature.toFixed(0); } },
                    { headerText: "Humidity", rowText: function (item) { return GetHumidity(item.ElevationForecast.Temperature, item.ElevationForecast.DewPoint) + '%'; }}
                ]
            })
        };
    });
}

function GetHumidity(temp, dewPoint) {
    return (100 - 5 * (temp - dewPoint)).toFixed(0);
}

function ToggleLoadingSpinner(show) {
    $('#MeteoLoadSpinner').toggleClass('hidden', !show);
    $('#MeteoGridContainer').toggleClass('hidden', show);
}