var defaultPlaces = [{ Name: '---' }];

$(document).ready(function () {
    $.get('api/GeoData/Countries', null, OnCountriesDataLoaded);
});

function OnCountriesDataLoaded(result) {

    if (result.Data == null) {
        ReportError();

        return;
    }

    var ViewModel = function () {

        var self = this;

        // external events

        this.CountrySelected = new ko.subscribable();
        this.PlaceSelected = new ko.subscribable();
        this.OnReady = new ko.subscribable();

        // viewmodel content

        var countries = result.Data;
        var selectedCountry = countries[0];

        this.Countries = ko.observable(countries);
        this.Places = ko.observable(defaultPlaces);
        this.SelectedCountry = ko.observable(selectedCountry);
        this.SelectedPlace = ko.observable(defaultPlaces[0]);
        this.FlagUrl = ko.observable(selectedCountry.Flag);
        this.IsPlacesLoaded = ko.observable(false);

        this.OnCountrySelected = function (country, event) {

            event.stopPropagation();

            SetSelectedCountry(country);

            self.CountrySelected.notifySubscribers();
        };

        this.OnPlaceSelected = function (place, event) {

            event.stopPropagation();

            self.SelectedPlace(place);

            self.PlaceSelected.notifySubscribers();
        };

        this.SearchCountry = ko.pureComputed({
            read: function() {
                return "";
            },
            write: function(searchCountry) {

                var filteredCountries = countries.filter(function(country) {
                    return country.Name.toLowerCase().indexOf(searchCountry) > -1;
                });

                self.Countries(filteredCountries);
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

                self.Places(filteredPlaces);
            },
            owner: this
        });

        this.SetSelectedCountry = function(country) {
            self.SelectedCountry(country);
            self.FlagUrl(country.Flag);

            LoadPlacesForCountry(self, country);
        };
    };

    var placeSelector = new ViewModel();

    ko.applyBindings(placeSelector, $('#PlaceSelectorElement')[0]);

    RootVM().AddChildVM(placeSelector, 'PlaceSelector');

    placeSelector.OnReady.notifySubscribers();
}

function LoadPlacesForCountry(vm, country, place) {

    var requestData = {
        countryName: country.Name
    };

    $.get('api/GeoData/GeoPoints',
    requestData,
    function (response) {

        var isPlaceLoaded = response.Data.length == 0;

        var places = isPlaceLoaded ? defaultPlaces : response.Data;
        vm.Places(places);
        vm.IsPlacesLoaded(isPlaceLoaded);
        vm.SelectedPlace(place == null ? places[0] : place);

        ReportError(false);
    });
}