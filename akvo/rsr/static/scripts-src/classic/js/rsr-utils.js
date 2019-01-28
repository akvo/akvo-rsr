// Akvo RSR is covered by the GNU Affero General Public License.
// See more details in the license.txt file located at the root folder of the
// Akvo RSR module. For additional details on the GNU license please see
// < http://www.gnu.org/licenses/agpl.html >.

// AKVO_RSR is defined in base.html
window.AKVO_RSR.utils = {
    resetFormElement: function(e) {
        e.wrap("<form>")
            .closest("form")
            .get(0)
            .reset();
        e.unwrap();
    },

    alertSnippet: function(msg) {
        var s =
                '<div class="alert alert-danger alert-dismissible" role="alert">' +
                '<button type="button" class="close" data-dismiss="alert">' +
                '<span aria-hidden="true">×</span><span class="sr-only">' +
                "Close</span></button><%= msg %></div>",
            t = _.template(s);
        return t({ msg: msg });
    },

    scheduleAlertFade: function(timeOut) {
        window.setTimeout(function() {
            $(".alert")
                .fadeTo(500, 0)
                .slideUp(500, function() {
                    $(this).remove();
                });
        }, timeOut);
    }
};

function setup_sentry() {
    var data = JSON.parse(document.querySelector("#sentry-dsn").innerHTML),
        sentry_dsn = data.sentry_dsn,
        user_email = data.email;

    if (sentry_dsn === "") {
        console.log("Could not find Sentry DSN. Sentry not installed");
    } else {
        Raven.config(sentry_dsn).install();
        console.log("Sentry installed");
        if (user_email != undefined) {
            Raven.setUserContext({ email: user_email });
        }
    }
}

$(document).ready(function() {
    setup_sentry();

    function toggle_advanced_filters(show) {
        // Toggles the advanced filters pane if show is undefined
        // Shows the pane if show is true.
        // Hides the pane if show is false.
        if (show != undefined && show == $("#wrapper, #search").hasClass("toggled")) {
            return;
        }
        $("#wrapper, #search").toggleClass("toggled");
        $("a.showFilters > i").toggleClass("fa-toggle-off fa-toggle-on");
        Cookies.set(
            "showAdvancedFilters",
            $("#wrapper, #search").hasClass("toggled") ? "on" : "off"
        );
    }

    // Advanced filtering & search
    $(".menu-toggle").click(function(e) {
        e.preventDefault();
        toggle_advanced_filters();
    });

    if ($("#wrapper, #search").length && Cookies.get("showAdvancedFilters") === "on") {
        toggle_advanced_filters(true);
    }

    // partner + tooltip
    $('[data-toggle="tooltip"]').tooltip({
        html: true,
        delay: {
            show: 0,
            hide: 1000
        }
    });

    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie !== "") {
            var cookies = document.cookie.split(";");
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == name + "=") {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return /^(GET|HEAD|OPTIONS|TRACE)$/.test(method);
    }

    var csrftoken = getCookie("csrftoken");
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });

    // Maps
    // Render a map with the given config in the given node
    render_map = function(node, mapConfig) {
        var mapId = node.id,
            disableDefaultUI = false,
            draggable = true;

        mapConfig = mapConfig || window[mapId];

        if (!mapConfig.dynamic) {
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

            locations: mapConfig.locations,
            load: function() {
                var map = new google.maps.Map(this.canvas, this.options),
                    bounds = new google.maps.LatLngBounds(),
                    world_bounds = new google.maps.LatLngBounds(
                        new google.maps.LatLng(85, -180),
                        new google.maps.LatLng(-85, 180)
                    ),
                    infoWinTempl = _.template(
                        '<div class="mapInfoWindow">' +
                            '<a href="<%= url %>">' +
                            '<%= text %><br /><img src="<%= image %>" />' +
                            "</a></div>"
                    );

                /* Keep track of infoWindows so we can close them as needed */
                var infoWindows = [];
                // Keep track of markers, so we can animate them on corresponding element hover
                window.mapMarkers = [];

                _(this.locations).forEach(function(location) {
                    var markerImage = new google.maps.MarkerImage(
                        location.icon,
                        new google.maps.Size(38, 38),
                        new google.maps.Point(0, 0),
                        new google.maps.Point(19, 19)
                    );
                    var position = new google.maps.LatLng(location.latitude, location.longitude),
                        markerOpts = {
                            position: position,
                            icon: markerImage,
                            map: map,
                            highlightId: location.highlightId
                        },
                        marker,
                        infoWindow,
                        listener;

                    if (node.dynamic === false) {
                        markerOpts.clickable = false;
                    }

                    // Setup marker
                    marker = new google.maps.Marker(markerOpts);
                    window.mapMarkers.push(marker);
                    infoWindow = new google.maps.InfoWindow({
                        content: infoWinTempl(location)
                    });
                    infoWindows.push(infoWindow);
                    if (mapConfig.dynamic) {
                        google.maps.event.addListener(marker, "click", function() {
                            if (marker.highlightId) {
                                var project_selector = marker.highlightId,
                                    project_div = document.querySelector(project_selector);
                                project_div.scrollIntoView();
                                project_div.classList.add("highlightProject");
                                window.setTimeout(function() {
                                    project_div.classList.remove("highlightProject");
                                }, 3000);
                            } else {
                                infoWindows.forEach(function(entry) {
                                    // Close any existing windows
                                    entry.close();
                                });
                                infoWindow.open(map, marker);
                            }
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
                    google.maps.event.removeListener(listener);
                });

                // This code is based on
                // https://developers.google.com/fusiontables/docs/samples/mouseover_map_styles
                // Global function since it is called from JSONP callback
                // Closure since it needs the map
                window.drawCountries = function(data) {
                    // Set data as a global, so that we don't need to fetch it
                    // each time the map is re-rendered.
                    window.gMapCountryData = data;

                    var fillColor = "lightyellow",
                        strokeColor = "#0000FF",
                        rows = data["rows"];

                    rows.forEach(function(row) {
                        if (row[0] != "Antarctica") {
                            var newCoordinates = [];
                            newCoordinates = constructNewCoordinates(JSON.parse(row[1]));
                            var country = new google.maps.Polygon({
                                paths: newCoordinates,
                                strokeColor: strokeColor,
                                strokeOpacity: 0,
                                strokeWeight: 1,
                                fillColor: fillColor,
                                fillOpacity: 0.3,
                                name: transformCountryName(row[0])
                            });

                            google.maps.event.addListener(country, "mouseover", function() {
                                this.setOptions({ fillOpacity: 1 });
                            });
                            google.maps.event.addListener(country, "mouseout", function() {
                                this.setOptions({ fillOpacity: 0.3 });
                            });
                            google.maps.event.addListener(country, "click", function() {
                                if (mapConfig.clickCallback) {
                                    mapConfig.clickCallback(country.name);
                                }
                            });

                            country.setMap(map);
                        }
                    });
                };
            }
        };

        gMap.load();
        if (window.gMapCountryData) {
            window.drawCountries(window.gMapCountryData);
        } else {
            getCountryData();
        }
    };

    var getCountryData = function() {
        // Initialize JSONP request
        var script = document.createElement("script");
        var url = ["https://www.googleapis.com/fusiontables/v1/query?"];
        url.push("sql=");
        var query = "SELECT name, json_4326 FROM " + "1eSZj8FglXY3rIdzZTe42yJCXjvN_H0PjRZHCzP8X";
        var encodedQuery = encodeURIComponent(query);
        url.push(encodedQuery);
        url.push("&callback=drawCountries");
        url.push("&key=AIzaSyAm9yWCV7JPCTHCJut8whOjARd7pwROFDQ");
        script.src = url.join("");
        var body = document.getElementsByTagName("body")[0];
        body.appendChild(script);
    };

    var constructNewCoordinates = function(polygon) {
        var newCoordinates = [];
        var coordinates = polygon["coordinates"][0];
        for (var i in coordinates) {
            newCoordinates.push(new google.maps.LatLng(coordinates[i][1], coordinates[i][0]));
        }
        return newCoordinates;
    };

    // FIXME: There should be a better way of doing this. This function
    // translates the country names between two different datasets - country KML
    // and the m49_codes list.
    var transformCountryName = function(name) {
        if (name.includes("Rep.")) {
            name = name.replace("Rep.", "Republic");
        }
        if (name.includes("S.")) {
            name = name.replace("S.", "South");
        }
        if (name.includes("N.")) {
            name = name.replace("N.", "North");
        }
        if (name.includes("W.")) {
            name = name.replace("W.", "Western");
        }
        if (name.includes("Eq.")) {
            name = name.replace("Eq.", "Equatorial");
        }
        if (name.includes("Is.")) {
            name = name.replace("Is.", "Islands");
        }
        if (name.includes("Herz.")) {
            name = name.replace("Herz.", "Herzegovina");
        }
        if (name == "Iran") {
            name = "Iran (Islamic Republic of)";
        }
        if (name == "Syria") {
            name = "Syrian Arab Republic";
        }
        if (name == "Laos") {
            name = "Lao People's Democratic Republic";
        }
        if (name == "Guinea Bissau") {
            name = "Guinea-Bissau";
        }
        if (name == "Congo (Kinshasa)") {
            name = "Democratic Republic of the Congo";
        }
        if (name == "Russia") {
            name = "Russian Federation";
        }
        if (name == "Moldova") {
            name = "Republic of Moldova";
        }
        if (name == "Vietnam") {
            name = "Viet Nam";
        }
        if (name == "Congo (Brazzaville)") {
            name = "Congo";
        }
        if (name == "North Cyprus") {
            name = "Cyprus";
        }
        if (name == "Brunei") {
            name = "Brunei Darussalam";
        }
        if (name == "Ivory Coast") {
            name = "Cote d'Ivoire";
        }
        if (name == "North Korea") {
            name = "Democratic People's Republic of Korea";
        }
        if (name == "South Korea") {
            name = "Republic of Korea";
        }
        if (name == "Tanzania") {
            name = "United Republic of Tanzania";
        }
        if (name == "Venezuela") {
            name = "Venezuela (Bolivarian Republic of)";
        }
        if (name == "Bolivia") {
            name = "Bolivia (Plurinational State of)";
        }
        if (name == "Macedonia") {
            name = "The former Yugoslav Republic of Macedonia";
        }
        if (name == "East Timor") {
            name = "Timor-Leste";
        }
        if (name == "Falkland Islands") {
            name = "Falkland Islands (Malvinas)";
        }
        if (name == "United Kingdom") {
            name = "United Kingdom of Great Britain and Northern Ireland";
        }
        if (name == "United States") {
            name = "United States of America";
        }
        return name;
    };
});
