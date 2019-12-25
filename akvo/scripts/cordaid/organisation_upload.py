# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import os
import django
os.environ['DJANGO_SETTINGS_MODULE'] = 'akvo.settings'
from akvo import settings

from akvo.scripts.cordaid import ERROR_EXCEPTION, ERROR_CREATE_ORG, ERROR_UPLOAD_ORG, ACTION_CREATE_ORG, log, init_log, print_log, ACTION_CREATE_IOI, ACTION_UPDATE_ORG


import getopt
import json
import sys
from lxml import etree

from rest_framework.status import HTTP_200_OK, HTTP_201_CREATED

from akvo.scripts.cordaid.requester import Requester

API_VERSION = 'v1'

# get this module
me = sys.modules[__name__]
api_settings = dict(
    UPLOAD_ROOT_DIR='/Users/gabriel/Downloads/cordaid_full',
    PROJECT_IMAGES_SUBDIR='project_images',
    LOGOS_SUBDIR='logos',
    IATI_ACTIVITES_FILENAME='iati_export0.xml',
    ORGANISATIONS_FILENAME='cordaid_organisations.xml',
    ORGANISATIONS_UPLOAD_LOG_FILENAME='organisations_upload_{datetime}.csv',
)

# construct local variables for Cordaid supporting data
for key, val in api_settings.items():
    # try to grab the identifier from settings, if not found use the default from cordaid_settings
    setattr(me, key, getattr(settings, key, val))

IATI_ACTIVITIES_XML = os.path.join(me.UPLOAD_ROOT_DIR, me.IATI_ACTIVITES_FILENAME)
ORGANISATIONS_XML = os.path.join(me.UPLOAD_ROOT_DIR, me.ORGANISATIONS_FILENAME)
ORGANISATIONS_UPLOAD_LOG_FILE = os.path.join(
    me.UPLOAD_ROOT_DIR, me.ORGANISATIONS_UPLOAD_LOG_FILENAME
)


def user_org(user_cred):
    try:
        profile = Requester(
            url_template="http://{domain}/api/{api_version}/user/?"
                         "format=json&api_key={api_key}&username={username}&"
                         "user__username={username}",
            url_args=user_cred
        )
        # find the organisation ID in the path string, e.g. "/api/v1/organisation/42/"
        # non-intuitively split() returns an empty string first and last, thus [-2]
        return profile.response.json()['objects'][0]['organisation'].split('/')[-2]
    except Exception as e:
        print "{message}".format(message=e.message)
        return False, None


def find_org(user_cred, reporting_org_id, internal_org_id):
    """
    """
    url_args = user_cred
    url_args.update(
        recording_org=reporting_org_id,
        identifier=internal_org_id,
    )
    try:
        ioi = Requester(
            url_template="http://{domain}/rest/v1/internal_organisation_id/?"
                         "recording_org={recording_org}&identifier={identifier}&format=json",
            url_args=url_args,
            headers={
                'content-type': 'application/xml', 'encoding': 'utf-8',
                'Authorization': 'Token {}'.format(user_cred['api_key'])
            },
        )
        # TODO: check that we only get one object back
        org_id = ioi.response.json()[0]['referenced_org']
    except Exception as e:
        print "{message}".format(message=e.message)
        return False, None
    return True, org_id


def post_an_org(org_element, user_cred):
    internal_org_id = org_element.find('org_id').text
    try:
        organisation = Requester(
            method='post',
            url_template="http://{domain}/rest/v1/organisation/",
            url_args=user_cred,
            headers={'content-type': 'application/xml', 'encoding': 'utf-8', 'Authorization': 'Token {}'.format(user_cred['api_key'])},
            data=etree.tostring(org_element),
            accept_codes=[HTTP_201_CREATED]
        )
    except Exception as e:
        return False, "{extra}", dict(
            internal_org_id=internal_org_id,
            event=ERROR_EXCEPTION,
            extra=e.message,
        )
    if organisation.response.status_code is HTTP_201_CREATED:
        import pdb
        pdb.set_trace()
        return True, "Created organisation ID: {pk}", dict(
            pk=organisation.response.json()['id'], event=ACTION_CREATE_ORG
        )
    elif organisation.response.status_code != HTTP_201_CREATED:
        import pdb
        pdb.set_trace()
        return False, "**** Error creating organisation: {internal_org_id}", dict(
            internal_org_id=internal_org_id,
            event=ERROR_CREATE_ORG,
            extra=organisation.response.text
        )
    else:
        return (
            False,
            "**** Error creating organisation: {iati_org_id}. HTTP status code: {extra}", dict(
                internal_org_id=internal_org_id,
                event=ERROR_UPLOAD_ORG,
                extra=organisation.response.status_code,
            )
        )


def post_an_internal_id(user_cred, reporting_org_id, internal_identifier, pk):
    try:
        internal_org_id = Requester(
            method='post',
            url_template="http://{domain}/rest/v1/internal_organisation_id/",
            url_args=user_cred,
            headers={'content-type': 'application/json', 'encoding': 'utf-8', 'Authorization': 'Token {}'.format(user_cred['api_key'])},
            data=json.dumps(dict(
                recording_org=reporting_org_id,
                referenced_org=pk,
                identifier=internal_identifier,
            )),
            accept_codes=[HTTP_201_CREATED]
        )
    except Exception as e:
        return False, "{extra}", dict(
            pk,
            event=ERROR_EXCEPTION,
            extra=e.message,
        )
    if internal_org_id.response.status_code is HTTP_201_CREATED:
        import pdb
        pdb.set_trace()
        return True, "Created internal organisation ID: {identifier}", dict(
            pk=internal_org_id.response.json()['identifier'],
            event=ACTION_CREATE_IOI
        )


def put_an_org(org_element, user_cred, pk):
    internal_org_id = org_element.find('org_id').text
    user_cred.update(pk=pk)
    import pdb
    pdb.set_trace()
    try:
        organisation = Requester(
            method='put',
            url_template="http://{domain}/rest/v1/organisation/{pk}/",
            url_args=user_cred,
            headers={'content-type': 'application/xml', 'encoding': 'utf-8', 'Authorization': ' Token {}'.format(user_cred['api_key'])},
            data=etree.tostring(org_element),
            accept_codes=[HTTP_200_OK]
        )
    except Exception as e:
        return False, "{extra}", dict(
            internal_org_id=internal_org_id,
            event=ERROR_EXCEPTION,
            extra=e.message,
        )
    if organisation.response.status_code is HTTP_200_OK:
        return True, "Updated organisation ID: {pk}", dict(
            pk=organisation.response.json()['id'], event=ACTION_UPDATE_ORG,
        )
    else:
        return (
            False,
            "**** Error updating organisation: {pk}. HTTP status code: {extra}", dict(
                pk=pk,
                event=ERROR_UPLOAD_ORG,
                extra=organisation.response.status_code,
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
    except Exception as e:
        print "{message}".format(message=e.message)
        usage(argv[0])
        return None


def upload_organisations(argv):
    user_cred = credentials_from_args(argv)
    reporting_org_id = user_org(user_cred, **dict())
    if user_cred:
        with open(ORGANISATIONS_XML, 'r') as f:
            root = etree.fromstring(f.read())
            organisations = root.findall('object')
            for i in range(len(organisations)):
                internal_org_id = organisations[i].find('org_id').text
                name = organisations[i].find('name').text
                print "Processing organisation {name}".format(name=name),
                if internal_org_id:
                    print " ID: {org_id}".format(org_id=internal_org_id),
                    import pdb
                    pdb.set_trace()
                    ok, pk = find_org(user_cred, reporting_org_id, internal_org_id)
                    if pk:
                        ok, message, data = put_an_org(organisations[i], user_cred, pk)
                        log(message, data)
                        print message.format(**data)
                    else:
                        ok, message, data = post_an_org(organisations[i], user_cred)
                        log(message, data)
                        print message.format(**data)
                        if ok:
                            post_an_internal_id(user_cred, reporting_org_id, internal_org_id, data['pk'])
                else:
                    print "No internal org ID"


if __name__ == '__main__':
    django.setup()
    import pdb
    pdb.set_trace()
    upload_organisations(sys.argv)
    log_file = init_log(ORGANISATIONS_UPLOAD_LOG_FILE)
    names = (u'pk', u'other_id', u'event', u'extra')
    print_log(log_file, names)

STATIC_ROOT = "/var/akvo/rsr/static/"
STATIC_URL = "/static/"
