#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Generate a python file, codelists_vXXX.py, in the codelists folder that contains a python representation of all
IATI codelists, based on the IATI version.
See http://iatistandard.org/codelists/ and http://iatistandard.org/codelists/code-list-api/
"""

import requests
import re
import argparse
import sys
from xml.etree import ElementTree

# Modify this list to add new versions
VERSIONS = {"1.01": "http://codelists102.archive.iatistandard.org/data/",
            "1.02": "http://codelists102.archive.iatistandard.org/data/",
            "1.03": "http://codelists103.archive.iatistandard.org/data/",
            "1.04": "http://iatistandard.org/codelists/downloads/clv2/"}


def pythonify_codelist_name(codelist_name):
    "Turn OrganisationType into ORGANISATION_TYPE"
    bits = re.findall('[A-Z][^A-Z]*', codelist_name)
    return '_'.join(bits).upper().replace("-","_")


def stringify(bits):
    "Add unicode string 'markup' to strings"
    return [(lambda bit: "u'%s'" % bit.replace("'", ""))(bit) for bit in bits]
    # return [(lambda bit: bit if bit.isdigit() else "u'%s'" % bit.replace("'", ""))(bit) for bit in bits]


def codelist_to_tuples(xml_string, codelist, version):
    "Takes XML codelist string and converts it to tuples"
    tree = ElementTree.fromstring(xml_string)

    if not version == "1.04":
        codelist_lookup = '*'
        codelist_tree = tree
    else:
        codelist_lookup = 'codelist-items/codelist-item'
        codelist_tree = tree.find('codelist-items').findall('codelist-item')

    fields = []
    for field in list(tree.find(codelist_lookup)):
        if not field.tag in fields:
            fields.append(field.tag)
    fields = ', '.join(fields)

    codelist_content = []
    for codelist_field in list(codelist_tree):
        codelist_field_content = []
        codelist_tags = []
        for codelist_field_item in codelist_field.findall('*'):
            if not codelist_field_item.tag in codelist_tags:
                codelist_tags.append(codelist_field_item.tag)
                if codelist_field_item.text:
                    codelist_field_content.append(codelist_field_item.text.replace("\n", "").replace("\r", ""))
                else:
                    codelist_field_content.append("")
        codelist_content.append(codelist_field_content)
    tuples = '),\n    ('.join([', '.join(stringify(row)) for row in codelist_content])

    identifier = pythonify_codelist_name(codelist)

    return '# Fields: %s\n\n%s = (\n    (%s)\n)' % (fields, identifier, tuples)


def get_codelists(version, url):
    "Depending on the codelist version, retrieves the codelists"
    if not version == "1.04":
        codelists_url = url + "codelist.xml"
        codelist_url = url + "codelist/%s.xml"
    else:
        codelists_url = url + "codelists.xml"
        codelist_url = url + "xml/%s.xml"

    result = requests.get(codelists_url)
    codelists = []
    if result.status_code == 200 and len(result.text) > 0:
        tree = ElementTree.fromstring(result.text)
        if not version == "1.04":
            for codelist in tree.iter('name'):
                codelists.append(codelist.text)
        else:
            for codelist in tree.iter('codelist'):
                if not codelist.attrib['ref'] in codelists:
                    codelists.append(codelist.attrib['ref'])
    else:
        print "ERROR: Could not retrieve codelists from %s" % codelists_url

    return codelist_url, codelists


def generate_code_lists(version):
    "Main function for generating codelists based on the codelist version"
    codelists_url = VERSIONS[version]
    codelist_url, codelists = get_codelists(version, codelists_url)

    python_code = []
    for codelist in codelists:
        result = requests.get(codelist_url % codelist)
        if result.status_code == 200 and len(result.text) > 0:
            python_code.append('# From %s' % codelist_url % codelist)
            python_code.append('\n')
            python_code.append(codelist_to_tuples(result.text.encode('utf-8'), codelist, version))
            python_code.append('\n\n')
            print "Generate python for %s" % codelist
        else:
            print "ERROR: Could not generate python for %s" % codelist
    print
    return python_code


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument("-v", "--version", help="version, e.g. '1.01' (required)", required=True)
    args = parser.parse_args()

    # Version has to be one of the allowed versions
    if not args.version in VERSIONS.keys():
        print "Error; Version should be one of the following:"
        for version in VERSIONS.keys():
            print "- %s" % version
        sys.exit(0)

    source = generate_code_lists(args.version)
    with open("codelists/codelists_v%s.py" % args.version.replace(".", ""), "w") as iati_file:
        iati_file.write('# -*- coding: utf-8 -*-\n\n')
        iati_file.write(''.join(source).encode('utf-8'))