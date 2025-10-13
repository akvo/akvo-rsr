# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import json
from django.core.management.base import BaseCommand
from django.db.models import Q

from ...models import Project
from ...usecases.iati_validation.internal_validator_runner import run_internal_project_validator


class Command(BaseCommand):
    help = (
        'Identify and fix projects with recipient countries/regions at both '
        'project and transaction level (which prevents IATI export)'
    )

    def add_arguments(self, parser):
        parser.add_argument(
            '--project-id',
            type=int,
            help='Process only a specific project by ID'
        )
        parser.add_argument(
            '--fix',
            action='store_true',
            help='Actually fix the conflicts (default is dry-run/list only)'
        )
        parser.add_argument(
            '--format',
            choices=['table', 'csv', 'json'],
            default='table',
            help='Output format for listing projects'
        )
        parser.add_argument(
            '--skip-validation',
            action='store_true',
            help='Skip re-running IATI validation after fixing (faster but validation results not updated)'
        )

    def handle(self, *args, **options):
        verbosity = int(options['verbosity'])
        project_id = options.get('project_id')
        fix_mode = options.get('fix')
        output_format = options.get('format')
        skip_validation = options.get('skip_validation', False)

        # Find conflicted projects
        if verbosity > 0:
            if fix_mode:
                self.stdout.write('=' * 80)
                self.stdout.write('IATI Recipient Conflict Fixer')
                self.stdout.write('=' * 80)
            else:
                self.stdout.write('=' * 80)
                self.stdout.write('IATI Recipient Conflict Report (DRY RUN)')
                self.stdout.write('=' * 80)
            self.stdout.write('')
            self.stdout.write('Scanning for projects with recipient conflicts...')

        conflicted_projects = self.find_conflicted_projects(project_id)

        if verbosity > 0:
            if fix_mode:
                self.stdout.write(f'Found {len(conflicted_projects)} project(s) to fix')
            else:
                self.stdout.write(f'Found {len(conflicted_projects)} project(s) with conflicts')
            self.stdout.write('')

        if not conflicted_projects:
            if verbosity > 0:
                self.stdout.write('No conflicts found!')
            return

        # Display or fix based on mode
        if fix_mode:
            total_fixed_transactions = self.fix_conflicts(
                conflicted_projects, verbosity, skip_validation
            )
            if verbosity > 0:
                self.stdout.write('')
                self.stdout.write('=' * 80)
                self.stdout.write(
                    f'Summary: Fixed {len(conflicted_projects)} projects, '
                    f'cleared {total_fixed_transactions} transactions'
                )
                self.stdout.write('=' * 80)
        else:
            # Display conflicts in requested format
            if output_format == 'csv':
                self.display_csv(conflicted_projects)
            elif output_format == 'json':
                self.display_json(conflicted_projects)
            else:
                self.display_table(conflicted_projects, verbosity)

    def find_conflicted_projects(self, project_id=None):
        """
        Find projects with recipient data at both project and transaction level.

        Returns:
            List of Project objects with conflicts
        """
        # Base query: projects with recipient_countries OR recipient_regions
        projects = Project.objects.filter(
            Q(recipient_countries__isnull=False)
            | Q(recipient_regions__isnull=False)
        ).distinct()

        # Filter to specific project if requested
        if project_id:
            projects = projects.filter(id=project_id)

        # Further filter to projects with transactions having recipients
        conflicted_projects = []
        for project in projects:
            has_transaction_recipients = project.transactions.filter(
                Q(recipient_country__isnull=False) & ~Q(recipient_country='')
                | Q(recipient_region__isnull=False) & ~Q(recipient_region='')
            ).exists()

            if has_transaction_recipients:
                conflicted_projects.append(project)

        return conflicted_projects

    def get_project_conflict_details(self, project):
        """
        Get detailed information about a project's conflicts.

        Returns:
            dict with conflict details
        """
        transactions_with_country = project.transactions.filter(
            Q(recipient_country__isnull=False) & ~Q(recipient_country='')
        )
        transactions_with_region = project.transactions.filter(
            Q(recipient_region__isnull=False) & ~Q(recipient_region='')
        )

        return {
            'project_id': project.id,
            'project_title': project.title,
            'project_countries_count': project.recipient_countries.count(),
            'project_regions_count': project.recipient_regions.count(),
            'project_countries': list(project.recipient_countries.values_list('country', flat=True)),
            'project_regions': list(project.recipient_regions.values_list('region', flat=True)),
            'transactions_with_country': list(
                transactions_with_country.values_list('id', 'recipient_country')
            ),
            'transactions_with_region': list(
                transactions_with_region.values_list('id', 'recipient_region')
            ),
            'total_transactions': project.transactions.count(),
            'affected_transactions_count': project.transactions.filter(
                Q(recipient_country__isnull=False) & ~Q(recipient_country='')
                | Q(recipient_region__isnull=False) & ~Q(recipient_region='')
            ).count()
        }

    def display_table(self, projects, verbosity):
        """Display conflicts in table format."""
        total_affected = 0

        if verbosity > 0:
            if verbosity > 1:
                self.stdout.write('Detailed conflict information:')
                self.stdout.write('')

        for idx, project in enumerate(projects, 1):
            details = self.get_project_conflict_details(project)
            total_affected += details['affected_transactions_count']

            if verbosity > 0:
                self.stdout.write('-' * 80)
                self.stdout.write(f"[{idx}] Project ID: {details['project_id']} - \"{details['project_title']}\"")

                # Project-level recipients
                countries_str = ', '.join(details['project_countries']) if details['project_countries'] else '0'
                regions_str = ', '.join(details['project_regions']) if details['project_regions'] else '0'

                if details['project_countries_count'] > 0 and details['project_regions_count'] > 0:
                    self.stdout.write(f"    Project-level recipients: {details['project_countries_count']} countries ({countries_str}), {details['project_regions_count']} regions ({regions_str})")
                elif details['project_countries_count'] > 0:
                    self.stdout.write(f"    Project-level recipients: {details['project_countries_count']} countries ({countries_str})")
                else:
                    self.stdout.write(f"    Project-level recipients: {details['project_regions_count']} regions ({regions_str})")

                # Transaction-level conflicts
                self.stdout.write(
                    f"    Transaction-level conflicts: {details['affected_transactions_count']} "
                    f"of {details['total_transactions']} transactions"
                )

                if verbosity > 1:
                    # Show transaction IDs
                    if details['transactions_with_country']:
                        trans_ids = [str(t[0]) for t in details['transactions_with_country']]
                        self.stdout.write(f"    Affected transaction IDs (country): {', '.join(trans_ids)}")
                    if details['transactions_with_region']:
                        trans_ids = [str(t[0]) for t in details['transactions_with_region']]
                        self.stdout.write(f"    Affected transaction IDs (region): {', '.join(trans_ids)}")

                self.stdout.write('')

        if verbosity > 0:
            self.stdout.write('=' * 80)
            self.stdout.write(
                f'Summary: {len(projects)} projects with conflicts '
                f'affecting {total_affected} transactions total'
            )
            self.stdout.write('Use --fix to apply changes')
            self.stdout.write('=' * 80)

    def display_csv(self, projects):
        """Display conflicts in CSV format."""
        # Print header
        self.stdout.write(
            'project_id,project_title,project_countries,project_regions,'
            'affected_transactions,total_transactions,transaction_ids'
        )

        for project in projects:
            details = self.get_project_conflict_details(project)

            countries_str = ';'.join(details['project_countries'])
            regions_str = ';'.join(details['project_regions'])

            all_trans_ids = [str(t[0]) for t in details['transactions_with_country']]
            all_trans_ids.extend([str(t[0]) for t in details['transactions_with_region']])
            trans_ids_str = ';'.join(all_trans_ids)

            # Escape title for CSV
            title = details['project_title'].replace('"', '""')

            self.stdout.write(
                f"{details['project_id']},\"{title}\",\"{countries_str}\",\"{regions_str}\","
                f"{details['affected_transactions_count']},{details['total_transactions']},"
                f"\"{trans_ids_str}\""
            )

    def display_json(self, projects):
        """Display conflicts in JSON format."""
        project_list = []

        for project in projects:
            details = self.get_project_conflict_details(project)
            project_list.append(details)

        output = {
            'total_conflicted_projects': len(projects),
            'projects': project_list
        }

        self.stdout.write(json.dumps(output, indent=2))

    def fix_conflicts(self, projects, verbosity, skip_validation=False):
        """
        Fix conflicts by removing transaction-level recipient data.

        Args:
            projects: List of projects to fix
            verbosity: Output verbosity level
            skip_validation: If True, skip re-running IATI validation

        Returns:
            Total number of transactions fixed
        """
        if verbosity > 0:
            self.stdout.write('Fixing conflicts...')
            if not skip_validation:
                self.stdout.write('(IATI validation will be re-run for each fixed project)')
            self.stdout.write('')

        total_fixed = 0

        for idx, project in enumerate(projects, 1):
            details = self.get_project_conflict_details(project)

            if verbosity > 0:
                self.stdout.write(f"[{idx}] Project {details['project_id']} - \"{details['project_title']}\"")

            # Clear recipient fields on transactions
            affected_transactions = project.transactions.filter(
                Q(recipient_country__isnull=False) & ~Q(recipient_country='')
                | Q(recipient_region__isnull=False) & ~Q(recipient_region='')
            )

            count = affected_transactions.count()
            transaction_ids = list(affected_transactions.values_list('id', flat=True))

            affected_transactions.update(
                recipient_country='',
                recipient_region='',
                recipient_region_vocabulary='',
                recipient_region_vocabulary_uri=''
            )

            total_fixed += count

            if verbosity > 0:
                self.stdout.write(f"  ✓ Cleared recipient data from {count} transaction(s)")
                if verbosity > 1 and transaction_ids:
                    self.stdout.write(f"    Transaction IDs: {', '.join(map(str, transaction_ids))}")

            # Re-run IATI validation to update the validation results
            if not skip_validation:
                if verbosity > 1:
                    self.stdout.write("  ⟳ Re-running IATI validation...")
                try:
                    result = run_internal_project_validator(project)
                    if verbosity > 1:
                        self.stdout.write(
                            f"  ✓ Validation complete: {result.error_count} errors, "
                            f"{result.warning_count} warnings"
                        )
                except Exception as e:
                    if verbosity > 0:
                        self.stdout.write(f"  ⚠ Warning: Failed to re-run validation: {str(e)}")

            if verbosity > 0:
                self.stdout.write('')

        return total_fixed
