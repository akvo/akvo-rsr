# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os
os.environ['DJANGO_SETTINGS_MODULE'] = 'akvo.settings'
from akvo import settings


from akvo.scripts.rain import (
    ERROR_EXCEPTION, ERROR_CREATE_ORG, ERROR_UPLOAD_ORG, ACTION_CREATE_ORG, log, init_log, print_log, ACTION_CREATE_IOI,
    ACTION_UPDATE_ORG, RAIN_LOGOS_DIR
)

import getopt
import json
import sys
from lxml import etree

from rest_framework.status import HTTP_200_OK, HTTP_201_CREATED  

from akvo.rsr.models import Country, Organisation
from akvo.api_utils import Requester, ImageImporter


API_VERSION = 'v1'
RAIN_NS = "{http://data.rainfoundation.org}"

# get this module
me = sys.modules[__name__]
api_settings = dict(
    #UPLOAD_ROOT_DIR = '/Users/gabriel/Downloads/api_upload',
    UPLOAD_ROOT_DIR = '/var/akvo/rsr/code/akvo/rain',
    PROJECT_IMAGES_SUBDIR = 'project_images',
    LOGOS_SUBDIR = 'logos',
    IATI_ACTIVITES_FILENAME = 'rain_one_activity_20140730.xml',
    #ORGANISATIONS_FILENAME = 'organisations.xml',
    ORGANISATIONS_FILENAME = '3_organisations_2014_08_01.xml',
    ORGANISATIONS_UPLOAD_LOG_FILENAME = 'organisations_upload_{datetime}.csv',
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
LOGOS_PATH = os.path.join(me.UPLOAD_ROOT_DIR, me.LOGOS_SUBDIR)

def user_org(user_cred):
    try:
        profile = Requester(
            url_template="http://{domain}/api/{api_version}/user_profile/?"
                 "format=json&api_key={api_key}&username={username}&user__username={username}",
            url_args=user_cred,
        )
        # find the organisation ID in the path string, e.g. "/api/v1/organisation/42/"
        #non-intuitively split() returns an empty string first and last, thus [-2]
        return profile.response.json()['objects'][0]['organisation'].split('/')[-2]
    except Exception, e:
        print "{message}".format(message=e.message)
        return None

def find_org(user_cred, reporting_org_id, iati_org_id, internal_org_id, name):
    """
    """
    def query_rsr(url_template, url_args, token, field_name='id'):
        try:
            request = Requester(
                url_template=url_template,
                url_args=url_args,
                headers={
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                    'Encoding': 'utf-8',
                    'Authorization': 'Token {}'.format(token)
                },
            )
            data = request.response.json()
            if data.get('count', 0) == 1:
                return data['results'][0][field_name]
            elif data.get('count', 0) == 0:
                return None
            else:
                raise Exception(
                    "Multiple matches when looking for organisation using {}".format(url_template.format(**url_args))
                )
        except Exception, e:
            print "{message}".format(message=e.message)
            raise Exception(
                "Requester error, message:\n{}".format(e.message)
            )

    def find_by_iati_org_id(user_cred, iati_org_id):
        user_cred.update({'iati_org_id': iati_org_id})
        return query_rsr(
            "http://{domain}/rest/v1/organisation/?iati_org_id={iati_org_id}",
            user_cred,
            user_cred['api_key'],
        )

    def find_by_internal_org_id(user_cred, internal_org_id):
        user_cred.update({'recording_org': reporting_org_id, 'identifier': internal_org_id})
        return query_rsr(
            "http://{domain}/rest/v1/internal_organisation_id/?"
                "recording_org={recording_org}&identifier={identifier}&format=json",
            user_cred,
            user_cred['api_key'],
            'referenced_org'
        )

    def find_by_name(user_cred, name):
        user_cred.update({'name': name})
        return query_rsr(
            "http://{domain}/rest/v1/organisation/?name={name}",
            user_cred,
            user_cred['api_key'],
        )

    if iati_org_id:
        org_id = find_by_iati_org_id(user_cred, iati_org_id)
        if org_id:
            return org_id

    if internal_org_id:
        org_id = find_by_internal_org_id(user_cred, internal_org_id)
        if org_id:
            return org_id

    if name:
        org_id = find_by_name(user_cred, name)
        if org_id:
            return org_id

    return None

def post_org(internal_org_id, org_as_dict, user_cred):
    try:
        organisation = Requester(
            url_template="http://{domain}/rest/v1/organisation/",
            method='post',
            url_args=user_cred,
            headers={
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Encoding': 'utf-8',
                'Authorization': 'Token {}'.format(user_cred['api_key'])
            },
            data=json.dumps(org_as_dict),
            accept_codes=[HTTP_201_CREATED],
        )
    except Exception, e:
        return False, "{extra}", dict(
            internal_org_id=internal_org_id,
            event=ERROR_EXCEPTION,
            extra=e.message,
        )
    if organisation.response.status_code is HTTP_201_CREATED:
        return True, "Created organisation ID: {pk} ", dict(
            pk=organisation.response.json()['id'], event=ACTION_CREATE_ORG
        )
    elif organisation.response.status_code != HTTP_201_CREATED:
        return False,  "**** Error creating organisation: {internal_org_id}", dict(
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

def post_internal_id(user_cred, reporting_org_id, internal_identifier, pk):
    try:
        internal_org_id = Requester(
            url_template="http://{domain}/rest/v1/internal_organisation_id/",
            method='post',
            url_args=user_cred,
            headers={
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Encoding': 'utf-8',
                'Authorization': 'Token {}'.format(user_cred['api_key'])
            },
            data=json.dumps(dict(
                recording_org=reporting_org_id,
                referenced_org=pk,
                identifier=internal_identifier,
            )),
            accept_codes=[HTTP_201_CREATED],
        )
    except Exception, e:
        return False, "{extra}", dict(
            pk,
            event = ERROR_EXCEPTION,
            extra = e.message,
        )
    if internal_org_id.response.status_code is HTTP_201_CREATED:
        return True, "Created internal organisation ID: {identifier}", dict(
            pk = internal_org_id.response.json()['identifier'],
            event = ACTION_CREATE_IOI
        )

def put_org(pk, internal_org_id, org_as_dict, user_cred):

    ### DEBUG ###
    import pdb
    pdb.set_trace()
    ### DEBUG ###

    user_cred.update(pk=pk)
    try:
        organisation = Requester(
            url_template="http://{domain}/rest/v1/organisation/{pk}/",
            method='put',
            url_args=user_cred,
            headers={
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Encoding': 'utf-8',
                'Authorization': 'Token {}'.format(user_cred['api_key'])
            },
            data=json.dumps(org_as_dict),
            accept_codes=[HTTP_200_OK],
        )
    except Exception, e:
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
        "\nUsage: %s [options] <domain> <username>\n\n"
        "  Options (note that either PWD or KEY must be supplied):\n"
        "     -h, --help    show this message\n\n"
        "     -p PWD, --password=PWD\n"
        "       Supply your Akvo account password\n\n"
        "     -k KEY, --api_key=KEY\n"
        "       Supply the API key generated in your Akvo user profile\n"
        "  <domain>         The domain you are posting to, e.g. test.akvo.org\n"
        "  <username>       Your Akvo account username\n\n"
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
            data=dict(
                username=username,
                password=password,
            ),
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

def find_text(tree, str):
    try:
        tag, attr = str.split('@')
    except ValueError:
        tag, attr = str, None
    element = tree.find(tag)
    if element is None:
        return ''
    if attr:
        return element.get(attr).strip()
    else:
        return element.text.strip() if element.text else ''

def python_organisation(tree):
    """
    Create a python data structure representing an organisation from the etree representation
    """
    def location_data(location_tree):
        if location_tree is None:
            return []
        iso_code = find_text(location_tree, 'iso_code').lower()
        if iso_code:
            country, created = Country.objects.get_or_create(**Country.fields_from_iso_code(iso_code))
            country = country.id
        else:
            # TODO: error reporting
            return []
        latitude = find_text(location_tree, 'latitude') or 0
        longitude = find_text(location_tree, 'longitude') or 0
        primary = True
        return [dict(
            latitude=latitude,
            longitude=longitude,
            country=country,
            primary=primary,
        )]

    def import_logo(tree):
        logo = find_text(tree, 'logo')
        if logo:
            image = ImageImporter(logo)
            image.get_image()
            return image.to_base64()
        return ''

    long_name = find_text(tree, 'name')
    name = long_name[:25]
    description = find_text(tree, 'description')
    url = find_text(tree, 'url')
    iati_type = find_text(tree, 'iati_organisation_type')
    new_organisation_type = int(iati_type) if iati_type else 22
    organisation_type = Organisation.org_type_from_iati_type(new_organisation_type)
    locations = location_data(tree.find('locations/object'))

    logo = import_logo(tree)
    return dict(
        name=name,
        long_name=long_name,
        description=description,
        url=url,
        organisation_type=organisation_type,
        new_organisation_type=new_organisation_type,
        locations=locations,
        logo=logo,
    )

def upload_organisations(argv):
    user_cred = credentials_from_args(argv)
    if user_cred:
        reporting_org_id = user_org(user_cred)
        with open(ORGANISATIONS_XML, 'r') as f:
            root = etree.fromstring(f.read())
            organisations = root.findall('organisation')
            for i, org_as_etree in enumerate(organisations):
                # if i > 5:
                #     break
                org_id = find_text(org_as_etree, 'internal_org_id@{}akvo_identifier'.format(RAIN_NS))
                iati_org_id = find_text(org_as_etree, 'iati_org_id')
                internal_org_id = find_text(org_as_etree, 'internal_org_id')
                name = find_text(org_as_etree, 'name')

                print "Processing organisation {}".format(name),
                try:
                    pk = find_org(user_cred, reporting_org_id, iati_org_id, internal_org_id, name)
                except Exception, e:
                    message = "Error trying to find organisation, error message: {extra}"
                    data = dict(extra=e.message)
                    log(message, data)
                    print message.format(**data)
                    continue

                org_as_dict = python_organisation(org_as_etree)
                if pk:
                    ok, message, data = put_org(pk, internal_org_id, org_as_dict, user_cred)
                    log(message, data)
                    print message.format(**data)
                else:
                    ok, message, data = post_org(internal_org_id, org_as_dict, user_cred)
                    log(message, data)
                    print message.format(**data)
                    if ok:
                        post_internal_id(user_cred, reporting_org_id, internal_org_id, data['pk'])


if __name__ == '__main__':
    upload_organisations(sys.argv)
    log_file = init_log(ORGANISATIONS_UPLOAD_LOG_FILE)
    names = (u'pk', u'other_id', u'event', u'extra')
    print_log(log_file, names)

STATIC_ROOT = "/var/akvo/rsr/static/"
STATIC_URL = "/static/"