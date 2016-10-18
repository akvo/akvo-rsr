# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


Usage:

    ./scripts/devhelpers/manage.sh test -v 3 akvo.rsr.tests.rest.test_migration.MigrationTestCase

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
    Employment, Indicator, IndicatorPeriod, IndicatorPeriodData, Keyword, Organisation, Project, Result
)
from .migration_data import (DELETE_URLS, GET_URLS, HERE, POST_URLS)


EXPECTED_RESPONSES_FILE = join(HERE, 'expected_responses.json')
CLIENT = Client(HTTP_HOST=settings.RSR_DOMAIN)
FIXTURE = 'test_data.json'


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

    # Add a keyword
    k = Keyword(label='new-keyword')
    k.save()
    project.keywords.add(k)


def parse_response(url, response):
    if not response:
        return response

    # XXX: converting ordered dict to dict for pretty diffs
    return (
        json.loads(json.dumps(xmltodict.parse(response))) if 'format=xml' in url
        else json.loads(response)
    )


def _drop_unimportant_data(d):
    """Recursively drop unimportant data from given dict or list."""

    unimportant_keys = [
        # These get changed because the setUp - load_fixture_data - actually
        # creates some required objects and not everything is in the fixutres.
        'last_modified_at',
        'created_at',
        'id',
        # IDs of the Result and Indicator
        'result',
        'indicator',
        # TODO: check what format images URLs should have
        'logo',
        'photo',
        'file',
        # request meta
        'next',
        'limit',
    ]

    ignored_string_prefixes = (
        # File paths may change, when hashes are used, etc.
        '/media/cache/',
        '/media/db/',
        '/var/akvo/rsr/mediaroot',
        # The error from GET is sent using detail key.  This changes from
        # "Method 'GET' not allowed." to 'Method "GET" not allowed.',
        "Method 'GET' not allowed.",
        'Method "GET" not allowed.',
        u'Not found',
        u'Not found.',
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


class MigrationTestsMeta(type):
    def __new__(cls, name, bases, attrs):

        for i, url in enumerate(GET_URLS):
            data = (url,)
            attrs['test_get_{}'.format(i)] = cls.gen(data, 'get')

        for i, data in enumerate(POST_URLS):
            attrs['test_post_{}'.format(i)] = cls.gen(data, 'post')

        for i, data in enumerate(DELETE_URLS):
            attrs['test_delete_{}'.format(i)] = cls.gen(data, 'delete')

        return super(MigrationTestsMeta, cls).__new__(cls, name, bases, attrs)

    @classmethod
    def gen(cls, x, method='get'):
        # Return a testcase that tests ``x``.
        def fn(self):
            getattr(self, '{}_test'.format(method))(*x)
        fn.__doc__ = '{} on {}'.format(method.upper(), x[0])
        return fn


class MigrationTestCase(TestCase):
    """Test the endpoints.

    The actual test methods are generated using the metaclass
    MigrationTestsMeta and the list of endpoints/urls to test with.

    """

    __metaclass__ = MigrationTestsMeta

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

        cls.collected_count = 0
        cls._load_expected()

    @classmethod
    def tearDownClass(cls):
        management.call_command('flush', interactive=False)
        if cls.collected_count == 0:
            return
        print('Collected new outputs for {} urls.'.format(cls.collected_count))
        with open(EXPECTED_RESPONSES_FILE, 'w') as f:
            json.dump(cls._expected, f, indent=2)

    @classmethod
    def setup_user_context(cls):
        # Login as super admin
        cls.c.login(username='su@localdev.akvo.org', password='password')

    @classmethod
    def _load_expected(cls):
        if not exists(EXPECTED_RESPONSES_FILE):
            cls._expected = {}
            return

        with open(EXPECTED_RESPONSES_FILE) as f:
            cls._expected = json.load(f)

    @staticmethod
    def get_response_dict(method, url, data=None, queries=None):
        response_dict = {}

        with do_in_transaction():
            # METHOD calls
            method = getattr(CLIENT, method)
            r = (
                method(url, data, content_type='application/xml') if 'format=xml' in url else
                method(url, data)
            )
            assert int(r.status_code / 100) == 2, r.status_code
            response_dict['post'] = r.content

            # GET
            response_dict['get'] = CLIENT.get(url).content

            # query assertions
            queries_dict = response_dict.setdefault('queries', {})
            EXEC_CODE = 'from django.contrib.admin.models import *; from akvo.rsr.models import *; output = {}'
            for query in queries:
                code = EXEC_CODE.format(query)
                ns = {}
                exec(code, ns)
                queries_dict[query] = ns['output']

        return response_dict

    def get_test(self, url):
        """Test if GET requests return expected data."""

        response = self.c.get(url)
        expected_responses = self._expected.setdefault('GET', {})
        if url not in expected_responses:
            expected_responses[url] = response.content
            self.__class__.collected_count += 1
            raise unittest.SkipTest('No previously recorded output for {}'.format(url))

        expected = parse_response(url, expected_responses[url])
        actual = parse_response(url, response.content)
        self.assertEqual(expected, actual)

    def post_test(self, url, data, queries):
        """Test if POST requests post data correctly."""

        response_dict = self.get_response_dict('post', url, data, queries)
        expected_responses = self._expected.setdefault('POST', {})
        if url not in expected_responses:
            expected_responses[url] = response_dict
            self.__class__.collected_count += 1
            raise unittest.SkipTest('No previously recorded output for {}'.format(url))

        for key, expected_value in expected_responses[url].items():
            actual_value = response_dict[key]
            if not isinstance(expected_value, dict):
                expected_value = parse_response(url, expected_value)
                actual_value = parse_response(url, actual_value)

            self.assertEqual(expected_value, actual_value)

    def delete_test(self, url, data, queries):
        """Test if DELETE requests work correctly."""

        response_dict = self.get_response_dict('delete', url, data, queries)

        expected_responses = self._expected.setdefault('DELETE', {})
        if url not in expected_responses:
            expected_responses[url] = response_dict
            self.__class__.collected_count += 1
            raise unittest.SkipTest('No previously recorded output for {}'.format(url))

        for key, expected_value in expected_responses[url].items():
            actual_value = response_dict[key]
            if not isinstance(expected_value, dict):
                expected_value = parse_response(url, expected_value)
                actual_value = parse_response(url, actual_value)

            self.assertEqual(expected_value, actual_value)

    def assertEqual(self, expected, actual, msg=None):
        expected = _drop_unimportant_data(expected)
        actual = _drop_unimportant_data(actual)
        super(MigrationTestCase, self).assertEqual(expected, actual, msg)
