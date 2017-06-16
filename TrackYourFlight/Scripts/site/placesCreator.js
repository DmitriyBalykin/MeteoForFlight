var MapSizeCoefficient = 30;
var NewPointName = "New point";

$(document).ready(function () {

    var ViewModel = function () {

        var self = this;

        this.EditPlaceSelected = ko.observable(false);
        this.EditPlaceSelected.subscribe(PlaceSelectedSwitchHandler);

        this.NewPlaceName = ko.observable(NewPointName);
        this.NewPlaceLat = ko.observable(0);
        this.NewPlaceLong = ko.observable(0);

        this.OnReady = new ko.subscribable();
        this.Markers = [];

        this.OnPlaceSelectedWithMap = function (place) {

            var convertedData = {
                Latitude: place.latLng.lat().toFixed(3),
                Longitude: place.latLng.lng().toFixed(3)
            };

            self.NewPlaceLat(convertedData.Latitude);
            self.NewPlaceLong(convertedData.Longitude);

            SetMarkerToPoint(RootVM().PlaceCreator.Map, convertedData.Latitude, convertedData.Longitude);
        };

        this.SavePlace = function (data, event) {

            event.stopPropagation();

            var action = self.EditPlaceSelected() ? 'EditPlace' : 'CreatePlace';
            var url = 'api/GeoData/' + action;

            var dataToSave = RootVM().PlaceSelector.SelectedPlace();

            if (self.EditPlaceSelected()) {
                dataToSave.Name = self.NewPlaceName();
                dataToSave.Latitude = self.NewPlaceLat();
                dataToSave.Longitude = self.NewPlaceLong();
            } else {
                dataToSave.Id = 0;
            }

            $.post(url, dataToSave, self.OnPlaceSaved, 'json');
        };

        this.OnPlaceSaved = function (data) {
            LoadPlacesForCountry(RootVM().PlaceSelector, data.Data.Country, data.Data.Place);
        };
    };

    var placeCreator = new ViewModel();

    ko.applyBindings(placeCreator, $('#PlacePlaceCreatorElement')[0]);

    RootVM().AddChildVM(placeCreator, 'PlaceCreator');

    //selector events subscriptions
    RootVM().OnReady.subscribe(OnSelectorReady);
});

function OnSelectorReady() {

    RootVM().PlaceSelector.CountrySelected.subscribe(OnCountrySelected);
    RootVM().PlaceSelector.PlaceSelected.subscribe(OnPlaceSelected);

    LoadGoogleMap();
}

function OnCountrySelected() {
    SetSelectedCountry(RootVM().PlaceSelector.SelectedCountry());
}

function OnPlaceSelected() {

    var place = RootVM().PlaceSelector.SelectedPlace();
    var creator = RootVM().PlaceCreator;

    MoveMapToPoint(creator.Map, place.Latitude, place.Longitude, true);

    if (creator.EditPlaceSelected()) {
        creator.NewPlaceName(place.Name);
    }

    creator.NewPlaceLat(place.Latitude);
    creator.NewPlaceLong(place.Longitude);
}

function myMap() {

    var mapOptions = {
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    var placeCreatorVM = RootVM().PlaceCreator;

    var map = new google.maps.Map(document.getElementById("map"), mapOptions);

    map.addListener('click', placeCreatorVM.OnPlaceSelectedWithMap);

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            MoveMapToPoint(position.coords.latitude, position.coords.longitude);

            var closestCountry = GetClosestCountry(position.coords.latitude, position.coords.longitude);

            SetSelectedCountry(closestCountry);
        });
    }

    placeCreatorVM.Map = map;
}

function SetSelectedCountry(country) {

    RootVM().PlaceSelector.SetSelectedCountry(country);

    var map = RootVM().PlaceCreator.Map;

    MoveMapToPoint(map, country.LatLng[0], country.LatLng[1]);

    if (country.Area != null) {
        var appxZoom = Math.ceil(MapSizeCoefficient / Math.log10(country.Area));

        map.setZoom(appxZoom);
    }
}

function LoadGoogleMap() {
    $.get('api/ApiData/GetGoogleMapsUrl', null, function (url) {
        $.getScript(url + '&callback=myMap');
    });
}

function MoveMapToPoint(map, lat, long, isDetailed) {
    if (map.data != null) {

        centerLocation = new google.maps.LatLng(lat, long);

        map.setCenter(centerLocation);

        if (isDetailed) {
            map.setZoom(14);
        }
    }
}

function SetMarkerToPoint(map, lat, long) {
    if (map.data != null) {

        ClearMarkers();

        var pointName = $('#NewPlaceName').val();

        if (pointName == null || pointName == '') {
            pointName = NewPointName;
        }

        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, long),
            map: map,
            title: pointName
        });

        RootVM().PlaceCreator.Markers.push(marker);
    }
}

function ClearMarkers() {
    RootVM().PlaceCreator.Markers.forEach(function (marker) { marker.setMap(null) });
    RootVM().PlaceCreator.Markers = [];
}

function GetClosestCountry(latitude, longitude) {
    return RootVM().PlaceSelector.Countries().reduce(function (foundCountry, nextCountry) {

        var foundCountryLatDif = Math.abs(foundCountry.LatLng[0] - latitude);
        var nextCountryLatDif = Math.abs(nextCountry.LatLng[0] - latitude);

        var foundCountryLonDif = Math.abs(foundCountry.LatLng[1] - longitude);
        var nextCountryLonDif = Math.abs(nextCountry.LatLng[1] - longitude);

        var foundCountryDistance = Pow2(foundCountryLatDif) + Pow2(foundCountryLonDif);
        var nextCountryDistance = Pow2(nextCountryLatDif) + Pow2(nextCountryLonDif);

        return nextCountryDistance < foundCountryDistance ? nextCountry : foundCountry;
    });
}

function PlaceSelectedSwitchHandler (selected) {
    var placeNameEl = $('#NewPlaceName');

    var value = selected ? RootVM().PlaceSelector.SelectedPlace().Name : NewPointName;
    placeNameEl.val(value);
}