
$(document).ready(function () {

    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: 'Meteo/Data',
        success: function (response) {
            var meteElement = $('#meteoTable');

            meteElement.html(response);
        },
        error: function(data) {
            window.console.error(data.statusText);
        }
    });
});