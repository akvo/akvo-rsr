# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os
import django

os.environ['DJANGO_SETTINGS_MODULE'] = 'akvo.settings'
from akvo import settings


from akvo.scripts.rain import (
    ERROR_EXCEPTION, ERROR_CREATE_ORG, ERROR_UPLOAD_ORG, ACTION_CREATE_ORG, log, init_log, print_log, ACTION_CREATE_IOI,
    ACTION_UPDATE_ORG, RAIN_ORG_ID, ERROR_OTHER_CONTENT_OWNER, ERROR_UPDATE_ORG, RAIN_ORGANISATION_NS,
    RAIN_ORG_CSV_FILE, ERROR_CREATE_INTERNAL_ID, ERROR_XML_PARSING, RAIN_ORGANISATIONS_XML, load_xml,
    RAIN_ORGANISATIONS_URL, save_xml)

import getopt
import json
import sys
from lxml import etree

from rest_framework.status import HTTP_200_OK, HTTP_201_CREATED  

from akvo.rsr.models import Country, Organisation
from akvo.api_utils import Requester, ImageImporter


API_VERSION = 'v1'

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

def find_org(user_cred, reporting_org_id, org_id, iati_org_id, internal_org_id, name):
    """
    """
    def query_rsr_for_org(url_template, url_args, token, field_name='id'):
        """
        wrapper around Requester for a number of similar requests to try find an organisation
        """
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
                # return org ID and the content owner ID if available
                return data['results'][0][field_name], data['results'][0].get('content_owner',None)
            elif data.get('count', 0) == 0:
                return None, None
            else:
                raise Exception(
                    "Multiple matches when looking for organisation using {}".format(url_template.format(**url_args))
                )
        except Exception, e:
            print "{message}".format(message=e.message)
            raise Exception(
                "Requester error, message:\n{}".format(e.message)
            )

    def find_by_org_id(user_cred, org_id):
        user_cred.update({'org_id': org_id})
        return query_rsr_for_org(
            "http://{domain}/rest/v1/organisation/?id={org_id}",
            user_cred,
            user_cred['api_key'],
        )

    def find_by_iati_org_id(user_cred, iati_org_id):
        user_cred.update({'iati_org_id': iati_org_id})
        return query_rsr_for_org(
            "http://{domain}/rest/v1/organisation/?iati_org_id={iati_org_id}",
            user_cred,
            user_cred['api_key'],
        )

    def find_by_internal_org_id(user_cred, internal_org_id):
        user_cred.update({'recording_org': reporting_org_id, 'identifier': internal_org_id})
        return query_rsr_for_org(
            "http://{domain}/rest/v1/internal_organisation_id/?"
                "recording_org={recording_org}&identifier={identifier}&format=json",
            user_cred,
            user_cred['api_key'],
            'referenced_org'
        )

    def find_by_name(user_cred, name):
        user_cred.update({'name': name})
        return query_rsr_for_org(
            "http://{domain}/rest/v1/organisation/?name={name}",
            user_cred,
            user_cred['api_key'],
        )

    content_owner_id = None
    if org_id:
        org_id, content_owner_id = find_by_org_id(user_cred, org_id)
    else:
        org_ids = []
        if iati_org_id:
            org_id_from_iati_org_id, content_owner_id = find_by_iati_org_id(user_cred, iati_org_id)
            if org_id_from_iati_org_id:
               org_ids.append(org_id_from_iati_org_id)
        if internal_org_id:
            org_id_from_internal_org_id, content_owner_id = find_by_internal_org_id(user_cred, internal_org_id)
            if org_id_from_internal_org_id:
                org_ids.append(org_id_from_internal_org_id)
        if name:
            org_id_from_name, content_owner_id = find_by_name(user_cred, name)
            if org_id_from_name:
                org_ids.append(org_id_from_name)
        # Check we haven't found different orgs by making a set of the IDs.
        # If the set contains more than one ID we're in trouble
        org_ids = list(set(org_ids))
        assert len(org_ids) < 2, \
            "Different organisations found when trying to identify with RSR ID: {org_id} , IATI ID: {iati_org_id}, internal ID: {internal_org_id}, name: {name}".format(
                org_id=org_id, iati_org_id=iati_org_id, internal_org_id=internal_org_id, name=name
            )
        if org_ids:
            org_id = org_ids[0]
    if org_id:
        return org_id, content_owner_id

    return None, None

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
        return "Error creating internal ID: {extra}", dict(
            pk=pk,
            event=ERROR_CREATE_INTERNAL_ID,
            internal_org_id=internal_identifier,
            extra=e.message,
        )
    if internal_org_id.response.status_code is HTTP_201_CREATED:
        return "Created internal organisation ID: {extra}", dict(
            pk=pk,
            internal_org_id=internal_identifier,
            event=ACTION_CREATE_IOI,
            extra=internal_org_id.response.json()['id'],
        )

def put_org(pk, internal_org_id, org_as_dict, user_cred):
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
        )
    except Exception, e:
        return False, "{extra}", dict(
            pk=pk,
            internal_org_id=internal_org_id,
            event=ERROR_EXCEPTION,
            extra=e.message,
        )
    if organisation.response.status_code is HTTP_200_OK:
        return True, "Updated organisation ID: {pk}", dict(
            pk=organisation.response.json()['id'],
            internal_org_id=internal_org_id,
            event=ACTION_UPDATE_ORG,
        )
    else:
        return (
            False,
            "**** Error updating organisation: {pk}. HTTP status code: {extra}", dict(
                pk=pk,
                event=ERROR_UPDATE_ORG,
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
        return None

    long_name = find_text(tree, 'name')
    name = long_name[:25]
    description = find_text(tree, 'description')
    url = find_text(tree, 'url')
    iati_type = find_text(tree, 'iati_organisation_type')
    new_organisation_type = int(iati_type) if iati_type else 22
    organisation_type = Organisation.org_type_from_iati_type(new_organisation_type)
    content_owner = RAIN_ORG_ID
    locations = location_data(tree.find('locations/object'))
    org_dict = dict(
        name=name,
        long_name=long_name,
        description=description,
        url=url,
        organisation_type=organisation_type,
        new_organisation_type=new_organisation_type,
        content_owner=content_owner,
        locations=locations,
    )
    logo = import_logo(tree)
    if logo:
        org_dict['logo'] = logo
    return org_dict


def upload_organisations(argv):
    user_cred = credentials_from_args(argv)
    if user_cred:
        xml = load_xml(RAIN_ORGANISATIONS_URL)
        if xml:
            save_xml(xml, "rain_organisations_{datetime}.xml")
            parser = etree.XMLParser(ns_clean=True, recover=True, encoding='utf-8')
            root = etree.fromstring(xml, parser=parser)
            organisations = root.findall('organisation')
            for i, org_as_etree in enumerate(organisations):
                org_id = find_text(org_as_etree, 'internal_org_id@{{{}}}akvo_identifier'.format(RAIN_ORGANISATION_NS))
                iati_org_id = find_text(org_as_etree, 'iati_org_id')
                internal_org_id = find_text(org_as_etree, 'internal_org_id')
                name = find_text(org_as_etree, 'name')
                assert org_id or ( iati_org_id or internal_org_id), \
                    "Cannot create a new organisation without either an IATI ID or an internal ID"

                print "Processing organisation {}".format(name),
                try:
                    pk, content_owner_id = find_org(user_cred, RAIN_ORG_ID, org_id, iati_org_id, internal_org_id, name)
                except Exception, e:
                    message = "Error trying to find organisation {name} ID {pk}, error message: {extra}"
                    data = dict(
                        pk=org_id,
                        name=name,
                        iati_org_id=iati_org_id,
                        internal_org_id=internal_org_id,
                        event=ERROR_UPLOAD_ORG,
                        extra=e.message,
                    )
                    log(message, data)
                    print message.format(**data)
                    continue
                if content_owner_id is not None and int(content_owner_id) != RAIN_ORG_ID:
                    # Don't mess with orgs managed by others
                    message = "Organisation {name} ID {pk} is managed by another organisation: {extra}"
                    data = dict(
                        pk=org_id,
                        name=name,
                        iati_org_id=iati_org_id,
                        internal_org_id=internal_org_id,
                        event=ERROR_OTHER_CONTENT_OWNER,
                        extra=content_owner_id,
                    )
                    log(message, data)
                    print message.format(**data)
                    continue
                try:
                    org_as_dict = python_organisation(org_as_etree)
                except Exception, e:
                    message = "Error converting organisation XML to json. Error message: {extra}"
                    data = dict(
                        pk=org_id,
                        name=name,
                        iati_org_id=iati_org_id,
                        internal_org_id=internal_org_id,
                        event=ERROR_XML_PARSING,
                        extra=e.message,
                    )
                if pk:
                    ok, message, data = put_org(pk, internal_org_id, org_as_dict, user_cred)
                    log(message, data)
                    print message.format(**data)
                else:
                    ok, message, data = post_org(internal_org_id, org_as_dict, user_cred)
                    log(message, data)
                    print message.format(**data)
                if ok:
                    message, data = post_internal_id(user_cred, RAIN_ORG_ID, internal_org_id, data['pk'])
                    log(message, data)
                    print message.format(**data)

if __name__ == '__main__':
    django.setup()
    upload_organisations(sys.argv)
    log_file = init_log(RAIN_ORG_CSV_FILE)
    names = (u'pk', u'name', u'iati_org_id', u'internal_org_id', u'event', u'extra')
    print_log(log_file, names)

STATIC_ROOT = "/var/akvo/rsr/static/"
STATIC_URL = "/static/"