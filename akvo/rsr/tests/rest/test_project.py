# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

import datetime
import json
import os

from django.conf import settings
from django.contrib.admin.models import LogEntry
from django.contrib.auth.models import Group
from django.core.cache import cache
from django.test import TestCase, Client

from akvo.rsr.models import (Project, Organisation, Partnership, User,
                             Employment, Keyword, PartnerSite,
                             PublishingStatus, ProjectLocation,
                             RecipientCountry, ProjectEditorValidationSet,
                             OrganisationCustomField, ProjectCustomField)
from akvo.rsr.models.user_projects import restrict_projects
from akvo.rsr.tests.test_project_access import RestrictedUserProjects
from akvo.utils import check_auth_groups, custom_get_or_create_country
from akvo.rsr.tests.base import BaseTestCase


class RestProjectTestCase(BaseTestCase):
    """Tests the project REST endpoints."""

    def setUp(self):
        """
        For all tests, we at least need two projects in the database. And a client.
        """
        project = Project.objects.create(
            title="REST test project",
        )
        project.publish()
        self.project = Project.objects.create(
            title="REST test project 2",
        )
        self.project.publish()

        # Create organisation
        self.reporting_org = Organisation.objects.create(
            id=1337,
            name="Test REST reporting",
            long_name="Test REST reporting org",
            new_organisation_type=22
        )
        self.user_email = 'foo@bar.com'
        self.user = self.create_user(self.user_email, 'password', is_admin=True)
        super(RestProjectTestCase, self).setUp()

    def test_rest_project(self):
        """
        Checks the regular REST project endpoint.
        """
        response = self.c.get('/rest/v1/project/', {'format': 'json'})
        self.assertEqual(response.status_code, 200)

        content = json.loads(response.content)
        self.assertEqual(content['count'], 2)

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
            datetime.datetime.strptime(content['date_start_actual'], '%Y-%m-%d'),
            datetime.datetime.strptime(data['date_start_actual'], '%d-%m-%Y'),
        )
        self.assertEqual(content['date_start_planned'], data['date_start_planned'])

    def test_rest_project_reporting_org(self):
        """
        Checks the regular REST project endpoint with the 'reporting_org' or 'partnerships'
        parameter.
        """
        Partnership.objects.create(
            project=self.project,
            organisation=self.reporting_org,
            iati_organisation_role=Partnership.IATI_REPORTING_ORGANISATION,
        )

        response = self.c.get('/rest/v1/project/', {'format': 'json', 'reporting_org': 1337})
        self.assertEqual(response.status_code, 200)

        content = json.loads(response.content)
        self.assertEqual(content['count'], 1)

        response = self.c.get('/rest/v1/project/', {'format': 'json', 'partnerships__exact': 1234})
        self.assertEqual(response.status_code, 200)

        content = json.loads(response.content)
        self.assertEqual(content['count'], 0)

    def test_rest_project_iati_export_reporting_org(self):
        """
        Checks the regular REST project endpoint with the reporting org parameter.
        """
        Partnership.objects.create(
            project=self.project,
            organisation=self.reporting_org,
            iati_organisation_role=Partnership.IATI_REPORTING_ORGANISATION,
        )

        response = self.c.get('/rest/v1/project_iati_export/', {'format': 'json',
                                                                'reporting_org': 1337})
        self.assertEqual(response.status_code, 200)

        content = json.loads(response.content)
        self.assertEqual(content['count'], 1)

    def test_rest_project_wrong_filter(self):
        """
        Checks the regular REST project endpoint with a non-existing filter.
        """
        Partnership.objects.create(
            project=self.project,
            organisation=self.reporting_org,
            iati_organisation_role=Partnership.IATI_REPORTING_ORGANISATION,
        )

        response = self.c.get('/rest/v1/project_iati_export/', {'format': 'json',
                                                                'wrong__exact': 'parameter'})
        self.assertEqual(response.status_code, 200)

    def test_rest_project_advanced_filters(self):
        """
        Checks the regular REST project endpoint with advanced filters and options.
        """
        # Correct request
        response = self.c.get('/rest/v1/project/', {'format': 'json',
                                                    'filter': "{'title__icontains':'water'}",
                                                    'exclude': "{'currency':'EUR'}",
                                                    'prefetch_related': "['partners']"})
        self.assertEqual(response.status_code, 200)

        # Incorrect request
        response = self.c.get('/rest/v1/project/', {'format': 'json',
                                                    'filter': "{'blabla__icontains':'water'}",
                                                    'exclude': "{'currency':'EUR'}",
                                                    'prefetch_related': "['partners']"})
        self.assertEqual(response.status_code, 500)

        # Request with the Q object
        response = self.c.get('/rest/v1/project/', {'format': 'json',
                                                    'q_filter1': "{'title__icontains':'water'}",
                                                    'q_filter2': "{'currency':'EUR'}"})
        self.assertEqual(response.status_code, 200)

    def test_rest_project_permissions(self):
        """
        Checks the access to projects for a logged in non-superuser. Also for private projects.
        """
        # Create necessary groups
        for group in settings.REQUIRED_AUTH_GROUPS:
            Group.objects.get_or_create(name=group)
        admin_group, _created = Group.objects.get_or_create(name="Admins")

        # Create project
        new_project = Project.objects.create(
            title="Private project",
            is_public=False,
        )

        # Create partnership
        Partnership.objects.create(
            project=new_project,
            organisation=self.reporting_org,
            iati_organisation_role=Partnership.IATI_REPORTING_ORGANISATION,
        )

        # Create active user
        user = User.objects.create_user(
            username="Normal user REST",
            email="user.rest@test.akvo.org",
            password="password",
        )
        user.is_active = True
        user.save()

        # Create employment
        Employment.objects.create(
            user=user,
            organisation=self.reporting_org,
            group=admin_group,
            is_approved=True,
        )

        self.c.login(username=user.username, password="password")

        response = self.c.get('/rest/v1/project/', {'format': 'json'})
        self.assertEqual(response.status_code, 200)

        content = json.loads(response.content)
        self.assertEqual(content['count'], 3)


class ProjectDirectoryTestCase(TestCase):

    def setUp(self):
        super(ProjectDirectoryTestCase, self).setUp()
        self.organisation = self._create_organisation('Akvo')
        self.partner_site = PartnerSite.objects.create(
            organisation=self.organisation,
            piwik_id=1,
            hostname='akvo'
        )

        self.image = os.path.join(settings.MEDIA_ROOT, 'test-image.png')
        with open(self.image, 'w+b'):
            pass

        self.projects = []
        for i in range(1, 6):
            project = Project.objects.create(title='Project - {}'.format(i),
                                             current_image=self.image)
            self.projects.append(project)
            if i < 4:
                publishing_status = project.publishingstatus
                publishing_status.status = PublishingStatus.STATUS_PUBLISHED
                publishing_status.save()

            # Add a partnership for a couple of projects
            if i in {1, 4}:
                Partnership.objects.create(
                    organisation=self.organisation,
                    project=project,
                    iati_organisation_role=Partnership.IATI_REPORTING_ORGANISATION
                )

        # Additional organisation for typeahead/organisations end-point
        self._create_organisation('UNICEF')

    def tearDown(self):
        os.remove(self.image)
        cache.clear()

    def _create_client(self, host=None):
        """ Create and return a client with the given host."""
        if not host:
            host = settings.RSR_DOMAIN
        return Client(HTTP_HOST=host)

    def _create_organisation(self, name):
        long_name = '{} organisation'.format(name)
        return Organisation.objects.create(name=name, long_name=long_name)

    def test_should_show_keyword_projects_in_partner_site(self):
        # Given
        hostname = 'akvo'
        host = '{}.{}'.format(hostname, settings.AKVOAPP_DOMAIN)
        partner_projects = False
        keyword = Keyword.objects.create(label=hostname)
        self.partner_site.partner_projects = partner_projects
        self.partner_site.save()
        self.partner_site.keywords.add(keyword)
        project_title = '{} awesome project'.format(hostname)
        project = Project.objects.create(title=project_title, current_image=self.image)
        project.keywords.add(keyword)
        project.publish()

        url = '/rest/v1/project_directory?format=json'
        client = self._create_client(host)

        # When
        response = client.get(url, follow=True)

        # Then
        self.assertEqual(len(response.data['projects']), 1)
        self.assertEqual(project_title, response.data['projects'][0]['title'])

    def test_should_show_all_partner_projects(self):
        # Given
        hostname = 'akvo'
        host = '{}.{}'.format(hostname, settings.AKVOAPP_DOMAIN)
        url = '/rest/v1/project_directory?format=json'
        client = self._create_client(host)

        # When
        response = client.get(url, follow=True)

        # Then
        self.assertEqual(len(response.data['projects']), 1)
        self.assertIn('Project - 1', response.data['projects'][0]['title'])

    def test_should_show_all_country_projects(self):
        # Given
        titles = ['Project - {}'.format(i) for i in range(0, 6)]
        url = '/rest/v1/project_directory?format=json&location=262'
        latitude, longitude = ('11.8948112', '42.5807153')
        country_code = 'DJ'
        custom_get_or_create_country(iso_code=country_code.lower())

        # Add a Recipient Country - DJ
        RecipientCountry.objects.create(project=self.projects[2], country=country_code)
        # Published project - ProjectLocation in DJ
        project_location = ProjectLocation.objects.create(location_target=self.projects[1],
                                                          latitude=latitude,
                                                          longitude=longitude)
        # Unpublished project
        ProjectLocation.objects.create(location_target=self.projects[3],
                                       latitude=latitude,
                                       longitude=longitude)

        # ProjectLocation with no country
        ProjectLocation.objects.create(location_target=self.projects[0],
                                       latitude=None,
                                       longitude=None)
        client = self._create_client()

        # When
        response = client.get(url, follow=True)

        # Then
        projects = response.data['projects']
        self.assertEqual(len(projects), 2)
        response_titles = {project['title'] for project in projects}
        self.assertIn(titles[2], response_titles)
        self.assertIn(titles[3], response_titles)
        self.assertEqual(project_location.country.iso_code, country_code.lower())

    def test_filter_by_custom_fields(self):
        # Setup
        process_custom_fields = (('Process', 'design'), ('Process', 'production'), ('Process', 'use'))
        type_custom_fields = (('Type', 'industrial'), ('Type', 'domestic'))

        process = OrganisationCustomField.objects.create(
            section='1', order='1', name='Process', organisation=self.organisation)
        type_ = OrganisationCustomField.objects.create(
            section='1', order='1', name='Type', organisation=self.organisation)

        for i, project in enumerate(self.projects):
            project.publish()
            name, value = process_custom_fields[i % 3]
            ProjectCustomField.objects.create(
                section='1', order='1', name=name, value=value, project=project)
            name, value = type_custom_fields[i % 2]
            ProjectCustomField.objects.create(
                section='1', order='2', name=name, value=value, project=project)
        client = self._create_client()

        # Single projects with single custom field
        # Given
        url = '/rest/v1/project_directory?format=json&custom_field__{}=use'.format(process.id)

        # When
        response = client.get(url, follow=True)

        # Then
        projects = response.data['projects']
        self.assertEqual(len(projects), 1)
        self.assertEqual(projects[0]['id'], self.projects[2].pk)

        # Multiple projects with single custom field
        # Given
        url = '/rest/v1/project_directory?format=json&custom_field__{}=production'.format(process.id)

        # When
        response = client.get(url, follow=True)

        # Then
        projects = sorted(response.data['projects'], key=lambda x: x['id'])
        self.assertEqual(len(projects), 2)
        self.assertEqual(projects[0]['id'], self.projects[1].pk)
        self.assertEqual(projects[1]['id'], self.projects[4].pk)

        # Single projects with multiple custom fields
        # Given
        url = ('/rest/v1/project_directory?format=json'
               '&custom_field__{0}=production'
               '&custom_field__{1}=domestic'.format(process.id, type_.id))

        # When
        response = client.get(url, follow=True)

        # Then
        projects = response.data['projects']
        self.assertEqual(len(projects), 1)
        self.assertEqual(projects[0]['id'], self.projects[1].pk)

        # No projects with multiple custom fields
        # Given
        url = ('/rest/v1/project_directory?format=json'
               '&custom_field__{0}=use'
               '&custom_field__{1}=domestic'.format(process.id, type_.id))

        # When
        response = client.get(url, follow=True)

        # Then
        projects = response.data['projects']
        self.assertEqual(len(projects), 0)


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


class RestrictionsSetupOnProjectCreation(RestrictedUserProjects):

    def setUp(self):
        """
        User M      User N      User O
        Admin       Admin       User
           \            \      /
            \            \    /
              Org A       Org B
            /      \      /    \
           /        \    /      \
        Project X   Project Y   Project Z
        """

        self.tearDown()

        super(RestrictionsSetupOnProjectCreation, self).setUp()

        self.c = Client(HTTP_HOST=settings.RSR_DOMAIN)

        self.password_m = 'password_m'
        self.user_m.set_password(self.password_m)
        self.user_m.save()

        self.password_n = 'password_n'
        self.user_n.set_password(self.password_n)
        self.user_n.save()
        self.user_n.employers.filter(organisation=self.org_a).delete()

    def tearDown(self):
        Project.objects.all().delete()
        User.objects.all().delete()
        Organisation.objects.all().delete()
        Group.objects.all().delete()

    def test_access_for_unrestricted_user_of_new_project(self):
        # When
        self.c.login(username=self.user_n.username, password=self.password_n)
        self.validation = ProjectEditorValidationSet.objects.create(name='test')

        response = self.c.post(
            '/rest/v1/project/',
            json.dumps({'format': 'json', 'validations': [self.validation.pk]}),
            content_type='application/json'
        )

        # Then
        project_id = response.data['id']
        my_projects_list = self.user_o.my_projects().values_list('id', flat=True)
        self.assertTrue(project_id in my_projects_list)

    def test_access_for_restricted_user_of_new_project(self):
        # When
        self.c.login(username=self.user_n.username, password=self.password_n)
        self.validation = ProjectEditorValidationSet.objects.create(name='test')

        restrict_projects(self.user_n, self.user_o, [self.projects['Y']])
        response = self.c.post(
            '/rest/v1/project/',
            json.dumps({'format': 'json', 'validations': [self.validation.pk]}),
            content_type='application/json'
        )

        # Then
        project_id = response.data['id']
        my_projects_list = self.user_o.my_projects().values_list('id', flat=True)
        self.assertTrue(project_id in my_projects_list)

    def test_access_for_unrestricted_user_of_new_project_by_other_orgs_admin(self):
        # When
        self.c.login(username=self.user_m.username, password=self.password_m)
        self.validation = ProjectEditorValidationSet.objects.create(name='test')

        response = self.c.post(
            '/rest/v1/project/',
            json.dumps({'format': 'json', 'validations': [self.validation.pk]}),
            content_type='application/json'
        )

        # Then
        project_id = response.data['id']
        my_projects_list = self.user_o.my_projects().values_list('id', flat=True)
        self.assertFalse(project_id in my_projects_list)

    def test_access_for_restricted_user_of_new_project_by_other_orgs_admin(self):
        # When
        self.c.login(username=self.user_m.username, password=self.password_m)
        self.validation = ProjectEditorValidationSet.objects.create(name='test')

        restrict_projects(self.user_n, self.user_o, [self.projects['Y']])
        response = self.c.post(
            '/rest/v1/project/',
            json.dumps({'format': 'json', 'validations': [self.validation.pk]}),
            content_type='application/json'
        )

        # Then
        project_id = response.data['id']
        my_projects_list = self.user_o.my_projects().values_list('id', flat=True)
        self.assertFalse(project_id in my_projects_list)
