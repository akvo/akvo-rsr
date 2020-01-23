# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

import collections
from django.conf import settings


Coordinate = collections.namedtuple('Coordinate', ['latitude', 'longitude'])

Size = collections.namedtuple('Size', ['width', 'height'])


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

        groups[location] += + 1

    return groups


default_adapter = MapboxAdapter(getattr(settings, 'MAPBOX_KEY', 'NO_API_KEY'))


def get_staticmap_url(locations, size=None, zoom=None):
    return default_adapter.get_url(locations, size, zoom)
