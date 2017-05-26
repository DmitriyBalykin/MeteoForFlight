var baseUrl = 'https://rucsoundings.noaa.gov/get_soundings.cgi?data_source=GFS&latest=latest';

var gfsUrlBuilder = function (year, monthName, day, hour, minute, hoursInterval, latitude, longitude) {
    var url = baseUrl +
        '&start_year=' + year +
        '&start_month_name=' + monthName +
        '&start_mday=' + day +
        '&start_hour=' + hour +
        '&start_min=' + minute +
        '&n_hrs=' + hoursInterval +
        '&fcst_len=shortest' +
        '&airport=' + latitude + '%2C' + longitude +
        '&text=Ascii%20text%20%28GSD%20format%29&hydrometeors=false&start=latest';

    return url;
};

$(document).ready(function () {

    var url = gfsUrlBuilder(2017, 'May', 26, 10, 0, 36, 50.5, 30.5);

    $.ajax({
        type: 'GET',
        dataType: 'jsonp',
        url: url,
        success: function (response) {
            var meteElement = $('#meteoTable');

            meteElement.html(response);
        },
        error: function(data) {
            window.console.error(data.statusText);
        }
    });
});