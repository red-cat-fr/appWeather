<?php

$curl = curl_init(buildUrl($_GET['lat'], $_GET['lon'], $_GET['type']));
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
$result = curl_exec($curl);
header('Content-Type: application/json');
echo $result;


function buildUrl($lat, $lon, $type) {
    $key = "ec396e43967e3398aba2f5755cea978a";
    return 'http://api.openweathermap.org/data/2.5/'. $type
        . '?lat=' . $lat
        . '&lon=' . $lon
        . '&cnt=16&units=metric&lang=fr&APPID='. $key ;
}
