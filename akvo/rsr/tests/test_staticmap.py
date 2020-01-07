# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

import unittest
from akvo.rsr.staticmap import MapquestAdapter, Coordinate, Size


class TestMapquestAdapter(unittest.TestCase):

    def test_url_contains_key(self):
        key = 'SecretKey'
        adapter = MapquestAdapter(key)
        self.assertIn(key, adapter.get_url([Coordinate(0.0, 0.0)]))

    def test_url_contains_one_location(self):
        c = Coordinate(0.0, 1.0)
        adapter = MapquestAdapter('SecretKey')
        self.assertIn("{},{}".format(c.latitude, c.longitude), adapter.get_url([c]))

    def test_url_contains_multiple_locations(self):
        c1 = Coordinate(0.0, 1.0)
        c2 = Coordinate(1.0, 2.0)
        adapter = MapquestAdapter('SecretKey')
        url = adapter.get_url([c1, c2])
        self.assertIn("{},{}".format(c1.latitude, c1.longitude), url)
        self.assertIn("{},{}".format(c2.latitude, c2.longitude), url)

    def test_url_with_size(self):
        c = Coordinate(0.0, 1.0)
        s = Size(100, 100)
        adapter = MapquestAdapter('SecretKey')
        self.assertIn("{},{}".format(s.width, s.height), adapter.get_url([c], size=s))

    def test_consolidate_same_multiple_location(self):
        locations = [
            Coordinate(39.7160439, 32.7059948),
            Coordinate(38.963745, 35.243322),
            Coordinate(38.963745, 35.243322),
            Coordinate(38.963745, 35.243322)
        ]
        adapter = MapquestAdapter('SecretKey')

        url = adapter.get_url(locations)

        self.assertIn('39.7160439,32.7059948|marker-1', url)
        self.assertIn('38.963745,35.243322|marker-3', url)
