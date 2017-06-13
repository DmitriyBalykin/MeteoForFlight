var Map;
var VM;
var Markers = [];

$(document).ready(function () {

    $.ajaxSetup({
        error: function () { ReportError(true); }
    });

    $.getScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyBEpRZJ45ti62SWlr0GDwB1OWjCHC_5uXI&callback=myMap');

    $.get('api/GeoData/Countries', null, OnCountriesDataLoaded);
});

function OnCountriesDataLoaded(result) {

    var ViewModel = function () {

        var vmContext = this;

        this.Countries = result.Data;
        this.ExistingPlaces = ko.observable([]);
        this.SelectedCountry = ko.observable(result.Data[0]);
        this.IsCreatePlaceSelected = ko.observable(true);
        this.SelectedPlace = ko.observable("---");

        this.OnCountrySelected = function (country, event) {

            event.stopPropagation();

            vmContext.SelectedCountry(country);

            $('#CountryFlag').attr('src', country.Flag);

            MoveMapToPoint(country.LatLng[0], country.LatLng[1]);

            var requestData = {
                countryName: country.Name
            };

            $.get('api/GeoData/GeoPoints',
                requestData,
                function(response) {
                    vmContext.ExistingPlaces(response.Data);

                    ReportError(false);
                });
        };

        this.OnPlaceSelected = function (place, event) {

            event.stopPropagation();

            vmContext.SelectedPlace(place);

            MoveMapToPoint(place.Latitude, place.Longitude);
        };

        this.OnPlaceSelectedWithMap = function (place) {

            //convert in some way
            var convertedData = {
                Latitude: place.latLng.lat(),
                Longitude: place.latLng.lng()
            };

            $('#PlaceLat').val(convertedData.Latitude);
            $('#PlaceLong').val(convertedData.Longitude);

            vmContext.SelectedPlace(convertedData);

            SetMarkerToPoint(convertedData.Latitude, convertedData.Longitude);
        };

        this.SavePlace = function (data, event) {

            event.stopPropagation();

            var url = 'api/GeoData/';

            if (vmContext.IsCreatePlaceSelected()) {
                url += 'CreatePlace';
            } else {
                url += 'EditPlace/' + vmContext.SelectedPlace.Id;
            }

            var dataToSave = vmContext.SelectedPlace();

            if (dataToSave.Name == null) {
                dataToSave.Id = 0;
                dataToSave.Name = $('#NewPlaceName').val();
                dataToSave.Country = vmContext.SelectedCountry().Name;
            }

            $.post(url, dataToSave, OnPlaceSaved, 'json');
        };

        this.OnPlaceSaved = function () {
            //set place to newly saved
        };
    };

    VM = new ViewModel();

    InitializeMapEvents();

    ko.applyBindings(VM, document.body);
}

function myMap() {

    var mapOptions = {
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    Map = new google.maps.Map(document.getElementById("map"), mapOptions);

    InitializeMapEvents();

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            MoveMapToPoint(position.coords.latitude, position.coords.longitude);

            //$.get('api/GeoData/ClosestCountry', {Latitude: position.coords.latitude, Longitude: position.coords.longitude, function(response){ SetCountry}});
        });
    }
}

function InitializeMapEvents() {
    if (VM != null && Map.data != null) {
        Map.addListener('click', VM.OnPlaceSelectedWithMap);
    }
}

function MoveMapToPoint(lat, long) {
    if (Map.data != null) {

        centerLocation = new google.maps.LatLng(lat, long);

        Map.setCenter(centerLocation);
    }
}

function SetMarkerToPoint(lat, long) {
    if (Map.data != null) {

        Markers.forEach(function (marker) { marker.setMap(null) });
        Markers = [];

        var pointName = $('#NewPlaceName').val();

        if (pointName == null || pointName == '') {
            pointName = "New point";
        }

        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, long),
            map: Map,
            title: pointName
        });

        Markers.push(marker);
    }
}

function ReportError(doReport) {
    $('#ErrorContainer').toggleClass('hidden', doReport);
}