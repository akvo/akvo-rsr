from datetime import date
from django.core import mail
from django.test import override_settings
from akvo.rsr.tests.base import BaseTestCase
from akvo.rsr.tests.utils import ProjectFixtureBuilder
from akvo.rsr.usecases.period_update_aggregation import aggregate
from akvo.rsr.usecases import audit_project_aggregation as auditor


class AuditPeriodAggregationBaseTestCase(BaseTestCase):
    CONTRIBUTOR_TITLE = 'Contributor project'
    PERIOD_START = date(2020, 1, 1)

    def setUp(self):
        super().setUp()
        self.user = self.create_user('test@akvo.org', 'password', is_admin=True)
        self.project = ProjectFixtureBuilder().with_contributors([{
            'title': self.CONTRIBUTOR_TITLE,
        }]).with_results([{
            'title': 'Result #1',
            'indicators': [{
                'title': 'Indicator #1',
                'periods': [
                    {'period_start': self.PERIOD_START, 'period_end': date(2020, 12, 31)},
                ]
            }]
        }]).build()
        self.contributor = self.project.get_contributor(title=self.CONTRIBUTOR_TITLE)
        self.project_period = self.project.get_period(period_start=self.PERIOD_START)
        self.contrib_period = self.contributor.get_period(period_start=self.PERIOD_START)
        self.contrib_period.add_update(user=self.user, value=1)
        aggregate(self.contrib_period.object)


class AuditPeriodAggregationTestCase(AuditPeriodAggregationBaseTestCase):

    def test_success(self):
        result = auditor.audit_period_aggregation(self.project.periods.first())
        self.assertEqual(2, result.success)
        self.assertEqual(0, result.failure_count)

    def test_failure(self):
        project_period = self.project.periods.first()
        project_period.actual_value = '2'
        project_period.save()

        result = auditor.audit_period_aggregation(self.project.periods.first())
        self.assertEqual(1, result.success)
        self.assertEqual(1, result.failure_count)


class AuditProjectAggregationTestCase(AuditPeriodAggregationBaseTestCase):
    def setUp(self):
        super().setUp()
        mail.outbox = []
        self.recipient = ['admin@akvo.org']

    def test_success(self):
        with override_settings(PROJECT_AGGREGATION_ERROR_RECIPIENTS=self.recipient):
            auditor.audit_project_aggregation(self.project.object)
        self.assertEqual(0, len(mail.outbox))

    def test_failure(self):
        project_period = self.project.periods.first()
        project_period.actual_value = '2'
        project_period.save()

        with override_settings(PROJECT_AGGREGATION_ERROR_RECIPIENTS=self.recipient):
            auditor.audit_project_aggregation(self.project.object)

        self.assertEqual(1, len(mail.outbox))
        msg = mail.outbox[0]
        self.assertEqual(self.recipient, msg.to)
