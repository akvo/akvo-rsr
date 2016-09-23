# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from __future__ import print_function

import json
from os.path import abspath, dirname, exists, join
import unittest

from django.conf import settings
from django.test import TestCase, Client
from django.core import management
import xmltodict

from akvo.rsr.models import Organisation


TEST = 0
COLLECT = 1
HERE = dirname(abspath(__file__))
EXPECTED_RESPONSES_FILE = join(HERE, 'expected_responses.json')
MODE = TEST if exists(EXPECTED_RESPONSES_FILE) else COLLECT
CLIENT = Client(HTTP_HOST=settings.RSR_DOMAIN)


def collect_responses():
    """ Collect responses for all the interesting urls."""

    load_fixture_data()
    output = {}

    for url in MigrationGetTestCase.GET_URLS:
        if 'xml' in url:
            from IPython.core.debugger import Tracer; Tracer()()

        response = CLIENT.get(url)
        output[url] = response.content

    with open(EXPECTED_RESPONSES_FILE, 'w') as f:
        json.dump(output, f, indent=2)


def load_fixture_data():
    """Load up fixture data."""

    management.call_command(
        'loaddata', 'test_data.json', verbosity=3, interactive=False
    )

    # FIXME: Ideally, the dump data should already have this.
    Organisation.objects.update(can_create_projects=True)


def parse_response(url, response):
    if 'format=xml' in url:
        # XXX: converting ordered dict to dict for pretty diffs
        parsed = json.loads(json.dumps(xmltodict.parse(response)))

    else:
        parsed = json.loads(response)

    return _drop_unimportant_keys(parsed)


def _drop_unimportant_keys(d):
    """Recursively drop unimportant keys from given dict or list."""

    unimportant_keys = ['last_modified_at']

    if isinstance(d, dict):
        for key in unimportant_keys:
            if key in d:
                d.pop(key)

        for value in d.values():
            if isinstance(d, dict) or isinstance(d, list):
                _drop_unimportant_keys(value)

    elif isinstance(d, list):
        for element in d:
            _drop_unimportant_keys(element)

    return d


class MigrationGetTestCase(TestCase):
    """Tests the GET endpoints."""

    GET_URLS = [
        '/rest/v1/project/?format=json',
        '/rest/v1/project_update/?format=xml&project=3&last_modified_at__gt=2014-01-01'
    ]

    @classmethod
    def setUpClass(cls):
        """Load the fixture data and do any modifications required."""

        # Allow showing full diff
        cls.maxDiff = None
        # Allow showing standard assertion error msg along with ours
        cls.longMessage = True

        cls.c = CLIENT

        # Load some initial fixture data
        load_fixture_data()

        if MODE != TEST:
            collect_responses()
            raise unittest.SkipTest('Collecting expected responses')

        cls.errors = []

    def test_get(self):
        """Test if the get requests return the same data as expected."""

        self._load_expected()

        for url in self.GET_URLS:
            if url not in self._expected:
                print('Expected output not recorded for {}'.format(url))
                continue
            response = self.c.get(url)
            expected = parse_response(url, self._expected[url])
            actual = parse_response(url, response.content)
            try:
                self.assertEqual(expected, actual)

            except AssertionError as e:
                self.errors.append((url, expected, actual, e))

    @classmethod
    def tearDownClass(cls):
        for url, _, _, e in cls.errors:
            print(e)
            print('Response for {}'.format(url))
            print('=' * 40)

        print('Following end point responses changed:')
        for url, _, _, _ in cls.errors:
            print(url)

        raise AssertionError('Some tests failed')


    @classmethod
    def _load_expected(cls):
        with open(EXPECTED_RESPONSES_FILE) as f:
            cls._expected = json.load(f)
