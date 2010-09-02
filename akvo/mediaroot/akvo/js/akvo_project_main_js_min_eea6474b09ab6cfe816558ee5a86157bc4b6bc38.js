

/*---------------------------------------------------------------------------
 Contents from: x_google_maps.js
---------------------------------------------------------------------------*/

function loadGoogleMap() {

    var latitude = {{ object.coordinates.0 }};
    var longitude = {{ object.coordinates.1 }};
    var zoom = {{ zoom }};

    var mapData = {
        coordinates: new google.maps.LatLng(latitude, longitude),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
    };

    var mapOptions = {
        zoom: zoom,
        center: mapData.coordinates,
        mapTypeId: mapData.mapTypeId,
        scrollwheel: false
    };

    var mapCanvas = document.getElementById('map_canvas');

    var map = new google.maps.Map(mapCanvas, mapOptions);

    var marker = new google.maps.Marker({
        map: map,
        position: mapData.coordinates,
        title: 'Main location'
    });

}