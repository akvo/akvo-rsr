
$(document).ready(function() {
  $('.akvo_map').each(function() {
    var mapId = $(this).attr('id');
    var mapElement = document.getElementById(mapId);
    var mapOpts = window[mapId];
    var objectId = mapOpts.objectId;

    $(mapElement).gmap().bind('init', function() {
      resourceURL = 'http://akvo.dev/api/v1/project/' + objectId + '/?format=jsonp&depth=1&callback=?';
      $(this).gmap('option', 'disableDefaultUI', true);

      var tmplSrc = '<div class="mapInfoWindow" style="height:150px; min-height:150px; max-height:150px; overflow:hidden;">' +
                      '<a href="{{projectUrl}}">{{projectTitle}}</a>' +
                      '{{#if projectImage}}' +
                        '<div style="text-align: center; margin-top: 10px;">' +
                          '<a href="{{projectUrl}}" title="{{projectTitle}}">' +
                            '<img src="{{projectImage}}" alt="">' +
                          '</a>' +
                        '</div>' +
                      '{{/if}}' +
                    '</div>';
      var mapInfoWindowTemplate = Handlebars.compile(tmplSrc);

      $.getJSON(resourceURL, function(data) {
        $.each(data.locations, function(i, location) {
          location.projectTitle = data.title;
          location.projectUrl = data.absolute_url;
          if (location.projectUrl == 'null') {
            location.projectUrl = '#';
          }

          try {
            location.projectImage = data.current_image.thumbnails.map_thumb;
          }
          catch (e) {
            location.projectImage = '';
          }

          $(mapElement).gmap('addMarker', {
            'position': new google.maps.LatLng(location.latitude, location.longitude),
            // 'clickable': false,
            'bounds': true
          }).click(function() {
            $(mapElement).gmap('openInfoWindow', {
              'content': mapInfoWindowTemplate(location)
            }, this);

          });
        });
        
      });
    });
    
  });
});






// $(document).ready(function() {
//   $('.akvo_map').each(function() {
//     var mapId = $(this).attr('id');
//     var mapElement = document.getElementById(mapId);
//     var mapOpts = window[mapId];
//     var objectId = mapOpts.objectId;

//     var options = {
//       zoom: mapOpts.zoom,
//       center: new google.maps.LatLng(mapOpts.Lat, mapOpts.Lng),
//       mapTypeId: google.maps.MapTypeId.ROADMAP,
//       scrollwheel: false,
//       streetViewControl: false
//       };

//     var map = new google.maps.Map(mapElement, options);

//     var akvoMap = {
//       // resourceURL: 'http://akvo.dev/api/v1/project_location/?format=jsonp&project=' + objectId + '&callback=?',
//       resourceURL: 'http://akvo.dev/api/v1/project/' + objectId + '/?format=jsonp&depth=1&callback=?',

//       load: function(callback) {
//         $.getJSON(this.resourceURL, function(data) {
//           var items = [];
//           var projectTitle = data.title;
//           var projectPath = data.path;
//           var projectImage = data.current_image;
//           $.each(data.locations, function(i, location) {
//             items.push({
//               'projectId': location.project,
//               'latitude': location.latitude,
//               'longitude': location.longitude,
//               'primary': location.primary,
//               'city': location.city,
//               'projectTitle': projectTitle,
//               'projectPath': projectPath
//             });
//           });
//           callback(items);
//         });
//       }
//     };

//     akvoMap.load(function(locations){

//       $.each(locations, function(index, location){
//         console.log(location.city);
//         var marker = new google.maps.Marker({
//           icon: '/rsr/media/core/img/blueMarker.png',
//           map: map,
//           position: new google.maps.LatLng(location.latitude, location.longitude),
//           clickable: false
//         });
//       });
//     });

//   });
// });
