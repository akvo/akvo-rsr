# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

""" Manage JVAP (Joint Valetta Action Plan) sector codes in EUTF projects

Usage:

    python manage.py eutf_jvap_codes username [options]

    Options:
        -d, --data: name of the EUTF Excel sheet used as data source. Default: "jvap.xlsx"
        -h, --host: RSR host where the data is uploaded. Default: "rsr.test.akvo.org"
"""

import datetime
import sys

import requests
import os

from collections import namedtuple
from getpass import getpass
from tablib import Databook, Dataset

from django.core.management.base import BaseCommand
from optparse import make_option

from akvo.rsr.management.utils import rotate_spinner

DATA_SOURCE = 'jvap.xlsx'
API_VERSION = 'v1'
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VOCABULARY = 99
COL_DESCRIPTION = 2
COL_CODE = 1
COL_SUBTITLE = 0
COL_PRIORITIES = 6
SECTOR_PERCENT = 100
SHEET_DATA = 0
SHEET_LOOKUPS = 1

Sector = namedtuple('Sector', ['project', 'sector_code', 'percentage'])


class RequestsWrapper(object):
    """Wrapper class for requests."""

    def __init__(self, url_template, url_args=None, method='get', headers=None, data=None):

        self.url = url_template.format(**url_args)
        self.method = method
        self.headers = headers
        self.data = data
        self.error = None

        self.kwargs = {}
        if self.headers:
            self.kwargs.update(headers=self.headers)
        if self.data:
            self.kwargs.update(data=self.data)

    def dispatch(self):

        try:
            response = getattr(requests, self.method)(self.url, **self.kwargs)
        except Exception, e:
            raise Exception("Error in request. Error msg:\n {message}".format(message=e.message))
        if not response.ok:
            text = "\nResponse text: {}".format(response.text) if response.text else ""
            error_msg = "Non-OK response. Status: {}\nMethod: {}\nURL:{}{}".format(
                response.status_code,
                self.method,
                self.url,
                text
            )
            raise Exception(error_msg)
        return response


class Command(BaseCommand):
    """
    Management script that syncs sector codes for EUTF projects, based on an EuTF excel data book used
    as a data source. The excel data book contains two tabs, the first one, "HOAW" holds the actual
    data, the second, "JVAP Actions-PAs" is used to translate between the Valetta priorities and the
    codes EUTF use for them.

    For each row in the HOAW tab we extract the columns "Contract reference number" and
    "Priorities".
    The Contract reference number maps to the Project.subtitle field in RSR and is used to find the
    project ID.
    The Priorities holds one of more JVAP strings, separated by newlines. For each of these, the tab
    "JVAP Actions-PAs" is used to find the mapping between the JVAP string and the code used for it
    in RSR.
    Armed with the project ID and a set of code mappings, the script finds the project, deletes all
    Sector objects that have a code that is in the "priority_area description in AKVO" columns of
    the "JVAP Actions-PAs" tab.
    When the managed sectors have been deleted, new sectors are created using the list of JVAP
    strings in the Priorities column for the project, mapping each string to the relevant code.

    The excel sheet should be placed in the data folder of the RSR repo. If it's not named "jvap.xlsx"
    the name must be specified in the command using the `--data` option.

    The script should be run as a superuser or an EUTF admin.
    """

    args = ''
    help = 'Script for uploading JVAP codes to the EUTF hierarchy'

    option_list = BaseCommand.option_list + (
        make_option('--host',
                    action='store', dest='host',
                    default='rsr.test.akvo.org',
                    help='Host to send data to, defaults to rsr.test.akvo.org'),

        make_option('-d', '--data',
                    action='store', dest='data_source',
                    default=DATA_SOURCE,
                    help='File name of JVAP CSV data, defaults to {}'.format(DATA_SOURCE)),
    )

    def post_api_key(self):
        password = getpass()
        request = RequestsWrapper(
            "{origin}/auth/token/?format=json",
            dict(origin=self.origin),
            method='post',
            data=dict(username=self.username, password=password),
        )
        response = request.dispatch()
        return response.json()['api_key']

    def delete_sector(self, project_id, sector_id):
        delete = RequestsWrapper(
            "{origin}/rest/{api_version}/sector/{sector_id}/?format=json",
            dict(origin=self.origin, api_version=API_VERSION, sector_id=sector_id),
            method='delete',
            headers=self.headers
        )
        try:
            delete.dispatch()
            self.logger.append([project_id, sector_id, 'delete', None, None])
        except Exception, e:
            self.logger.append([project_id, sector_id, 'error:delete', None, e.message])

    def post_sector(self, project_id, sector):
        data = dict(
            project=sector.project,
            sector_code=sector.sector_code,
            percentage=sector.percentage,
            vocabulary=VOCABULARY
        )
        request = RequestsWrapper(
            "{origin}/rest/{api_version}/sector/?format=json",
            dict(origin=self.origin, api_version=API_VERSION),
            method='post',
            headers=self.headers,
            data=data
        )
        try:
            response = request.dispatch()
            self.logger.append(
                [project_id, response.json()['id'], 'create', sector.sector_code, None]
            )
        except Exception, e:
            self.logger.append(
                [project_id, None, 'error: create sector', sector.sector_code, e.message]
            )

    def get_project_id(self, subtitle):
        request = RequestsWrapper(
            "{origin}/rest/{api_version}/project/?format=json&subtitle={subtitle}",
            dict(origin=self.origin, api_version=API_VERSION, subtitle=subtitle),
            method='get',
        )
        try:
            response = request.dispatch()
            results = response.json()['results']
            if len(results) == 1:
                return results[0]['id']
            else:
                self.logger.append([subtitle, None, 'error:get project', None,
                                    "{} matches to {}".format(len(results), subtitle)])
        except Exception, e:
            self.logger.append([subtitle, None, 'error:get project', None, e.message])

    def get_sectors(self, project_id):
        request = RequestsWrapper(
            "{origin}/rest/{api_version}/sector/?format=json&project={project_id}",
            dict(origin=self.origin, api_version=API_VERSION, project_id=project_id),
            method='get',
        )
        try:
            response = request.dispatch()
            return response.json()['results']
        except Exception, e:
            self.logger.append([project_id, None, 'error:get sectors', None, e.message])
            return []

    def create_lookups(self, raw_lookups):
        lookups = {}
        for row in raw_lookups[2:]:
            if row[COL_DESCRIPTION] and row[COL_CODE]:
                description = row[COL_DESCRIPTION].strip()
                code = row[COL_CODE].strip()
                # Some descriptions don't have a code specced by EUTF yet. Those we ignore
                if code:
                    lookups[description] = code
        self.lookups = lookups

    def create_cleaned_data(self, raw_data):
        cleaned_data = Dataset()
        for row in raw_data[3:]:
            priorities = [code.strip() for code in row[COL_PRIORITIES].split('\n')]
            cleaned_data.append((row[COL_SUBTITLE], priorities))
        self.cleaned_data = cleaned_data

    def conditional_sector_delete(self, project_id, sector):
        if sector['sector_code'] in self.lookups.values():
            self.delete_sector(project_id, sector['id'])

    def create_sector(self, project_id, priority):
        sector_code = self.lookups.get(priority, None)
        if sector_code is not None:
            sector = Sector(project_id, sector_code, SECTOR_PERCENT)
            self.post_sector(project_id, sector)

    def handle(self, *args, **options):
        if len(args) != 1:
            print(__doc__)
            sys.exit(1)

        self.username = args[0]

        # Shenanigans to allow access when running on local docker
        host = options['host']
        if host == 'localhost':
            port = 8000
            scheme = 'http'
        else:
            port = 443
            scheme = 'https'
        self.origin = "{scheme}://{host}:{port}".format(scheme=scheme, host=host, port=port)

        self.headers = dict(encoding='utf-8', authorization='Token {}'.format(self.post_api_key()))

        self.logger = Dataset()
        self.logger.headers = [
            'Project ID/subtitle',
            'Sector ID',
            'Action',
            'Data',
            'Error'
        ]

        book = Databook()
        data_source = options['data_source']
        with open(os.path.join(BASE_DIR, '../../../data', data_source), 'rb') as f:
            book.load('xlsx', f.read(), headers=False)

        # The lookups translate the Priorities text in the data source to the sector code to enter
        # in RSR
        raw_lookups = book.sheets()[SHEET_LOOKUPS]
        self.create_lookups(raw_lookups)
        # The source data, the important columns are Contract reference number and Priorities
        raw_data = book.sheets()[SHEET_DATA]
        self.create_cleaned_data(raw_data)

        for row in self.cleaned_data:
            rotate_spinner()

            subtitle = row[0]
            priorities = row[1]
            project_id = self.get_project_id(subtitle)

            if project_id:
                sectors = self.get_sectors(project_id)
                # Delete all sectors that we manage, i.e. they are present in lookups
                for sector in sectors:
                    self.conditional_sector_delete(project_id, sector)
                # For each sector in cleaned, create a new sector
                for priority in priorities:
                    self.create_sector(project_id, priority)

        print self.logger.export('tsv')
        log_book = Databook()
        log_book.add_sheet(self.logger)
        log_file_name = 'EUTF-JVAP-upload-log-{when:%Y-%m-%d %H.%M}.xls'.format(
            when=datetime.datetime.now()
        )
        with open(os.path.join(BASE_DIR, '../../../data', log_file_name), 'wb') as f:
            f.write(log_book.xls)
