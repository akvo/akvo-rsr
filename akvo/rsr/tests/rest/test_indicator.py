# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

import json

from django.conf import settings
from django.contrib.auth.models import Group
from django.test import TestCase, Client

from akvo.rsr.models import Project, Organisation, Partnership, User, Employment, Result, Indicator, IndicatorPeriod
from akvo.utils import check_auth_groups


class RestIndicatorTestCase(TestCase):
    """Tests the indicator REST endpoints."""

    def setUp(self):
        """ Setup a minimal DB for the tests. """

        self.project = Project.objects.create(
            title="REST test project",
        )

        # Create groups
        check_auth_groups(settings.REQUIRED_AUTH_GROUPS)

        # Create organisation
        self.reporting_org = Organisation.objects.create(
            id=1337,
            name="Test REST reporting",
            long_name="Test REST reporting org",
            new_organisation_type=22
        )

        # Create partnership
        self.partnership = Partnership.objects.create(
            project=self.project,
            organisation=self.reporting_org,
            iati_organisation_role=Partnership.IATI_REPORTING_ORGANISATION,
        )

        # Create active user
        self.user = User.objects.create_user(
            username="Normal user REST",
            email="user.rest@test.akvo.org",
            password="password",
        )
        self.user.is_active = True
        self.user.is_admin = True
        self.user.is_superuser = True
        self.user.save()

        # Create employment
        self.employment = Employment.objects.create(
            user=self.user,
            organisation=self.reporting_org,
            is_approved=True,
        )

        self.c = Client(HTTP_HOST=settings.RSR_DOMAIN)

    def tearDown(self):
        Project.objects.all().delete()
        User.objects.all().delete()
        Organisation.objects.all().delete()
        Group.objects.all().delete()

    def test_rest_indicator_pagination(self):
        """Test that paginating the indicator results works."""

        # Given
        n_results = 5
        n_indicators = 5
        n_periods = 6
        total = n_results * n_indicators * n_periods
        for _ in range(n_results):
            result = Result.objects.create(project=self.project)
            for _ in range(n_indicators):
                indicator = Indicator.objects.create(result=result)
                for _ in range(n_periods):
                    IndicatorPeriod.objects.create(indicator=indicator)

        self.c.login(username=self.user.username, password="password")

        indicator_periods = self.get_indicator_periods(self.project.id)
        self.assertEqual(len(indicator_periods), total)
        for indicator_id in Indicator.objects.values_list('id', flat=True):
            periods = filter(lambda x: x['indicator'] == indicator_id, indicator_periods)
            self.assertEqual(len(periods), n_periods)

    def get_indicator_periods(self, project_id):
        periods = []
        next_url = '/rest/v1/indicator_period/?format=json&indicator__result__project={}&limit=50'.format(project_id)
        while next_url:
            response = self.c.get(next_url)
            data = json.loads(response.content)
            periods += data['results']
            next_url = data['next']
        return periods
