// Akvo RSR is covered by the GNU Affero General Public License.
// See more details in the license.txt file located at the root folder of the
// Akvo RSR module. For additional details on the GNU license please see
// < http://www.gnu.org/licenses/agpl.html >.

// AKVO_RSR is defined in base.html
window.AKVO_RSR.utils = {

  resetFormElement: function(e) {
    e.wrap('<form>').closest('form').get(0).reset();
    e.unwrap();
  },

  alertSnippet: function(msg) {
  var s = '<div class="alert alert-danger alert-dismissible" role="alert">' +
        '<button type="button" class="close" data-dismiss="alert">' +
        '<span aria-hidden="true">×</span><span class="sr-only">' +
        'Close</span></button><%= msg %></div>',
      t = _.template(s);
    return t({'msg': msg});
  },

  scheduleAlertFade: function(timeOut) {
    window.setTimeout(function() {
      $('.alert').fadeTo(500, 0).slideUp(500, function() {
        $(this).remove();
      });
    }, timeOut);
  }

};

function setup_sentry(){
    var sentry_dsn = JSON.parse(document.querySelector('#sentry-dsn').innerHTML).sentry_dsn;
    if (sentry_dsn === '') {
        console.log("Could not find Sentry DSN. Sentry not installed");
    } else {
        Raven.config(sentry_dsn).install();
        console.log("Sentry installed");
    }
};


$(document).ready(function() {

    setup_sentry();

  function toggle_advanced_filters(show){
    // Toggles the advanced filters pane if show is undefined
    // Shows the pane if show is true.
    // Hides the pane if show is false.
    if (show != undefined && show == $("#wrapper, #search").hasClass('toggled')){
      return;
    }
    $("#wrapper, #search").toggleClass("toggled");
    $("a.showFilters > i").toggleClass("fa-toggle-off fa-toggle-on");
    Cookies.set('showAdvancedFilters', $("#wrapper, #search").hasClass('toggled')?'on':'off');
  }

  // Advanced filtering & search
  $(".menu-toggle").click(function(e) {
    e.preventDefault();
    toggle_advanced_filters();
  });

  if ($("#wrapper, #search").length && Cookies.get('showAdvancedFilters') === 'on'){
    toggle_advanced_filters(true);
  }

  // partner + tooltip
  $('[data-toggle="tooltip"]').tooltip({
    html: true,
    delay: {
      "show": 0,
      "hide": 1000
    }
  });


  function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
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
        mapConfig = window[mapId],
        disableDefaultUI = false,
        draggable = true;

    if ( !mapConfig.dynamic ) {
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

      locations: window[mapId].locations,
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

        /* Keep track of infoWindows so we can close them as needed */
        var infoWindows = [];

        _(this.locations).forEach(function( location ) {
          var position = new google.maps.LatLng( location.latitude,
                                                 location.longitude ),
              markerOpts = {
                position: position,
                icon: location.icon,
                map: map
              },
              marker, infoWindow, listener;

          if (node.dynamic === false) {
            markerOpts.clickable = false;
          }

          // Setup marker
          marker = new google.maps.Marker( markerOpts );
          infoWindow = new google.maps.InfoWindow({
            content: infoWinTempl(location)
          });
          infoWindows.push(infoWindow);
          if (mapConfig.dynamic) {
            google.maps.event.addListener(marker, 'click', function() {
              infoWindows.forEach(function(entry) {

                // Close any existing windows
                entry.close();
              });
              infoWindow.open(map, marker);
            });
          }

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
