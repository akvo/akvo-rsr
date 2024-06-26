# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from datetime import datetime
import json

from django.conf import settings
from django.contrib.admin.models import LogEntry
from django.contrib.auth.models import Group
from django.test import TestCase, Client
from akvo.iati.exports.utils import make_datetime_aware

from akvo.codelists.store import default_codelists as codelists
from akvo.rsr.factories.external_project import ExternalProjectFactory
from akvo.rsr.models import (
    ExternalProject, Project, Organisation, Partnership, User,
    Employment, ProjectLocation, ProjectEditorValidationSet,
    OrganisationCustomField, ProjectCustomField, Result,
    Sector, IndicatorDimensionValue, Indicator, IndicatorPeriod, IndicatorReference
)
from akvo.rsr.usecases.add_project_to_program import add_new_project_to_program
from akvo.rsr.tests.utils import ProjectFixtureBuilder
from akvo.utils import check_auth_groups
from akvo.rsr.tests.base import BaseTestCase


class RestProjectTestCase(BaseTestCase):
    """Tests the project REST endpoints."""

    def setUp(self):
        """
        For all tests, we at least need two projects in the database. And a client.
        """
        super(RestProjectTestCase, self).setUp()
        self.other_project = self.create_project("REST test project")
        self.project = self.create_project("REST test project 2")
        self.reporting_org = self.create_organisation("Test REST reporting")
        self.user_email = 'foo@bar.com'
        self.user = self.create_user(self.user_email, 'password', is_admin=True)

    def test_rest_projects(self):
        response = self.c.get('/rest/v1/project/', {'format': 'json'})
        self.assertEqual(response.status_code, 200)

        content = json.loads(response.content)
        self.assertEqual(content['count'], 2)

    def test_rest_project(self):
        response = self.c.get('/rest/v1/project/{}/'.format(self.project.pk), {'format': 'json'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['title'], self.project.title)

    def test_rest_patch_project(self):
        """Checks patching the a project."""
        # Given
        self.c.login(username=self.user_email, password='password')
        data = {'date_start_actual': '03-02-2018', 'date_start_planned': '2018-01-01'}

        # When
        response = self.c.patch(
            '/rest/v1/project/{}/?format=json'.format(self.project.id),
            data=json.dumps(data),
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 200)
        content = json.loads(response.content)
        self.assertEqual(
            datetime.strptime(content['date_start_actual'], '%Y-%m-%d'),
            datetime.strptime(data['date_start_actual'], '%d-%m-%Y'),
        )
        self.assertEqual(content['date_start_planned'], data['date_start_planned'])

    def test_iati_id_validation(self):
        """Checks that empty iati_activity_id strings are ignored."""
        # Given
        new_project = self.create_project("Private project")
        new_project.iati_activity_id = ' '
        new_project.save(update_fields=['iati_activity_id'])
        self.c.login(username=self.user_email, password='password')
        data = {'iati_activity_id': ' '}

        # When
        response = self.c.patch(
            '/rest/v1/project/{}/?format=json'.format(self.project.id),
            data=json.dumps(data),
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 200)
        content = json.loads(response.content)
        self.assertIsNone(content['iati_activity_id'])

    def test_rest_project_reporting_org(self):
        """
        Checks the regular REST project endpoint with the 'reporting_org' or 'partnerships'
        parameter.
        """
        org = self.reporting_org
        self.make_partner(self.project, org, Partnership.IATI_REPORTING_ORGANISATION)

        response = self.c.get('/rest/v1/project/', {'format': 'json', 'reporting_org': org.id})
        self.assertEqual(response.status_code, 200)

        self.assertEqual(response.data['count'], 1)

        response = self.c.get('/rest/v1/project/', {'format': 'json', 'partnerships__exact': 1234})
        self.assertEqual(response.status_code, 200)

        content = json.loads(response.content)
        self.assertEqual(content['count'], 0)

    def test_rest_project_iati_export_reporting_org(self):
        """
        Checks the regular REST project endpoint with the reporting org parameter.
        """
        org = self.reporting_org
        self.make_partner(self.project, org, Partnership.IATI_REPORTING_ORGANISATION)

        response = self.c.get('/rest/v1/project_iati_export/', {'format': 'json',
                                                                'reporting_org': org.id})
        self.assertEqual(response.status_code, 200)

        content = json.loads(response.content)
        self.assertEqual(content['count'], 1)

    def test_rest_project_wrong_filter(self):
        """
        Checks the regular REST project endpoint with a non-existing filter.
        """
        self.make_partner(self.project, self.reporting_org, Partnership.IATI_REPORTING_ORGANISATION)

        response = self.c.get('/rest/v1/project_iati_export/', {'format': 'json',
                                                                'wrong__exact': 'parameter'})
        self.assertEqual(response.status_code, 200)

    def test_rest_project_advanced_filters(self):
        """
        Checks the regular REST project endpoint with advanced filters and options.
        """
        # Correct request
        self.project.title = 'water scarcity'
        self.project.currency = 'INR'
        self.project.save(update_fields=['title', 'currency'])
        response = self.c.get('/rest/v1/project/', {'format': 'json',
                                                    'filter': "{'title__icontains':'water'}",
                                                    'exclude': "{'currency':'EUR'}",
                                                    'prefetch_related': "['partners']"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['results'][0]['title'], self.project.title)

        # Correct request (partners)
        org = self.reporting_org
        self.make_partner(self.project, org, Partnership.IATI_REPORTING_ORGANISATION)
        response = self.c.get('/rest/v1/project/',
                              {'format': 'json',
                               'filter': "{{'partners__in':[24, {}]}}".format(org.pk),
                               'prefetch_related': "['partners']"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['results'][0]['title'], self.project.title)

        # Correct request (2 filter conditions)
        self.project.currency = 'EUR'
        self.project.save(update_fields=['currency'])
        response = self.c.get('/rest/v1/project/',
                              {'format': 'json',
                               'filter': "{'title__icontains':'water', 'currency':'EUR'}",
                               'prefetch_related': "['partners']"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['results'][0]['title'], self.project.title)

        # Request with the Q object
        response = self.c.get('/rest/v1/project/', {'format': 'json',
                                                    'q_filter1': "{'title__icontains':'water'}",
                                                    'q_filter2': "{'currency':'EUR'}"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 2)
        self.assertEqual({project['title'] for project in response.data['results']},
                         {self.project.title, self.other_project.title})

        # Incorrect request
        response = self.c.get('/rest/v1/project/', {'format': 'json',
                                                    'filter': "{'blabla__icontains':'water'}",
                                                    'exclude': "{'currency':'EUR'}",
                                                    'prefetch_related': "['partners']"})
        self.assertEqual(response.status_code, 500)

    def test_rest_project_permissions(self):
        """
        Checks the access to projects for a logged in non-superuser. Also for private projects.
        """

        new_project = self.create_project("Private project", public=False)
        self.make_partner(new_project, self.reporting_org, Partnership.IATI_REPORTING_ORGANISATION)
        user = self.create_user("user.rest@test.akvo.org", "password")
        self.make_org_admin(user, self.reporting_org)

        self.c.login(username=user.username, password="password")

        response = self.c.get('/rest/v1/project/', {'format': 'json'})
        self.assertEqual(response.status_code, 200)

        content = json.loads(response.content)
        self.assertEqual(content['count'], 3)


class ProjectPostTestCase(TestCase):
    """Test the creation of projects."""

    def setUp(self):
        # Create necessary groups
        check_auth_groups(settings.REQUIRED_AUTH_GROUPS)
        # Create a validation set
        self.validation = ProjectEditorValidationSet.objects.create(name='test')
        # Create organisation
        self.reporting_org = Organisation.objects.create(
            id=1337,
            name="Test REST reporting",
            long_name="Test REST reporting org",
            new_organisation_type=22,
            can_create_projects=True,
        )
        username = 'username'
        password = 'password'
        group = Group.objects.get(name='Admins')
        self.user = self.create_user(username, password, group, self.reporting_org)
        self.c = Client(HTTP_HOST=settings.RSR_DOMAIN)
        self.c.login(username=username, password=password)

    @staticmethod
    def create_user(username, password, group, organisation, is_admin=False, is_superuser=False):
        user = User.objects.create(username=username,
                                   email=username,
                                   is_active=True)
        user.set_password(password)
        user.is_admin = is_admin
        user.is_superuser = is_superuser
        user.save()
        Employment.objects.create(
            user=user,
            group=group,
            organisation=organisation,
            is_approved=True)
        return user

    def test_project_creation(self):
        # Given
        data = {
            'publishing_status': u'unpublished',
            'title': u'Our amazing project',
            'status': u'N',
            'aggregate_children': True,
            'aggregate_to_parent': True,
            'is_impact_project': True,
            'is_public': True,
            'currency': u'EUR',
            'validations': [self.validation.pk]
        }
        # When
        response = self.c.post(
            '/rest/v1/project/',
            json.dumps(data),
            content_type='application/json'
        )

        # Then
        self.assertEqual(response.status_code, 201)
        project_id = response.data['id']
        project = Project.objects.get(id=project_id)
        self.assertEqual(project.partnerships.count(), 1)
        partnership = project.partnerships.first()
        self.assertEqual(partnership.organisation, self.reporting_org)
        self.assertEqual(
            partnership.iati_organisation_role, Partnership.IATI_REPORTING_ORGANISATION
        )
        for key in data:
            self.assertEqual(data[key], response.data[key])
        self.assertEqual(response.data['primary_organisation'], partnership.organisation.pk)

    def test_reporting_org_set(self):
        # When
        response = self.c.post(
            '/rest/v1/project/',
            json.dumps({'format': 'json', 'validations': [self.validation.pk]}),
            content_type='application/json'
        )

        # Then
        self.assertEqual(response.status_code, 201)
        project_id = response.data['id']
        project = Project.objects.get(id=project_id)
        self.assertEqual(project.partnerships.count(), 1)
        partnership = project.partnerships.first()
        self.assertEqual(partnership.organisation, self.reporting_org)
        self.assertEqual(
            partnership.iati_organisation_role, Partnership.IATI_REPORTING_ORGANISATION
        )

    def test_project_creation_logged(self):
        # When
        response = self.c.post(
            '/rest/v1/project/',
            json.dumps({'format': 'json', 'validations': [self.validation.pk]}),
            content_type='application/json'
        )

        # Then
        log_entry = LogEntry.objects.first()
        self.assertEqual(log_entry.user, self.user)
        self.assertEqual(log_entry.object_id, str(response.data['id']))
        self.assertEqual(log_entry.content_type.name, 'project')

    def test_custom_fields_added(self):
        # Given
        for num in (1, 2):
            OrganisationCustomField.objects.create(
                organisation=self.reporting_org,
                name='Custom Field {}'.format(num),
                order=num,
                max_characters=num,
                section=num,
                help_text='Help Text {}'.format(num),
                type='text',
                mandatory=True,
            )

        # When
        response = self.c.post(
            '/rest/v1/project/',
            json.dumps({'format': 'json', 'validations': [self.validation.pk]}),
            content_type='application/json'
        )

        # Then
        project_id = response.data['id']
        custom_fields = ProjectCustomField.objects.filter(project_id=project_id)
        self.assertEqual(custom_fields.count(), 2)
        self.assertEqual(custom_fields.filter(section=1).count(), 1)
        self.assertEqual(custom_fields.filter(section=2).count(), 1)
        custom_field_1 = custom_fields.filter(section=1).first()
        self.assertEqual(custom_field_1.name, 'Custom Field 1')
        self.assertEqual(custom_field_1.type, 'text')
        self.assertEqual(custom_field_1.order, 1)
        self.assertEqual(custom_field_1.max_characters, 1)
        self.assertTrue(custom_field_1.mandatory)
        self.assertEqual(custom_field_1.help_text, 'Help Text 1')


class ProjectGeoJsonTestCase(BaseTestCase):

    def setUp(self):
        super().setUp()
        self.project = self.create_project('Test Project')
        self.project.current_image = 'foo'  # Set current_image to show project in the directory
        ProjectLocation.objects.create(location_target=self.project, latitude='12', longitude='73')
        ProjectLocation.objects.create(location_target=self.project, latitude='13', longitude='74')

    def test_all_project(self):
        project = self.create_project('Test Project 2')
        project.current_image = 'foo'  # Set current_image to show project in the directory
        ProjectLocation.objects.create(location_target=project, latitude='14', longitude='73')
        ProjectLocation.objects.create(location_target=project, latitude='13', longitude='73')

        response = self.c.get('/rest/v1/project_location_geojson')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(2, len(response.data['features']))
        self.assertEqual(
            {tuple(feature['geometry']['coordinates']) for feature in response.data['features']},
            {(p.primary_location.longitude, p.primary_location.latitude) for p in Project.objects.all()}
        )

    def test_params(self):
        response = self.c.get('/rest/v1/project_location_geojson?fields=activeness,title')
        feature = response.data['features'][0]
        self.assertIn('activeness', feature['properties'])
        self.assertIn('title', feature['properties'])

    def test_no_activeness(self):
        response = self.c.get('/rest/v1/project_location_geojson')
        feature = response.data['features'][0]
        self.assertNotIn('activeness', feature['properties'])


class ProjectsByIdTestCase(BaseTestCase):

    def setUp(self):
        super().setUp()
        self.project1 = self.create_project('Project #1')
        self.project1.current_image = 'foo'
        self.project1.save()
        self.project2 = self.create_project('Project #2')
        self.project2.current_image = 'foo'
        self.project2.save()

    def test_empty_ids(self):
        response = self.c.get('/rest/v1/projects_by_id?format=json')
        data = response.data
        self.assertEqual(0, len(data))

    def test_default_fields(self):
        response = self.c.get(f'/rest/v1/projects_by_id?ids={self.project1.id},{self.project2.id}&format=json')
        data = response.data
        self.assertEqual(2, len(data))
        self.assertEqual(['id', 'title'], [k for k in data[0].keys()])

    def test_fields_param(self):
        project_ids = [str(self.project1.id), str(self.project2.id)]
        fields = ['title', 'subtitle', 'project_plan_summary', 'partners', 'image', 'countries']
        response = self.c.get(f'/rest/v1/projects_by_id?ids={",".join(project_ids)}&fields={",".join(fields)}&format=json')
        data = response.data
        self.assertEqual((['id'] + fields).sort(), [k for k in data[0].keys()].sort())


class ProjectPublishedSearchTestCase(BaseTestCase):

    def setUp(self):
        super().setUp()
        self.org1 = self.create_organisation('Org #1')
        self.org2 = self.create_organisation('Org #2')
        self.project1 = self.create_project('Project One')
        self.project1.current_image = 'foo'
        self.project1.save()
        self.make_partner(self.project1, self.org1)
        self.project2 = self.create_project('Project Two')
        self.project2.current_image = 'foo'
        self.project2.save()
        self.make_partner(self.project2, self.org2)
        self.sector1 = codelists.SECTOR_CATEGORY[1][0]
        self.sector2 = codelists.SECTOR_CATEGORY[2][0]
        vocabulary = codelists.SECTOR_VOCABULARY[2][0]
        Sector.objects.create(project=self.project1, vocabulary=vocabulary, sector_code=self.sector1)
        Sector.objects.create(project=self.project2, vocabulary=vocabulary, sector_code=self.sector2)

    def test_query(self):
        response = self.c.get('/rest/v1/project_published_search?query=one&format=json')
        data = response.data
        self.assertEqual(1, data['total'])
        self.assertEqual(self.project1.id, data['results'][0])

    def test_orgs(self):
        response = self.c.get(f'/rest/v1/project_published_search?query=project&orgs={self.org1.id}&format=json')
        data = response.data
        self.assertEqual(1, data['total'])
        self.assertEqual(self.project1.id, data['results'][0])

    def test_sectors(self):
        response = self.c.get(f'/rest/v1/project_published_search?query=project&sectors={self.sector1}&format=json')
        data = response.data
        self.assertEqual(1, data['total'])
        self.assertEqual(self.project1.id, data['results'][0])


class AddProjectToProgramTestCase(BaseTestCase):

    def setUp(self):
        super(AddProjectToProgramTestCase, self).setUp()
        email = 'foo@bar.com'
        self.user = self.create_user(email, 'password', is_superuser=True)
        self.c.login(username=email, password='password')
        org = self.create_organisation('Organisation')
        program_fixture = ProjectFixtureBuilder()\
            .as_program_of(org)\
            .with_validations([v for v in ProjectEditorValidationSet.objects.all()])\
            .with_disaggregations({
                'Gender': ['Male', 'Female'],
            })\
            .with_default_periods([{
                'period_start': make_datetime_aware(datetime(2010, 1, 1)),
                'period_end': make_datetime_aware(datetime(2010, 12, 31)),
            }])\
            .with_results([
                {
                    'title': 'Result #1',
                    'indicators': [{
                        'title': 'Indicator #1.1',
                        'references': [{'reference': 'test'}],
                        'periods': [{
                            'period_start': make_datetime_aware(datetime(2011, 1, 1)),
                            'period_end': make_datetime_aware(datetime(2011, 12, 31)),
                        }]
                    }]
                },
                {
                    'title': 'Result #2',
                    'indicators': [
                        {'title': 'Indicator #2.1'},
                        {'title': 'Indicator #2.2'}
                    ]
                },
            ])\
            .build()
        self.program = program_fixture.object

    def test_add_project_to_program(self):
        org2 = self.create_organisation('Delegation')
        self.make_employment(self.user, org2, 'Admins')

        data = {
            'parent': self.program.pk
        }
        response = self.c.post('/rest/v1/program/{}/add-project/?format=json'.format(self.program.id), data=data)

        self.assertEqual(response.status_code, 201)
        child_project = Project.objects.get(id=response.data['id'])
        self.assertEqual(child_project.parent(), self.program)
        self.assertEqual(child_project.reporting_org, self.program.reporting_org)
        partnership = child_project.partnerships.get(organisation=org2)
        self.assertIsNotNone(partnership.iati_organisation_role, Partnership.IATI_ACCOUNTABLE_PARTNER)

        self.assertEqual(child_project.validations.count(), self.program.validations.count())

        self.assertEqual(child_project.default_periods.count(), self.program.default_periods.count())
        self.assertEqual(child_project.default_periods.first().parent.project, self.program)

        self.assertEqual(child_project.dimension_names.count(), self.program.dimension_names.count())
        self.assertEqual(child_project.dimension_names.first().parent_dimension_name.project, self.program)
        self.assertEqual(
            IndicatorDimensionValue.objects.filter(name__project=child_project).count(),
            IndicatorDimensionValue.objects.filter(name__project=self.program).count()
        )
        self.assertEqual(
            IndicatorDimensionValue.objects.filter(name__project=child_project).first().parent_dimension_value.name.project,
            self.program
        )

        self.assertEqual(child_project.results.count(), self.program.results.count())
        self.assertEqual(child_project.results.first().parent_result.project, self.program)

        self.assertEqual(
            Indicator.objects.filter(result__project=child_project).count(),
            Indicator.objects.filter(result__project=self.program).count()
        )
        first_child_indicator = Indicator.objects.filter(result__project=child_project).first()
        self.assertEqual(first_child_indicator.parent_indicator.result.project, self.program)
        self.assertEqual(first_child_indicator.dimension_names.count(), first_child_indicator.parent_indicator.dimension_names.count())

        self.assertEqual(
            IndicatorReference.objects.filter(indicator__result__project=child_project).count(),
            IndicatorReference.objects.filter(indicator__result__project=self.program).count()
        )

        self.assertEqual(
            IndicatorPeriod.objects.filter(indicator__result__project=child_project).count(),
            IndicatorPeriod.objects.filter(indicator__result__project=self.program).count()
        )
        self.assertEqual(
            IndicatorPeriod.objects.filter(indicator__result__project=child_project).first().parent_period.indicator.result.project,
            self.program
        )

    def test_add_project_to_sub_program(self):
        org2 = self.create_organisation('Delegation')
        self.make_employment(self.user, org2, 'Admins')
        sub_program = self.create_project('Sub-Program')
        add_new_project_to_program(sub_program, self.program)
        # Add an extra result at the sub program level
        Result.objects.create(project=sub_program)

        data = {
            'parent': sub_program.pk
        }
        response = self.c.post('/rest/v1/program/{}/add-project/?format=json'.format(self.program.id), data=data)

        self.assertEqual(response.status_code, 201)
        child_project = Project.objects.get(id=response.data['id'])
        self.assertEqual(child_project.reporting_org, self.program.reporting_org)
        self.assertEqual(child_project.parent(), sub_program)
        self.assertEqual(child_project.results.count(), sub_program.results.count())
        self.assertEqual(child_project.validations.count(), self.program.validations.count())
        partnership = child_project.partnerships.get(organisation=org2)
        self.assertIsNotNone(partnership.iati_organisation_role, Partnership.IATI_ACCOUNTABLE_PARTNER)


class ExternalProjectTestCase(BaseTestCase):

    def setUp(self):
        super().setUp()
        user_password = 'password'
        user = self.create_user('abc@example.com', user_password, is_superuser=True, is_admin=True)
        self.c.login(username=user.username, password=user_password)
        self.project = self.create_project('A Project')

    def test_get_external_projects(self):
        ext_project_count = 10
        ExternalProjectFactory.create_batch(ext_project_count, related_project=self.project)
        response = self.c.get(
            f"/rest/v1/project/{self.project.id}/external_project/?format=json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), ext_project_count)

    def test_add_external_project(self):
        iati_id = "THIS_IS_AN_IATI_ID"
        response = self.c.post(
            f"/rest/v1/project/{self.project.id}/external_project/?format=json",
            data={
                "iati_id": iati_id
            }
        )
        self.assertEqual(response.status_code, 201)
        self.assertTrue(ExternalProject.objects.filter(iati_id=iati_id).exists())

    def test_add_external_project__fail(self):
        user = self.create_user('no_rights@example.com', "random password")
        self.c.login(username=user.username, password="random password")
        response = self.c.post(f"/rest/v1/project/{self.project.id}/external_project/?format=json")
        self.assertEqual(response.status_code, 403)
        self.assertEqual(ExternalProject.objects.all().count(), 0)

    def test_delete_external_project(self):
        ext_project = ExternalProject.objects.create(
            iati_id="THIS_IS_AN_IATI_ID",
            related_project=self.project,
        )
        response = self.c.delete(
            f"/rest/v1/project/{self.project.id}/external_project/{ext_project.id}/?format=json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertFalse(ExternalProject.objects.filter(id=ext_project.id).exists())

    def test_delete_external_project__no_permissions(self):
        user = self.create_user('no_rights@example.com', "random password")
        self.c.login(username=user.username, password="random password")

        ext_project = ExternalProject.objects.create(
            iati_id="THIS_IS_AN_IATI_ID",
            related_project=self.project,
        )

        response = self.c.delete(
            f"/rest/v1/project/{self.project.id}/external_project/{ext_project.id}/?format=json",
        )
        self.assertEqual(response.status_code, 403)
        self.assertTrue(ExternalProject.objects.filter(id=ext_project.id).exists())

    def test_delete_missing_external_project(self):
        missing_id = 12341234
        response = self.c.delete(
            f"/rest/v1/project/{self.project.id}/external_project/{missing_id}/?format=json",
        )
        self.assertEqual(response.status_code, 404)
        self.assertFalse(ExternalProject.objects.filter(id=missing_id).exists())


class ProjectContributeTestCase(BaseTestCase):

    def setUp(self):
        super().setUp()
        user_password = 'password'
        user = self.create_user('abc@example.com', user_password, is_superuser=True, is_admin=True)
        self.c.login(username=user.username, password=user_password)
        self.project = self.create_project('A Project')
        self.parent_project = self.create_project('Parent Project')

    def test_set_parent_contributing_project(self):
        # Set a pre-existing external parent
        self.project.external_parent_iati_activity_id = "IATI-test-192837475"
        self.project.save()

        response = self.c.patch(
            f"/rest/v1/project/{self.project.id}/?format=json",
            data=json.dumps({
                "contributes_to_project": self.parent_project.id,
            }),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 200)

        self.project.refresh_from_db()
        # external parent should have been removed
        self.assertIsNone(self.project.external_parent_iati_activity_id)
        # internal parent should have been set
        self.assertEqual(self.project.parent().id, self.parent_project.id)

    def test_set_external_parent_contributing_project(self):
        # Set a pre-existing internal parent
        self.project.contributes_to_project = self.parent_project
        self.project.save()

        external_id = "IATI-PROJECT-12345"
        response = self.c.patch(
            f"/rest/v1/project/{self.project.id}/?format=json",
            data=json.dumps({
                "external_parent_iati_activity_id": external_id,
            }),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 200)

        self.project.refresh_from_db()
        # internal parent should've been removed
        self.assertIsNone(self.project.contributes_to_project)
        # external parent should've been set
        self.assertEqual(self.project.external_parent_iati_activity_id, external_id)


class TargetsAtAtributeTestCase(BaseTestCase):

    def test_default_targets_at_value(self):
        project = self.create_project('A Project')
        response = self.c.get('/rest/v1/project/{}/?format=json'.format(project.id))
        self.assertEqual('period', response.data['targets_at'])

    def test_patch_targets_at(self):
        project = self.create_project('A Project')
        self.create_user('test@akvo.org', 'password', is_admin=True)

        self.c.login(username='test@akvo.org', password='password')
        self.c.patch(
            '/rest/v1/project/{}/?format=json'.format(project.id),
            data=json.dumps({'targets_at': 'indicator'}),
            content_type='application/json')

        project.refresh_from_db()
        self.assertEqual(project.targets_at, 'indicator')

    def test_contributor_targets_at_inherit_from_program(self):
        program = self.create_program('Program')
        contributor = self.create_contributor('Contributor', program)
        self.create_user('test@akvo.org', 'password', is_admin=True)

        program.targets_at = 'indicator'
        program.save()

        self.c.login(username='test@akvo.org', password='password')
        response = self.c.get('/rest/v1/project/{}/?format=json'.format(contributor.id))

        self.assertEqual(response.data['targets_at'], 'indicator')
