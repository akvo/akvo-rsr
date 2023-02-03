# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""
from unittest.mock import ANY

from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_403_FORBIDDEN

from akvo.rsr.models import IndicatorPeriodAggregationJob
from akvo.rsr.permissions import GROUP_NAME_ME_MANAGERS
from akvo.rsr.tests.base import BaseTestCase
from akvo.rsr.tests.usecases.jobs.test_aggregation import AggregationJobBaseTests
from akvo.rsr.usecases.jobs.aggregation import schedule_aggregation_job


class AnonymousUserTestCase(BaseTestCase):

    def test_anonymous_user(self):
        """Shouldn't be able to access any resources even if the project is public"""
        response = self.c.get("/rest/v1/jobs/indicator_period_aggregation/?format=json")
        self.assertEqual(response.status_code, HTTP_403_FORBIDDEN)


class EndpointTestCase(AggregationJobBaseTests):
    """Tests accessing indicator period aggregation job REST endpoints"""

    def setUp(self):
        super().setUp()

        #  Create private child project in the default org
        self.private_user = self.create_user("private@akvo.org", "password", is_superuser=False)
        self.private_project = self.create_project("Super private project", public=False)
        self.make_parent(self.project, self.private_project)
        self.private_project.set_reporting_org(self.org)
        self.private_project.import_results()
        self.make_employment(self.private_user, self.org, GROUP_NAME_ME_MANAGERS)

        self.private_result = self.result.child_results.first()
        self.private_indicator = self.indicator.child_indicators.first()
        self.private_period = self.period.child_periods.first()
        self.private_job = schedule_aggregation_job(self.private_period)[0]

        # Create private project in another org
        self.other_private_user = self.create_user("other_private@akvo.org", "password", is_superuser=False)
        self.other_private_project, self.other_private_org = self._make_project("Private", public=False)
        self.make_employment(self.other_private_user, self.other_private_org, GROUP_NAME_ME_MANAGERS)

        self.other_private_result, self.other_private_indicator, self.other_private_period = \
            self._make_results_framework(self.other_private_project)
        self.other_private_job = schedule_aggregation_job(self.other_private_period)[0]

    def test_super_user(self):
        """Super users should be able to access all jobs"""
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
        self.assertEqual(data.get("count"), len(expected_job_id_set))
        self.assertEqual({result["id"] for result in data["results"]}, expected_job_id_set)

    def test_filter_by_root_period(self):
        """Ensure that the jobs of the child periods are returned"""
        self.c.login(username=self.user.username, password="password")
        response = self.c.get("/rest/v1/jobs/indicator_period_aggregation/?format=json&filter={'root_period_id':%s}" % (
            self.period.id
        ))

        self.assertEqual(response.status_code, HTTP_200_OK)

        data = response.json()
        self.assertEqual(data["count"], 2)

        self.assertEqual({result["id"] for result in data["results"]}, {self.job.id, self.private_job.id})

    def test_filter_by_status(self):
        """Ensure filtering by status works"""
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
        """Ensure the detail view works as expected"""
        self.c.login(username=self.user.username, password="password")
        response = self.c.get(f"/rest/v1/jobs/indicator_period_aggregation/{self.private_job.id}/?format=json")

        self.assertEqual(response.status_code, HTTP_200_OK)

        data = response.json()
        self.assertEqual(data["id"], self.private_job.id)

    def test_reschedule(self):
        """Ensure rescheduling creates a new job and leaves the old one intact"""

        self.c.login(username=self.user.username, password="password")
        self.private_job.mark_maxxed()

        response = self.c.post(
            f"/rest/v1/jobs/indicator_period_aggregation/{self.private_job.id}/reschedule/?format=json"
        )

        self.assertEqual(response.status_code, HTTP_200_OK)

        data = response.json()
        self.assertNotEqual(data[0]["id"], self.private_job.id)

        self.assertEqual(
            IndicatorPeriodAggregationJob.objects.filter(period=self.private_period).count(),
            2
        )

    def test_reschedule_unmaxxed_job(self):
        """Attempting to reschedule a job in the wrong status shouldn't be allowed"""

        self.c.login(username=self.user.username, password="password")

        response = self.c.post(
            f"/rest/v1/jobs/indicator_period_aggregation/{self.private_job.id}/reschedule/?format=json"
        )

        self.assertEqual((response.status_code, response.content), (HTTP_400_BAD_REQUEST, ANY))

    def test_reschedule_private_from_other_user(self):
        """Attempting a reschedule of a private job from a user of another org should fail"""

        self.c.login(username=self.other_private_user.username, password="password")
        self.private_job.mark_maxxed()

        response = self.c.post(
            f"/rest/v1/jobs/indicator_period_aggregation/{self.private_job.id}/reschedule/?format=json"
        )

        self.assertEqual(response.status_code, HTTP_403_FORBIDDEN)

    def test_reschedule_public_from_other_user(self):
        """Attempting a reschedule of a public job from a user of another org should fail"""

        self.c.login(username=self.other_private_user.username, password="password")
        self.job.mark_maxxed()

        response = self.c.post(
            f"/rest/v1/jobs/indicator_period_aggregation/{self.job.id}/reschedule/?format=json"
        )

        self.assertEqual(response.status_code, HTTP_403_FORBIDDEN)
