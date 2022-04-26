# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""
import datetime
import json
from os.path import abspath, dirname, join
from urllib.parse import urlencode

from django.conf import settings
from django.contrib.auth.models import Group
from django.test import TestCase, Client
from django.test.client import BOUNDARY, MULTIPART_CONTENT, encode_multipart
import xmltodict

from akvo.codelists.models import ResultType, Version
from akvo.rsr.models import (
    Employment, Indicator, Organisation,
    Partnership, Project, Result, User,
    RelatedProject, IndicatorPeriod, OrganisationLocation
)
from akvo.rsr.tests.base import BaseTestCase
from akvo.rsr.tests.utils import ProjectFixtureBuilder
from akvo.utils import check_auth_groups

HERE = dirname(abspath(__file__))

ORGANISATION_XML = """
<?xml version="1.0" encoding="utf-8"?>
<root><total_budgets></total_budgets><recipient_org_budgets></recipient_org_budgets><region_budgets></region_budgets><country_budgets></country_budgets><total_expenditures></total_expenditures><documents></documents><name>ABC</name><language>en</language><organisation_type>N</organisation_type><currency>EUR</currency><new_organisation_type>22</new_organisation_type><iati_org_id></iati_org_id><url>http://www.google.com/</url></root>
"""


def create_user(username='username', email='user@name.com', password='password'):
    user = User.objects.create_user(username, email, password)
    user.is_active = user.is_admin = user.is_superuser = True
    user.save()
    return user, username, password


class BaseReorderTestCase(object):

    def setUp(self):
        # Create necessary groups
        check_auth_groups(settings.REQUIRED_AUTH_GROUPS)

        # Create project
        self.project = Project.objects.create(title="Test Project")

        # Create reporting organisation
        self.reporting_org = Organisation.objects.create(
            name="REST reporting",
            long_name="REST reporting org",
            new_organisation_type=22
        )

        # Create partnership
        Partnership.objects.create(
            project=self.project,
            organisation=self.reporting_org,
            iati_organisation_role=Partnership.IATI_REPORTING_ORGANISATION,
        )

        # Create active user
        self.user, self.username, self.password = create_user()

        # Create employment
        Employment.objects.create(
            user=self.user,
            organisation=self.reporting_org,
            group=Group.objects.get(name='Admins'),
            is_approved=True,
        )

        self.c = Client(HTTP_HOST=settings.RSR_DOMAIN)

    def test_should_reorder_item_up(self):
        """
        Checks the regular REST project endpoint.
        """

        # Given
        items = [self.create_item() for _ in range(5)]
        item_id = items[1].id
        url = '/rest/v1/project/{}/reorder_items/'.format(self.project.id)
        data = {
            'item_type': self.item_type,
            'item_id': item_id,
            'item_direction': 'up',
            'format': 'json'
        }
        self.c.login(username=self.username, password=self.password)

        # When
        response = self.c.post(url, data=data, follow=True)

        # Then
        items = self.get_items()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(items[0].order, 1)
        self.assertEqual(items[1].order, 0)
        self.assertEqual(items[2].order, 2)
        self.assertEqual(items[3].order, 3)
        self.assertEqual(items[4].order, 4)

    def test_should_not_reorder_first_item_up(self):
        # Given
        items = [self.create_item() for _ in range(5)]
        item_id = items[0].id
        url = '/rest/v1/project/{}/reorder_items/'.format(self.project.id)
        data = {
            'item_type': self.item_type,
            'item_id': item_id,
            'item_direction': 'up',
            'format': 'json'
        }
        self.c.login(username=self.username, password=self.password)

        # When
        response = self.c.post(url, data=data, follow=True)

        # Then
        items = self.get_items()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(items[0].order, 0)
        self.assertEqual(items[1].order, 1)
        self.assertEqual(items[2].order, 2)
        self.assertEqual(items[3].order, 3)
        self.assertEqual(items[4].order, 4)

    def test_should_reorder_item_down(self):
        # Given
        items = [self.create_item() for _ in range(5)]
        item_id = items[0].id
        url = '/rest/v1/project/{}/reorder_items/'.format(self.project.id)
        data = {
            'item_type': self.item_type,
            'item_id': item_id,
            'item_direction': 'down',
            'format': 'json'
        }
        self.c.login(username=self.username, password=self.password)

        # When
        response = self.c.post(url, data=data, follow=True)

        # Then
        items = self.get_items()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(items[0].order, 1)
        self.assertEqual(items[1].order, 0)
        self.assertEqual(items[2].order, 2)
        self.assertEqual(items[3].order, 3)
        self.assertEqual(items[4].order, 4)

    def test_should_not_reorder_last_item_down(self):
        # Given
        items = [self.create_item() for _ in range(5)]
        item_id = items[4].id
        url = '/rest/v1/project/{}/reorder_items/'.format(self.project.id)
        data = {
            'item_type': self.item_type,
            'item_id': item_id,
            'item_direction': 'down',
            'format': 'json'
        }
        self.c.login(username=self.username, password=self.password)

        # When
        response = self.c.post(url, data=data, follow=True)

        # Then
        items = self.get_items()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(items[0].order, 0)
        self.assertEqual(items[1].order, 1)
        self.assertEqual(items[2].order, 2)
        self.assertEqual(items[3].order, 3)
        self.assertEqual(items[4].order, 4)

    def test_should_handle_deleted_item(self):
        # Given
        self.c.login(username=self.username, password=self.password)
        items = [self.create_item() for _ in range(5)]
        item_id = items[2].id
        url = '/rest/v1/project/{}/reorder_items/'.format(self.project.id)
        data = {
            'item_type': self.item_type,
            'item_id': item_id,
            'item_direction': 'down',
            'format': 'json'
        }
        self.c.post(url, data=data, follow=True)

        # When
        item = self.ItemModel.objects.get(id=item_id)
        assert item.order is not None
        item.delete()

        # Then
        items = self.get_items()
        self.assertEqual(len(items), 4)
        self.assertEqual(items[0].order, 0)
        self.assertEqual(items[1].order, 1)
        self.assertEqual(items[2].order, 2)
        self.assertEqual(items[3].order, 3)

    def test_should_handle_creating_new_item(self):
        # Given
        # Try to move first item up, to set order column
        self.c.login(username=self.username, password=self.password)
        items = [self.create_item() for _ in range(4)]
        item_id = items[0].id
        url = '/rest/v1/project/{}/reorder_items/'.format(self.project.id)
        data = {
            'item_type': self.item_type,
            'item_id': item_id,
            'item_direction': 'up',
            'format': 'json'
        }
        self.c.post(url, data=data, follow=True)

        # When
        item = self.create_item()

        # Then
        items = self.get_items()
        self.assertEqual(len(items), 5)
        self.assertEqual(items[0].order, 0)
        self.assertEqual(items[1].order, 1)
        self.assertEqual(items[2].order, 2)
        self.assertEqual(items[3].order, 3)
        self.assertEqual(items[4].id, item.id)
        self.assertEqual(items[4].order, 4)

    def test_should_handle_messed_up_order(self):
        # Given
        self.c.login(username=self.username, password=self.password)
        order = [2, 3, 3, 6, 6]
        items = [self.create_item(order=i) for i in order]
        item_id = items[0].id
        url = '/rest/v1/project/{}/reorder_items/'.format(self.project.id)
        data = {
            'item_type': self.item_type,
            'item_id': item_id,
            'item_direction': 'down',
            'format': 'json'
        }

        # When
        self.c.post(url, data=data, follow=True)

        # Then
        items = self.get_items()
        self.assertEqual(len(items), 5)
        self.assertEqual(items[0].order, 1)
        self.assertEqual(items[1].order, 0)
        self.assertEqual(items[2].order, 2)
        self.assertEqual(items[3].order, 3)
        self.assertEqual(items[4].order, 4)

    def create_item(self, order=None):
        raise NotImplementedError

    def get_items(self):
        raise NotImplementedError


class ProjectEditorReorderResultsTestCase(BaseReorderTestCase, TestCase):
    """Tests the reordering of results in the project editor."""

    item_type = 'result'
    ItemModel = Result

    def create_item(self, order=None):
        return Result.objects.create(project_id=self.project.id, order=order)

    def get_items(self):
        return Result.objects.filter(project__id=self.project.id).order_by('id')


class ProjectEditorReorderIndicatorsTestCase(BaseReorderTestCase, TestCase):
    """Tests the reordering of indicators in the project editor."""

    item_type = 'indicator'
    ItemModel = Indicator

    def setUp(self):
        super(ProjectEditorReorderIndicatorsTestCase, self).setUp()
        self.result = Result.objects.create(project_id=self.project.id)

    def create_item(self, order=None):
        return Indicator.objects.create(result_id=self.result.id, order=order)

    def get_items(self):
        return Indicator.objects.filter(result_id=self.result.id).order_by('id')


class ProjectEditorReorderImportedResultsFrameworkTestCase(BaseTestCase):

    email = 'test@example.com'
    password = 'password'

    def test_should_not_be_able_to_reorder_result(self):
        # Given
        self.create_user(self.email, self.password, is_superuser=True)
        self.c.login(username=self.email, password=self.password)
        lead = ProjectFixtureBuilder()\
            .with_title('Lead Project')\
            .with_results([
                {'title': 'Result #1'},
                {'title': 'Result #2'},
            ])\
            .with_contributors([
                {'title': 'Contrib Project'}
            ])\
            .build()
        contrib = lead.get_contributor(title='Contrib Project')
        results = contrib.results.all()

        # When
        url = '/rest/v1/project/{}/reorder_items/'.format(contrib.object.id)
        data = {
            'item_type': 'result',
            'item_id': results[0].id,
            'item_direction': 'down',
        }
        response = self.c.post(url, data=data, follow=True)

        # Then
        self.assertEqual(response.status_code, 400)

    def test_should_not_be_able_to_reorder_indicator(self):
        # Given
        self.create_user(self.email, self.password, is_superuser=True)
        self.c.login(username=self.email, password=self.password)
        lead = ProjectFixtureBuilder()\
            .with_title('Lead Project')\
            .with_results([
                {
                    'title': 'Result #1',
                    'indicators': [
                        {'title': 'Indicator #1'},
                        {'title': 'Indicator #2'},
                    ]
                },
            ])\
            .with_contributors([
                {'title': 'Contrib Project'}
            ])\
            .build()
        contrib = lead.get_contributor(title='Contrib Project')
        indicators = contrib.indicators.all()

        # When
        url = '/rest/v1/project/{}/reorder_items/'.format(contrib.object.id)
        data = {
            'item_type': 'indicator',
            'item_id': indicators[0].id,
            'item_direction': 'down',
        }
        response = self.c.post(url, data=data, follow=True)

        # Then
        self.assertEqual(response.status_code, 400)

    def test_reordering_result_at_lead_reflected_to_contributor(self):
        # Given
        self.create_user(self.email, self.password, is_superuser=True)
        self.c.login(username=self.email, password=self.password)
        lead = ProjectFixtureBuilder()\
            .with_title('Lead Project')\
            .with_results([
                {'title': 'Result #1'},
                {'title': 'Result #2'},
            ])\
            .with_contributors([
                {'title': 'Contrib Project'}
            ])\
            .build()
        contrib = lead.get_contributor(title='Contrib Project')
        lead_result = lead.results.get(title='Result #2')

        # When
        url = '/rest/v1/project/{}/reorder_items/'.format(lead.object.id)
        data = {
            'item_type': 'result',
            'item_id': lead_result.id,
            'item_direction': 'up',
        }
        self.c.post(url, data=data, follow=True)

        # Then
        self.assertEqual(lead.results.get(title='Result #1').order, 1)
        self.assertEqual(lead.results.get(title='Result #2').order, 0)
        self.assertEqual(contrib.results.get(title='Result #1').order, 1)
        self.assertEqual(contrib.results.get(title='Result #2').order, 0)

    def test_reordering_indicator_at_lead_reflected_to_contributor(self):
        # Given
        self.create_user(self.email, self.password, is_superuser=True)
        self.c.login(username=self.email, password=self.password)
        lead = ProjectFixtureBuilder()\
            .with_title('Lead Project')\
            .with_results([
                {
                    'title': 'Result #1',
                    'indicators': [
                        {'title': 'Indicator #1'},
                        {'title': 'Indicator #2'},
                    ]
                },
            ])\
            .with_contributors([
                {'title': 'Contrib Project'}
            ])\
            .build()
        contrib = lead.get_contributor(title='Contrib Project')
        lead_indicator = lead.indicators.get(title='Indicator #2')

        # When
        url = '/rest/v1/project/{}/reorder_items/'.format(lead.object.id)
        data = {
            'item_type': 'indicator',
            'item_id': lead_indicator.id,
            'item_direction': 'up',
        }
        self.c.post(url, data=data, follow=True)

        # Then
        self.assertEqual(lead.indicators.get(title='Indicator #1').order, 1)
        self.assertEqual(lead.indicators.get(title='Indicator #2').order, 0)
        self.assertEqual(contrib.indicators.get(title='Indicator #1').order, 1)
        self.assertEqual(contrib.indicators.get(title='Indicator #2').order, 0)


class DefaultPeriodsTestCase(TestCase):
    """Test the adding and removal of default periods."""

    def setUp(self):
        self.user, self.username, self.password = create_user()

        self.c = Client(HTTP_HOST=settings.RSR_DOMAIN)
        self.c.login(username=self.username, password=self.password)

        self.parent_project = Project.objects.create(
            title="Parent project", subtitle="Parent project (subtitle)"
        )
        self.parent_project.publish()

        self.child_project1 = Project.objects.create(
            title="Child project 1", subtitle="Child project 1 (subtitle)"
        )
        self.child_project1.publish()

        self.child_project2 = Project.objects.create(
            title="Child project 2", subtitle="Child project 2 (subtitle)"
        )
        self.child_project2.publish()

        RelatedProject.objects.create(
            project=self.parent_project, related_project=self.child_project1,
            relation=RelatedProject.PROJECT_RELATION_CHILD
        )
        RelatedProject.objects.create(
            project=self.parent_project, related_project=self.child_project2,
            relation=RelatedProject.PROJECT_RELATION_CHILD
        )
        # Create results framework
        self.result = Result.objects.create(
            project=self.parent_project, title="Result #1", type="1"
        )
        self.indicator1 = Indicator.objects.create(
            result=self.result, title="Indicator #1", measure="1"
        )
        self.today = datetime.date.today()
        self.period1 = IndicatorPeriod.objects.create(
            indicator=self.indicator1, period_start=self.today,
            period_end=self.today + datetime.timedelta(days=1), target_value="100"
        )
        self.period2 = IndicatorPeriod.objects.create(
            indicator=self.indicator1,
            period_start=self.today + datetime.timedelta(days=1),
            period_end=self.today + datetime.timedelta(days=2), target_value="200"
        )
        self.indicator2 = Indicator.objects.create(
            result=self.result, title="Indicator #2", measure="1"
        )
        # self.period3 = IndicatorPeriod.objects.create(
        #     indicator=self.indicator2,
        #     period_start=today + datetime.timedelta(days=3),
        #     period_end=today + datetime.timedelta(days=4), target_value="300"
        # )
        # self.period4 = IndicatorPeriod.objects.create(
        #     indicator=self.indicator2,
        #     period_start=today + datetime.timedelta(days=5),
        #     period_end=today + datetime.timedelta(days=6), target_value="400"
        # )

        # Import results framework into child
        self.import_status1, self.import_message1 = self.child_project1.import_results()
        self.import_status2, self.import_message2 = self.child_project2.import_results()


class CreateNewOrganisationTestCase(BaseTestCase):

    def setUp(self):
        super(CreateNewOrganisationTestCase, self).setUp()
        self.username = 'example@akvo.org'
        self.password = 'password'
        self.user = self.create_user(self.username, self.password)
        self.org = self.create_organisation('Akvo')
        self.make_org_admin(self.user, self.org)
        self.c = Client(HTTP_HOST=settings.RSR_DOMAIN)

    def test_create_new_organisation(self):
        # Given
        self.c.login(username=self.username, password=self.password)
        url = '/rest/v1/organisation/?format=json'
        content_type = 'application/x-www-form-urlencoded'
        data = {'name': 'Test Org',
                'long_name': 'Test Organisation',
                'new_organisation_type': 10,
                'url': 'http://example.com',
                'latitude': '12.9',
                'longitude': '77.5',
                'city': 'Bangalore',
                'iati_country': 'IN'}

        # When
        response = self.c.post(url, data=urlencode(data), content_type=content_type)

        # Then
        self.assertEqual(response.status_code, 201)
        self.assertIn('id', response.data)
        for key in set(data.keys()) - {'iati_country'}:
            self.assertEqual(response.data[key], data[key])
        self.assertEqual(1, len(response.data['locations']))
        location = response.data['locations'][0]
        for key in {'latitude', 'longitude', 'city'}:
            self.assertEqual(str(location[key]), str(data[key]))

    def test_create_new_organisation_xml_content(self):
        # Given
        self.c.login(username=self.username, password=self.password)
        url = '/rest/v1/organisation/?format=xml'
        content_type = 'application/xml'

        # When
        response = self.c.post(url, data=ORGANISATION_XML.strip(), content_type=content_type)

        # Then
        self.assertEqual(response.status_code, 201)
        self.assertIn('id', response.data)
        data = xmltodict.parse(ORGANISATION_XML.strip())['root']
        self.assertEqual(data['language'], response.data['language'])
        self.assertEqual(data['name'], response.data['name'])
        self.assertEqual(data['organisation_type'], response.data['organisation_type'])
        self.assertEqual(int(data['new_organisation_type']), response.data['new_organisation_type'])
        self.assertEqual(data['url'], response.data['url'])
        self.assertTrue(response.data['public_iati_file'])
        self.assertFalse(response.data['can_create_projects'])
        self.assertFalse(response.data['can_become_reporting'])

    def test_create_new_organisation_json_content(self):
        # Given
        self.c.login(username=self.username, password=self.password)
        location = OrganisationLocation.objects.create(location_target=self.org)
        url = '/rest/v1/organisation/?format=json'
        content_type = 'application/json'
        data = {u'can_become_reporting': False,
                u'can_create_projects': True,
                u'content_owner': None,
                u'currency': u'EUR',
                u'language': u'en',
                u'long_name': u'ABC XYZ',
                u'name': u'XYZ',
                u'new_organisation_type': 70,
                u'organisation_type': u'C',
                u'primary_location': location.id,
                u'public_iati_file': True,
                u'url': u'http://gooddeeds.example.com/'}

        # When
        response = self.c.post(url, data=json.dumps(data), content_type=content_type)

        # Then
        self.assertEqual(response.status_code, 201)
        for key in data:
            self.assertEqual(data[key], response.data[key], '{} has different values'.format(key))

    def test_create_new_organisation_with_content_owner(self):
        # Given
        self.c.login(username=self.username, password=self.password)
        location = OrganisationLocation.objects.create(location_target=self.org)
        url = '/rest/v1/organisation/?format=json'
        content_type = 'application/json'
        data = {u'can_become_reporting': False,
                u'can_create_projects': True,
                u'content_owner': self.org.id,
                u'currency': u'EUR',
                u'language': u'en',
                u'long_name': u'ABC XYZX',
                u'name': u'XYZX',
                u'new_organisation_type': 70,
                u'organisation_type': u'C',
                u'primary_location': location.id,
                u'public_iati_file': True,
                u'url': u'http://moregooddeeds.example.com/'}

        # When
        response = self.c.post(url, data=json.dumps(data), content_type=content_type)

        # Then
        self.assertEqual(response.status_code, 201)
        for key in data:
            self.assertEqual(data[key], response.data[key], '{} has different values'.format(key))

    def test_create_new_organisation_no_content_owner(self):
        # Given
        self.c.login(username=self.username, password=self.password)
        location = OrganisationLocation.objects.create(location_target=self.org)
        url = '/rest/v1/organisation/?format=json'
        content_type = 'application/json'
        data = {u'can_become_reporting': False,
                u'can_create_projects': True,
                u'currency': u'EUR',
                u'language': u'en',
                u'long_name': u'ABC XYZX',
                u'name': u'XYZX',
                u'new_organisation_type': 70,
                u'organisation_type': u'C',
                u'primary_location': location.id,
                u'public_iati_file': True,
                u'url': u'http://moregooddeeds.example.com/'}

        # When
        response = self.c.post(url, data=json.dumps(data), content_type=content_type)

        # Then
        self.assertEqual(response.status_code, 201)
        for key in data:
            self.assertEqual(data[key], response.data[key], '{} has different values'.format(key))

    def test_create_new_organisation_without_primary_location(self):
        # Given
        self.c.login(username=self.username, password=self.password)
        url = '/rest/v1/organisation/?format=json'
        content_type = 'application/x-www-form-urlencoded'
        data = {'name': 'Test Org',
                'long_name': 'Test Organisation',
                'new_organisation_type': 10,
                'url': 'http://example.com',
                'iati_country': 'IN'}

        # When
        response = self.c.post(url, data=urlencode(data), content_type=content_type)

        # Then
        self.assertEqual(response.status_code, 201)
        self.assertIn('id', response.data)
        for key in set(data.keys()) - {'iati_country'}:
            self.assertEqual(response.data[key], data[key])
        org = Organisation.objects.get(id=response.data['id'])
        self.assertIsNone(org.primary_location)

    def test_uploading_organisation_logo(self):
        # Given
        self.c.login(username=self.username, password=self.password)
        url = '/rest/v1/organisation/{}/?format=json'.format(self.org.id)
        image_path = join(dirname(HERE), 'iati_export', 'test_image.jpg')
        with open(image_path, 'r+b') as f:
            data = encode_multipart(BOUNDARY, {'logo': f})

            # When
            response = self.c.patch(url, data=data, content_type=MULTIPART_CONTENT)

        # Then
        self.assertEqual(200, response.status_code)
        self.org.refresh_from_db()
        self.assertIsNotNone(self.org.logo.file)
        with open(image_path, 'r+b') as g:
            self.assertEqual(self.org.logo.file.read(), g.read())


class ProjectUpdateTestCase(BaseTestCase):
    """Test that project related methods are called when Project Editor saves"""

    def setUp(self):
        super(ProjectUpdateTestCase, self).setUp()
        iati_version, _ = Version.objects.get_or_create(code=settings.IATI_VERSION)
        ResultType.objects.get_or_create(
            version=iati_version, code="1", defaults=dict(name="Output"))
        self.username = 'example@akvo.org'
        self.password = 'password'
        self.user = self.create_user(self.username, self.password)
        self.org = self.create_organisation('Akvo')
        self.make_org_admin(self.user, self.org)
        self.project = self.create_project('')
        self.make_partner(self.project, self.org)
        self.c = Client(HTTP_HOST=settings.RSR_DOMAIN)
        self.c.login(username=self.username, password=self.password)
        self.project.update_iati_checks()

    def test_update_project_attributes_runs_iati_checks(self):
        # Given
        success_checks = self.project.iati_checks.filter(status=1).count()
        error_checks = self.project.iati_checks.filter(status=3).count()
        url = '/rest/v1/project/{}/?format=json'.format(self.project.id)
        data = {"title": "DEMONSTRATION!", "date_start_planned": "2009-06-10"}

        # When
        response = self.c.patch(
            url, data=json.dumps(data), follow=True, content_type='application/json')

        # Then
        self.assertEqual(response.status_code, 200)
        self.project.refresh_from_db()
        self.assertTrue(self.project.run_iati_checks)
        # Run the IATI checks manually
        self.project.update_iati_checks()
        new_success_checks = self.project.iati_checks.filter(status=1).count()
        new_error_checks = self.project.iati_checks.filter(status=3).count()
        self.assertEqual(0, success_checks)
        self.assertEqual(2, new_success_checks)
        self.assertEqual(2 + new_error_checks, error_checks)

    def test_create_delete_update_direct_related_object_runs_iati_checks(self):
        # #### Create
        # Given
        success_checks = self.project.iati_checks.filter(status=1).count()
        error_checks = self.project.iati_checks.filter(status=3).count()
        url = '/rest/v1/results_framework_lite/?format=json'
        data = {"type": "1", "indicators": [], "project": self.project.id}

        # When
        response = self.c.post(
            url, data=json.dumps(data), follow=True, content_type='application/json')

        # Then
        self.assertEqual(response.status_code, 201)
        self.project.refresh_from_db()
        self.assertTrue(self.project.run_iati_checks)
        # Run the IATI checks manually
        self.project.update_iati_checks()
        new_success_checks = self.project.iati_checks.filter(status=1).count()
        new_error_checks = self.project.iati_checks.filter(status=3).count()
        self.assertEqual(0, success_checks)
        self.assertEqual(0, new_success_checks)
        self.assertEqual(new_error_checks, 2 + error_checks)
        result_id = response.data['id']

        # #### Update
        # Given
        url = '/rest/v1/results_framework_lite/{}/?format=json'.format(result_id)
        data = {"title": "Demo Result"}

        # When
        response = self.c.patch(
            url, data=json.dumps(data), follow=True, content_type='application/json')

        # Then
        self.assertEqual(response.status_code, 200)
        self.project.refresh_from_db()
        self.assertTrue(self.project.run_iati_checks)
        # Run the IATI checks manually
        self.project.update_iati_checks()
        new_success_checks = self.project.iati_checks.filter(status=1).count()
        new_error_checks = self.project.iati_checks.filter(status=3).count()
        self.assertEqual(0, success_checks)
        self.assertEqual(0, new_success_checks)
        self.assertEqual(new_error_checks, 1 + error_checks)

        # #### Delete
        # Given
        url = '/rest/v1/results_framework_lite/{}/?format=json'.format(result_id)

        # When
        response = self.c.delete(url, follow=True, content_type='application/json')

        # Then
        self.assertEqual(response.status_code, 204)
        self.project.refresh_from_db()
        self.assertTrue(self.project.run_iati_checks)
        # Run the IATI checks manually
        self.project.update_iati_checks()
        new_success_checks = self.project.iati_checks.filter(status=1).count()
        new_error_checks = self.project.iati_checks.filter(status=3).count()
        self.assertEqual(0, success_checks)
        self.assertEqual(0, new_success_checks)
        self.assertEqual(new_error_checks, error_checks)

    def test_create_delete_update_indirect_related_object_runs_iati_checks(self):
        result = Result.objects.create(project=self.project, type='1', title='Result')
        self.project.update_iati_checks()

        # #### Create
        # Given
        success_checks = self.project.iati_checks.filter(status=1).count()
        error_checks = self.project.iati_checks.filter(status=3).count()
        url = '/rest/v1/indicator_framework/?format=json'
        data = {"type": 1, "periods": [], "dimension_names": [], "result": result.id}

        # When
        response = self.c.post(
            url, data=json.dumps(data), follow=True, content_type='application/json')

        # Then
        self.assertEqual(response.status_code, 201)
        self.project.refresh_from_db()
        self.assertTrue(self.project.run_iati_checks)
        # Run the IATI checks manually
        self.project.update_iati_checks()
        new_success_checks = self.project.iati_checks.filter(status=1).count()
        new_error_checks = self.project.iati_checks.filter(status=3).count()
        self.assertEqual(0, success_checks)
        self.assertEqual(0, new_success_checks)
        self.assertEqual(new_error_checks, 1 + error_checks)

        indicator_id = response.data['id']

        # #### Update
        # Given
        url = '/rest/v1/indicator_framework/{}/?format=json'.format(indicator_id)
        data = {"title": "Demo Indicator"}

        # When
        response = self.c.patch(
            url, data=json.dumps(data), follow=True, content_type='application/json')

        # Then
        self.assertEqual(response.status_code, 200)
        self.project.refresh_from_db()
        self.assertTrue(self.project.run_iati_checks)
        # Run the IATI checks manually
        self.project.update_iati_checks()
        new_success_checks = self.project.iati_checks.filter(status=1).count()
        new_error_checks = self.project.iati_checks.filter(status=3).count()
        self.assertEqual(0, success_checks)
        self.assertEqual(0, new_success_checks)
        self.assertEqual(new_error_checks, error_checks)

        # #### Delete
        # Given
        url = '/rest/v1/indicator_framework/{}/?format=json'.format(indicator_id)

        # When
        response = self.c.delete(url, follow=True, content_type='application/json')

        # Then
        self.assertEqual(response.status_code, 204)
        self.project.refresh_from_db()
        self.assertTrue(self.project.run_iati_checks)
        # Run the IATI checks manually
        self.project.update_iati_checks()
        new_success_checks = self.project.iati_checks.filter(status=1).count()
        new_error_checks = self.project.iati_checks.filter(status=3).count()
        self.assertEqual(0, success_checks)
        self.assertEqual(0, new_success_checks)
        self.assertEqual(new_error_checks, error_checks)

    def test_project_change_updates_last_modified(self):
        # When/Then
        self.assertIsNone(self.project.last_modified_by)
        self.test_update_project_attributes_runs_iati_checks()
        self.assertEqual(self.project.last_modified_by['user'], self.user)

    def test_project_direct_related_obj_change_updates_last_modified(self):
        # When/Then
        self.assertIsNone(self.project.last_modified_by)
        self.test_create_delete_update_direct_related_object_runs_iati_checks()
        self.assertEqual(self.project.last_modified_by['user'], self.user)

    def test_project_indirect_related_obj_change_updates_last_modified(self):
        # When/Then
        self.assertIsNone(self.project.last_modified_by)
        self.test_create_delete_update_indirect_related_object_runs_iati_checks()
        self.assertEqual(self.project.last_modified_by['user'], self.user)


class ImportResultTestCase(BaseTestCase):

    def setUp(self):
        super(ImportResultTestCase, self).setUp()
        email = password = 'email@org.com'
        self.create_user(email, password, is_superuser=True)
        self.c.login(username=email, password=password)

    def test_should_import_results(self):
        parent = self.create_project('Parent')
        child = self.create_project('Child')
        self.make_parent(parent, child)
        result = Result.objects.create(project=parent, title='Result')
        url = '/rest/v1/project/{}/import_result/{}/?format=json'.format(child.id, result.id)

        response = self.c.post(url)

        self.assertEqual(201, response.status_code)
        self.assertTrue(response.data['import_success'])
        self.assertEqual(response.data['result_id'], result.child_results.first().id)


class ImportResultsTestCase(BaseTestCase):

    def setUp(self):
        super(ImportResultsTestCase, self).setUp()
        email = password = 'email@org.com'
        self.create_user(email, password, is_superuser=True)
        self.c.login(username=email, password=password)

    def test_should_import_results(self):
        parent = self.create_project('Parent')
        child = self.create_project('Child')
        self.make_parent(parent, child)

        response = self.c.post('/rest/v1/project/{}/import_results/?format=json'.format(child.id))

        self.assertEqual(201, response.status_code)
        self.assertTrue(response.data['import_success'])
        self.assertEqual(response.data['project_id'], str(child.id))
