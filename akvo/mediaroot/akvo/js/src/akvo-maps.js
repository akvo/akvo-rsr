
$(document).ready(function() {
  $('.akvo_map').each(function() {
    var mapId = $(this).attr('id');
    var mapElement = document.getElementById(mapId);
    var mapOpts = window[mapId];
    var objectId = mapOpts.objectId;


    var options = {
      zoom: mapOpts.zoom,
      center: new google.maps.LatLng(mapOpts.Lat, mapOpts.Lng),
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      scrollwheel: false,
      streetViewControl: false
      };

    var map = new google.maps.Map(mapElement, options);

  

    // var googleMap = {
    //   canvas: mapElement,
    //   options: {
    //     zoom: mapOpts.zoom,
    //     center: new google.maps.LatLng(mapOpts.Lat, mapOpts.Lng),
    //     mapTypeId: google.maps.MapTypeId.ROADMAP,
    //     scrollwheel: false,
    //     streetViewControl: false
    //   },
    //   load: function() {
    //     var map = new google.maps.Map(this.canvas, this.options);
    //     var marker = new google.maps.Marker({
    //       icon: '/rsr/media/core/img/blueMarker.png',
    //       map: map,
    //       position: this.options.center,
    //       clickable: false
    //     });
    //   }
    // };
    // googleMap.load();

    var akvoMap = {
      // resourceURL: 'http://akvo.dev/api/v1/project_location/?format=jsonp&project=' + objectId + '&callback=?',
      resourceURL: 'http://akvo.dev/api/v1/project/' + objectId + '/?format=json&depth=1&callback=?',

      load: function(callback) {
        $.getJSON(this.resourceURL, function(data) {
          var items = [];
          var title = data.title;
          $.each(data.locations, function(i, location) {
            items.push({
              'project': location.project,
              'latitude': location.latitude,
              'longitude': location.longitude,
              'primary': location.primary,
              'city': location.city
            });
          });
          callback(items);
        });
      }
    };

    akvoMap.load(function(locations){
      $.each(locations, function(index, location){
        console.log(location.city);
        var marker = new google.maps.Marker({
          icon: '/rsr/media/core/img/blueMarker.png',
          map: map,
          position: new google.maps.LatLng(location.latitude, location.longitude),
          clickable: false
        });
      });
    });

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