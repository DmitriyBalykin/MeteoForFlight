var Map;
var VM;

$(document).ready(function () {

    $.getScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyBEpRZJ45ti62SWlr0GDwB1OWjCHC_5uXI&callback=myMap');

    $.get('api/GeoData/Countries', null, OnCountriesDataLoaded);
});

function OnCountriesDataLoaded(result) {

    var ViewModel = function () {

        var vmContext = this;

        var areCountriesLoaded = false;

        this.Countries = result.Data;
        this.ExistingPlaces = ko.observable([]);
        this.SelectedCountry = ko.observable(result.Data[0]);
        this.IsCreatePlaceSelected = ko.observable(true);
        this.SelectedPlace = ko.observable("");

        areCountriesLoaded = true;

        this.OnCountrySelected = function (countryName, event) {

            if (!areCountriesLoaded) {
                return;
            }

            this.SelectedCountry(countryName);

            var requestData = {
                country: countryName
            };

            $.get('api/GeoData/GeoPoints',
                requestData,
                function(response) {
                    vmContext.ExistingPlaces(response.Data);
                });
        };

        this.OnPlaceSelected = function (data, event) {
            vmContext.SelectedPlace(data);
        };

        this.OnPlaceSelectedWithMap = function (data, event) {

            //convert in some way
            var convertedData = data;

            vmContext.SelectedPlace(convertedData);
        };

        this.SavePlace = function (data, event) {

            var url = 'api/GeoData/';

            if (this.IsCreatePlaceSelected) {
                url += 'Create';
            } else {
                url += 'Edit/' + vmContext.SelectedPlace.Id;
            }

            var dataToSave = vmContext.SelectedPlace;

            $.post(url, dataToSave, OnCountriesDataLoaded);
        };
    };

    VM = new ViewModel();

    //Map.onclick(VM.OnPlaceSelectedWithMap);

    //var marker = new google.maps.Marker({
    //    position: myLatlng,
    //    map: Map,
    //    title: 'Click to zoom'
    //});

    InitializeMapEvents();

    ko.applyBindings(VM, document.body);
}

function myMap() {
    var mapOptions = {
        center: new google.maps.LatLng(50.45, 30.5),
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    Map = new google.maps.Map(document.getElementById("map"), mapOptions);

    InitializeMapEvents();
}

function InitializeMapEvents() {
    if (VM != null && Map.data != null) {
        Map.addListener('click', VM.OnPlaceSelectedWithMap);
    }
}