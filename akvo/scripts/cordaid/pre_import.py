# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import csv
import glob
from lxml import etree
import os
from os.path import splitext, basename
import sys

from django.core.files import File
from django.core.files.temp import NamedTemporaryFile
from django.core.management import setup_environ

from akvo import settings

setup_environ(settings)

from akvo.rsr.iati_code_lists import IATI_LIST_ORGANISATION_TYPE
from akvo.rsr.models import (
    Category, Benchmarkname, FocusArea, Organisation, InternalOrganisationID, OrganisationLocation
)
from akvo.rsr.utils import model_and_instance_based_filename, custom_get_or_create_country, who_am_i
from akvo.scripts.cordaid import (
    CORDAID_ORG_ID, CORDAID_IATI_ID, DGIS_ORG_ID, DGIS_IATI_ID, CORDAID_INDICATORS_CSV,
    CORDAID_LOGOS_DIR, CORDAID_ORGANISATIONS_XML,
    print_log, log, LOG_ORGANISATIONS, ACTION_FOUND, ERROR_MULTIPLE_OBJECTS, ACTION_LOCATION_SET,
    ERROR_COUNTRY_CODE, ACTION_CREATE_ORG, ERROR_EXCEPTION, ACTION_LOCATION_FOUND, ACTION_SET_IMAGE,
    CORDAID_ORG_CSV_FILE,
    init_log,
    outsys, CORDAID_IATI_ACTIVITIES_XML)


def create_cordaid_business_units(business_units):
    outsys("\nRunning {}() ".format(who_am_i()))
    business_units_info = [
        dict(pk=CORDAID_ORG_ID,  internal_id="27239"),
        dict(pk=959,  internal_id="K6020", cat_name="Children & Education", fa="Education"),
        dict(pk=962,  internal_id="K6090", cat_name="Domestic", fa="Economic development"),
        dict(pk=961,  internal_id="K6030", cat_name="Disaster Recovery", fa="Economic development"),
        dict(pk=950,  internal_id="K6070", cat_name="Entrepreneurship", fa="Economic development"),
        dict(pk=1099, internal_id="K6110", cat_name="Food Security", fa="Healthcare"),
        dict(pk=953,  internal_id="K6100", cat_name="Investments", fa="Economic development"),
        dict(pk=949,  internal_id="K6010", cat_name="Healthcare", fa="Healthcare"),
        dict(pk=1241, internal_id="K6060", cat_name="Security & Justice", fa="Economic development"),
        dict(pk=946,  internal_id="K6080", cat_name="Urban Matters", fa="Economic development"),
        dict(pk=955,  internal_id="K6040", cat_name="Women's leadership", fa="Economic development"),
        dict(pk=960,  internal_id="K6050", cat_name="Extractives", fa="Economic development"),
    ]
    cordaid = Organisation.objects.get(pk=CORDAID_ORG_ID)
    for data in business_units_info:
        outsys('.')
        pk, identifier = data['pk'], data['internal_id']
        cat_name, fa_name = data.get('cat_name'), data.get('fa')
        try:
            organisation = Organisation.objects.get(pk=pk)
        except:
            log(
                u"No business unit with id {pk}, internal ID {identifier}",
                dict(pk=pk, identifier=identifier),
            )
            continue
        internal_org, created = InternalOrganisationID.objects.get_or_create(
            recording_org=cordaid,
            referenced_org=organisation,
            identifier= identifier
        )
        if cat_name:
            new_cat, created = Category.objects.get_or_create(name=cat_name)
            if created:
                log(u"Created cat: {id}, {cat_name}",dict(id=new_cat.id, cat_name=cat_name))
                new_cat.focus_area.add(FocusArea.objects.get(name=fa_name))
            else:
                log(u"Found existing cat: {id}, {cat_name}", dict(id=new_cat.id, cat_name=cat_name))
            business_units.setdefault(identifier, {'category': None, 'benchmarknames': []})['category'] = new_cat

    cordaid.iati_org_id = CORDAID_IATI_ID
    cordaid.save()
    try:
        dgis = Organisation.objects.get(pk=DGIS_ORG_ID)
        dgis.iati_org_id = DGIS_IATI_ID
        dgis.save()
    except:
        log(u"Can't find DGIS using ID {dgis_id}", dict(dgis_id=DGIS_ORG_ID),)
    return business_units


def create_cats_and_benches(business_units):
    outsys("\nRunning {}() ".format(who_am_i()))
    for internal_id, data in business_units.items():
        for name in data['benchmarknames']:
            outsys('.')
            new_bench, created = Benchmarkname.objects.get_or_create(name=name)
            if created:
                log(u"Created bench: {id}, {name}", dict(id=new_bench.id, name=name))
            else:
                log(u"Found existing bench: {id}, {name}", dict(id=new_bench.id, name=name))
            data['category'].benchmarknames.add(new_bench)


def import_cordaid_benchmarks(csv_file):
    outsys("\nRunning {}() ".format(who_am_i()))
    # the columns to use in the CSV
    COL_BENCHMARKNAME, COL_BUSINESS_UNID_ID = 1, 2
    with open(csv_file, 'r') as f:
        outsys('.')
        indicators_reader = csv.reader(f, delimiter=',', quotechar='"')
        business_units = {}
        for line in indicators_reader:
            business_units.setdefault(
                line[COL_BUSINESS_UNID_ID], dict(benchmarknames=[]))['benchmarknames'].append(line[COL_BENCHMARKNAME]
            )
        return business_units


def find_benchmarknames_and_BUs():
    business_units = {}
    with open(CORDAID_IATI_ACTIVITIES_XML, 'r') as f:
        root = etree.fromstring(f.read())
        AKVO_NS = '{{{akvo_ns}}}'.format(akvo_ns=root.nsmap['akvo'])
        activities = root.findall('iati-activity')
        for activity in activities:
            business_unit = activity.get(AKVO_NS + 'business-unit-id')
            if business_unit:
                for result in activity.findall('result'):
                    for title in result.findall('indicator/title'):
                        business_units.setdefault(
                            business_unit, dict(benchmarknames=[])
                        )['benchmarknames'].append(title.text)
        import pdb
        pdb.set_trace()
        for business_unit in business_units.keys():
            business_units[business_unit]['benchmarknames'] = list(set(business_units[business_unit]['benchmarknames']))
    return business_units


def get_organisation_type(new_organisation_type):
    types = dict(zip([type for type, name in IATI_LIST_ORGANISATION_TYPE],
                     Organisation.NEW_TO_OLD_TYPES
    ))
    return types[new_organisation_type]

def normalize_url(url):
    if url is None:
        return ""
    url = url.strip().lower()
    if url and not url.startswith("http"):
        if url.startswith("www"):
            url = u"http://%s" % url
        else:
            url = u""
    return url

def import_orgs(xml_file):
    outsys("\nRunning {}() ".format(who_am_i()))

    def text_from_xpath(tree, xpath):
        """ utility to get the text of an element using xpath, stripped
            returns '' if the xpath returns 0 or more than one element
        """
        element = tree.xpath(xpath)
        if len(element) != 1:
            return ''
        return element[0].text.strip() if element[0].text else ""

    def create_new_organisation(org_etree, internal_id):
        try:
            name = text_from_xpath(org_etree, 'name')
            new_organisation_type = int(text_from_xpath(org_etree, 'iati_organisation_type'))
            referenced_org = Organisation.objects.create(
                name = name[:25],
                long_name = name,
                description = text_from_xpath(org_etree, 'description') or u"N/A",
                url = normalize_url(text_from_xpath(org_etree, 'url')),
                new_organisation_type = new_organisation_type,
                organisation_type = Organisation.org_type_from_iati_type(new_organisation_type)
            )
            log(
                u"Created new organisation: {label}, Akvo ID: {pk}",
                dict(
                    log_type=LOG_ORGANISATIONS,
                    internal_id=internal_id,
                    label=referenced_org.name,
                    pk=referenced_org.pk,
                    event=ACTION_CREATE_ORG
                )
            )
            return referenced_org
        except Exception, e:
            log(
                u"Error trying to create organisation with Cordaid ID {internal_id} ",
                dict(
                    log_type=LOG_ORGANISATIONS,
                    internal_id=internal_id,
                    event=ERROR_EXCEPTION,
                    extra=e.message
                )
            )

    def set_location_for_org(org_etree, internal_id, org):
        if not org.primary_location:
            iso_code = text_from_xpath(org_etree, 'location/object/iso_code').lower()
            if not iso_code == "ww!":
                country = custom_get_or_create_country(iso_code)
                location = OrganisationLocation.objects.create(
                    country = country,
                    location_target = org
                )
                org.locations.add(location)
                org.primary_location = location
                org.save()
                log(
                    u"  Added location to org {pk}",
                    dict(
                        log_type = LOG_ORGANISATIONS,
                        internal_id = internal_id,
                        pk = org.pk,
                        label = org.name,
                        event = ACTION_LOCATION_SET,
                    )
                )
            else:
                log(
                    u"Couldn't create location for org {pk}, no proper country code",
                    dict(
                        log_type = LOG_ORGANISATIONS,
                        internal_id = internal_id,
                        pk = org.pk,
                        label = org.name,
                        event = ERROR_COUNTRY_CODE,
                    )
                )
        else:
            log(
                u"  Org {pk} already has a location.",
                dict(
                    log_type = LOG_ORGANISATIONS,
                    internal_id = internal_id,
                    pk = org.pk,
                    label = org.name,
                    event = ACTION_LOCATION_FOUND,
                )
            )

    def organisation_logo(org_etree, internal_id, org):
        logo_file = glob.glob(
            os.path.join(
                CORDAID_LOGOS_DIR,
                u"{logo_id}.*".format(logo_id=text_from_xpath(org_etree, 'logo_id'))
            )
        )
        if len(logo_file) == 1:
            logo_filename = basename(logo_file[0])
            _, extension = splitext(logo_filename)
            if extension.lower() in (".png", ".jpg", ".jpeg", ".gif"):
                filename = model_and_instance_based_filename(
                    "Organisation",
                    org.pk,
                    "logo",
                    logo_filename
                )
                with open(os.path.join(CORDAID_LOGOS_DIR, logo_filename), "rb") as f:
                    logo_data = f.read()
                    logo_tmp = NamedTemporaryFile(delete=True)
                    logo_tmp.write(logo_data)
                    logo_tmp.flush()
                    org.logo.save(
                        filename, File(logo_tmp), save=True
                    )
                    log(
                        u"  Added logo {extra} to org {pk}, ",
                        dict(
                            log_type = LOG_ORGANISATIONS,
                            internal_id = internal_id,
                            pk = org.pk,
                            event = ACTION_SET_IMAGE,
                            extra =  filename,
                        )
                    )


    with open(xml_file, "rb") as f:
        root = etree.fromstring(f.read())
        cordaid = Organisation.objects.get(id=CORDAID_ORG_ID)
        for org_etree in root:
            outsys('.')
            internal_id = text_from_xpath(org_etree, 'org_id')
            try:
                internal_org_id = InternalOrganisationID.objects.get(
                    recording_org=cordaid,
                    identifier=internal_id
                )
                log(
                    u"Found existing org {label} (Akvo PK {pk}) with Cordaid internal ID '{internal_id}'",
                    dict(
                        log_type = LOG_ORGANISATIONS,
                        label = internal_org_id.referenced_org.name,
                        pk = internal_org_id.referenced_org.pk,
                        internal_id = internal_id,
                        event = ACTION_FOUND
                    )
                )
                set_location_for_org(org_etree, internal_id, internal_org_id.referenced_org)
            except InternalOrganisationID.MultipleObjectsReturned:
                log(
                    u"Error from lookup of internal ID {internal_id}. Multiple objects found.",
                    dict(
                        log_type = LOG_ORGANISATIONS,
                        internal_id = internal_id,
                        event = ERROR_MULTIPLE_OBJECTS
                    ),
                )
                continue
            except InternalOrganisationID.DoesNotExist:
                referenced_org = create_new_organisation(org_etree, internal_id)
                if referenced_org:
                    set_location_for_org(org_etree, internal_id, referenced_org)
                    internal_org_id = InternalOrganisationID.objects.create(
                        recording_org = cordaid,
                        referenced_org = referenced_org,
                        identifier = internal_id
                    )
                else:
                    continue
            organisation_logo(org_etree, internal_id, internal_org_id.referenced_org)
    outsys('\n')

if __name__ == '__main__':
    #business_units = import_cordaid_benchmarks(CORDAID_INDICATORS_CSV)
    business_units = find_benchmarknames_and_BUs()
    business_units = create_cordaid_business_units(business_units)
    create_cats_and_benches(business_units)
    import_orgs(CORDAID_ORGANISATIONS_XML)
    log_file = init_log(CORDAID_ORG_CSV_FILE)
    names = (u'internal_id', u'pk', u'label', u'event', u'extra')
    print_log(log_file, names, True)
