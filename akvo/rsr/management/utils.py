# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import sys


def spinning_cursor():
    while True:
        for cursor in '|/-\\':
            yield cursor


def rotate_spinner():
    sys.stdout.write(next(spinner))
    sys.stdout.flush()
    sys.stdout.write('\b')


spinner = spinning_cursor()
