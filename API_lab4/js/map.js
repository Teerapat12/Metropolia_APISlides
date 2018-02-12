/**
 * @fileoverview Google map from lab 1
 * @author Teerapat
 */

'use strict';
let weatherRadius = 200;
let map;
let loc = {lat: 60.223385, lng: 24.805091};

const textField = document.getElementById('searchTextField');

let markers = [];

/* global google map maps*/

/* eslint no-unused-vars: "off" */
// noinspection JSUnusedGlobalSymbols
function initMap() {
  const center = new google.maps.LatLng(60.223385, 24.805091);
  const zoom = 15;
  const setting = {
    center,
    zoom,
  };

  const mapDiv = document.getElementById('map');
  // noinspection JSUnresolvedVariable
  map = new google.maps.Map(mapDiv, setting);

  // // Adding Marker to the center of the map.
  // const marker = new google.maps.Marker({
  //    position: center,
  //    map: map,
  //    title: textField.value,
  //    });
  //
  // markers.push(marker);
}

function clearMarker() {
  markers.forEach(function(marker) {
    // noinspection JSUnresolvedFunction
    marker.setMap(null);
  });

  markers.length = 0;
}

// Get marker and radius, search the weather and put infoWindow above the marker
function onSearchWeather(data, marker, radius) {
  // noinspection JSUnusedLocalSymbols
  let cityCircle = new google.maps.Circle({
    strokeColor: '#FF2222',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF5555',
    fillOpacity: 0.2,
    map: map,
    center: loc,
    radius: radius,
  });

  // Add weather information to the city marker (by infoWindow for now)
  let infoWindow = new google.maps.InfoWindow({
    // eslint-disable-next-line
    content: '<div>Temperature: ' + data.weatherObservation.temperature +
        ' c°</div><div>Humidity: ' + data.weatherObservation.humidity +
        '</div><div>Elevation: ' + data.weatherObservation.elevation + '</div>',
  });
  marker.addListener('click', function() {
    infoWindow.open(map, marker);
  });

  markers.push(marker);
}

function searchWeather(marker, radius) {
  const findNearByWeather = {
    url: 'http://api.geonames.org/findNearByWeatherJSON',
    data: {
      username: 'teerapat',
      lat: loc.lat,
      lng: loc.lng,
      radius: radius,
    },
  };
  // eslint-disable-next-line
  $.ajax(findNearByWeather).done((data)=>onSearchWeather(data,marker,radius));
}

function onSearchResult(results, status) {
  if (status === 'OK') {
    clearMarker();
    clearImageMarker();

    loc = results[0].geometry.location;
    map.setCenter(loc);

    // Add Marker
    const marker = new google.maps.Marker({
      position: loc,
      map: map,
      title: textField.value,
    });
    marker.setMap(map);
    // Search nearby Weather and addCircle
    searchWeather(marker, weatherRadius);
  } else {
    alert('Address not found');
    textField.value = '';
  }
}

function onSubmit(e) {
  e.preventDefault();
  const query = textField.value;
  const geoCoder = new google.maps.Geocoder();
  geoCoder.geocode({'address': query}, onSearchResult);
}

const searchForm = document.getElementById('searchForm');
searchForm.addEventListener('submit', onSubmit);

function fitMarkerToMap(markers){
  // Create a new LatLngBounds instance
  var bounds = new google.maps.LatLngBounds();

// Extend bounds to contain some coordinate inside it
  markers.forEach((marker)=>{
    bounds.extend(marker.getPosition());
  });

  map.fitBounds(bounds);
}