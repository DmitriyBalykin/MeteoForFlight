$(document).ready(function () {

    var self = this;

    var ViewModel = function () {

        this.RawForecastData = [];

        var data = self.GetForecastData()
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

        
        this.Elevations = ko.observable([]);
        this.SelectedElevation = ko.observable(0);

        this.ForecastGridData = ko.observableArray(data);

        this.OnElevationSelected = function (elevation, event) {
            event.stopPropagation();

            self.SelectedElevation(elevation);
            self.ShowForecastTable(elevation);

            return true;
        };
    };

    this.ShowForecastTable = function (elevation) {
        var data = self.GetForecastData(elevation);
        this.ForecastGridData(data);
    };

    this.GetForecastData = function (elevation) {

        if (elevation == null) {
            elevation = this.elevations[0];
        }

        var elevationForecastData = this.RawForecastData.DaysMeteoData.map(function (item) {

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

    var meteo = new ViewModel();

    RootVM().RegisterChild(meteo, 'Meteo');

    ko.applyBindings(meteo, $('#MeteoPage')[0]);

    RootVM().OnReady.subscribe(OnSelectorReady);
});

function OnSelectorReady() {
    RootVM().PlaceSelector.OnPlaceSelected(OnPlaceSelected);

    LoadForecastData();
}

function OnDataLoaded(response) {

    var meteoVM = RootVM();

    meteoVM.RawForecastData = response.Data;

    var elevations = forecastData.Elevations.map(function (value, index) {
            return { index: index, elevation: value };
    });

    meteoVM.Elevations(elevations);
    meteoVM.SelectedElevation(elevations[0]);
}

function OnPlaceSelected() {
    LoadForecastData();
}

function LoadForecastData() {
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