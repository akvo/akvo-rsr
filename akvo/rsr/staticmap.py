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

    URL = "https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/static/{}/{}/{}?access_token={}"

    def __init__(self, key):
        self.key = key

    def get_url(self, locations, size=Size(600, 300), zoom=None):
        if len(locations) > 1:
            return self._handle_multiple_locations(locations, size)

        return self._handle_single_location(locations[0], size, zoom)

    def _handle_multiple_locations(self, locations, size):
        location_groups = _group_locations(locations)
        location_strings = [
            'pin-s-{}+1890ff({},{})'.format(v, c.longitude, c.latitude)
            for c, v
            in sorted(location_groups.items(), key=lambda kv:(kv[1], kv[0]))
        ]
        size_string = "{}x{}".format(size.width, size.height)

        return self.URL.format(','.join(location_strings), 'auto', size_string, self.key)

    def _handle_single_location(self, location, size, zoom):
        location_string = 'pin-s+1890ff({},{})'.format(location.longitude, location.latitude)
        zoom_center = '{},{},{}'.format(location.longitude, location.latitude, zoom or 8)
        size_string = "{}x{}".format(size.width, size.height)

        return self.URL.format(location_string, zoom_center, size_string, self.key)


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
