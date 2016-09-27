# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


Usage:

1. First, you need to have the test fixture to be able to run these tests.  To
get the fixture file, run the script akvo/rsr/fixtures/download.sh.  This test
data is a json fixture of the dump that localdev uses.

2. Once you have the test data, you will first need to run these tests against
the old API.  This will create an `expected_responses.json` file in this
directory.  You can run the tests as follows:

    ./scripts/devhelpers/manage.sh test -v 3 akvo.rsr.tests.rest.test_migration.MigrationGetTestCase

3. Next, you should run these tests against the new API.  Make sure you are on
the new akvo-rsr branch.  Also make sure that you have the correct version of
DRF installed. Now, run the tests as before.

    ./scripts/devhelpers/manage.sh test -v 3 akvo.rsr.tests.rest.test_migration.MigrationGetTestCase

You should get an output with all the offending URLs.

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
        response = CLIENT.get(url)
        output[url] = response.content

    with open(EXPECTED_RESPONSES_FILE, 'w') as f:
        json.dump(output, f, indent=2)

    print('Collected responses for {} urls'.format(len(output)))


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
        # akvo/rsr/static/scripts-src/my-projects.js
        '/rest/v1/project/?format=json',

        # akvo/scripts/cordaid/organisation_upload.py
        '/api/v1/user/?format=json&api_key=df405025a990bc4c5644f54f8e3760118c736f53&username=admin@good-deeds.io&user__username=admin@good-deeds.io',
        # XXX: /rest/v1/internal_organisation_id/?recording_org={recording_org}&identifier={identifier}&format=json,

        # akvo/rest/filters.py doc examples
        "/rest/v1/project/?filter={'title__icontains':'water','currency':'EUR'}&format=json",
        "/rest/v1/project/?filter={'title__icontains':'fiber'}&exclude={'currency':'EUR'}&format=json",
        "/rest/v1/project/?filter={'partners__in':[2,3]}&prefetch_related=['partners']&format=json",

        # akvo/rsr/static/scripts-src/project-directory-typeahead.jsx
        '/rest/v1/typeaheads/organisations?format=json',

        # akvo/rsr/static/scripts-src/my-details-employments.jsx
        '/rest/v1/typeaheads/countries?format=json',

        # akvo/rsr/static/scripts-src/project-main/project-main-report.jsx
        '/rest/v1/project/4/?format=json',
        '/rest/v1/project_location/?format=json&location_target=4',
        '/rest/v1/indicator/?format=json&result__project=4',
        '/rest/v1/indicator_reference/?format=json&indicator__result__project=4',
        '/rest/v1/indicator_period/?format=json&indicator__result__project=4',
        '/rest/v1/indicator_period_actual_dimension/?format=json&period__indicator__result__project=4',
        '/rest/v1/indicator_period_target_dimension/?format=json&period__indicator__result__project=4',
        '/rest/v1/indicator_period_actual_location/?format=json&period__indicator__result__project=4',
        '/rest/v1/indicator_period_target_location/?format=json&period__indicator__result__project=4',
        '/rest/v1/transaction_sector/?format=json&transaction__project=4',
        '/rest/v1/administrative_location/?format=json&location__location_target=4',
        '/rest/v1/project_document_category/?format=json&document__project=4',
        '/rest/v1/crs_add_other_flag/?format=json&crs__project=4',
        '/rest/v1/fss_forecast/?format=json&fss__project=4',

        # akvo/rsr/static/scripts-src/project-directory.js
        '/rest/v1/typeaheads/projects?format=json',

        # akvo/rsr/static/scripts-src/update-directory.js
        '/rest/v1/typeaheads/project_updates?format=json',

        # akvo/rsr/static/scripts-src/my-reports.js
        '/rest/v1/report_formats/?format=json',
        '/rest/v1/reports/?format=json',
        '/rest/v1/typeaheads/user_organisations?format=json',
        '/rest/v1/typeaheads/user_projects?format=json',

        # akvo/rsr/static/scripts-src/my-results.js
        '/rest/v1/partnership/?format=json&project=4',
        '/rest/v1/user/6/?format=json',
        '/rest/v1/result/?format=json&project=4',
        '/rest/v1/indicator/?format=json&result__project=4',
        '/rest/v1/indicator_period/?format=json&indicator__result__project=4',
        '/rest/v1/indicator_period_data_framework/?format=json&period__indicator__result__project=4',
        '/rest/v1/indicator_period_framework/1/?format=json',

        # akvo/rsr/static/scripts-src/my-iati.js
        '/rest/v1/project_iati_export/?format=json&limit=50&reporting_org=3',
        '/rest/v1/iati_export/?format=json&reporting_organisation=2&ordering=-id&limit=1',
        '/rest/v1/iati_export/?format=json&reporting_organisation=3',

        # akvo/rsr/static/scripts-src/project-main/project-main-partners.js
        '/rest/v1/partnership_more_link/?format=json&project=4',

        '/rest/v1/project_update/?format=xml&project=3&last_modified_at__gt=2014-01-01',

    ]

    POST_URLS = [
        # akvo/scripts/cordaid/organisation_upload.py
        '/rest/v1/internal_organisation_id/',

        # akvo/rsr/static/scripts-src/project-editor.jsx
        '/rest/v1/project/{project_id}/project_editor/?format=json',
        '/rest/v1/project/{project_id}/upload_file/?format=json',
        '/rest/v1/project/{project_id}/reorder_items/?format=json',
        '/rest/v1/project/{project_id}/default_periods/?format=json',
        '/rest/v1/project/{project_id}/import_results/?format=json',
        '/rest/v1/organisation/?format=json',
        '/rest/v1/organisation_location/?format=json',
        '/rest/v1/organisation/{organisation_id}/add_logo/?format=json',

        # akvo/rsr/static/scripts-src/my-user-management.js
        '/rest/v1/invite_user/?format=json',
        '/rest/v1/employment/{employment_id}/approve/?format=json',
        '/rest/v1/employment/{employment_id}/set_group/{group_id}/?format=json',

        # akvo/rsr/static/scripts-src/my-results.js
        "/rest/v1/indicator_period_data/{update}/upload_file/?format=json",
        "/rest/v1/indicator_period_data_comment/?format=json",
        "/rest/v1/indicator_period_data_framework/?format=json"

        # akvo/rsr/static/scripts-src/my-iati.js
        '/rest/v1/iati_export/?format=json',

    ]

    PATCH_URLS = [
        # akvo/rsr/static/scripts-src/project-editor.jsx
        '/rest/v1/project/{project_id}/?format=json',
        '/rest/v1/project_document/{documentId}/?format=json',
        '/rest/v1/publishing_status/{publishing_status_id}/?format=json',

        # akvo/rsr/static/scripts-src/my-results.js
        "/rest/v1/indicator_period_data_framework/{update}/?format=json",
        "/rest/v1/indicator_period_framework/{period}/?format=json",

        # akvo/rsr/static/scripts-src/my-iati.js
        "/rest/v1/iati_export/{iati_export}/?format=json",
        "/rest/v1/organisation/{{ selected_org.id }}/?format=json",
    ]


    PUT_URLS = [
        # akvo/scripts/cordaid/organisation_upload.py
        '/rest/v1/organisation/{pk}/',
    ]

    DELETE_URLS = [

        # akvo/rsr/static/scripts-src/my-details-employments.jsx
        "/rest/v1/employment/{employment_id}",

        # akvo/rsr/static/scripts-src/project-editor.jsx
        '/rest/v1/project/{project_id}/remove_keyword/{item_id}/?format=json',
        '/rest/v1/{itemType}/{itemId}/?format=json',
        '/rest/v1/project/{project_id}/remove_validation/{validation_set_id}/?format=json',
        '/rest/v1/project/{project_id}/add_validation/{validation_set_id}/?format=json',

        # akvo/rsr/static/scripts-src/my-user-management.js
        '/rest/v1/employment/{employment_id}/?format=json',

        # akvo/rsr/static/scripts-src/my-updates.js
        '/rest/v1/project_update/{update_id}/?format=json',

        # akvo/rsr/static/scripts-src/my-results.js
        "/rest/v1/indicator_period_data_framework/{update}/?format=json",
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


    def test_get(self):
        """Test if the get requests return the same data as expected."""

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
