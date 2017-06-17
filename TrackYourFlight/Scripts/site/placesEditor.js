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

            SetMarkerToPoint(RootVM().PlaceEditor.Map, convertedData.Latitude, convertedData.Longitude);
        };

        this.SavePlace = function (data, event) {

            event.stopPropagation();

            var action = self.EditPlaceSelected() ? 'EditPlace' : 'CreatePlace';
            var url = 'api/GeoData/' + action;

            var dataToSave = RootVM().PlaceSelector.SelectedPlace();

            dataToSave.Name = self.NewPlaceName();
            dataToSave.Latitude = self.NewPlaceLat();
            dataToSave.Longitude = self.NewPlaceLong();
            dataToSave.Country = RootVM().PlaceSelector.SelectedCountry().Name;

            if (!self.EditPlaceSelected()) {
                dataToSave.Id = 0;
            }

            $.post(url, dataToSave, self.OnPlaceSaved, 'json');
        };

        this.DeletePlace = function (data, event) {

            event.stopPropagation();

            var url = 'api/GeoData/DeletePlace/' + RootVM().PlaceSelector.SelectedPlace().Id;

            $.post(url, null, self.OnPlaceDeleted, 'json');
        };

        this.OnPlaceSaved = function (data) {
            LoadPlacesForCountry(RootVM().PlaceSelector, data.Data.Country, data.Data.Place);
        };

        this.OnPlaceDeleted = function (data) {
            var selector = RootVM().PlaceSelector;
            LoadPlacesForCountry(RootVM().PlaceSelector, data.Data.Country, data.Data.Place);
        };
    };

    var placeEditor = new ViewModel();

    ko.applyBindings(placeEditor, $('#PlacePlaceEditorElement')[0]);

    RootVM().RegisterChild(placeEditor, 'PlaceEditor');

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
    var editor = RootVM().PlaceEditor;

    MoveMapToPoint(editor.Map, place.Latitude, place.Longitude, true);

    if (editor.EditPlaceSelected()) {
        editor.NewPlaceName(place.Name);
    }

    editor.NewPlaceLat(place.Latitude);
    editor.NewPlaceLong(place.Longitude);

    SetMarkerToPoint(editor.Map, place.Latitude, place.Longitude);
}

function myMap() {

    var mapOptions = {
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    var editor = RootVM().PlaceEditor;

    var map = new google.maps.Map(document.getElementById("map"), mapOptions);

    map.addListener('click', editor.OnPlaceSelectedWithMap);

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                MoveMapToPoint(map, position.coords.latitude, position.coords.longitude, true);

                var closestCountry = GetClosestCountry(position.coords.latitude, position.coords.longitude);

                SetSelectedCountry(closestCountry);
            },
            function (failure) {
                if (failure.message.indexOf("Only secure origins are allowed") == 0) {
                    // TODO: replace with notification popups
                    $('#GeoLocationNeedsSecureContextError').show();

                    SetDefaultMapState(map);
                } else {
                    // TODO: replace with notification popups
                    $('#GeoLocationUnavailableError').show();
                    SetDefaultMapState(map);
                }
            });
    }

    editor.Map = map;
}

function SetDefaultMapState(map) {
    MoveMapToPoint(map, 0, 0);
    map.setZoom(3);
}

function SetSelectedCountry(country) {

    RootVM().PlaceSelector.SetSelectedCountry(country);

    var map = RootVM().PlaceEditor.Map;

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

        var pointName = RootVM().PlaceEditor.NewPlaceName();

        if (pointName == null || pointName == '') {
            pointName = NewPointName;
        }

        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, long),
            map: map,
            title: pointName
        });

        RootVM().PlaceEditor.Markers.push(marker);
    }
}

function ClearMarkers() {
    RootVM().PlaceEditor.Markers.forEach(function (marker) { marker.setMap(null) });
    RootVM().PlaceEditor.Markers = [];
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
    var editor = RootVM().PlaceEditor;
    var value = NewPointName;

    if (selected) {
        var place = RootVM().PlaceSelector.SelectedPlace();

        value = place.Name;
        editor.NewPlaceLat(place.Latitude);
        editor.NewPlaceLong(place.Longitude);

        SetMarkerToPoint(editor.Map, place.Latitude, place.Longitude);
    }

    editor.NewPlaceName(value);
}