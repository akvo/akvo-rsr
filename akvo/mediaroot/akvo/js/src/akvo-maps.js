
// "extra_thumbnails": [{
//     "map_thumb": "/rsr/media/db/project/339/Project_339_current_image_2012-11-12_15.59.49_jpg_160x120_autocrop_detail_q85.jpg"
//   }],

// {
// ...
//   "current_image": null,
// ...
//   "extra_thumbnails": null,
// ...
// }


$(document).ready(function() {
  $('.akvo_map').each(function() {
    var mapId = $(this).attr('id');
    var mapElement = document.getElementById(mapId);
    var mapOpts = window[mapId];
    var objectId = mapOpts.objectId;

    $(mapElement).gmap().bind('init', function() {
      resourceURL = 'http://akvo.dev/api/v1/project/' + objectId + '/?format=jsonp&depth=1&callback=?';
      $(this).gmap('option', 'disableDefaultUI', true);

    
      $.getJSON(resourceURL, function(data) {
        var projectTitle = data.title;
        var projectPath = data.path;
        var projectImage = data.current_image;

        $.each(data.locations, function(i, location) {
          $(mapElement).gmap('addMarker', {
            'position': new google.maps.LatLng(location.latitude, location.longitude),
            'clickable': false,
            'bounds': true
            // 'streetViewControl': false
          }).click(function() {
            var content = '<div class="mapInfoWindow" style="height:150px; min-height:150px; max-height:150px; overflow:hidden;">';
            content += '<a href="' + projectPath + '">' + projectTitle + '</a>';
            content += '<div style="text-align: center; margin-top: 10px;">';
            content += '<a href="' + projectPath + '" title="' + projectPath +'">';
            // content += '<img src="' + location.extra_thumbnails[0].map_thumb  + '" alt="">';
            content += '<img src="' + projectImage  + '" alt="">';
            content += '</a></div></div>';
            $(mapElement).gmap('openInfoWindow', {
              'content': content
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
