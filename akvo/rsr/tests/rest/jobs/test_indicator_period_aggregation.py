# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""
from unittest.mock import ANY

from rest_framework.status import HTTP_200_OK, HTTP_403_FORBIDDEN

from akvo.rsr.models import IndicatorPeriodAggregationJob
from akvo.rsr.permissions import GROUP_NAME_ME_MANAGERS
from akvo.rsr.tests.base import BaseTestCase
from akvo.rsr.tests.usecases.jobs.test_aggregation import AggregationJobBaseTests


class AnonymousUserTestCase(BaseTestCase):

    def test_anonymous_user(self):
        """Shouldn't be able to access any resources even if the project is public"""
        response = self.c.get("/rest/v1/jobs/indicator_period_aggregation/?format=json")
        self.assertEqual(response.status_code, HTTP_403_FORBIDDEN)


class EndpointTestCase(AggregationJobBaseTests):
    """Tests accessing indicator period aggregation job REST endpoints"""

    def setUp(self):
        super().setUp()

        #  Create private project in the default org
        self.private_user = self.create_user("private@akvo.org", "password", is_superuser=False)
        self.private_project = self.create_project("Super private project", public=False)
        self.private_project.set_reporting_org(self.org)
        self.make_employment(self.private_user, self.org, GROUP_NAME_ME_MANAGERS)

        self.private_result, self.private_indicator, self.private_period = \
            self._make_results_framework(self.private_project)
        self.private_job = IndicatorPeriodAggregationJob.objects.create(
            period=self.private_period, program=self.private_project
        )

        # Create private project in another org
        self.other_private_user = self.create_user("other_private@akvo.org", "password", is_superuser=False)
        self.other_private_project, self.other_private_org = self._make_project("Private", public=False)
        self.make_employment(self.other_private_user, self.other_private_org, GROUP_NAME_ME_MANAGERS)

        self.other_private_result, self.other_private_indicator, self.other_private_period = \
            self._make_results_framework(self.other_private_project)
        self.other_private_job = IndicatorPeriodAggregationJob.objects.create(
            period=self.other_private_period, program=self.other_private_project
        )

    def test_super_user(self):
        """Super users be able to access all jobs"""
        self.c.login(username=self.user.username, password="password")
        response = self.c.get("/rest/v1/jobs/indicator_period_aggregation/?format=json")
        self.assertEqual(response.status_code, HTTP_200_OK)

        data = response.json()
        self.assertEqual(data.get("count"), 3)

        results = data.get("results")
        self.assertEqual(
            {result["id"] for result in results},
            {self.job.id, self.private_job.id, self.other_private_job.id},
        )

    def test_private_user(self):
        """Test a private user accessing jobs from the default org"""
        self.c.login(username=self.private_user.username, password="password")
        self._test_private_user_access({self.job.id, self.private_job.id})

    def test_other_private_user(self):
        """Test a private user accessing jobs from the private org"""
        self.c.login(username=self.other_private_user.username, password="password")
        self._test_private_user_access({self.job.id, self.other_private_job.id})

    def _test_private_user_access(self, expected_job_id_set):
        """
        Private users should only be able to access jobs of their private projects and that of public ones
        """
        response = self.c.get("/rest/v1/jobs/indicator_period_aggregation/?format=json")
        self.assertEqual(response.status_code, HTTP_200_OK)
        data = response.json()
        self.assertEqual(data.get("count"), 2)
        self.assertEqual({result["id"] for result in data["results"]}, expected_job_id_set)

    def test_filter_by_program(self):
        self.c.login(username=self.user.username, password="password")
        response = self.c.get("/rest/v1/jobs/indicator_period_aggregation/?format=json&filter={'program_id':%s}" % (
            self.project.id
        ))

        self.assertEqual(response.status_code, HTTP_200_OK)

        data = response.json()
        self.assertEqual(data["count"], 1)

        self.assertEqual(data["results"][0]["id"], self.job.id)

    def test_filter_by_status(self):
        self.job.status = IndicatorPeriodAggregationJob.Status.FINISHED
        self.job.save()

        self.c.login(username=self.user.username, password="password")
        response = self.c.get("/rest/v1/jobs/indicator_period_aggregation/?format=json&filter={'status':'%s'}" % (
            self.job.status.FINISHED
        ))
        self.assertEqual((response.status_code, response.json()), (HTTP_200_OK, ANY))

        data = response.json()
        self.assertEqual(data["count"], 1)

        self.assertEqual(data["results"][0]["id"], self.job.id)

    def test_get_by_id(self):
        self.c.login(username=self.user.username, password="password")
        response = self.c.get(f"/rest/v1/jobs/indicator_period_aggregation/{self.private_job.id}/?format=json")

        self.assertEqual(response.status_code, HTTP_200_OK)

        data = response.json()
        self.assertEqual(data["id"], self.private_job.id)
