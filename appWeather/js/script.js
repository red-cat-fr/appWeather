/* jshint esversion: 6 */
$('document').ready(function() {
    'use strict';
    console.log('je suis prêt');

    const googleKey = "AIzaSyADOomMECKoDoame-iXnGw9Cx12ns1-yIM";
    let googleSize = "size=600x400";
    localStorage.setItem('test', 'toto');
    console.log(localStorage.getItem('test'));

    if (navigator.geolocation) { // si la geolocation est activé
        console.log('Geolocation OK');
        navigator.geolocation.getCurrentPosition(function(position) { // on recupere la position courante
            console.log(
                position.coords.latitude,
                position.coords.longitude
            );

            getOpenWeatherData('weather', position, displayWeather)
            getOpenWeatherData('forecast', position, displayForecast)
            getOpenWeatherData('forecast/daily', position, displayDaily)


        });
    } else {
        console.log('Geolocation KO');
    }




    function displayForecast(data) {
        console.log(data);
        let temp = [];
        let txPrecipitations = [];
        let labels = [];
        data.list.forEach(function(e) {
            temp.push(e.main.temp);
            txPrecipitations.push(e.rain ? e.rain['3h'] || 0 : 0);
            labels.push(moment.unix(e.dt).format('LT'));

        });
        console.log(temp);
        console.log(txPrecipitations);
        console.log(labels);
        //affiche le graff main
        let myChart = Highcharts.chart('main', {



            title: {
                text: 'Prévisions pour la journée'
            },
            xAxis: {
                categories: labels.slice(0, 10)
            },
            yAxis: [{ //axes des température
                labels: {
                    format: '{value} °C',
                },
                title: {
                    text: 'Température en °C'
                }
            }, {
                //axes secondaire
                labels: {
                    format: '{value} mm'
                },
                title: {
                    text: 'Precipitation en mm'
                },
                opposite: true
            }],
            tooltip: {
                shared: true
            },
            legend: {
                layout: 'vertical',
                align: 'left',
                x: 500,
                verticalAlign: 'top',
                y: 50,
                floating: true,

            },
            series: [{
                name: 'Taux d huminidité',
                type: 'column',
                data: txPrecipitations.slice(0, 10),
                yAxis: 1
            }, {
                name: 'Température',
                type: 'spline',
                data: temp.slice(0, 10)
            }]

        });
    }

    function displayDaily(data) {
        console.log(data)

        let temp = [];
        let ranges = [];
        let txPrecipitations = [];
        let labels = [];
        data.list.forEach(function(e) {
            temp.push(e.temp.day)
            ranges.push([e.temp.min, e.temp.max])
            txPrecipitations.push(e.rain || 0)
            labels.push(moment.unix(e.dt).format('DD MMM '))

        });
        console.log(temp);
        console.log(ranges)
        console.log(txPrecipitations);
        console.log(labels);
        //graf daily
        let myChartDaily = Highcharts.chart('daily', {


            title: {
                text: 'Temperature variation by day'
            },

            xAxis: {
                categories: labels.slice(0, 10)
            },

            yAxis: [{ //axes des température
                labels: {
                    format: '{value} °C',
                },
                title: {
                    text: 'Température en °C'
                }
            }, {
                //axes secondaire
                labels: {
                    format: '{value} mm'
                },
                title: {
                    text: 'Precipitation en mm'
                },
                opposite: true
            }],

            tooltip: {
                //crosshairs: false,
                shared: false,

            },

            legend: {
                enabled: true,
                layout: 'vertical',
                align: 'left',
                x: 500,
                verticalAlign: 'top',
                y: 50,
                floating: true,
            },

            series: [{
                name: 'Taux d huminidité',
                type: 'column',
                data: txPrecipitations.slice(0, 10),
                yAxis: 1
            }, {
                name: 'ecart',
                data: ranges.slice(0, 10),
                type: 'arearange'

            }, {
                name: 'Temperatures',
                data: temp.slice(0, 10),
                type: 'spline',

            }]

        });


    }


    function displayWeather(data) {

        console.log(data);
        //let urlGoogle = 'https://maps.googleapis.com/maps/api/streetview?size=600x400&location=%22jou%C3%A9-les-tours%22&key=AIzaSyADOomMECKoDoame-iXnGw9Cx12ns1-yIM'
        //"https://maps.googleapis.com/maps/api/streetview"
        //                 +"?"
        //                 +googleSize
        //                 +"&location="
        //                 //+data.name
        //                 +47.35
        //                 +','
        //                 +0.67
        //                 +"&key="
        //                 +googleKey;
        // $('.jumbotron').css({
        //   'background-image': 'url(urlGoogle)'
        // });


        $('#name').text(data.name);
        $('#wind').text(data.wind.speed + ' m/s');
        $('#clouds').text(data.clouds.all);
        $('#pressure').text(data.main.pressure + ' hpa');
        $('#humidity').text(data.main.humidity + ' %');
        $('#coords').text('[' + data.coord.lat + ', ' + data.coord.lon + ']');
        $('#temp').text(data.main.temp + ' C°');
        $('#description').text(data.weather[0].description);
        $('#ico').attr('src', 'http://openweathermap.org/img/w/' + data.weather[0].icon + '.png');
        $('#ico').attr('alt', 'data.weather[0].description');
        let sunrise = moment.unix(data.sys.sunrise);
        let sunset = moment.unix(data.sys.sunset);
        $('#sunrise').text(sunrise.format('LT'));
        $('#sunset').text(sunset.format('LT'));

    }

    function getOpenWeatherData(type, position, callback) {

        $.cachax(
            buildUrl(type, position), //URL
            type, //key dans local setStorage
            60, //temps de refresh
            callback //fonction callback
        );

        function buildUrl(type, position) {
            let pages = {
                'weather': 'weather.php',
                'forecast': 'forecast.php',
                'forecast/daily': 'forecast/daily.php'
            };
            return 'weather.php?type=' + type +
                '&lat=' + position.coords.latitude +
                '&lon=' + position.coords.longitude;
        }

    }

});
