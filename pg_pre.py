#!/usr/bin/env python
# -*- coding: utf-8 -*-

""" Akvo RSR is covered by the GNU Affero General Public License.
See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.

This script should be run before we enable postgres settings!
"""

from __future__ import print_function
import sys
import os

from django.db import connections


def truncate_django_sessions():
    """
    We don't need to carry over old sessions.
    """
    print('\tAbout to truncate django sessions')
    cursor = connections["mysql"].cursor()

    sql = ('TRUNCATE django_session;')
    cursor.execute(sql)
    print('\tDid truncate django sessions')


if __name__ == '__main__':
    # Setup the Django env
    try:
        sys.path.append('/var/akvo/rsr/code/akvo')
        os.environ['DJANGO_SETTINGS_MODULE'] = 'settings'
    except ImportError as error:
        sys.stderr.write('Error: Can not find the \'settings\' module.')
        sys.stderr.write('\nImportError: ' + str(error) + '\n')
        sys.exit(1)

    print('\nAbout to do pre migration work\n')
    truncate_django_sessions()
    print('\nFinished\n')
