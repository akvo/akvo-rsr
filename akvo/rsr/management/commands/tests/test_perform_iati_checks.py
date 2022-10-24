from unittest.mock import patch

from django.utils.timezone import now
from akvo.iati.iati_validator import IATIValidationResult
from akvo.rsr.management.commands.perform_iati_checks import Command
from akvo.rsr.management.commands.tests.base import BaseCommandTestCase
from akvo.rsr.models import IatiActivityValidationJob, IatiOrganisationValidationJob
from akvo.rsr.usecases.iati_validation import DEFAULT_SCHEDULE_DELAY_TIME, validator

DUMMY_VALIDATION_RESULT = IATIValidationResult(error_count=0, warning_count=0, data={})


@patch.object(validator, 'validate', return_value=DUMMY_VALIDATION_RESULT)
class TestPerformIatiChecks(BaseCommandTestCase[Command]):
    command_class = Command

    def setUp(self):
        super().setUp()
        self.project = self.create_project('Test project')
        self.organisation = self.create_organisation('Test project')

    def test_activity_validation(self, _):
        IatiActivityValidationJob.objects.create(
            project=self.project,
            scheduled_at=now() - DEFAULT_SCHEDULE_DELAY_TIME
        )
        self.run_command()
        self.assertEqual(0, IatiActivityValidationJob.objects.filter(project=self.project, finished_at__isnull=True).count())

    def test_organisation_validation(self, _):
        IatiOrganisationValidationJob.objects.create(
            organisation=self.organisation,
            scheduled_at=now() - DEFAULT_SCHEDULE_DELAY_TIME
        )
        self.run_command()
        self.assertEqual(0, IatiOrganisationValidationJob.objects.filter(organisation=self.organisation, finished_at__isnull=True).count())
