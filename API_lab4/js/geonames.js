/**
 * @fileoverview Google map with geonames from lab 2
 * @author Teerapat
 */

function wikiHit2InfoWindow(wikiHit) {
// eslint-disable-next-line
  return "<div><a class='summaryTitle' href='"+wikiHit.wikipediaUrl+"'>"+wikiHit.title+"</a><div>"+wikiHit.summary+"</div></div>"
}

/* global loc $ google map markers*/

function addWikiHitMarker(wikiHit) {
  console.log(wikiHit);
  let thisLatLng = {lat: wikiHit.lat, lng: wikiHit.lng};
  let marker = new google.maps.Marker({
    position: thisLatLng,
    title: wikiHit.title,
  });
  marker.setMap(map);


  // Add infoWindow to the marker
  const contentString = wikiHit2InfoWindow(wikiHit);
  const infoWindow = new google.maps.InfoWindow({
    content: contentString,
  });
  marker.addListener('click', function() {
    infoWindow.open(map, marker);
  });

  // Push marker into markers (so that we can delete it later).
  markers.push(marker);

  fitMarkerToMap(markers);
}

function onClickedWikiSearch() {
  // noinspection SpellCheckingInspection
  const wikiSearchSettings = {
    url: 'http://api.geonames.org/findNearbyWikipediaJSON',
    data: {
      username: 'teerapat',
      lat: loc.lat,
      lng: loc.lng,
    },
  };
  $.ajax(wikiSearchSettings).done((data)=>data.geonames.map(addWikiHitMarker));
}

const button = document.getElementById('wikiSearchButton');
button.addEventListener('click', onClickedWikiSearch);
