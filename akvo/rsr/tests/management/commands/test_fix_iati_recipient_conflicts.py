# -*- coding: utf-8 -*-

"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

import datetime
from io import StringIO
from django.core.management import call_command

from unittest.mock import patch

from akvo.rsr.tests.base import BaseTestCase
from akvo.rsr.models import RecipientCountry, RecipientRegion, Transaction, IatiCheck


class FixIatiRecipientConflictsTestCase(BaseTestCase):

    def call_command(self, *args, **kwargs):
        """Helper to call command and capture output."""
        out = StringIO()
        kwargs['stdout'] = out
        call_command('fix_iati_recipient_conflicts', *args, **kwargs)
        return out.getvalue()

    def test_identify_conflicted_project_with_country(self):
        """Test that command identifies project with countries at both levels."""
        project = self.create_project("Test project")
        RecipientCountry.objects.create(project=project, country="NL", percentage=100)
        Transaction.objects.create(
            project=project,
            transaction_type="1",
            transaction_date=datetime.date.today(),
            value=1000,
            value_date=datetime.date.today(),
            recipient_country="KE"
        )

        output = self.call_command(verbosity=1)

        self.assertIn('Found 1 project(s) with conflicts', output)
        self.assertIn(str(project.id), output)

    def test_identify_conflicted_project_with_region(self):
        """Test that command identifies project with regions at both levels."""
        project = self.create_project("Test project")
        RecipientRegion.objects.create(project=project, region="89", percentage=100)
        Transaction.objects.create(
            project=project,
            transaction_type="1",
            transaction_date=datetime.date.today(),
            value=1000,
            value_date=datetime.date.today(),
            recipient_region="298"
        )

        output = self.call_command(verbosity=1)

        self.assertIn('Found 1 project(s) with conflicts', output)
        self.assertIn(str(project.id), output)

    def test_ignore_project_with_only_project_level_recipients(self):
        """Test that command ignores projects with only project-level recipients."""
        project = self.create_project("Test project")
        RecipientCountry.objects.create(project=project, country="NL", percentage=100)
        Transaction.objects.create(
            project=project,
            transaction_type="1",
            transaction_date=datetime.date.today(),
            value=1000,
            value_date=datetime.date.today()
        )

        output = self.call_command(verbosity=1)

        self.assertIn('Found 0 project(s) with conflicts', output)

    def test_ignore_project_with_only_transaction_level_recipients(self):
        """Test that command ignores projects with only transaction-level recipients."""
        project = self.create_project("Test project")
        Transaction.objects.create(
            project=project,
            transaction_type="1",
            transaction_date=datetime.date.today(),
            value=1000,
            value_date=datetime.date.today(),
            recipient_country="KE"
        )

        output = self.call_command(verbosity=1)

        self.assertIn('Found 0 project(s) with conflicts', output)

    def test_fix_mode_clears_transaction_recipients(self):
        """Test that fix mode clears transaction-level recipients."""
        project = self.create_project("Test project")
        RecipientCountry.objects.create(project=project, country="NL", percentage=100)
        transaction = Transaction.objects.create(
            project=project,
            transaction_type="1",
            transaction_date=datetime.date.today(),
            value=1000,
            value_date=datetime.date.today(),
            recipient_country="KE"
        )

        # Verify conflict exists
        self.assertEqual(transaction.recipient_country, "KE")
        self.assertEqual(project.recipient_countries.count(), 1)

        # Run fix command
        output = self.call_command(fix=True, verbosity=1)

        # Verify fix was applied
        transaction.refresh_from_db()
        self.assertEqual(transaction.recipient_country, "")
        self.assertEqual(project.recipient_countries.count(), 1)
        self.assertIn('Fixed 1 projects', output)
        self.assertIn('cleared 1 transactions', output)

    def test_fix_mode_preserves_project_recipients(self):
        """Test that fix mode preserves project-level recipients."""
        project = self.create_project("Test project")
        country = RecipientCountry.objects.create(project=project, country="NL", percentage=50)
        region = RecipientRegion.objects.create(project=project, region="89", percentage=50)
        Transaction.objects.create(
            project=project,
            transaction_type="1",
            transaction_date=datetime.date.today(),
            value=1000,
            value_date=datetime.date.today(),
            recipient_country="KE"
        )

        # Run fix command
        self.call_command(fix=True, verbosity=0)

        # Verify project-level recipients are intact
        country.refresh_from_db()
        region.refresh_from_db()
        self.assertEqual(country.country, "NL")
        self.assertEqual(country.percentage, 50)
        self.assertEqual(region.region, "89")
        self.assertEqual(region.percentage, 50)

    def test_single_project_filtering(self):
        """Test that --project-id filters to single project."""
        project1 = self.create_project("Project 1")
        project2 = self.create_project("Project 2")

        # Create conflicts in both projects
        for project in [project1, project2]:
            RecipientCountry.objects.create(project=project, country="NL", percentage=100)
            Transaction.objects.create(
                project=project,
                transaction_type="1",
                transaction_date=datetime.date.today(),
                value=1000,
                value_date=datetime.date.today(),
                recipient_country="KE"
            )

        # Run command for project1 only
        output = self.call_command(project_id=project1.id, verbosity=1)

        self.assertIn('Found 1 project(s) with conflicts', output)
        self.assertIn(str(project1.id), output)
        self.assertNotIn(str(project2.id), output)

    def test_dry_run_does_not_modify_data(self):
        """Test that default mode (without --fix) doesn't modify data."""
        project = self.create_project("Test project")
        RecipientCountry.objects.create(project=project, country="NL", percentage=100)
        transaction = Transaction.objects.create(
            project=project,
            transaction_type="1",
            transaction_date=datetime.date.today(),
            value=1000,
            value_date=datetime.date.today(),
            recipient_country="KE"
        )

        original_recipient = transaction.recipient_country

        # Run command without --fix
        self.call_command(verbosity=0)

        # Verify no changes
        transaction.refresh_from_db()
        self.assertEqual(transaction.recipient_country, original_recipient)

    def test_csv_output_format(self):
        """Test that CSV format produces valid output."""
        project = self.create_project("Test project")
        RecipientCountry.objects.create(project=project, country="NL", percentage=100)
        Transaction.objects.create(
            project=project,
            transaction_type="1",
            transaction_date=datetime.date.today(),
            value=1000,
            value_date=datetime.date.today(),
            recipient_country="KE"
        )

        output = self.call_command(format='csv', verbosity=0)

        # Should have header row
        self.assertIn('project_id,project_title', output)
        # Should have data row with project id
        self.assertIn(str(project.id), output)

    def test_json_output_format(self):
        """Test that JSON format produces valid output."""
        import json

        project = self.create_project("Test project")
        RecipientCountry.objects.create(project=project, country="NL", percentage=100)
        Transaction.objects.create(
            project=project,
            transaction_type="1",
            transaction_date=datetime.date.today(),
            value=1000,
            value_date=datetime.date.today(),
            recipient_country="KE"
        )

        output = self.call_command(format='json', verbosity=0)

        # Should be valid JSON
        data = json.loads(output)
        self.assertEqual(data['total_conflicted_projects'], 1)
        self.assertEqual(data['projects'][0]['project_id'], project.id)

    def test_multiple_transactions_with_conflicts(self):
        """Test handling of multiple conflicted transactions in one project."""
        project = self.create_project("Test project")
        RecipientCountry.objects.create(project=project, country="NL", percentage=100)

        # Create 3 transactions with recipients
        for i in range(3):
            Transaction.objects.create(
                project=project,
                transaction_type="1",
                transaction_date=datetime.date.today(),
                value=1000 + i,
                value_date=datetime.date.today(),
                recipient_country="KE"
            )

        # Run fix command
        output = self.call_command(fix=True, verbosity=1)

        # Verify all 3 transactions were fixed
        self.assertIn('cleared 3 transactions', output)

        # Verify all transactions are cleared
        for transaction in project.transactions.all():
            self.assertEqual(transaction.recipient_country, "")

    def test_mixed_country_and_region_conflicts(self):
        """Test project with both country and region conflicts."""
        project = self.create_project("Test project")
        RecipientCountry.objects.create(project=project, country="NL", percentage=50)
        RecipientRegion.objects.create(project=project, region="89", percentage=50)

        Transaction.objects.create(
            project=project,
            transaction_type="1",
            transaction_date=datetime.date.today(),
            value=1000,
            value_date=datetime.date.today(),
            recipient_country="KE"
        )
        Transaction.objects.create(
            project=project,
            transaction_type="1",
            transaction_date=datetime.date.today(),
            value=2000,
            value_date=datetime.date.today(),
            recipient_region="298"
        )

        output = self.call_command(fix=True, verbosity=1)

        # Should fix 2 transactions
        self.assertIn('cleared 2 transactions', output)

        # Verify all transaction recipients are cleared
        for transaction in project.transactions.all():
            self.assertEqual(transaction.recipient_country, "")
            self.assertEqual(transaction.recipient_region, "")

    def test_clears_all_recipient_fields_on_transaction(self):
        """Test that fix clears all recipient-related fields on transactions."""
        project = self.create_project("Test project")
        RecipientCountry.objects.create(project=project, country="NL", percentage=100)

        transaction = Transaction.objects.create(
            project=project,
            transaction_type="1",
            transaction_date=datetime.date.today(),
            value=1000,
            value_date=datetime.date.today(),
            recipient_region="298",
            recipient_region_vocabulary="1",
            recipient_region_vocabulary_uri="http://example.com/vocab"
        )

        # Run fix command
        self.call_command(fix=True, verbosity=0)

        # Verify all recipient fields are cleared
        transaction.refresh_from_db()
        self.assertEqual(transaction.recipient_country, "")
        self.assertEqual(transaction.recipient_region, "")
        self.assertEqual(transaction.recipient_region_vocabulary, "")
        self.assertEqual(transaction.recipient_region_vocabulary_uri, "")

    @patch('akvo.rsr.management.commands.fix_iati_recipient_conflicts.run_internal_project_validator')
    def test_validation_is_rerun_after_fix(self, mock_validator):
        """Test that IATI validation is re-run after fixing conflicts."""
        from akvo.rsr.usecases.iati_validation.internal_validator_runner import CheckResult

        # Setup mock to return success
        mock_validator.return_value = CheckResult(error_count=0, warning_count=0, data=[])

        project = self.create_project("Test project")
        RecipientCountry.objects.create(project=project, country="NL", percentage=100)
        Transaction.objects.create(
            project=project,
            transaction_type="1",
            transaction_date=datetime.date.today(),
            value=1000,
            value_date=datetime.date.today(),
            recipient_country="KE"
        )

        # Run fix command
        self.call_command(fix=True, verbosity=0)

        # Verify validation was called for the project
        mock_validator.assert_called_once()
        call_args = mock_validator.call_args[0]
        self.assertEqual(call_args[0].id, project.id)

    @patch('akvo.rsr.management.commands.fix_iati_recipient_conflicts.run_internal_project_validator')
    def test_skip_validation_flag(self, mock_validator):
        """Test that --skip-validation prevents re-running validation."""
        project = self.create_project("Test project")
        RecipientCountry.objects.create(project=project, country="NL", percentage=100)
        Transaction.objects.create(
            project=project,
            transaction_type="1",
            transaction_date=datetime.date.today(),
            value=1000,
            value_date=datetime.date.today(),
            recipient_country="KE"
        )

        # Run fix command with skip-validation
        self.call_command(fix=True, skip_validation=True, verbosity=0)

        # Verify validation was NOT called
        mock_validator.assert_not_called()

    def test_validation_updates_iati_checks(self):
        """Test that validation actually updates IatiCheck records."""
        project = self.create_project("Test project")
        RecipientCountry.objects.create(project=project, country="NL", percentage=100)
        Transaction.objects.create(
            project=project,
            transaction_type="1",
            transaction_date=datetime.date.today(),
            value=1000,
            value_date=datetime.date.today(),
            recipient_country="KE"
        )

        # Create an initial error check (simulating the conflict error)
        IatiCheck.objects.create(
            project=project,
            status=3,  # error
            description='recipient countries or regions present on project and transaction level'
        )

        # Verify initial state has errors
        initial_errors = project.iati_checks.filter(status=3).count()
        self.assertGreater(initial_errors, 0)

        # Run fix command (which will re-run validation)
        self.call_command(fix=True, verbosity=0)

        # After fix, the specific conflict error should be gone
        # (Note: there may be other errors, but the conflict error should be resolved)
        conflict_errors = project.iati_checks.filter(
            status=3,
            description__icontains='recipient countries or regions present on project and transaction'
        ).count()
        self.assertEqual(conflict_errors, 0)
