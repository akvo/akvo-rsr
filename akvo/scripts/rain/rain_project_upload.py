# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import getopt
import sys

from lxml import etree
from rest_framework.status import HTTP_200_OK

from tastypie.http import HttpCreated, HttpNoContent

from django.http import HttpResponse

from akvo.scripts.rain import (
    log, API_VERSION, RAIN_IATI_ACTIVITIES_XML, RAIN_ACTIVITIES_CSV_FILE, ACTION_CREATE_PROJECT, ERROR_EXCEPTION,
    ERROR_UPLOAD_ACTIVITY, ERROR_CREATE_ACTIVITY, ERROR_UPDATE_ACTIVITY, ACTION_UPDATE_PROJECT,
    RAIN_ACTIVITIES_CSV_FILE, print_log, init_log, ERROR_NO_ORGS, RainActivity, AKVO_NS, RAIN_NS, RAIN_ORG_ID,
    ERROR_MISSING_IATI_ID, ERROR_IDENTIFY_RSR_PROJECT
)

from akvo.api_utils import Requester


def post_an_activity(activity_element, user):
    try:
        iati_id = activity_element.findall('iati-identifier')[0].text
        project = Requester(
            url_template="http://{domain}/api/{api_version}/iati_activity/?format=xml&api_key={api_key}&username={username}",
            method='post',
            url_args=user,
            headers={'content-type': 'application/xml', 'encoding': 'utf-8'},
            data=etree.tostring(activity_element), accept_codes=[HttpCreated.status_code]
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
    url_args.update(pk=pk)
    try:
        iati_id = activity_element.findall('iati-identifier')[0].text
        project = Requester(
            url_template="http://{domain}/api/{api_version}/iati_activity/{pk}/?format=xml&api_key={api_key}&username={username}",
            method='put',
            url_args=url_args,
            headers={'content-type': 'application/xml', 'encoding': 'utf-8'},
            data=etree.tostring(activity_element),
            accept_codes=[HttpNoContent.status_code],
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
            url_template="http://{domain}/auth/token/",
            method='post',
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
    Look for a project
    """
    url_args = user
    url_args.update(
        extra_args = "&".join(
            ["{}={}".format(item[0], item[1]) for item in q_args.items()]
        )
    )
    try:
        project = Requester(
            url_template="http://{domain}/api/{api_version}/project/"
                "?format=json&api_key={api_key}&username={username}&{extra_args}",
            url_args=url_args,
        )
    except Exception, e:
        print "{message}".format(message=e.message)
        return False, None
    return True, project

def load_xml(location):
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
            return None
        if xml.response.status_code is HTTP_200_OK:
            return xml.response.text.encode('utf-8')

    else:
        with open(location, 'r') as f:
            xml = f.read()

    return xml

def identify_rsr_project(user, rsr_id, iati_id, internal_id):
    """ Figure out if we can identify an RSR project from one or more of
        the RSR ID, an IATI activity ID, and an internal ID of RAIN, with consistency checking
    """
    rsr_id_from_iati_id, rsr_id_from_internal_id = None, None
    if rsr_id:
        ok, project = get_project_count(user, **dict(id=rsr_id))
        # IF we have an RSR ID and we don't get anything back something's seriously wrong
        if not ok:
            raise AssertionError, "Project with ID {} not found".format(rsr_id)
    if iati_id:
        ok, project = get_project_count(user, **dict(partnerships__iati_activity_id=iati_id))
        if ok:
            iati_project_count = project.response.json()['meta']['total_count']
            # More than one project with the same IATI activity ID is not good
            assert iati_project_count < 2, "Two or more projects with the same IATI ID: {}".format(iati_id)
            if iati_project_count == 0:
                rsr_id_from_iati_id = None
            elif iati_project_count == 1:
                rsr_id_from_iati_id = project.response.json()['objects'][0]['id']
                if rsr_id:
                    # If we have an RSR ID verify it's the same project
                    assert int(rsr_id) == int(rsr_id_from_iati_id), \
                        "Project with ID {} doesn't match query for project with IATI ID {}".format(rsr_id, iati_id)
    if internal_id:
        ok, project = get_project_count(
            user, **dict(partnerships__internal_id=internal_id, partnerships__organisation=RAIN_ORG_ID)
        )
        if ok:
            internal_id_project_count = project.response.json()['meta']['total_count']
            # More than one project with the same internal ID is not good either
            assert internal_id_project_count < 2, \
                "Two or more projects with the same internal ID: {}".format(internal_id)
            if internal_id_project_count == 0:
                rsr_id_from_internal_id = None
            elif internal_id_project_count == 1:
                rsr_id_from_internal_id = project.response.json()['objects'][0]['id']
                if rsr_id:
                    # If we have an RSR ID verify it's the same project
                    assert int(rsr_id) == int(rsr_id_from_internal_id), \
                        "Project with ID {} doesn't match query for project with internal ID {}".format(rsr_id, internal_id)
    if rsr_id_from_iati_id and rsr_id_from_internal_id:
        # finally check that we get the same project when using IATI ID or internal ID lookup when we have both
        assert int(rsr_id_from_iati_id) == int(rsr_id_from_internal_id), \
            "Query for project with IATI ID {} doesn't match query for project with internal ID {}".format(rsr_id, internal_id)
    # if we've found a project return is ID
    if rsr_id:
        return rsr_id
    if rsr_id_from_iati_id:
        return rsr_id_from_iati_id
    if rsr_id_from_internal_id:
        return rsr_id_from_internal_id
    # no project found
    return None

def upload_activities(argv):
    user = credentials_from_args(argv)
    if user:
        xml = load_xml(RAIN_IATI_ACTIVITIES_XML)
        if xml:
            parser = etree.XMLParser(ns_clean=True, recover=True, encoding='utf-8')
            root = etree.fromstring(xml, parser=parser)
            document_akvo_ns = akvo_ns=root.nsmap['akvo']
            assert document_akvo_ns == AKVO_NS, "Akvo name space is incorrect in the IATI XML"
            activities = root.findall('iati-activity')
            activity_count = len(activities)
            for i, activity in enumerate(activities):
                activity = RainActivity(activity, RAIN_NS, AKVO_NS)
                internal_id = activity.internal_id()
                iati_id = activity.iati_id()
                try:
                    assert iati_id is not None, "No IATI ID found, for activity number {} in the XML".format(i+1)
                except AssertionError, e:
                    message = "No IATI ID for activity number {extra}"
                    data = dict(
                        event=ERROR_MISSING_IATI_ID,
                        extra=i,
                    )
                    log(message, data)
                    print message.format(**data)
                    continue
                rsr_id = activity.rsr_id()
                print "({current} of {activity_count}) Processing activity {iati_id}".format(
                    current=i+1, activity_count=activity_count, iati_id=iati_id
                ),
                if len(activity.tree.findall('participating-org')) > 0:
                    try:
                        rsr_id = identify_rsr_project(user, rsr_id, iati_id, internal_id)
                    except AssertionError, e:
                        message = "Error identifying RSR project: ID {pk}, IATI ID: {iati_id}, Error message: \n{extra}"
                        data = dict(
                            pk=rsr_id,
                            iati_id=iati_id,
                            event=ERROR_IDENTIFY_RSR_PROJECT,
                            extra=e.message,
                        )
                        log(message, data)
                        print message.format(**data)
                        continue
                    if rsr_id:
                        ok, message, data = put_an_activity(activity.tree, rsr_id, user)
                        log(message, data)
                        print message.format(**data)
                    else:
                        ok, message, data = post_an_activity(activity.tree, user)
                        log(message, data)
                        print message.format(**data)
                else:
                    message = "Iati-activity {iati_id} has no participating-orgs, aborting"
                    data = dict(iati_id = iati_id, event = ERROR_NO_ORGS,)
                    log(message, data)
                    print(message.format(**data))

if __name__ == '__main__':
    upload_activities(sys.argv)
    log_file = init_log(RAIN_ACTIVITIES_CSV_FILE)
    names = (u'iati_id', u'pk', u'event', u'extra')
    print_log(log_file, names)
