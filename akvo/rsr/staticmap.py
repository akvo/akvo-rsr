# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

import collections
from django.conf import settings


Coordinate = collections.namedtuple('Coordinate', ['latitude', 'longitude'])

Size = collections.namedtuple('Size', ['width', 'height'])


class MapquestAdapter(object):

    URL = "https://www.mapquestapi.com/staticmap/v5/map?key={}&locations={}"

    def __init__(self, key):
        self.key = key

    def get_url(self, locations, size=None, zoom=None):
        location_groups = self._group_location(locations)
        location_strings = [
            '{},{}|marker-{}'.format(c.latitude, c.longitude, v)
            for c, v
            in sorted(location_groups.items(), key=lambda kv:(kv[1], kv[0]))
        ]
        url = self.URL.format(self.key, "||".join(location_strings))
        if size:
            url = url + "&size={},{}".format(size.width, size.height)
        if 0 <= zoom <= 20:
            url = url + "&zoom={}".format(zoom)

        return url

    def _group_location(self, locations):
        groups = {}
        for location in locations:
            if location not in groups:
                groups[location] = 0

            groups[location] = groups[location] + 1

        return groups


default_adapter = MapquestAdapter(getattr(settings, 'MAPQUEST_KEY', 'NO_API_KEY'))


def get_staticmap_url(locations, size=None, zoom=None):
    return default_adapter.get_url(locations, size, zoom)
