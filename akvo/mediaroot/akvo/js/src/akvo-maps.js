
$(document).ready(function() {
  $('.akvo_map').each(function() {
    var mapId = $(this).attr('id');
    var mapElement = document.getElementById(mapId);
    var mapOpts = window[mapId];
    var objectId = mapOpts.objectId;


    var googleMap = {
      canvas: mapElement,
      options: {
        zoom: mapOpts.zoom,
        center: new google.maps.LatLng(mapOpts.Lat, mapOpts.Lng),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        scrollwheel: false,
        streetViewControl: false
      },
      load: function() {
        var map = new google.maps.Map(this.canvas, this.options);
        var marker = new google.maps.Marker({
          icon: '/rsr/media/core/img/blueMarker.png',
          map: map,
          position: this.options.center,
          clickable: false
        });
      }
    };
    googleMap.load();

    var akvoMap = {
      resourceURL: 'http://akvo.dev/api/v1/project_location/?format=jsonp&project=' + objectId + '&callback=?',

      load: function() {
        $.getJSON(this.resourceURL, function(data) {
          console.log(data.objects);
          $.each(data.objects, function(i, location) {
            console.log(location.city);
          });
        });

      }
    };
    akvoMap.load();

  });
});

/*

$(document).ready(function() {
  $('.akvo_map').each(function() {
    var mapElement = $(this).get();
    var mapId = $(this).attr('id');
    var opts = window[mapId];

    var options =  {
      zoom: 3,
            center: new google.maps.LatLng(11.09447,
                                           -2.098178),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scrollwheel: false,
            streetViewControl: false
        };

    var load = function() {
      var map = new google.maps.Map(this.mapElement, this.options);
      var marker = new google.maps.Marker({
                
                    icon: '/rsr/media/core/img/blueMarker.png',
                
                map: map,
                position: this.options.center,
                clickable: false
            });
      alert("Hi there");
    }();


    // alert("mapId: " + opts.type);
    // var opts = mapId;

    // var resouceUrl = "http://akvo.dev/api/v1/project_location/?format=jsonp&project=436";

    // alert("Type was: " + opts.type);
    // var opts = akvoMaps_12345;
    // alert("Id was: " + objectId);
    // alert( this.id + ". Opts was: " + opts.type);
  });

  // alert("Jquery ready from maps");
});

*/