#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Generate a python file, iati_code_lists.py, that contains a python representation of selected IATI code lists
See http://iatistandard.org/codelists/ and http://iatistandard.org/codelists/code-list-api/
"""

import requests
import csv
import re

# Modify this list to add new IATI code lists
iati_lists = ("OrganisationType", )

iati_list_api_url = "http://datadev.aidinfolabs.org/data/codelist/%s.csv"
identifier_prefix = "IATI_LIST_"

def pythonify_code_list_name(code_list_name):
    "Turn OrganisationType into ORGANISATION_TYPE"
    bits = re.findall('[A-Z][^A-Z]*', code_list_name)
    return '_'.join(bits).upper()

def stringify(bits):
    "add unicode string 'markup' to strings"
    return [(lambda bit: bit if bit.isdigit() else "u'%s'" %  bit)(bit) for bit in bits ]

def code_list_to_tuples(raw_csv, iati_list):
    iati_reader = csv.reader(raw_csv.splitlines(), delimiter=',', quotechar='"')
    fields = ', '.join(iati_reader.next())
    identifier = pythonify_code_list_name(iati_list)
    tuples = '),\n    ('.join([', '.join(stringify(row)) for row in iati_reader])
    return '# Fields: %s\n\n%s%s = (\n    (%s)\n)' % (fields, identifier_prefix, identifier, tuples)

def generate_code_lists(iati_lists):
    python_code = []
    for iati_list in iati_lists:
        result = requests.get(iati_list_api_url % iati_list,)
        if result.status_code == 200 and len(result.text) > 0:
            python_code.append('# From %s' % iati_list_api_url % iati_list)
            python_code.append('\n')
            python_code.append(code_list_to_tuples(result.text, iati_list))
            python_code.append('\n\n')
            print "Generate python for %s" % iati_list
        else:
            print "ERROR: Could not generate python for %s" % iati_list
    print
    return python_code


if __name__ == '__main__':
    source = generate_code_lists(iati_lists)
    with open("iati_code_lists.py", "w") as iati_file:
        iati_file.write('# -*- coding: utf-8 -*-\n\n')
        iati_file.write(''.join(source))