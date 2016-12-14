# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

import json

from akvo.rsr.models import (
    AdministrativeLocation, Employment, Organisation, Partnership, Project,
    ProjectLocation, User
)
from akvo.utils import check_auth_groups

from django.conf import settings
from django.contrib.auth.models import Group
from django.test import TestCase, Client


class AdministrativeLocationTestCase(TestCase):
    """Tests the administrative location REST endpoints."""

    def setUp(self):
        """Setup the database as required."""

        # Create user auth groups
        check_auth_groups(settings.REQUIRED_AUTH_GROUPS)

        self.project = Project.objects.create(
            title="REST test project",
        )

        # Create organisation
        self.reporting_org = Organisation.objects.create(
            id=1337,
            name="Test REST reporting",
            long_name="Test REST reporting org",
            new_organisation_type=22
        )

        Partnership.objects.create(
            project=self.project,
            organisation=self.reporting_org,
            iati_organisation_role=Partnership.IATI_REPORTING_ORGANISATION,
        )

        location = ProjectLocation.objects.create(location_target=self.project)
        self.admin_location = AdministrativeLocation.objects.create(location=location)

        self.username = 'test@example.com'
        self.password = 'password'
        self.user = User.objects.create(
            username=self.username,
            email=self.username,
            is_active=True
        )
        self.user.set_password(self.password)
        self.user.save()
        Employment.objects.create(
            user=self.user,
            organisation=self.reporting_org,
            group=Group.objects.get(name='Admins'),
            is_approved=True
        )

        self.c = Client(HTTP_HOST=settings.RSR_DOMAIN)

    def test_delete_administrative_location(self):
        """Checks that org admin can delete an administrative location."""

        # Given
        assert self.c.login(username=self.user.username, password=self.password)

        # When
        response = self.c.delete(
            '/rest/v1/administrative_location/{}/'.format(self.admin_location.id),
            {'format': 'json'}
        )

        # Then
        self.assertEqual(response.status_code, 200)
