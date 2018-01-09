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
import re
import requests
import sys
import tempfile

from xml.etree import ElementTree

# Modify this list to add new versions
VERSIONS = {
    "1.01": "http://codelists102.archive.iatistandard.org/data/",
    "1.02": "http://codelists102.archive.iatistandard.org/data/",
    "1.03": "http://codelists103.archive.iatistandard.org/data/",
    "1.04": "http://iatistandard.org/104/codelists/downloads/clv2/",
    "1.05": "http://iatistandard.org/105/codelists/downloads/clv2/",
    "2.01": "http://iatistandard.org/201/codelists/downloads/clv2/",
    "2.02": "http://iatistandard.org/202/codelists/downloads/clv2/",
}


translated_codelists = {
    # 'AidType': [u"name"], # Very long descriptions!
    # 'ActivityScope': [u"name", u"description"],
    'ActivityStatus': [u"name", u"description"],
    # 'BudgetIdentifier': [u"name"],
    # 'BudgetIdentifierVocabulary': [u"name", u"description"],
    # 'BudgetStatus': [u"name", u"description"],
    # 'BudgetType': [u"name", u"description"],
    # one very long name, probably a data bug 'CollaborationType': [u"name", u"description"],
    # 'ConditionType': [u"name", u"description"],
    'ContactType': [u"name", u"description"],
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
    'IndicatorMeasure': [u"name", u"description"],
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
    'RelatedActivityType': [u"name", u"description"],
    'ResultType': [u"name", u"description"],
    # 'Sector': [u"name"], # very long descriptions
    # 'SectorCategory': [u"name"], # very long descriptions
    'SectorVocabulary': [u"name", u"description"],
    # 'TiedStatus': [u"name", u"description"],
    # 'TransactionType': [u"name", u"description"],
}

DOC_TEMPLATE = u"""# -*- coding: utf-8 -*-

from django.utils.translation import ugettext_lazy as _

{codelists}
"""

CODELIST_TEMPLATE = u"""
# From {url}
{name} = (
    {field_names}
{rows}
)"""

UNICODE_BIT = u'u"{}"'
I18N_BIT = u'_(u"{}")'


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
        for field in item.getchildren():
            # an attrib here indicates an alternative language, which we skip for now
            if not field.attrib:
                #  we need to "collect" fields since not all items have all fields
                fields = fields.union({field.tag})
                text = field.text.replace('\n', u'').replace('\r', u'') if field.text else u''
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
        print "ERROR: Could not retrieve codelists from {}".format(codelists_url)

    return codelist_url_template, codelists


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

        print "Gathering data for {}...".format(name)
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
            row['name'] = re.sub('\(.*\)', '', row['name']).strip()

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
        url = codelist['url']
        name = pythonify_codelist_name(codelist['name'])
        field_names = u"({}),".format(
            u", ".join([UNICODE_BIT.format(field) for field in codelist['fields']]))

        rows = []
        for row in codelist['rows']:
            fields = []
            for field in codelist['fields']:
                text = row.get(field, u'')
                # don't tag empty strings for translation
                if field in translated_codelists.get(codelist['name'], []) and text:
                    template = I18N_BIT
                else:
                    template = UNICODE_BIT
                fields.append(template.format(row.get(field, u'').replace('"', '\\"')))
            rows.append(u"    ({}),".format(u", ".join(fields)))

        rows = u"\n".join(rows)

        output = CODELIST_TEMPLATE.format(
            url=url,
            name=name,
            field_names=field_names,
            rows=rows
        )
        codelists.append(output)
    return codelists


def get_translation_pairs(version, lang):
    codelist_url_template, _ = get_codelists(version, VERSIONS[version])
    translations = []
    for name, fields in sorted(translated_codelists.items()):
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
    print 'Getting translations for {}'.format(lang)
    translations = get_translation_pairs(version, lang=lang)
    with open(tempfile.mktemp('.csv'), 'w')  as f:
        for translation_pair in translations:
            f.write( u'"{}","{}"\n'.format(*translation_pair).encode('utf8'))
    print 'Translations csv written to {}'.format(f.name)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument("-v", "--version", help="version, e.g. '1.01' (required)", required=True)
    parser.add_argument("-t", "--translate", help="translation language code e.g. 'fr'")
    args = parser.parse_args()

    # Version has to be one of the allowed versions
    if args.version not in VERSIONS.keys():
        print "Error; Version should be one of the following:"
        for version in VERSIONS.keys():
            print "- %s" % version
        sys.exit(0)

    if args.translate:
        get_translation_csv(args.version, args.translate)
        sys.exit(9)

    data_dict = generate_codelists_data(args.version)
    identifiers = [pythonify_codelist_name(data['name']) for data in data_dict]

    strings = data_to_strings(data_dict)

    codelists = u'\n'.join(strings).encode('utf-8')

    with open("../store/codelists_v%s.py" % args.version.replace(".", ""), "w") as iati_file:
        iati_file.write(u'# -*- coding: utf-8 -*-\n\n')
        iati_file.write(u'from django.utils.translation import ugettext_lazy as _\n\n')
        iati_file.writelines(u'codelist_list = [\n    "{}"\n]\n'.format(u'",\n    "'.join(identifiers)))
        iati_file.write(codelists)
        iati_file.write('\n')
