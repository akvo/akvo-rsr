#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please
    see < http://www.gnu.org/licenses/agpl.html >.
"""

from django.core.management import execute_manager

try:
    import settings
except ImportError as e:
    import sys
    message = """Error: Can't find the file 'settings.py' in the directory
              containing %r. It appears you've customized things.\nYou'll
              have to run django-admin.py, passing it your settings module.
              \n(If the file settings.py does indeed exist, it's causing an
              ImportError somehow.)\n""" % __file__

    sys.stderr.write(message)
    sys.stderr.write("\nImportError: " + str(e) + "\n")
    sys.exit(1)

if __name__ == "__main__":
    execute_manager(settings)
