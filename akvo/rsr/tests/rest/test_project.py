# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

import json

from akvo.rsr.models import Project, Organisation, Partnership, User, Employment

from django.conf import settings
from django.contrib.auth.models import Group
from django.test import TestCase, Client


class RestProjectTestCase(TestCase):
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

        self.c = Client(HTTP_HOST=settings.RSR_DOMAIN)

    def test_rest_project(self):
        """
        Checks the regular REST project endpoint.
        """
        response = self.c.get('/rest/v1/project/', {'format': 'json'})
        self.assertEqual(response.status_code, 200)

        content = json.loads(response.content)
        self.assertEqual(content['count'], 2)

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
