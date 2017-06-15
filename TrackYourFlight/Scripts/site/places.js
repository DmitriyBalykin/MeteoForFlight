var Map;
var VM;
var Markers = [];
var MapSizeCoefficient = 30;

$(document).ready(function () {

    $.ajaxSetup({
        error: function () { ReportError(true); }
    });

    $.get('api/GeoData/Countries', null, OnCountriesDataLoaded);
});

function OnCountriesDataLoaded(result) {

    if (result.Data == null) {
        ReportError();

        return;
    }

    var ViewModel = function () {

        var vmContext = this;

        var countries = result.Data;
        var places = [];

        var selectedCountry = countries[0];

        this.Countries = ko.observable(countries);
        this.ExistingPlaces = ko.observable(places);
        this.SelectedCountry = ko.observable(selectedCountry);
        this.IsCreatePlaceSelected = ko.observable(false);
        this.SelectedPlace = ko.observable("---");
        this.FlagUrl = ko.observable(selectedCountry.Flag);

        this.IsCreatePlaceSelected.subscribe(function(selected) {
            if (!selected) {
                ClearMarkers();
            }
        });

        this.OnCountrySelected = function (country, event) {

            event.stopPropagation();

            SetSelectedCountry(country);
        };

        this.OnPlaceSelected = function (place, event) {

            event.stopPropagation();

            vmContext.SelectedPlace(place);

            MoveMapToPoint(place.Latitude, place.Longitude, true);
        };

        this.OnPlaceSelectedWithMap = function (place) {

            var convertedData = {
                Latitude: place.latLng.lat().toFixed(3),
                Longitude: place.latLng.lng().toFixed(3)
            };

            $('#PlaceLat').val(convertedData.Latitude);
            $('#PlaceLong').val(convertedData.Longitude);

            if (vmContext.IsCreatePlaceSelected()) {
                vmContext.SelectedPlace(convertedData);

                SetMarkerToPoint(convertedData.Latitude, convertedData.Longitude);
            } else {
                //do something with existing places   
            }
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

            $.post(url, dataToSave, vmContext.OnPlaceSaved, 'json');
        };

        this.SearchCountry = ko.pureComputed({
            read: function() {
                return "";
            },
            write: function(searchCountry) {

                var filteredCountries = countries.filter(function(country) {
                    return country.Name.toLowerCase().indexOf(searchCountry) > -1;
                });

                vmContext.Countries(filteredCountries);
            },
            owner: this
        });

        this.SearchPlace = ko.pureComputed({
            read: function () {
                return "";
            },
            write: function (searchPlace) {

                var filteredPlaces = places.filter(function (place) {
                    return place.Name.toLowerCase().indexOf(searchPlace) > -1;
                });

                vmContext.ExistingPlaces(filteredPlaces);
            },
            owner: this
        });

        this.OnPlaceSaved = function (data) {
            LoadPlacesForCountry(data.Data.Country, data.Data.Place);
        };
    };

    VM = new ViewModel();

    LoadGoogleMap();

    ko.bindingHandlers.fadeVisible = {
        init: function (element, valueAccessor) {
            // Initially set the element to be instantly visible/hidden depending on the value
            var value = valueAccessor();
            $(element).toggle(ko.unwrap(value)); // Use "unwrapObservable" so we can handle values that may or may not be observable
        },
        update: function (element, valueAccessor) {
            // Whenever the value subsequently changes, slowly fade the element in or out
            var value = valueAccessor();
            ko.unwrap(value) ? $(element).fadeIn() : $(element).fadeOut();
        }
    };

    ko.applyBindings(VM, document.body);
}

function myMap() {

    var mapOptions = {
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    Map = new google.maps.Map(document.getElementById("map"), mapOptions);

    Map.addListener('click', VM.OnPlaceSelectedWithMap);

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            MoveMapToPoint(position.coords.latitude, position.coords.longitude);

            var closestCountry = GetClosestCountry(position.coords.latitude, position.coords.longitude);

            SetSelectedCountry(closestCountry);
        });
    }
}

function SetSelectedCountry(country) {
    VM.SelectedCountry(country);
    VM.FlagUrl(country.Flag);

    MoveMapToPoint(country.LatLng[0], country.LatLng[1]);

    LoadPlacesForCountry(country);

    if (country.Area != null) {
        var appxZoom = Math.ceil(MapSizeCoefficient / Math.log10(country.Area));

        Map.setZoom(appxZoom);
    }
}

function LoadPlacesForCountry(country, place) {

    var requestData = {
        countryName: country.Name
    };

    $.get('api/GeoData/GeoPoints',
    requestData,
    function (response) {
        VM.ExistingPlaces(response.Data);

        if (place == null) {
            if (response.Data.length > 0) {
                VM.SelectedPlace(response.Data[0]);
            } else {
                VM.SelectedPlace("---");
            }
        } else {
            VM.SelectedPlace(place);
        }

        ReportError(false);
    });
}

function LoadGoogleMap() {
    $.get('api/ApiData/GetGoogleMapsUrl', null, function (url) {
        $.getScript(url + '&callback=myMap');
    });
}

function MoveMapToPoint(lat, long, isDetailed) {
    if (Map.data != null) {

        centerLocation = new google.maps.LatLng(lat, long);

        Map.setCenter(centerLocation);

        if (isDetailed) {
            Map.setZoom(14);
        }
    }
}

function SetMarkerToPoint(lat, long) {
    if (Map.data != null) {

        ClearMarkers();

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

function ClearMarkers() {
    Markers.forEach(function (marker) { marker.setMap(null) });
    Markers = [];
}

function ReportError(doReport) {
    $('#ErrorContainer').toggleClass('hidden', !doReport);
}

function Pow2(value) {
    return value * value;
}

function GetClosestCountry(latitude, longitude) {
    return VM.Countries().reduce(function (foundCountry, nextCountry) {

        var foundCountryLatDif = Math.abs(foundCountry.LatLng[0] - latitude);
        var nextCountryLatDif = Math.abs(nextCountry.LatLng[0] - latitude);

        var foundCountryLonDif = Math.abs(foundCountry.LatLng[1] - longitude);
        var nextCountryLonDif = Math.abs(nextCountry.LatLng[1] - longitude);

        var foundCountryDistance = Math.sqrt(Pow2(foundCountryLatDif) + Pow2(foundCountryLonDif));
        var nextCountryDistance = Math.sqrt(Pow2(nextCountryLatDif) + Pow2(nextCountryLonDif));

        return nextCountryDistance < foundCountryDistance ? nextCountry : foundCountry;
    });
}