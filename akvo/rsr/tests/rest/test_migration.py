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


from contextlib import contextmanager
import json
from os.path import abspath, dirname, exists, join
import unittest

from django.conf import settings
from django.db import transaction
from django.test import TestCase, Client
from django.core import management
import xmltodict

from akvo.rsr.models import (
    Employment, Indicator, IndicatorPeriod, IndicatorPeriodData, Organisation, Project, Result
)


TEST = 0
COLLECT = 1
HERE = dirname(abspath(__file__))
EXPECTED_RESPONSES_FILE = join(HERE, 'expected_responses.json')
MODE = TEST if exists(EXPECTED_RESPONSES_FILE) else COLLECT
CLIENT = Client(HTTP_HOST=settings.RSR_DOMAIN)


class CancelTransactionError(Exception):
    """The exception we raise to cancel a transaction."""


def collect_responses():
    """ Collect responses for all the interesting urls."""

    output = {}

    get_responses = output.setdefault('GET', {})
    for url in MigrationGetTestCase.GET_URLS:
        get_responses[url] = CLIENT.get(url).content
    print('Collected GET responses for {} urls'.format(len(get_responses)))

    post_responses = output.setdefault('POST', {})
    for url, data, queries in MigrationGetTestCase.POST_URLS:
        post_responses[url] = MigrationGetTestCase.get_post_response_dict(url, data, queries)
    print('Collected POST responses for {} urls'.format(len(post_responses)))

    with open(EXPECTED_RESPONSES_FILE, 'w') as f:
        json.dump(output, f, indent=2)


@contextmanager
def do_in_transaction():
    """A context manager to do things inside a transaction, and then rollback."""
    try:
        with transaction.atomic():
            yield
            raise CancelTransactionError('Cancel the transaction!')
    except CancelTransactionError:
        pass


def load_fixture_data():
    """Load up fixture data."""

    management.call_command(
        'loaddata', 'test_data.json', verbosity=3, interactive=False
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
    if 'format=xml' in url:
        # XXX: converting ordered dict to dict for pretty diffs
        parsed = json.loads(json.dumps(xmltodict.parse(response)))

    else:
        parsed = json.loads(response)

    return parsed


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

        # RSR UP urls ################
        # android/AkvoRSR/src/org/akvo/rsr/up/service/GetProjectDataService.java
        '/rest/v1/project_update/?format=xml&project=3&last_modified_at__gt=2014-01-01',

        # android/AkvoRSR/src/org/akvo/rsr/up/service/VerifyProjectUpdateService.java
        '/rest/v1/project_update/?format=xml&uuid=%s&limit=2',

        # android/AkvoRSR/src/org/akvo/rsr/up/service/GetProjectDataService.java
        '/rest/v1/project_up/%s/?format=xml&image_thumb_name=up&image_thumb_up_width=100',

        # android/AkvoRSR/src/org/akvo/rsr/up/service/GetProjectDataService.java
        '/rest/v1/country/?format=json&limit=50',

        # android/AkvoRSR/src/org/akvo/rsr/up/service/GetProjectDataService.java
        '/rest/v1/user/6/?format=json&depth=1',

        # android/AkvoRSR/src/org/akvo/rsr/up/service/GetOrgDataService.java
        '/rest/v1/organisation/?format=json&limit=10',
        '/rest/v1/employment/?format=json&user=3',

        # android/AkvoRSR/src/org/akvo/rsr/up/service/GetProjectDataService.java
        '/rest/v1/organisation/3/?format=json',

        # android/AkvoRSR/src/org/akvo/rsr/up/service/GetProjectDataService.java
        '/rest/v1/results_framework/?format=json&project=4',

    ]

    POST_URLS = [
        # akvo/rsr/static/scripts-src/project-editor.jsx
        ('/rest/v1/project/4/project_editor/?format=json',
         {'rsr_project.title.4': 'foo bar'},
         ('Project.objects.get(id=4).title',),
        ),

        ('/rest/v1/project/4/upload_file/?format=json',
         {'file': open(join(dirname(HERE), 'iati_export', 'test_image.jpg')),
          'field_id': 'rsr_project.current_image.4'},
         ('Project.objects.get(id=4).current_image.path',),
        ),

        ('/rest/v1/project/4/reorder_items/?format=json',
         {'item_type': 'result', 'item_id': 1, 'item_direction': 'up'},
         ('Result.objects.count()',),
        ),

        ('/rest/v1/project/4/reorder_items/?format=json&dedup_param=indicator',
         {'item_type': 'indicator', 'item_id': 1, 'item_direction': 'down'},
         ('Indicator.objects.count()',),
        ),

        ('/rest/v1/project/4/default_periods/?format=json',
         {'indicator_id': '1', 'copy': 'true', 'set_default': 'true'},
         ('Indicator.objects.count()',
          'IndicatorPeriod.objects.count()'),
        ),

        ('/rest/v1/project/4/import_results/?format=json',
         {}, (),
        ),

        ('/rest/v1/organisation/2/add_logo/?format=json',
         {'logo': open(join(dirname(HERE), 'iati_export', 'test_image.jpg'))},
         ('Organisation.objects.get(id=2).logo.path',),
        ),

        ('/rest/v1/organisation_location/?format=json',
         {"latitude": 60,
          "longitude": 5,
          "city": "Amsterdam",
          "location_target": 1,
          "iati_country": "NL",
          "country": 3
         },
         ('OrganisationLocation.objects.count()',
          'OrganisationLocation.objects.get(id=4).latitude',
          'OrganisationLocation.objects.get(id=4).longitude'),
        ),

        ('/rest/v1/organisation/?format=json',
         {u'allow_edit': True,
          u'can_become_reporting': False,
          u'can_create_projects': True,
          u'content_owner': None,
          u'currency': u'EUR',
          u'language': u'en',
          u'long_name': u'ABC XYZ',
          u'name': u'XYZ',
          u'new_organisation_type': 70,
          u'organisation_type': u'C',
          u'primary_location': 2,
          u'public_iati_file': True,
          u'url': u'http://gooddeeds.example.com/'},
         ('Organisation.objects.count()',
          'Organisation.objects.get(id=4).name',),
        ),

        # akvo/rsr/static/scripts-src/my-user-management.js
        ('/rest/v1/invite_user/?format=json',
         {'user_data': '{"organisation": 1, "group": 2, "email": "abc@example.com"}'},
         ('User.objects.count()',),
        ),

        ('/rest/v1/employment/14/approve/?format=json',
         {}, ('Employment.objects.filter(is_approved=True).count()',)
        ),

        ('/rest/v1/employment/14/set_group/2/?format=json',
         {}, ('Employment.objects.filter(group_id=2).count()',)
        ),

        # # akvo/rsr/static/scripts-src/my-results.js
        ('/rest/v1/indicator_period_data/1/upload_file/?format=json',
         {'file': open(join(dirname(HERE), 'iati_export', 'test_image.jpg')),
          'type': 'photo'},
         (),
        ),

        ('/rest/v1/indicator_period_data_comment/?format=json',
         {"data": 4, "user": 1, "comment": "My awesome comment"},
         ('IndicatorPeriodDataComment.objects.count()',),
        ),

        ('/rest/v1/indicator_period_data_framework/?format=json',
         {"period": 1, "user": 1, "data": 1, "period_actual_value": "4", "status": "N"},
         ('IndicatorPeriodData.objects.count()',),
        ),

        # akvo/rsr/static/scripts-src/my-iati.js
        ('/rest/v1/iati_export/?format=json',
         {"reporting_organisation": 1, "user": 1, "version": "2"},
         ('IatiExport.objects.count()',),
        ),

        # akvo/scripts/cordaid/organisation_upload.py
        ('/rest/v1/internal_organisation_id/?format=json',
         {
            "recording_org": 1,
            "referenced_org": 1,
            "identifier": "ABC"
         },
         ('InternalOrganisationID.objects.count()',),
        ),

        # RSR UP urls ################

        # android/AkvoRSR/src/org/akvo/rsr/up/service/SubmitProjectUpdateService.java
        ('/rest/v1/project_update/?format=xml',
         open(join(HERE, 'update.xml')).read(),
         (),
        )

        # # android/AkvoRSR/src/org/akvo/rsr/up/service/SubmitIpdService.java
        # '/rest/v1/indicator_period_data/?format=json',

        # # android/AkvoRSR/src/org/akvo/rsr/up/service/SubmitEmploymentService.java
        # '/rest/v1/user/%s/request_organisation/?format=json',

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
        for url in self.GET_URLS:
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
        for url, data, queries in self.POST_URLS:

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
