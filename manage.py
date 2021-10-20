#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
    Akvo RSR is covered by the GNU Affero General Public License.
    See more details in the license.txt file located at the root folder of the
    Akvo RSR module. For additional details on the GNU license please
    see < http://www.gnu.org/licenses/agpl.html >.
"""

import os
import sys

if __name__ == "__main__":
    try:
        os.environ.setdefault("DJANGO_SETTINGS_MODULE", "akvo.settings")
        from django.core.management import execute_from_command_line

    except ImportError as e:
        message = """Error: Can't find the 'settings' module, it appears you've customized things.\nYou'll have to run
        django-admin.py, passing it your settings module.\n(If the settings module does indeed exist, it's causing an
        ImportError somehow.)\n"""

        sys.stderr.write(message)
        sys.stderr.write("\nImportError: " + str(e) + "\n")
        sys.exit(1)

    execute_from_command_line(sys.argv)
