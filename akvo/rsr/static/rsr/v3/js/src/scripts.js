// Akvo RSR is covered by the GNU Affero General Public License.
// See more details in the license.txt file located at the root folder of the
// Akvo RSR module. For additional details on the GNU license please see
// < http://www.gnu.org/licenses/agpl.html >.

// Resets a file Form element
function resetFormElement(e) {
  e.wrap('<form>').closest('form').get(0).reset();
  e.unwrap();
}


function bootstrapAlert(errorMsg, elementToPrepend) {
  var s = '<div class="alert alert-danger alert-dismissible" role="alert">'
        + '<button type="button" class="close" data-dismiss="alert">'
        + '<span aria-hidden="true">×</span><span class="sr-only">'
        + 'Close</span></button><%= msg %></div>',
      t = _.template(s),
      c = t({ 'msg': errorMsg });
  return c;
}


// Show a Bootstrap 3 alert
// Depends on lo-dash
function alertSnippet(msg) {
  var s = '<div class="alert alert-danger alert-dismissible" role="alert">'
        + '<button type="button" class="close" data-dismiss="alert">'
        + '<span aria-hidden="true">×</span><span class="sr-only">'
        + 'Close</span></button><%= msg %></div>',
      t = _.template(s);
  return t({'msg': msg});
}

function scheduleAlertFade(timeOut) {
  window.setTimeout(function() {
    $('.alert').fadeTo(500, 0).slideUp(500, function() {
      $(this).remove();
    });
  }, timeOut);
}

$(document).ready(function() {

    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    var csrftoken = getCookie('csrftoken');
    $.ajaxSetup({
        beforeSend: function (xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });

  // Maps
  // Find each element of class rsr_map (from the coll_map template tag)
  // and render map with data from related js object
  _.forEach(document.getElementsByClassName('rsr_map'), function( node ) {
    var mapId = node.id,
        disableDefaultUI = false,
        draggable = true;

    if ( node.dynamic == false ) {
      disableDefaultUI = true;
      draggable = false;
    }

    var gMap = {
      canvas: document.getElementById(mapId),
      options: {
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        streetViewControl: false,
        scrollwheel: false,
        disableDefaultUI: disableDefaultUI,
        zoom: 8,
        draggable: draggable
      },

      locations: window[ mapId ][ 'locations' ],
      load: function() {
        var map = new google.maps.Map( this.canvas, this.options ),
            bounds = new google.maps.LatLngBounds(),
            world_bounds = new google.maps.LatLngBounds(
              new google.maps.LatLng(85, -180),
              new google.maps.LatLng(-85, 180)),
            infoWinTempl = _.template(
              '<div class="mapInfoWindow">' +
                '<a href="<%= url %>">' +
                '<%= text %><br /><img src="<%= image %>" />' +
                '</a></div>');

        _(this.locations).forEach(function( location ) {
          var position = new google.maps.LatLng( location.latitude,
                                                 location.longitude ),
              markerOpts = {
                position: position,
                icon: location.icon,
                map: map
              },
              marker, infoWindow, listener;

          if (node.dynamic == false) {
            markerOpts[ 'clickable' ] = false;
          }

          // Setup marker
          marker = new google.maps.Marker( markerOpts );
          infoWindow = new google.maps.InfoWindow({
            content: infoWinTempl(location)
          });
          google.maps.event.addListener(marker, 'click', function() {
            infoWindow.open(map, marker);
          });

          bounds.extend(marker.position);
        });

        // If no locations default bounds to world map
        if (this.locations.length > 0) {
          map.fitBounds(bounds);
          map.panToBounds(bounds);
        } else {
          map.fitBounds(world_bounds);
          map.panToBounds(world_bounds);
        }

        listener = google.maps.event.addListener(map, "idle", function() {
          // Don't let the map be too zoomed in
          if (map.getZoom() > 8) map.setZoom(8);
          // Don't let the map be too zoomed out
          if (map.getZoom() < 2) map.setZoom(2);
          google.maps.event.removeListener(listener);
        });
      }
    };
    gMap.load();
  });

});
