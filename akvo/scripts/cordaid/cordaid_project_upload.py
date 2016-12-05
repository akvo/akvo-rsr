# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import collections
import getopt
import itertools
import os
import sys

from lxml import etree
from os.path import join, pardir
from tastypie.http import HttpCreated, HttpNoContent

project_root = join(os.path.dirname(os.path.realpath(__file__)), *[pardir]*3)
sys.path.append(project_root)

os.environ['DJANGO_SETTINGS_MODULE'] = 'akvo.settings'

from akvo.scripts.cordaid import (
    log, API_VERSION, CORDAID_IATI_ACTIVITIES_XML, CORDAID_UPLOAD_CSV_FILE, ACTION_CREATE_PROJECT, ERROR_EXCEPTION,
    ERROR_UPLOAD_ACTIVITY, ERROR_CREATE_ACTIVITY, ERROR_UPDATE_ACTIVITY, ACTION_UPDATE_PROJECT,
    print_log, init_log, ERROR_MULTIPLE_OBJECTS, ERROR_NO_ORGS, AKVO_NS
)
from requester import Requester

XML_LANG = "{http://www.w3.org/XML/1998/namespace}lang"


def check_activity_language(activity_element):
    """Checks whether the activity element has an xml:lang tag.
    If so, look for identical elements (with identical attributes) and check if there is an element containing the
    xml:lang of the activity element or one element without a xml:lang tag. In these cases, all other elements are
    removed."""

    def compare_dicts(dict1, dict2):
        """Compares two dicts while ignoring xml:lang attribute.
        Returns True if they're the same and False otherwise."""

        dict1_extra = 0
        dict2_extra = 0

        # Check if xml:lang attribute is present in one dict and missing in the other
        if XML_LANG in dict1 and XML_LANG not in dict2:
            dict1_extra += 1
        elif XML_LANG in dict2 and XML_LANG not in dict1:
            dict2_extra += 1

        # Return False if the number of shared attributes is different
        shared_keys = set(dict1.keys()) & set(dict2.keys())
        if not (len(shared_keys) == len(dict1.keys()) - dict1_extra and
                         len(shared_keys) == len(dict2.keys()) - dict2_extra):
            return False

        # Return True if all attributes are similar
        dicts_are_equal = True
        for key in dict1.keys():
            if key != XML_LANG:
                dicts_are_equal = dicts_are_equal and (dict1[key] == dict2[key])

        return dicts_are_equal

    def check_lang(element, lang):
        """Check if the element has the xml:lang corresponding to the activity language or no xml:lang attribute.
        Return True if so, False otherwise."""

        if XML_LANG not in element.attrib:
            return True

        elif element.attrib[XML_LANG].lower() == lang:
            return True

        return False


    if XML_LANG in activity_element.attrib:
        lang = activity_element.attrib[XML_LANG].lower()

        # For each element in the activity
        for element in activity_element.iter():

            # Look up the elements' children and count their number of appearances
            child_tag_list = [child.tag for child in list(element.iterchildren())]
            child_tag_list_counter = collections.Counter(child_tag_list)
            multiple_children_list = [i for i in child_tag_list_counter if child_tag_list_counter[i]>1]

            # For all children that appear multiple times
            for child_tag in multiple_children_list:
                children = element.findall(child_tag)

                # Make a comparison for all combinations
                for child1, child2 in itertools.combinations(children, 2):
                    if compare_dicts(child1.attrib, child2.attrib):
                        # Remove element if xml:lang differs from activity language and there is another element
                        # that does match the xml:lang or does not have a xml:lang specified.
                        if check_lang(child1, lang) and not check_lang(child2, lang):
                            element.remove(child2)
                        elif not check_lang(child1, lang) and check_lang(child2, lang):
                            element.remove(child1)

    return activity_element



def post_an_activity(activity_element, user):
    try:
        iati_id = activity_element.findall('iati-identifier')[0].text

        activity_element = check_activity_language(activity_element)

        project = Requester(
            method='post',
            url_template="http://{domain}/api/{api_version}/iati_activity/"
                         "?format=xml&api_key={api_key}&username={username}",
            url_args=user,
            headers={'content-type': 'application/xml', 'encoding': 'utf-8'},
            data=etree.tostring(activity_element),
            accept_codes=[HttpCreated.status_code]
        )
    except Exception, e:
        return False, "{extra}", dict(
            iati_id = iati_id,
            event = ERROR_EXCEPTION,
            extra = e.message,
        )
    if project.response.text:
        return False,  "**** Error creating iati-activity: {iati_id}", dict(
            iati_id = iati_id,
            event = ERROR_CREATE_ACTIVITY,
            extra = project.response.text
        )
    elif project.response.status_code is HttpCreated.status_code:
        return True, "Created project for iati-activity: {iati_id}", dict(
            iati_id = iati_id, event = ACTION_CREATE_PROJECT
        )
    else:
        return (
            False,
            "**** Error creating iati-activity: {iati_id}. HTTP status code: {extra}", dict(
                iati_id = iati_id,
                event = ERROR_UPLOAD_ACTIVITY,
                extra = project.response.status_code,
            )
        )

# root[i].findall('iati-identifier')[0].text

def put_an_activity(activity_element, pk, url_args):
    "NOTE: does not work!!!"
    url_args.update(pk=pk)
    try:
        iati_id = activity_element.findall('iati-identifier')[0].text

        activity_element = check_activity_language(activity_element)

        project = Requester(
            method='put',
            url_template="http://{domain}/api/{api_version}/iati_activity/{pk}/?"
                         "format=xml&api_key={api_key}&username={username}",
            url_args=url_args,
            headers={'content-type': 'application/xml', 'encoding': 'utf-8'},
            data=etree.tostring(activity_element),
            accept_codes=[HttpNoContent.status_code]
        )
    except Exception, e:
        return False, "{extra}", dict(
            iati_id = iati_id,
            event = ERROR_EXCEPTION,
            extra = e.message
        )
    if project.response.text:
        return False, "**** Error creating iati-activity: {iati_id}", dict(
            iati_id = iati_id,
            event = ERROR_UPDATE_ACTIVITY,
            extra = project.response.text
        )
    elif project.response.status_code is HttpNoContent.status_code:
        return True, "Updated project for iati-activity: {iati_id} (Akvo pk: {pk})", dict(
            iati_id = iati_id,
            event = ACTION_UPDATE_PROJECT,
            pk = pk
        )
    else:
        return (
            False,
            "**** Error updating iati-activity: {iati_id}. HTTP status code: {extra}", dict(
                iati_id = iati_id,
                event = ERROR_UPLOAD_ACTIVITY,
                extra = project.response.status_code,
            )
        )

def usage(script_name):
    print(
        "\nUsage: %s <domain> <username> [options]\n\n"
        "  <domain>         The domain you are posting to, e.g. test.akvo.org\n"
        "  <username>       Your Akvo account username\n\n"
        "  Options (note that either PWD or KEY must be supplied):\n"
        "     -h, --help    show this message\n\n"
        "     -p PWD, --password=PWD\n"
        "       Supply your Akvo account password\n\n"
        "     -k KEY, --api_key=KEY\n"
        "       Supply the API key generated in your Akvo user profile\n"
        % script_name)

def api_user(domain, username, password='', api_key=''):
    user = dict(domain=domain, username=username, api_version=API_VERSION,)
    if api_key:
        user['api_key'] = api_key
        return user
    elif password:
        auth = Requester(
            method='post',
            url_template="http://{domain}/auth/token/",
            url_args=dict(domain=domain),
            data=dict(username=username, password=password),
        )
        xml = auth.response.text
        root = etree.fromstring(xml)
        user['api_key'] = root.find("api_key").text
        return user
    else:
        raise Exception("Either password or API key must be supplied")

def credentials_from_args(argv):
    try:
        opts, args = getopt.getopt(argv[1:], "hp:k:", ["help", "password=", "api_key="])
    except getopt.GetoptError as e:
        print (str(e))
        usage(argv[0])
        sys.exit(2)
    kwargs = {}
    for opt, arg in opts:
        if opt in ("-h", "--help"):
            usage(argv[0])
            sys.exit()
        # TODO: see if it's possible to suppress password echoing in terminal
        elif opt in ("-p", "--password"):
            kwargs['password'] = arg
        elif opt in ("-k", "--api_key"):
            kwargs['api_key'] = arg
    try:
        domain = args[0]
        username = args[1]
    except IndexError:
        usage(argv[0])
        sys.exit(2)
    try:
        user = api_user(domain, username, **kwargs)
        return user
    except Exception, e:
        print "{message}".format(message=e.message)
        usage(argv[0])
        return None

def get_project_count(user, **q_args):
    """
    query the API for projects associated with a given internal_id
    """
    url_args = user
    url_args.update(
        extra_args = "&".join(
            ["{}={}".format(item[0], item[1]) for item in q_args.items()]
        )
    )
    try:
        project = Requester(
            url_template="http://{domain}/api/{api_version}/project/?"
                         "format=json&api_key={api_key}&username={username}&{extra_args}",
            url_args=url_args
        )
    except Exception, e:
        print "{message}".format(message=e.message)
        return False, None
    return True, project

def upload_activities(argv):
    user = credentials_from_args(argv)
    if user:
        with open(CORDAID_IATI_ACTIVITIES_XML, 'r') as f:
            root = etree.fromstring(f.read())
            document_akvo_ns = '{akvo_ns}'.format(akvo_ns=root.nsmap['akvo'])
            assert document_akvo_ns == AKVO_NS, "Akvo name space is incorrect in the IATI XML"
            activities = root.findall('iati-activity')
            activity_count = len(activities)
            for i in range(activity_count):
                internal_id = activities[i].get(AKVO_NS + 'internal-project-id')
                iati_id=activities[i].findall('iati-identifier')[0].text
                print "({current} of {activity_count}) Processing activity {iati_id}".format(current=i+1, activity_count=activity_count, iati_id=iati_id),
                if len(activities[i].findall('participating-org')) > 0:
                    if internal_id:
                        ok, project = get_project_count(user, **dict(partnerships__internal_id=internal_id))
                    elif iati_id:
                        ok, project = get_project_count(user, **dict(iati_activity_id=iati_id))
                    if not ok:
                        continue #error msg already output
                    project_count = project.response.json()['meta']['total_count']
                    if project_count == 0:
                        ok, message, data = post_an_activity(activities[i], user)
                        log(message, data)
                        print message.format(**data)
                    elif project_count == 1:
                        pk = project.response.json()['objects'][0]['id']
                        ok, message, data = put_an_activity(activities[i], pk, user)
                        log(message, data)
                        print message.format(**data)
                    elif project_count > 1:
                        data = dict(iati_id=iati_id, event=ERROR_MULTIPLE_OBJECTS, extra=internal_id)
                        log(None, data)
                        print(
                            "**** Error updating iati-activity: {iati_id}. "
                            "More than one project with internal ID {extra} exists.".format(**data)
                        )
                else:
                    message = "Iati-activity {iati_id} has no participating-orgs, aborting"
                    data = dict(iati_id = iati_id, event = ERROR_NO_ORGS,)
                    log(message, data)
                    print(message.format(**data))

if __name__ == '__main__':
    upload_activities(sys.argv)
    log_file = init_log(CORDAID_UPLOAD_CSV_FILE)
    names = (u'iati_id', u'pk', u'event', u'extra')
    print_log(log_file, names)
