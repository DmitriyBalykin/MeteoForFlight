
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

    $.post('api/Meteo/Data', requestData)
    .done(function (response) {
        var meteElement = $('#meteoTable');

        meteElement.text(JSON.stringify(response));
    });
});