# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import datetime
import os
import sys
import tablib

from django.core.management import setup_environ
from django.utils.encoding import smart_str, smart_unicode

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
    CORDAID_ORGANISATIONS_FILENAME = 'cordaid_organisations.xml',
    CORDAID_INDICATORS_CSV_FILE_NAME = '20130711_indicators.csv',
    CORDAID_LOG_FILENAME = 'cordaid_import.log',
    CORDAID_ORG_CSV_FILENAME = 'cordaid_organisations_import_{datetime}.csv',
    CORDAID_ACTIVITIES_CSV_FILENAME = 'cordaid_activities_import_{datetime}.csv',
    CORDAID_UPLOAD_CSV_FILENAME = 'cordaid_activities_upload_{datetime}.csv',

    CORDAID_ORG_ID = 273,
    CORDAID_IATI_ID = 'NL-KVK-41160054',
    DGIS_ORG_ID = 464,
    DGIS_IATI_ID = 'NL-1',
    OTHERS_ORG_ID = 1653,
)

# construct local variables for Cordaid supporting data
for key, val in cordaid_settings.items():
    # try to grab the identifier from settings, if not found use the default from cordaid_settings
    setattr(me, key, getattr(settings, key, val))

# "me." isn't strictly necessary here, but included for the code checker's sake
CORDAID_INDICATORS_CSV = os.path.join(me.CORDAID_ROOT_DIR, me.CORDAID_INDICATORS_CSV_FILE_NAME)
CORDAID_IATI_ACTIVITIES_XML = os.path.join(me.CORDAID_ROOT_DIR, me.CORDAID_IATI_ACTIVITES_FILENAME)
CORDAID_ORGANISATIONS_XML = os.path.join(me.CORDAID_ROOT_DIR, me.CORDAID_ORGANISATIONS_FILENAME)
CORDAID_LOG_FILE = os.path.join(me.CORDAID_ROOT_DIR, me.CORDAID_LOG_FILENAME)
CORDAID_ORG_CSV_FILE = os.path.join(me.CORDAID_ROOT_DIR, me.CORDAID_ORG_CSV_FILENAME)
CORDAID_ACTIVITIES_CSV_FILE = os.path.join(me.CORDAID_ROOT_DIR, me.CORDAID_ACTIVITIES_CSV_FILENAME)
CORDAID_UPLOAD_CSV_FILE = os.path.join(me.CORDAID_ROOT_DIR, me.CORDAID_UPLOAD_CSV_FILENAME)

CORDAID_PROJECT_IMAGES_DIR =  os.path.join(me.CORDAID_ROOT_DIR, me.CORDAID_PROJECT_IMAGES_SUBDIR)
CORDAID_LOGOS_DIR =  os.path.join(me.CORDAID_ROOT_DIR, me.CORDAID_LOGOS_SUBDIR)

def outsys(txt):
    sys.stdout.write(txt)
    sys.stdout.flush()

#base_log = dict(msg=[], error=[])
log_bits = []

def log(text, data):
    log_bits.append(dict(text=text, data=data or {}))

def init_log(log_file=CORDAID_LOG_FILE):
    current_log_file = log_file.format(datetime=datetime.datetime.now().strftime("%Y%m%d-%H%M%S"))
    with open(current_log_file, "w") as f:
        pass
    return current_log_file

def log_to_file(text, log_file):
    out = u"{text}\n".format(text=smart_unicode(text))
    with open(log_file, "a") as f:
        f.write(smart_str(out))
    sys.stdout.write(smart_str(out))

def print_log(log_file, column_names, to_console=False):
    dataset = tablib.Dataset()
    dataset.headers = column_names
    for bit in log_bits:
        data = bit['data']
        row = []
        do_append = False
        for name in column_names:
            data[name] = data.setdefault(name, '')
            row.append(data[name])
            if data[name]: do_append = True
        if do_append:
            dataset.append(row)
        elif to_console:
            print  bit['text'].format(**bit['data'])

    log_to_file(dataset.csv, log_file)


# Activities
# ==========
# Cordaid ID      Akvo ID     Title       Event     Error
# ==========      =======     =====       =====     =====
#
#
# Organiations
# ============
# Cordaid org ID      Akvo ID     Name    Event     Error
# ==============      =======     ====    =====     =====

LOG_ACTIVITIES = 'activities'
LOG_ORGANISATIONS = 'organisations'

ACTION_FOUND = 'found'
ACTION_SET_IMAGE = 'set image'
ACTION_LOCATION_SET = 'set location'
ACTION_LOCATION_FOUND = 'found location'
ACTION_CREATE_ORG = 'organisation created'
ACTION_FUNDING_SET = 'set funding'
ACTION_FUNDING_FOUND = 'found funding'
ACTION_BUDGET_SET = 'set total budget'
ACTION_CREATE_PROJECT = 'project created'
ACTION_UPDATE_PROJECT = 'project updated'

ERROR_COUNTRY_CODE = 'invalid country code'
ERROR_MULTIPLE_OBJECTS = 'multiple objects'
ERROR_IMAGE_UPLOAD = 'image upload exception'
ERROR_EXCEPTION = 'general exception'
ERROR_CREATE_ACTIVITY = 'activity create error'
ERROR_UPDATE_ACTIVITY = 'activity update error'
ERROR_UPLOAD_ACTIVITY = "activity upload error"
ERROR_NO_ORGS = "participating orgs missing error"