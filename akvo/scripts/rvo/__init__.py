# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
from rest_framework.status import HTTP_200_OK

from akvo import settings

import datetime
import os
import sys
import tablib

from django.utils.encoding import smart_str, smart_unicode
from akvo.api_utils import Requester


API_VERSION = 'v1'

# get this module
me = sys.modules[__name__]

rvo_settings = dict(
    AKVO_NS='http://akvo.org/iati-activities',
    RVO_ROOT_DIR='/var/tmp/rvo',
    RVO_PROJECT_IMAGES_SUBDIR='project_images',
    RVO_LOGOS_SUBDIR='logos',
    RVO_IATI_ACTIVITES_URL='http://www.rvo.nl/sites/default/files/rvo_website_content/opendata/IATI.xml',
    RVO_ACTIVITIES_CSV_FILENAME='rvo_activities_upload_{datetime}.csv',
    RVO_POST_PROCESS_CSV_FILENAME='rvo_post_import_{datetime}.csv',
    RVO_ORG_ID=2304,
    RVO_IATI_ID='NL-KVK-27378529',
    RVO_KEYWORD_ID=73,
    RVO_DEFAULT_IMAGE='http://www.rvo.nl/sites/default/files/styles/agnl_subject_thumbnail/public/2013/08/internationaal-search.jpg',
)

# construct local variables for RVO supporting data
for key, val in rvo_settings.items():
    setattr(me, key, getattr(settings, key, val))

RVO_ACTIVITIES_CSV_FILE = os.path.join(me.RVO_ROOT_DIR, me.RVO_ACTIVITIES_CSV_FILENAME)
RVO_POST_PROCESS_CSV_FILE = os.path.join(me.RVO_ROOT_DIR, me.RVO_POST_PROCESS_CSV_FILENAME)

RVO_PROJECT_IMAGES_DIR =  os.path.join(me.RVO_ROOT_DIR, me.RVO_PROJECT_IMAGES_SUBDIR)
RVO_LOGOS_DIR =  os.path.join(me.RVO_ROOT_DIR, me.RVO_LOGOS_SUBDIR)


def outsys(txt):
    sys.stdout.write(txt)
    sys.stdout.flush()


def save_xml(xml, xml_filename):
    xml_filename = xml_filename.format(
        datetime=datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
    )
    xml_filename = os.path.join(me.RVO_ROOT_DIR, xml_filename)
    with open(xml_filename, "w") as f:
        f.write(xml)

#base_log = dict(msg=[], error=[])
log_bits = []


def log(text, data):
    log_bits.append(dict(text=text, data=data or {}))


def init_log(log_file):
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
            print bit['text'].format(**bit['data'])

    log_to_file(dataset.csv, log_file)


def load_xml(location):
    "Load XMl either from file or from a URL"
    xml = ''
    if location[:4] == 'http':
        try:
            xml = Requester(
                url_template=location,
                headers={
                    'content-type': 'application/xml',
                    'encoding': 'utf-8',
                },
                accept_codes=[HTTP_200_OK],
            )
        except Exception, e:
            return ''
        if xml.response.status_code is HTTP_200_OK:
            return xml.response.text.encode('utf-8')

    else:
        with open(location, 'r') as f:
            xml = f.read()
    return xml

LOG_ACTIVITIES = 'activities'
LOG_ORGANISATIONS = 'organisations'

ACTION_FOUND = 'found'
ACTION_SET_IMAGE = 'set image'
ACTION_LOCATION_SET = 'set location'
ACTION_LOCATION_FOUND = 'found location'
ACTION_FUNDING_SET = 'set funding'
ACTION_FUNDING_FOUND = 'found funding'
ACTION_BUDGET_SET = 'set total budget'
ACTION_CREATE_PROJECT = 'project created'
ACTION_UPDATE_PROJECT = 'project updated'
ACTION_CREATE_IOI = 'internal org id created'
ACTION_CREATE_ORG = 'organisation created'
ACTION_UPDATE_ORG = 'organisation updated'
ACTION_PROJECT_PUBLISHED = 'project published'
ACTION_PROJECT_NOT_PUBLISHED = 'project not published'
ACTION_PROJECT_POST_PROCESS_DONE = 'project saved'

ERROR_COUNTRY_CODE = 'invalid country code'
ERROR_MULTIPLE_OBJECTS = 'multiple objects'
ERROR_IMAGE_UPLOAD = 'image upload exception'
ERROR_IMAGE_NOT_FOUND = 'no image found'
ERROR_EXCEPTION = 'general exception'
ERROR_CREATE_ACTIVITY = 'activity create error'
ERROR_UPDATE_ACTIVITY = 'activity update error'
ERROR_UPLOAD_ACTIVITY = "activity upload error"
ERROR_NO_ORGS = "participating orgs missing error"
ERROR_CREATE_ORG = 'organisation create error'
ERROR_UPDATE_ORG = 'organisation update error'
ERROR_UPLOAD_ORG = "organisation upload error"
ERROR_CREATE_INTERNAL_ID = 'internal ID creation error'
ERROR_OTHER_CONTENT_OWNER = "different organisation content owner"
ERROR_XML_PARSING = "error parsing organisation XML"
ERROR_MISSING_IATI_ID = "no IATI activity ID found"
ERROR_IDENTIFY_RSR_PROJECT = "inconsistency found when identifying existing RSR project"
ERROR_PROJECT_NOT_FOUND = "project not found"
ERROR_PROJECT_DATA_INVALID = "project data validation error"
ERROR_PROJECT_NOT_SAVED = "project could not be saved"


class RvoActivity():
    """ This class holds an etree representation of an activity and is responsible for mapping the relevant bits in the
        activity to the model fields in RSR (or closely related data)
    """
    def __init__(self, tree):
        # the iati-lactivity etree
        self.tree = tree

    def iati_id(self):
        return self.tree.find('iati-identifier').text.encode('utf-8')
