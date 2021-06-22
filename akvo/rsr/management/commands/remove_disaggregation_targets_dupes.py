# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.core.management.base import BaseCommand
from django.db.models import Count
from akvo.rsr.models import Indicator, IndicatorPeriod, DisaggregationTarget, IndicatorDisaggregationTarget


def find_duplicates(objects, project_relation):
    return objects.all()\
        .values('id', 'disaggregation_targets__dimension_value', 'disaggregation_targets__dimension_value__value', project_relation)\
        .annotate(duplicates=Count('disaggregation_targets__dimension_value'))\
        .filter(duplicates__gt=1)


def handle_duplicates(type, perform_deletion=False, verbosity=1):
    if type == 'period':
        container_objects = IndicatorPeriod.objects
        target_objects = DisaggregationTarget.objects
    elif type == 'indicator':
        container_objects = Indicator.objects
        target_objects = IndicatorDisaggregationTarget.objects
    else:
        raise Exception('Type must be period or indicator, {} given.'.format(type))

    project_relation = 'result__project' if type == 'indicator' else 'indicator__result__project'
    duplicates = find_duplicates(container_objects, project_relation)
    if verbosity > 0:
        print('Found {} duplicate disaggregation targets in {} {}s'.format(
            duplicates.count(),
            duplicates.values_list('id', flat=True).distinct().count(),
            type
        ))
    projects = set()
    if verbosity > 1:
        for dup in duplicates:
            print('{}: {}, dimension_value: {}, duplicates: {}, project: {}'.format(type, dup['id'], dup['disaggregation_targets__dimension_value'], dup['duplicates'], dup[project_relation]))
            projects.add(dup[project_relation])
        print(f'Affected projects: {projects}')

    all_targets = []
    tobe_removed = []
    for dup in duplicates:
        object_key = '{}__id'.format(type)
        filters = {
            object_key: dup['id'],
            'dimension_value__id': dup['disaggregation_targets__dimension_value']
        }
        candidates = target_objects.filter(**filters).values_list('id', flat=True)
        all_targets.extend(candidates)
        tobe_removed.extend(candidates[1:])

    if verbosity > 1:
        print('problematic {} disaggregation targets: {}, to be removed: {}'.format(type, len(all_targets), len(tobe_removed)))
    assert duplicates.count() == (len(all_targets) - len(tobe_removed))
    if verbosity > 0:
        print('{} duplicate {} disaggregation targets will be removed...'.format(len(tobe_removed), type))

    if perform_deletion:
        result = target_objects.filter(id__in=tobe_removed).delete()
        if verbosity > 0:
            print(result)


class Command(BaseCommand):
    help = (
        "Script to delete disaggregation target duplication at indicator and period level."
        "\n\n"
        "Use the --delete option to actually delete the duplicate objects"
    )

    def add_arguments(self, parser):
        parser.add_argument(
            '--delete',
            action='store_true',
            dest='delete',
            default=False,
            help='Actually delete duplicates'
        )

    def handle(self, *args, **options):
        # parse options
        verbosity = int(options['verbosity'])
        perform_deletion = options['delete']
        handle_duplicates('period', perform_deletion, verbosity)
        handle_duplicates('indicator', perform_deletion, verbosity)
