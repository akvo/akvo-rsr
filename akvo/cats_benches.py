# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import csv

from django.core.management import setup_environ
import settings

setup_environ(settings)

from akvo.rsr.models import Category, Benchmarkname, FocusArea, Organisation, InternalOrganisationID


def create_cordaid_business_units(business_units):
    CORDAID_ID = 273
    CORDAID_IATI_ID = 'NL-KVK-41160054'
    DGIS_ID = 464
    DGIS_IATI_ID = 'NL-1'

    business_units_info = [
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
    cordaid = Organisation.objects.get(pk=CORDAID_ID)
    for data in business_units_info:
        pk, identifier, cat_name, fa_name = data['pk'], data['internal_id'], data['cat_name'], data['fa']
        try:
            organisation = Organisation.objects.get(pk=pk)
        except:
            print "No business unit with id {pk}, internal ID {identifier}".format(
                pk=pk, identifier=identifier,
            )
            continue
        internal_org, created = InternalOrganisationID.objects.get_or_create(
            recording_org=cordaid,
            referenced_org=organisation,
            identifier= identifier
        )
        new_cat, created = Category.objects.get_or_create(name=cat_name)
        if created:
            print "Created cat: {cat_name}".format(cat_name=cat_name)
            new_cat.focus_area.add(FocusArea.objects.get(name=fa_name))
        else:
            print "Found existing cat: {cat_name}".format(cat_name=cat_name)
        business_units.setdefault(identifier, {'category': None, 'benchmarknames': []})['category'] = new_cat

    cordaid.iati_org_id = CORDAID_IATI_ID
    cordaid.save()
    try:
        dgis = Organisation.objects.get(pk=DGIS_ID)
        dgis.iati_org_id = DGIS_IATI_ID
        dgis.save()
    except:
        print "Can't find DGIS using ID {dgis_id}".format(dgis_id=DGIS_ID)
    return business_units


def create_cats_and_benches(business_units):
    for internal_id, data in business_units.items():
        for name in data['benchmarknames']:
            new_bench, created = Benchmarkname.objects.get_or_create(name=name)
            if created:
                print "Created bench: {name}".format(name=name)
            else:
                print "Found existing bench: {name}".format(name=name)
            data['category'].benchmarknames.add(new_bench)


def import_cordaid_benchmarks(csv_file):
    # the columns to use in the CSV
    import pdb
    pdb.set_trace()
    COL_BENCHMARKNAME, COL_BUSINESS_UNID_ID = 1, 2
    with open(csv_file, 'r') as f:
        indicators_reader = csv.reader(f, delimiter=',', quotechar='"')
        business_units = {}
        for line in indicators_reader:
            business_units.setdefault(
                line[COL_BUSINESS_UNID_ID], dict(benchmarknames=[]))['benchmarknames'].append(line[COL_BENCHMARKNAME]
            )
        return business_units


CORDAID_CSV = '/Users/gabriel/git/akvo-rsr/akvo/api/xml/cordaid/20130711_indicators.csv'


if __name__ == '__main__':
    business_units = import_cordaid_benchmarks(CORDAID_CSV)
    business_units = create_cordaid_business_units(business_units)
    create_cats_and_benches(business_units)



