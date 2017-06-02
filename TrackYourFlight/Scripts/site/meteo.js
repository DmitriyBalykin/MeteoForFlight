
$(document).ready(function () {

    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: 'api/Meteo/Data',
        success: function (response) {
            var meteElement = $('#meteoTable');

            meteElement.text(JSON.stringify(response));
        },
        error: function(data) {
            window.console.error(data.statusText);
        }
    });
});