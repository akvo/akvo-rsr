# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

"""Cache key construction.

Kept free of imports from the rest of akvo so that it can be named from the settings files
without pulling the application in while settings are still being assembled.
"""


def db_scoped_key(key, key_prefix, version):
    """Django cache key function that keeps parallel test workers out of each other's cache.

    `manage.py test --parallel` gives every worker its own clone of the database, each with
    its own sequences, so worker 1 and worker 3 both mint user id 5 and organisation id 7.
    They share a single memcached, and cache keys here are built from those ids - for
    instance `user_filtered_projects:5:7:...` in akvo.rsr.permissions, which decides whether
    a user may view a project. One worker could therefore read a value another worker derived
    from a different database, and the failure surfaces as a permission check that is wrong
    for no visible reason, in a test that passes when run on its own.

    Including the database name makes each worker's keyspace its own. The name is read per
    call rather than when settings load, which matters because workers are forked after that
    point and only then have their clone assigned.

    Production is left alone: there is one database, ids are unique, and prefixing every key
    there would throw away the existing cache for no benefit.

    One consequence worth knowing: `AkvoMemcachedCache.list_keys` recovers the logical key by
    splitting a raw key into three parts, so under a test database it would see the extra
    segment and return the wrong thing. Nothing calls it from the tests, and production keys
    keep their original shape, so this is noted rather than worked around.
    """
    from django.db import connections

    default_key = '%s:%s:%s' % (key_prefix, version, key)
    name = connections['default'].settings_dict.get('NAME') or ''
    if not str(name).startswith('test_'):
        return default_key
    return '%s:%s' % (name, default_key)
