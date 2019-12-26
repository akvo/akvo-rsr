# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import django
import csv
import os
import sys

from lxml import etree
from os.path import join, pardir

project_root = join(os.path.dirname(os.path.realpath(__file__)), *[pardir] * 3)
sys.path.append(project_root)

os.environ['DJANGO_SETTINGS_MODULE'] = 'akvo.settings'

from akvo.codelists.store.default_codelists import ORGANISATION_TYPE as IATI_LIST_ORGANISATION_TYPE
from akvo.rsr.models import (
    Category, Benchmarkname, FocusArea, Organisation, InternalOrganisationID
)
from akvo.utils import who_am_i
from akvo.scripts.cordaid import (
    CORDAID_ORG_ID, CORDAID_IATI_ID, DGIS_ORG_ID, DGIS_IATI_ID, print_log, log,
    CORDAID_ORG_CSV_FILE, init_log, outsys, CORDAID_IATI_ACTIVITIES_XML,
    ERROR_BUSINESS_UNIT_MISSING, ACTION_BENCH_FOUND, ACTION_BENCH_CREATE, ERROR_CATEGORY_MISSING,
)


def find_cordaid_business_units(business_units):
    outsys("\nRunning {}() ".format(who_am_i()))
    known_business_units = {
        "27239": dict(pk=CORDAID_ORG_ID),
        "K6020": dict(pk=959, cat_name="Children & Education", fa="Education"),
        "K6090": dict(pk=962, cat_name="Domestic", fa="Economic development"),
        "K6030": dict(pk=961, cat_name="Disaster Recovery", fa="Economic development"),
        "K6070": dict(pk=950, cat_name="Entrepreneurship", fa="Economic development"),
        "K6110": dict(pk=1099, cat_name="Food Security", fa="Healthcare"),
        "K6100": dict(pk=953, cat_name="Investments", fa="Economic development"),
        "K6010": dict(pk=949, cat_name="Healthcare", fa="Healthcare"),
        "K6060": dict(pk=1241, cat_name="Security & Justice", fa="Economic development"),
        "K6080": dict(pk=946, cat_name="Urban Matters", fa="Economic development"),
        "K6040": dict(pk=955, cat_name="Women's leadership", fa="Economic development"),
        "K6050": dict(pk=960, cat_name="Extractives", fa="Economic development"),
    }
    cordaid = Organisation.objects.get(pk=CORDAID_ORG_ID)

    for internal_id in list(business_units.keys()):
        cbu = known_business_units.get(internal_id, {'pk': -1})
        pk, cat_name, fa_name = cbu['pk'], cbu.get('cat_name'), cbu.get('fa'),
        try:
            organisation = Organisation.objects.get(pk=pk)
            outsys('.')
        except Exception:
            outsys('*')
            log(
                "No business unit with internal ID {internal_id}",
                dict(
                    internal_id=internal_id,
                    event=ERROR_BUSINESS_UNIT_MISSING
                )
            )
            continue
        internal_org, created = InternalOrganisationID.objects.get_or_create(
            recording_org=cordaid,
            referenced_org=organisation,
            identifier=internal_id
        )
        if cat_name:
            new_cat, created = Category.objects.get_or_create(name=cat_name)
            if created:
                log("Created cat: {id}, {cat_name}", dict(id=new_cat.id, cat_name=cat_name))
                new_cat.focus_area.add(FocusArea.objects.get(name=fa_name))
            else:
                log("Found existing cat: {id}, {cat_name}", dict(id=new_cat.id, cat_name=cat_name))
            business_units.setdefault(internal_id, {'category': None, 'benchmarknames': []})['category'] = new_cat

    cordaid.iati_org_id = CORDAID_IATI_ID
    cordaid.save()
    try:
        dgis = Organisation.objects.get(pk=DGIS_ORG_ID)
        dgis.iati_org_id = DGIS_IATI_ID
        dgis.save()
    except Exception:
        log("Can't find DGIS using ID {dgis_id}", dict(dgis_id=DGIS_ORG_ID),)
    return business_units


def create_cats_and_benches(business_units):
    outsys("\nRunning {}() ".format(who_am_i()))
    for internal_id, data in business_units.items():
        if data.get('category'):
            for name in data['benchmarknames']:
                outsys('.')
                new_bench, created = Benchmarkname.objects.get_or_create(name=name)
                if created:
                    log("Created bench: {pk}, {label}",
                        dict(
                            label=name,
                            pk=new_bench.id,
                            event=ACTION_BENCH_CREATE
                        )
                        )
                else:
                    log("Found existing bench: {pk}, {label}",
                        dict(
                            label=name,
                            pk=new_bench.id,
                            event=ACTION_BENCH_FOUND
                        )
                        )
                try:
                    data['category'].benchmarknames.add(new_bench)
                except Exception:
                    # we shouldn't end up here since we're testing for the existance of the category above
                    pass
        else:
            outsys('*')
            log(
                "No category set of business unit with internal ID {internal_id}",
                dict(
                    internal_id=internal_id,
                    event=ERROR_CATEGORY_MISSING
                )
            )


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
        for business_unit in business_units:
            business_units[business_unit]['benchmarknames'] = list(set(business_units[business_unit]['benchmarknames']))
    return business_units


def get_organisation_type(new_organisation_type):
    types = dict(zip([int(type) for type, name in IATI_LIST_ORGANISATION_TYPE[1:]],
                     Organisation.NEW_TO_OLD_TYPES
                     ))
    return types[new_organisation_type]


def normalize_url(url):
    if url is None:
        return ""
    url = url.strip().lower()
    if url and not url.startswith("http"):
        if url.startswith("www"):
            url = "http://%s" % url
        else:
            url = ""
    return url


if __name__ == '__main__':
    django.setup()
    # business_units = import_cordaid_benchmarks(CORDAID_INDICATORS_CSV)
    business_units = find_benchmarknames_and_BUs()
    business_units = find_cordaid_business_units(business_units)
    create_cats_and_benches(business_units)
    # import_orgs(CORDAID_ORGANISATIONS_XML)
    log_file = init_log(CORDAID_ORG_CSV_FILE)
    names = ('internal_id', 'pk', 'label', 'event', 'extra')
    print_log(log_file, names, True)
