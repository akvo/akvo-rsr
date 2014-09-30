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

rain_settings = dict(
    AKVO_NS='http://akvo.org/iati-activities',
    RAIN_ORGANISATION_NS="http://data.rainfoundation.org/rsr-organisations",
    RAIN_ACTIVITY_NS="http://data.rainfoundation.org",

    RAIN_ROOT_DIR = '/var/tmp/rain',
    RAIN_PROJECT_IMAGES_SUBDIR = 'project_images',
    RAIN_LOGOS_SUBDIR = 'logos',

    RAIN_IATI_ACTIVITES_FILENAME = 'rain_activities.xml',
    RAIN_IATI_ACTIVITES_URL='https://data.rainfoundation.org/iati/',
    RAIN_ORGANISATIONS_FILENAME = 'rain_organisations_v03.xml',
    RAIN_ORGANISATIONS_URL='https://data.rainfoundation.org/iati/rsrorg/',

    RAIN_ORG_CSV_FILENAME = 'rain_organisations_upload_{datetime}.csv',
    RAIN_ACTIVITIES_CSV_FILENAME = 'rain_activities_upload_{datetime}.csv',
    RAIN_POST_PROCESS_CSV_FILENAME = 'rain_post_import_{datetime}.csv',

    RAIN_ORG_ID = 35,
    RAIN_IATI_ID = 'NL-KVK-34200988',
)

# construct local variables for RAIN supporting data
for key, val in rain_settings.items():
    # try to grab the identifier from settings, if not found use the default from rain_settings
    setattr(me, key, getattr(settings, key, val))

# "me." isn't strictly necessary here, but included for the code checker's sake
RAIN_IATI_ACTIVITIES_XML = os.path.join(me.RAIN_ROOT_DIR, me.RAIN_IATI_ACTIVITES_FILENAME)
RAIN_ORGANISATIONS_XML = os.path.join(me.RAIN_ROOT_DIR, me.RAIN_ORGANISATIONS_FILENAME)

RAIN_ORG_CSV_FILE = os.path.join(me.RAIN_ROOT_DIR, me.RAIN_ORG_CSV_FILENAME)
RAIN_ACTIVITIES_CSV_FILE = os.path.join(me.RAIN_ROOT_DIR, me.RAIN_ACTIVITIES_CSV_FILENAME)
RAIN_POST_PROCESS_CSV_FILE = os.path.join(me.RAIN_ROOT_DIR, me.RAIN_POST_PROCESS_CSV_FILENAME)

RAIN_PROJECT_IMAGES_DIR =  os.path.join(me.RAIN_ROOT_DIR, me.RAIN_PROJECT_IMAGES_SUBDIR)
RAIN_LOGOS_DIR =  os.path.join(me.RAIN_ROOT_DIR, me.RAIN_LOGOS_SUBDIR)

# class ImportAdapter(logging.LoggerAdapter):
#     def process(self, msg, kwargs):
#         return '{}\t{}\t{}\t{}'.format(
#                 self.extra.get('internal_id', ''),
#                 self.extra.get('akvo_id', ''),
#                 self.extra.get('title_or_name', ''),
#                 msg
#             ), kwargs
#
# def setup_logging():
#     logger = logging.getLogger(__name__)
#     logger.setLevel(logging.DEBUG)
#     fh = logging.FileHandler(RAIN_LOG_FILE, "w")
#     formatter = logging.Formatter('%(asctime)s\t%(name)s\t%(levelname)s\t%(message)s')
#     fh.setFormatter(formatter)
#     logger.addHandler(fh)

def outsys(txt):
    sys.stdout.write(txt)
    sys.stdout.flush()

def save_xml(xml, xml_filename):
    xml_filename = xml_filename.format(
        datetime=datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
    )
    xml_filename = os.path.join(me.RAIN_ROOT_DIR, xml_filename)
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

# Activities
# ==========
# RAIN ID       Akvo ID IATI ID Event   Error/info
# ===========   ======= ======= =====   ==========
# internal_id   rsr_id  iati_id event   extra
#
# Organiations
# ============
# RAIN org ID   Akvo ID     Name    Event     Error
# ===========   =======     ====    =====     =====

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
ACTION_PUBLISHING_SET = 'set publishing status'
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

class RainActivity():
    """ This class holds an etree representation of an activity and is responsible for mapping the relevant bits in the
        activity to the model fields in RSR (or closely related data)
    """
    def __init__(self, tree, rain_ns, akvo_ns):
        # the iati-lactivity etree
        self.tree = tree
        # the Akvo XML namespace
        self.ns_map = {'rain': rain_ns, 'akvo': akvo_ns}

    def rsr_id(self):
        """ Look for the RSR Id of the project, search for a tag similar to:
            <other-identifier owner-name="akvorsr" owner-ref="29"/>
        """
        tags = self.tree.xpath("other-identifier[@owner-name='akvorsr']")
        if len(tags) == 1:
            return tags[0].get('owner-ref')

    def internal_id(self):
        """ Look for the internal Id of the project, search for a tag similar to:
            <other-identifier owner-name="rainpms" rain:type="id" owner-ref="520"/>
        """
        tags =  self.tree.xpath("other-identifier[@owner-name='rainpms' and @rain:type='id']", namespaces=self.ns_map)
        if len(tags) == 1:
            return tags[0].get('owner-ref')

    def iati_id(self):
        return self.tree.find('iati-identifier').text

    def current_image(self):
        url = self.tree.xpath("document-link['akvo:photo-id']/@url")
        if url:
            return url[0]
        return ''

    def current_image_caption(self):
        img_caption = self.tree.xpath("document-link['akvo:photo-id']/title", namespaces=self.ns_map)
        if img_caption:
            return img_caption[0].text.strip()
        return ''

    def current_image_credit(self):
        credit = self.tree.xpath("document-link['akvo:photo-id']/@akvo:photo-credit", namespaces=self.ns_map)
        if credit:
            return credit[0]
        return ''

    def publishing_status(self):
        return self.tree.get(self.akvo_ns + 'publish') == 'true'
