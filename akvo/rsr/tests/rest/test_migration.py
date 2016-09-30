# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


Usage:

    ./scripts/devhelpers/manage.sh test -v 3 akvo.rsr.tests.rest.test_migration.MigrationGetTestCase

The expected_responses.json has the outputs we obtained from an older version
of the API and this will test the current outputs against it.  You should get
an output with all the offending URLs.

To update the expected_responses.json file, you can just delete it and run the
same command as above.

"""

from __future__ import print_function


from contextlib import contextmanager
import json
from os.path import dirname, exists, join
import unittest

from django.conf import settings
from django.db import transaction
from django.test import TestCase, Client
from django.core import management
import xmltodict

from akvo.rsr.models import (
    Employment, Indicator, IndicatorPeriod, IndicatorPeriodData, Organisation, Project, Result
)
from .migration_data import (GET_URLS, HERE, POST_URLS)


TEST = 0
COLLECT = 1
EXPECTED_RESPONSES_FILE = join(HERE, 'expected_responses.json')
MODE = TEST if exists(EXPECTED_RESPONSES_FILE) else COLLECT
CLIENT = Client(HTTP_HOST=settings.RSR_DOMAIN)
FIXTURE = 'test_data.json'

def collect_responses():
    """ Collect responses for all the interesting urls."""

    output = {}

    get_responses = output.setdefault('GET', {})
    for url in GET_URLS:
        get_responses[url] = CLIENT.get(url).content
    print('Collected GET responses for {} urls'.format(len(get_responses)))

    post_responses = output.setdefault('POST', {})
    for url, data, queries in POST_URLS:
        post_responses[url] = MigrationGetTestCase.get_post_response_dict(url, data, queries)
    print('Collected POST responses for {} urls'.format(len(post_responses)))

    with open(EXPECTED_RESPONSES_FILE, 'w') as f:
        json.dump(output, f, indent=2)


@contextmanager
def do_in_transaction():
    """A context manager to do things inside a transaction, and then rollback."""

    class CancelTransactionError(Exception):
        """The exception we raise to cancel a transaction."""

    try:
        with transaction.atomic():
            yield
            raise CancelTransactionError('Cancel the transaction!')
    except CancelTransactionError:
        pass


def download_fixture_data():
    """Download fixture data, if required."""

    fixture_path = join(dirname(dirname(HERE)), 'fixtures', FIXTURE)
    if not exists(fixture_path):
        import subprocess
        subprocess.call(['/usr/bin/env', 'bash', join(dirname(fixture_path), 'download.sh')])


def load_fixture_data():
    """Load up fixture data."""

    download_fixture_data()

    management.call_command(
        'loaddata', FIXTURE, verbosity=3, interactive=False
    )

    # FIXME: Ideally, the dump data should already have this.
    ## Let organisations create projects
    Organisation.objects.update(can_create_projects=True)

    ## Publish a bunch of indicators and results
    project = Project.objects.get(id=4)
    for title in ('first', 'second', 'third'):
        r = Result(project=project, title=title)
        r.save()
        for title in ('1', '2', '3'):
            i = Indicator(result=r, title=title)
            i.save()
            ip = IndicatorPeriod(indicator=i, locked=False)
            ip.save()

            IndicatorPeriodData(period=ip, user_id=2).save()

    # Create an unapproved employment
    Employment(organisation_id=1, user_id=2).save()


def parse_response(url, response):
    # XXX: converting ordered dict to dict for pretty diffs
    return (
        json.loads(json.dumps(xmltodict.parse(response))) if 'format=xml' in url
        else json.loads(response)
    )


def _drop_unimportant_data(d):
    """Recursively drop unimportant data from given dict or list."""

    unimportant_keys = ['last_modified_at', 'created_at']

    ignored_string_prefixes = (
        '/media/cache/',
        '/media/db/',
        '/var/akvo/rsr/mediaroot',
    )


    if isinstance(d, dict):
        for key in unimportant_keys:
            if key in d:
                d.pop(key)

        for key, value in d.items():
            d[key] = _drop_unimportant_data(value)

    elif isinstance(d, list):
        for i, element in enumerate(d):
            d[i] = _drop_unimportant_data(element)

    elif isinstance(d, basestring) and d.startswith(ignored_string_prefixes):
        d = 'IGNORED_STRING'

    return d


class MigrationGetTestCase(TestCase):
    """Tests the GET endpoints."""

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

        # Make sure user is logged in, etc.
        cls.setup_user_context()

        if MODE != TEST:
            collect_responses()
            raise unittest.SkipTest('Collecting expected responses')

        cls.errors = []
        cls._load_expected()

    @classmethod
    def setup_user_context(cls):
        # Login as super admin
        cls.c.login(username='su@localdev.akvo.org', password='password')

    @classmethod
    def tearDownClass(cls):
        if not cls.errors:
            return

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

    @staticmethod
    def get_post_response_dict(url, data, queries):
        response_dict = {}

        with do_in_transaction():
            # POST
            r = (
                CLIENT.post(url, data, content_type='application/xml') if 'format=xml' in url else
                CLIENT.post(url, data)
            )
            assert int(r.status_code/100) == 2
            response_dict['post'] = r.content

            # GET
            response_dict['get'] = CLIENT.get(url).content

            # query assertions
            queries_dict = response_dict.setdefault('queries', {})
            EXEC_CODE = 'from akvo.rsr.models import *; output = {}'
            for query in queries:
                code = EXEC_CODE.format(query)
                ns = {}
                exec(code, ns)
                queries_dict[query] = ns['output']

        return response_dict

    def test_get(self):
        """Test if GET requests return expected data."""

        expected_responses = self._expected.get('GET', {})
        for url in GET_URLS:
            if url not in expected_responses:
                print('Expected output not recorded for {}'.format(url))
                continue
            response = self.c.get(url)
            try:
                expected = parse_response(url, expected_responses[url])
                actual = parse_response(url, response.content)
                self.assertEqual(expected, actual)

            except (ValueError, AssertionError) as e:
                self.errors.append((url, expected, actual, e))

            except Exception:
                print(url)
                raise

    def test_post(self):
        """Test if POST requests post data correctly."""

        expected_responses = self._expected.get('POST', {})
        for url, data, queries in POST_URLS:

            if url not in expected_responses:
                print('Expected output not recorded for {}'.format(url))
                continue

            response_dict = MigrationGetTestCase.get_post_response_dict(url, data, queries)
            self.assertResponseDictEqual(expected_responses[url], response_dict, url)

    def assertEqual(self, expected, actual, msg=None):
        expected = _drop_unimportant_data(expected)
        actual = _drop_unimportant_data(actual)
        super(MigrationGetTestCase, self).assertEqual(expected, actual, msg)

    def assertResponseDictEqual(self, expected, actual, url):
        # FIXME: It's weird for an assertion to take a url as argument
        for key, expected_value in expected.items():
            try:
                if isinstance(expected_value, dict):
                    self.assertEqual(expected_value, actual[key])

                else:
                    self.assertEqual(
                        parse_response(url, expected_value),
                        parse_response(url, actual[key])
                    )

            except AssertionError as e:
                self.errors.append(('{}:{}'.format(key, url), expected, actual, e))
                break

            except Exception:
                print(url)
                raise
