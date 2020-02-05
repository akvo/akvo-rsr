# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

import collections
from django.conf import settings
from math import radians, cos, sin, asin, sqrt, pi, log, tan


Coordinate = collections.namedtuple('Coordinate', ['latitude', 'longitude'])

Size = collections.namedtuple('Size', ['width', 'height'])

# Radius of earth in meters.
EARTH_RADIUS = 6378137


# Adopted from https://github.com/julienr/pymapcluster/blob/master/globalmaptiles.py
class SimpleMercator(object):
    def __init__(self, tileSize=256):
        self.tileSize = tileSize
        self.initialResolution = 2 * pi * EARTH_RADIUS / self.tileSize
        self.originShift = 2 * pi * EARTH_RADIUS / 2.0

    def coordinate_to_pixels(self, coordinate, zoom):
        mx, my = self.coordinate_to_meters(coordinate)

        return self.meters_to_pixels(mx, my, zoom)

    def coordinate_to_meters(self, coordinate):
        mx = coordinate.longitude * self.originShift / 180.0
        my = log(tan((90 + coordinate.latitude) * pi / 360.0)) / (pi / 180.0)
        my = my * self.originShift / 180.0

        return mx, my

    def meters_to_pixels(self, mx, my, zoom):
        res = self.resolution(zoom)
        px = (mx + self.originShift) / res
        py = (my + self.originShift) / res

        return px, py

    def resolution(self, zoom):
        return self.initialResolution / (2**zoom)


# Adopted from https://github.com/julienr/pymapcluster/blob/master/pymapcluster.py
class MarkerClusterer(object):
    def __init__(self, mercator=SimpleMercator(), gridsize=50):
        self.mercator = mercator
        self.gridsize = gridsize

    def process(self, coordinates, zoom):
        centers = []
        clusters = {}

        for i, coordinate in enumerate(coordinates):
            point_pix = self.mercator.coordinate_to_pixels(coordinate, zoom)
            assigned = False

            for c in centers:
                center = coordinates[c]
                center_pix = self.mercator.coordinate_to_pixels(center, zoom)
                if self._in_cluster(center_pix, point_pix):
                    clusters[c].append(coordinate)
                    assigned = True
                    break

            if not assigned:
                centers.append(i)
                clusters[i] = [coordinate]

        return clusters

    def _in_cluster(self, center, point):
        return (point[0] >= center[0] - self.gridsize) \
            and (point[0] <= center[0] + self.gridsize) \
            and (point[1] >= center[1] - self.gridsize) \
            and (point[1] <= center[1] + self.gridsize)


class MapboxAutoClusteringAdapter(object):

    URL = "https://api.mapbox.com/styles/v1/mapbox/light-v10/static/{}/{}/{}?access_token={}&logo=false"

    # https://docs.mapbox.com/help/glossary/zoom-level/
    MAPBOX_ZOOMLEVEL = {
        0: 78271.484,
        1: 39135.742,
        2: 19567.871,
        3: 9783.936,
        4: 4891.968,
        5: 2445.984,
        6: 1222.992,
        7: 611.496,
        8: 305.748,
        9: 152.874,
        10: 76.437,
        11: 38.218,
        12: 19.109,
        13: 9.555,
        14: 4.777,
        15: 2.389,
        16: 1.194,
        17: 0.597,
        18: 0.299,
        19: 0.149,
        20: 0.075,
        21: 0.037,
        22: 0.037,
    }

    def __init__(self, key, clusterer=MarkerClusterer()):
        self.key = key
        self.clusterer = clusterer

    def get_url(self, locations, size=Size(600, 300), zoom=None):
        zoom_level = self._calculate_zoom_level(locations, size)
        zoom_level = zoom_level if zoom is None or zoom > zoom_level else zoom
        clusters = self.clusterer.process(locations, zoom_level)
        center = _determine_center(locations)
        markers = self._make_markers(clusters)
        overlay_str = ','.join([
            'pin-s-{}+1890ff({},{})'.format(v, c.longitude, c.latitude)
            for (c, v)
            in markers
        ])
        coi_str = '{},{},{}'.format(center.longitude, center.latitude, zoom_level)
        size_str = "{}x{}".format(size.width, size.height)

        return self.URL.format(overlay_str, coi_str, size_str, self.key)

    def _calculate_zoom_level(self, locations, size):
        location_groups = _group_locations(locations)
        min_latitude = min(c.latitude for c in location_groups)
        max_latitude = max(c.latitude for c in location_groups)
        distance = _calculate_distance(Coordinate(min_latitude, 0), Coordinate(max_latitude, 0))

        for zoom in range(8, -1, -1):
            # Only zoom up to 8 level, bigger than that will be too small for an overview map.
            #
            # Mapbox determines the geographical distance covered by an individual
            # pixel in a map depends on the latitude, so we only need to use the
            # image height in the calculation.
            # https://docs.mapbox.com/help/glossary/zoom-level/#zoom-levels-and-geographical-distance
            level = self.MAPBOX_ZOOMLEVEL[zoom] * size.height
            if level > (distance + (distance * 0.8)):
                return zoom

        return 0

    def _make_markers(self, clusters):
        markers = []
        for cluster in clusters.values():
            center = _determine_center(cluster)
            count = len(cluster)
            markers.append((center, count))

        return markers


class MapboxAdapter(object):

    URL = "https://api.mapbox.com/styles/v1/mapbox/light-v10/static/{}/{}/{}?access_token={}&logo=false"

    def __init__(self, key):
        self.key = key

    def get_url(self, locations, size=Size(600, 300), zoom=None):
        location_groups = _group_locations(locations)
        overlay_string = self._make_multiple_markers(location_groups)\
            if len(locations) > 1\
            else self._make_single_marker(locations[0])
        center_zoom = self._make_center_and_zoom(location_groups, zoom or 8)
        size_string = "{}x{}".format(size.width, size.height)

        return self.URL.format(overlay_string, center_zoom, size_string, self.key)

    def _make_multiple_markers(self, location_groups):
        markers = [
            'pin-s-{}+1890ff({},{})'.format(v, c.longitude, c.latitude)
            for c, v
            in sorted(location_groups.items(), key=lambda kv:(kv[1], kv[0]))
        ]

        return ','.join(markers)

    def _make_single_marker(self, location):
        return 'pin-s+1890ff({},{})'.format(location.longitude, location.latitude)

    def _make_center_and_zoom(self, location_groups, zoom):
        if len(location_groups) > 1:
            return 'auto'

        location = list(location_groups.keys())[0]

        return '{},{},{}'.format(location.longitude, location.latitude, zoom)


class MapquestAdapter(object):

    URL = "https://www.mapquestapi.com/staticmap/v5/map?key={}&locations={}"

    def __init__(self, key):
        self.key = key

    def get_url(self, locations, size=None, zoom=None):
        location_groups = _group_locations(locations)
        location_strings = [
            '{},{}|marker-{}'.format(c.latitude, c.longitude, v)
            for c, v
            in sorted(location_groups.items(), key=lambda kv:(kv[1], kv[0]))
        ]
        url = self.URL.format(self.key, "||".join(location_strings))
        if size:
            url = url + "&size={},{}".format(size.width, size.height)
        if zoom is not None and 0 <= zoom <= 20:
            url = url + "&zoom={}".format(zoom)

        return url


def _group_locations(locations):
    groups = {}
    for location in locations:
        if location not in groups:
            groups[location] = 0

        groups[location] += 1

    return groups


def _determine_center(coordinates):
    location_groups = _group_locations(coordinates)
    min_latitude = min(c.latitude for c in location_groups)
    max_latitude = max(c.latitude for c in location_groups)
    min_longitude = min(c.longitude for c in location_groups)
    max_longitude = max(c.longitude for c in location_groups)

    latitude_center = (min_latitude + max_latitude) / 2
    longitude_center = (min_longitude + max_longitude) / 2

    return Coordinate(latitude_center, longitude_center)


def _calculate_distance(coordinate1, coordinate2):
    lon1 = radians(coordinate1.longitude)
    lon2 = radians(coordinate2.longitude)
    lat1 = radians(coordinate1.latitude)
    lat2 = radians(coordinate2.latitude)

    # Haversine formula
    a = sin((lat2 - lat1) / 2) ** 2 + cos(lat1) * cos(lat2) * sin((lon2 - lon1) / 2) ** 2
    c = 2 * asin(sqrt(a))

    return c * EARTH_RADIUS


default_adapter = MapboxAutoClusteringAdapter(getattr(settings, 'MAPBOX_KEY', 'NO_API_KEY'))


def get_staticmap_url(locations, size=None, zoom=None):
    return default_adapter.get_url(locations, size, zoom)
