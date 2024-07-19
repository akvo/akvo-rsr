#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Akvo RSR is covered by the GNU Affero General Public License. See more
# details in the license.txt file located at the root folder of the Akvo RSR
# module. For additional details on the GNU license please see
# <http://www.gnu.org/licenses/agpl.html>.

"""
Generate a python file, codelists_vXXX.py, in the codelists folder that contains a python representation of all
IATI codelists, based on the IATI version.
See http://iatistandard.org/codelists/ and http://iatistandard.org/codelists/code-list-api/
"""


import argparse
import json
from os.path import abspath, dirname, join
import re
import requests
import sys
import tempfile

from xml.etree import ElementTree

HERE = dirname(abspath(__file__))

# Modify this list to add new versions
VERSIONS = {
    "1.01": "http://codelists102.archive.iatistandard.org/data/",
    "1.02": "http://codelists102.archive.iatistandard.org/data/",
    "1.03": "http://codelists103.archive.iatistandard.org/data/",
    "1.04": "http://iatistandard.org/104/codelists/downloads/clv2/",
    "1.05": "http://iatistandard.org/105/codelists/downloads/clv2/",
    "2.01": "http://iatistandard.org/201/codelists/downloads/clv2/",
    "2.02": "http://iatistandard.org/202/codelists/downloads/clv2/",
    "2.03": "http://iatistandard.org/203/codelists/downloads/clv2/",
}

FIELDS_ORDER = ("category", "code", "name", "description", "url")

TRANSLATED_CODELISTS = {
    # 'AidType': [u"name"], # Very long descriptions!
    # 'ActivityScope': [u"name", u"description"],
    'ActivityStatus': ["name", "description"],
    # 'BudgetIdentifier': [u"name"],
    # 'BudgetIdentifierVocabulary': [u"name", u"description"],
    # 'BudgetStatus': [u"name", u"description"],
    # 'BudgetType': [u"name", u"description"],
    # one very long name, probably a data bug 'CollaborationType': [u"name", u"description"],
    # 'ConditionType': [u"name", u"description"],
    'ContactType': ["name", "description"],
    # 'CRSAddOtherFlags': [u"name", u"description"],
    # 'Currency': [u"name"],
    # 'Country': [u"name"],
    # 'DisbursementChannel': [u"name", u"description"],
    # 'FinanceType': [u"name"], # Very long descriptions!
    # 'DocumentCategory': [u"name", u"description"],
    # 'FlowType': [u"name", u"description"],
    # 'GeographicLocationClass': [u"name", u"description"],
    # 'GeographicLocationReach': [u"name", u"description"],
    # 'GeographicVocabulary': [u"name", u"description"],
    # 'HumanitarianScopeType': [u"name"],
    # 'HumanitarianScopeVocabulary': [u"name"],
    'IndicatorMeasure': ["name", "description"],
    # 'IndicatorVocabulary': [u"name"],
    # 'Language': [u"name"],
    # 'LoanRepaymentPeriod': [u"name", u"description"],
    # 'LoanRepaymentType': [u"name", u"description"],
    # 'LocationType': [u"name"],
    # 'OrganisationType': [u"name"],
    # 'PolicyMarker': [u"name", u"description"],
    # 'PolicySignificance': [u"name"],
    # 'Region': [u"name"],
    # 'RegionVocabulary': [u"name", u"description"],
    'RelatedActivityType': ["name", "description"],
    'ResultType': ["name", "description"],
    # 'Sector': [u"name"], # very long descriptions
    # 'SectorCategory': [u"name"], # very long descriptions
    'SectorVocabulary': ["name", "description"],
    # 'TiedStatus': [u"name", u"description"],
    # 'TransactionType': [u"name", u"description"],
}

JSON_CODELISTS = {
    # Section 1
    'AidType': {'path': 'section1/options/aid-types.json'},
    'AidTypeVocabulary': {'path': 'section1/options/aid-type-vocabulary.json'},
    'FinanceType': {'path': 'section1/options/finance-types.json'},
    'FlowType': {'path': 'section1/options/flow-types.json'},
    'TiedStatus': {'path': 'section1/options/tied-statuses.json', 'prefix-code': False},
    # Section 6
    'BudgetIdentifier': {'path': 'section6/country-budget-items/options.json'},
    'DisbursementChannel': {'path': 'section6/transactions/options/channels.json'},
    'TransactionType': {'path': 'section6/transactions/options/type-options.json', 'prefix-code': False},
    # Section 7
    'ActivityScope': {'path': 'section7/scope-options.json'},
    'GeographicVocabulary': {'path': 'section7/location-items/admin-vocab-options.json'},
    'LocationType': {'path': 'section7/location-items/feature-options.json'},
    'Region': {'path': 'section7/recipient-regions/regions.json'},
    # Section 8
    'Sector': {'path': 'section8/vocab-1-codes.json', 'indent': 2, 'separators': (',', ': '), 'prefix-code': False},
    'SectorCategory': {'path': 'section8/vocab-2-codes.json', 'prefix-code': False},
    'SectorVocabulary': {'path': 'section8/vocab.json'},
    'PolicySignificance': {'path': 'section8/policy-markers/significances.json'},
    'PolicyMarker': {'path': 'section8/policy-markers/markers.json', 'prefix-code': False},
    # Section 9
    'DocumentCategory': {'path': 'section9/docs/categories.json'},
    'FileFormat': {'path': 'section9/docs/formats.json'},
    'Language': {'path': 'section9/docs/languages.json', 'prefix-code': False},
    # Section 11
    'CRSChannelCode': {'path': 'section11/channel-codes.json'},
}

JSON_CODELISTS_PATH_PREFIX = 'akvo/rsr/spa/app/modules/editor/'

DOC_TEMPLATE = """# -*- coding: utf-8 -*-

from django.utils.translation import gettext_lazy as _

{codelists}
"""

CODELIST_TEMPLATE = """
# From {url}
{name} = (
    {field_names}
{rows}
)"""

STRING_BIT = '"{}"'
I18N_BIT = '_(u"{}")'


def pythonify_codelist_name(codelist_name):
    """Turn OrganisationType into ORGANISATION_TYPE"""
    bits = re.findall('[A-Z][^A-Z]*', codelist_name)
    return '_'.join(bits).upper().replace("-", "_")


def prettify_country_name(country):
    """ALL CAPS IS UGLY!"""
    country = country.lower()
    bits = []
    previous = ''
    for bit in country.split(' '):
        # don't capitalize small words unless they follow a comma
        if bit not in ['the', 'and', 'of', 'da'] or previous[-1] == ',':
            bit = bit.capitalize()
        # special case fo U.S.
        if bit == 'U.s.':
            bit = 'U.S.'
        # Capitalize inside parentheses
        if bit[0] == '(':
            bit = "({}".format(bit[1:].capitalize())
        # Fix hyphenated names
        if '-' in bit:
            bit = '-'.join([b.capitalize() for b in bit.split('-')])
        bits.append(bit)
        previous = bit
    return ' '.join(bits)


def codelist_data(result, version, transform=None):
    """ Create a data structure with the following format:
        {
            'fields: ['<field_name_1>', '<field_name_2>', ...,
            'rows: [
                {
                    '<field_name_1>': '<codelist_value_1>,
                    '<field_name_2>', '<codelist_value_2>,
                    ...
                },
                {
                    ...
                }
            ]
        }
    """
    tree = ElementTree.fromstring(result.text.encode('utf-8'))
    if version in ["1.01", "1.02", "1.03"]:
        items = tree
    else:
        items = tree.find('codelist-items').findall('codelist-item')

    rows = []
    for item in items:
        row = {}
        fields = set()
        for field in list(item):
            # an attrib here indicates an alternative language, which we skip for now
            if not field.attrib:
                #  we need to "collect" fields since not all items have all fields
                fields = fields.union({field.tag})
                text = field.text.replace('\n', '').replace('\r', '') if field.text else ''
                if transform and transform['field'] == field.tag:
                    text = transform['func'](text)
                row[field.tag] = text
        rows.append(row)
    return {'fields': fields, 'rows': rows}


def get_codelists(version, url):
    "Depending on the codelist version, retrieves the codelists"
    if version in ["1.01", "1.02", "1.03"]:
        codelists_url = url + "codelist.xml"
        codelist_url_template = url + "codelist/{}.xml"
    else:
        codelists_url = url + "codelists.xml"
        codelist_url_template = url + "xml/{}.xml"

    result = requests.get(codelists_url)
    codelists = []
    if result.status_code == 200 and len(result.text) > 0:
        tree = ElementTree.fromstring(result.text)
        if version in ["1.01", "1.02", "1.03"]:
            for codelist in tree.iter('name'):
                codelists.append(codelist.text)
        else:
            for codelist in tree.iter('codelist'):
                if not codelist.attrib['ref'] in codelists:
                    codelists.append(codelist.attrib['ref'])
    else:
        print("ERROR: Could not retrieve codelists from {}".format(codelists_url))

    return codelist_url_template, sorted(codelists)


def generate_codelists_data(version):
    """ For each codelist extend the data structure returned from codelist_data with a the fields
        'url' and 'name' and append to the list 'data' which is returned holding all data for all
        codelists
    """
    codelist_url_template, codelist_names = get_codelists(version, VERSIONS[version])

    data = []
    for name in codelist_names:
        if name in ["IATIOrganisationIdentifier", ]:
            # Ignore some names which are not codelists
            continue

        url = codelist_url_template.format(name)
        result = requests.get(url)
        if not result.status_code == 200 or not len(result.text) > 0:
            # Couldn't fetch the result from the IATI site
            continue

        print("Gathering data for {}...".format(name))
        if name == "Country":
            codelist_dict = codelist_data(
                result, version, {'field': 'name', 'func': prettify_country_name})
        else:
            codelist_dict = codelist_data(result, version)

        # HACK: Backward compatibility hacks for some apparent hand-made
        # changes to the codelist file.
        # FIXME: Remove these hacks when updating the IATI standard version
        if name == 'FinanceType':
            codelist_dict['fields'].remove('description')
            for row in codelist_dict['rows'][::]:
                row.pop('description', None)
                if len(row['category']) > 3:
                    codelist_dict['rows'].remove(row)
        elif name == 'CollaborationType':
            row = codelist_dict['rows'][-1]
            row['name'] = re.sub(r'\(.*\)', '', row['name']).strip()

        codelist_dict['url'] = url
        codelist_dict['name'] = name
        data.append(codelist_dict)

    return data


def data_to_strings(data):
    """ Use the data structure created in generate_codelists_data to assemble the string parts of
        the codelist document.
    """
    codelists = []
    for codelist in data:
        sorted_fields = sorted(codelist['fields'],
                        key=lambda x: FIELDS_ORDER.index(x) if x in FIELDS_ORDER else 100 + ord(x[0]))
        url = codelist['url']
        name = pythonify_codelist_name(codelist['name'])
        field_names = "({}),".format(
            ", ".join([STRING_BIT.format(field) for field in sorted_fields]))

        rows = []
        for row in codelist['rows']:
            fields = []
            for field in sorted_fields:
                text = row.get(field, '')
                # don't tag empty strings for translation
                if field in TRANSLATED_CODELISTS.get(codelist['name'], []) and text:
                    template = I18N_BIT
                else:
                    template = STRING_BIT
                fields.append(template.format(row.get(field, '').replace('"', '\\"')))
            rows.append("    ({}),".format(", ".join(fields)))

        rows = "\n".join(rows)

        output = CODELIST_TEMPLATE.format(
            url=url,
            name=name,
            field_names=field_names,
            rows=rows
        )
        codelists.append(output)

        if codelist['name'] in JSON_CODELISTS:
            write_codelist_json(codelist)

    return codelists


def get_translation_pairs(version, lang):
    codelist_url_template, _ = get_codelists(version, VERSIONS[version])
    translations = []
    for name, fields in sorted(TRANSLATED_CODELISTS.items()):
        url = codelist_url_template.format(name)
        result = requests.get(url)
        if not result.status_code == 200 or not len(result.text) > 0:
            # Couldn't fetch the result from the IATI site
            continue

        tree = ElementTree.fromstring(result.text.encode('utf-8'))
        items = (
            tree if version in ["1.01", "1.02", "1.03"] else
            tree.find('codelist-items').findall('codelist-item')
        )

        lang_attr = '{http://www.w3.org/XML/1998/namespace}lang'
        for item in items:
            for field in fields:
                values = item.findall(field)
                if len(values) <= 1:
                    continue
                values = {
                    value.get(lang_attr, 'en'): value.text for value in values
                }
                if lang in values:
                    translations.append((values['en'], values[lang]))

    return translations


def get_translation_csv(version, lang='fr'):
    print('Getting translations for {}'.format(lang))
    translations = get_translation_pairs(version, lang=lang)
    with open(tempfile.mktemp('.csv'), 'w') as f:
        for translation_pair in translations:
            f.write('"{}","{}"\n'.format(*translation_pair).encode('utf8'))
    print('Translations csv written to {}'.format(f.name))

def write_codelist_json(codelist, dry_run=False):
    name = codelist['name']
    config = JSON_CODELISTS[name]

    def get_row_label(row, config):
        code = row['code']
        name = row.get('name', code)
        prefix_code = config.get('prefix-code', True) and name != code
        label = f"{code} - {name}" if prefix_code else name
        return label

    data = [
        {'value': row['code'], 'label': get_row_label(row, config)}
        for row in codelist['rows']
    ]
    if config.get('add-empty', False):
        data.insert(0, {"value":"","label":"None"})

    if dry_run:
        return data

    path = join(JSON_CODELISTS_PATH_PREFIX, config['path'])
    with open(path, 'w') as f:
        # FIXME: Set indent=0 so that the files are easily diffable
        # Not setting it right now, to reduce the changes with existing files
        indent = config.get('indent')
        separators = config.get('separators', (',', ':'))
        json.dump(data, f, separators=separators, ensure_ascii=False, indent=indent)

    return data
 

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument("-v", "--version", help="version, e.g. '1.01' (required)", required=True)
    parser.add_argument("-t", "--translate", help="translation language code e.g. 'fr'")
    args = parser.parse_args()

    # Version has to be one of the allowed versions
    if args.version not in VERSIONS:
        print("Error; Version should be one of the following:")
        for version in VERSIONS:
            print("- %s" % version)
        sys.exit(0)

    if args.translate:
        get_translation_csv(args.version, args.translate)
        sys.exit(9)

    data_dict = generate_codelists_data(args.version)
    identifiers = [pythonify_codelist_name(data['name']) for data in data_dict]
    strings = data_to_strings(data_dict)
    codelists = '\n'.join(strings)
    codelist_path = join(HERE, '..', 'store', "codelists_v%s.py" % args.version.replace(".", ""))
    with open(codelist_path, "w") as iati_file:
        iati_file.write('# -*- coding: utf-8 -*-\n\n')
        iati_file.write('from django.utils.translation import gettext_lazy as _\n\n')
        iati_file.writelines('codelist_list = [\n    "{}"\n]\n'.format('",\n    "'.join(identifiers)))
        iati_file.write(codelists)
        iati_file.write('\n')
