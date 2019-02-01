# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from getpass import getpass

import requests
import os

from collections import namedtuple
from tablib import Dataset

from django.core.management.base import BaseCommand
from optparse import make_option


DATA_FILE = 'jvap.xlsx'
API_VERSION = 'v1'
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

Sector = namedtuple('Sector', ['project', 'sector_code', 'percentage'])


class RequestsWrapper:
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

    args = ''
    help = 'Script for uploading JVAP codes to the EUTF hierarchy'

    option_list = BaseCommand.option_list + (
        make_option('--host',
                    action='store', dest='host',
                    default='rsr.test.akvo.org',
                    help='Host to send data to, defaults to rsr.test.akvo.org'),

        make_option('-d', '--data',
                    action='store', dest='data_file',
                    default=DATA_FILE,
                    help='File name of JVAP CSV data'),

        make_option('-u', '--user',
                    action='store', dest='username',
                    default='',
                    help='Username of user accessing the API'),
    )

    def api_key(self):
        password = getpass()
        request = RequestsWrapper(
            "https://{host}/auth/token/?format=json",
            dict(host=self.host),
            method='post',
            data=dict(username=self.username, password=password),
        )
        response = request.dispatch()
        return response.json()['api_key']

    def delete_sectors(self, project_id):
        request = RequestsWrapper(
            "https://{host}/api/{api_version}/sector/?format=json&project={project_id}",
            dict(host=self.host, api_version=API_VERSION, project_id=project_id),
            method='get',
            headers=self.headers
        )
        response = request.dispatch()
        if len(response.json()['objects']) > 0:
            for sector in response.json()['objects']:
                delete = RequestsWrapper(
                    "https://{host}/api/{api_version}/sector/{sector_id}/?format=json",
                    dict(host=self.host, api_version=API_VERSION, sector_id=sector['id']),
                    method='delete',
                    headers=self.headers
                )
                try:
                    delete.dispatch()
                    self.logger.append([project_id, sector['id'], 'delete'])
                except Exception, e:
                    print e.message

    def create_sector(self, sector):
        data = dict(
            project=sector.project,
            sector_code=sector.sector_code,
            percentage=sector.percentage,
            vocabulary=99
        )
        request = RequestsWrapper(
            "https://{host}/api/{api_version}/sector/?format=json",
            dict(host=self.host, api_version=API_VERSION),
            method='post',
            headers=self.headers,
            data=data
        )
        try:
            response = request.dispatch()
            self.logger.append([sector.project, 'ID: {}'.format(response.json()['id']), 'create'])
        except Exception, e:
            self.logger.append([
                sector.project, 'Code: {}'.format(sector.sector_code), 'Error: {}'.format(e.message)
            ])
            print e.message

    def handle(self, *args, **options):
        self.host = options['host']
        self.username = options['username']
        self.headers=dict(encoding='utf-8', authorization='Token {}'.format(self.api_key()))

        self.logger = Dataset()
        self.logger.headers = [
            'Project ID',
            'Sector',
            'Status'
        ]

        dataset = Dataset()
        data_file = options['data_file']
        # ID column must be an integer
        dataset.add_formatter(0, int)
        with open(os.path.join(BASE_DIR, '../../../data', data_file), 'rb') as f:
            data = dataset.load(f.read())

        # sort on project ID so we can delete all sectors of a project when the ID changes
        data.sort(0)
        project_id = 0

        for row in data:
            sector = Sector(*row)
            if project_id != sector.project:
                project_id = sector.project
                self.delete_sectors(project_id)
            self.create_sector(sector)

        print self.logger.export('tsv')
