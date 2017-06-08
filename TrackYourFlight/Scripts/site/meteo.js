var forecastData;

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

    var elevationsObservable = ko.observable(
        forecastData.Elevations.map(function (value, index) {
            return {index:index, elevation:value}
        }));

    var viewModel = {
        Elevations: elevationsObservable,
        SelectedElevation: elevationsObservable[0],
        GeoPoint: forecastData.GeoPoint,
        ForecastDays: forecastData.GridData
    };

    ko.applyBindings(viewModel);
}

var ShowForecastTable = function (id) {

    var PagedGridModel = function (items) {
        //this.items = ko.observableArray(items);



        this.dayGridViewModel = new ko.simpleGrid.viewModel({
            data: this.items,
            columns: [
                { headerText: "Day", rowText: "Day" },
                { headerText: "", rowText: function (item) { return "nested grid" } }
            ]
        });

        this.dataGridViewModel = new ko.simpleGrid.viewModel({
            data: this.items,
            columns: [
                { headerText: "Time", rowText: "Time" },
                { headerText: "Wind", rowText: "Wind" },
                { headerText: "Wind Gusts", rowText: "WindGusts" },
                { headerText: "Humidity", rowText: "Humidity" },
                { headerText: "Cloud Cover", rowText: "Clouds" },
                { headerText: "Precipitation", rowText: "Precipitation" },
                { headerText: "Pressure", rowText: "Pressure" },
                { headerText: "Boundary Layer", rowText: "Boundary" }
            ]
        });
    };

    //ko.applyBindings(new PagedGridModel(forecastData));
}