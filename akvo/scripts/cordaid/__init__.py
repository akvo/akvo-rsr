# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import os
import sys

from django.core.management import setup_environ

from akvo import settings

setup_environ(settings)

API_VERSION = 'v1'

# get this module
me = sys.modules[__name__]

cordaid_settings = dict(
    CORDAID_ROOT_DIR = '/var/tmp/cordaid',
    CORDAID_PROJECT_IMAGES_SUBDIR = 'project_images',
    CORDAID_LOGOS_SUBDIR = 'logos',
    CORDAID_IATI_ACTIVITES_FILENAME = 'iati_export0.xml',
    CORDAID_INDICATORS_CSV_FILE_NAME = '20130711_indicators.csv',
    CORDAID_ORG_ID = 273,
    CORDAID_IATI_ID = 'NL-KVK-41160054',
    DGIS_ORG_ID = 464,
    DGIS_IATI_ID = 'NL-1'
)

# construct local variables for Cordaid supporting data
for key, val in cordaid_settings.items():
    # try to grab the identifier from settings, if not found use the default from cordaid_settings
    setattr(me, key, getattr(settings, key, val))

# me. isn't strictly necessary here, but included for the code checker's sake
CORDAID_INDICATORS_CSV = os.path.join(me.CORDAID_ROOT_DIR, me.CORDAID_INDICATORS_CSV_FILE_NAME)
CORDAID_IATI_ACTIVITIES_XML = os.path.join(me.CORDAID_ROOT_DIR, me.CORDAID_IATI_ACTIVITES_FILENAME)
CORDAID_PROJECT_IMAGES_DIR =  os.path.join(me.CORDAID_ROOT_DIR, me.CORDAID_PROJECT_IMAGES_SUBDIR)
CORDAID_LOGOS_DIR =  os.path.join(me.CORDAID_ROOT_DIR, me.CORDAID_LOGOS_SUBDIR)
