/**
 * @fileoverview Google map from lab 1
 * @author Teerapat
 */

'use strict';

/* global $ loc*/

let imageMarkers = [];

$('#imageSearch').click(function() {
  onImageSearch(loc);
});

function onImageSearch({lat,lng}) {
  $.ajax({
    'url': 'https://api.flickr.com/services/rest/',
    'dataType': 'jsonp',
    'data': {
      'method': 'flickr.photos.search',
      'api_key': 'd47c1c6da6eae9a0f440c75307627acb',
      'lat': lat,
      'lon': lng,
      'radius': 3, // DEFAULT: 5 km, MAX 32 km
      'format': 'json',
      'extras': 'url_c,geo',
    },
  });
}

// NOTE: with JSONP, use this exact method name, defined by the API,
// no need to define the success function
function jsonFlickrApi(data) {
  console.log('results: ', data);
  data.photos.photo.forEach(imageObj=>imageToMarkerAdapter(imageObj));

  fitMarkerToMap(imageMarkers);
}

function imageToMarkerAdapter(imageObj){
  console.log(imageObj);
  const {title, latitude, longitude, url_c} = imageObj;
  const pos = {
    lat:  parseFloat(latitude),
    lng: parseFloat(longitude),
  }
  // Add Image to Slide Show
  const image = addImage(url_c);
  // Add on show listener
  image.on('show', function () {
    map.panTo(pos);
    // Starts to bounce the marker
    marker.setAnimation(google.maps.Animation.BOUNCE);
  // setTimeout function will call the callback function after defined delay
      setTimeout(function () {
        // Stops animation of the marker
        marker.setAnimation(null);
      }, 700);
  });
  // Add marker to maps and add on click listener to show image at that position.
  const marker = new google.maps.Marker({
    position: pos,
    title: title
  });
  marker.setMap(map);
  google.maps.event.addListener(marker, 'click', function () {
      showImage(image);
  });
  imageMarkers.push(marker);
}

function clearImageMarker() {
  imageMarkers.forEach(function(marker) {
    // noinspection JSUnresolvedFunction
    marker.setMap(null);
  });
  imageMarkers.length = 0;
}