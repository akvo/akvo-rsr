# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from unittest.mock import patch

from django.core.cache import caches
from django.db import connections
from django.test import TestCase

from akvo.cache.keys import db_scoped_key


class DbScopedKeyTestCase(TestCase):
    """The default cache is shared by every parallel test worker while the database is not."""

    def test_production_keys_are_left_alone(self):
        """A non-test database keeps the key Django would have built by itself."""
        with patch.dict(connections['default'].settings_dict, {'NAME': 'rsr_db'}):
            self.assertEqual(db_scoped_key('somekey', 'prefix', 1), 'prefix:1:somekey')

    def test_workers_get_separate_keyspaces(self):
        """The same key from two worker databases must not collide.

        This is the actual failure being prevented: workers clone the database, so each mints
        the same ids, and a key such as `user_filtered_projects:5:7:` means different things
        in each of them.
        """
        key = 'user_filtered_projects:5:7:'
        with patch.dict(connections['default'].settings_dict, {'NAME': 'test_rsrdb_1'}):
            worker_1 = db_scoped_key(key, '', 1)
        with patch.dict(connections['default'].settings_dict, {'NAME': 'test_rsrdb_2'}):
            worker_2 = db_scoped_key(key, '', 1)

        self.assertNotEqual(worker_1, worker_2)
        self.assertIn('test_rsrdb_1', worker_1)
        self.assertIn('test_rsrdb_2', worker_2)

    def test_cache_round_trip_is_scoped_to_this_database(self):
        """The configured cache really uses the key function, and this run is isolated."""
        cache = caches['default']
        cache.set('isolation-probe', 'mine', 30)
        self.addCleanup(cache.delete, 'isolation-probe')

        self.assertEqual(cache.get('isolation-probe'), 'mine')
        # Under the test runner the database is a clone, so the stored key carries its name.
        name = connections['default'].settings_dict['NAME']
        self.assertTrue(str(name).startswith('test_'), 'expected a test database, got %r' % name)
        self.assertTrue(db_scoped_key('isolation-probe', '', 1).startswith(str(name)))
