# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
from argparse import ArgumentParser

import tablib
from django.core.management.base import BaseCommand

from akvo.rsr.checks.indicators import get_inconsistent_indicators
from akvo.rsr.checks.periods import get_inconsistent_periods
from akvo.rsr.checks.results import get_with_multi_project_parents, get_with_non_familial_parents
from akvo.rsr.management.commands.helpers.data_integrity import print_actual_parent, write, write_project
from akvo.rsr.models import RelatedProject
from akvo.rsr.models.related_project import get_project_parents


def projects_with_multiple_parents():
    parents_of = {}
    for relation in RelatedProject.objects.all().select_related('project', 'related_project'):
        if relation.relation == relation.PROJECT_RELATION_PARENT:
            child = relation.project.pk
            try:
                parent = relation.related_project.pk
            except AttributeError:
                continue
        elif relation.relation == relation.PROJECT_RELATION_CHILD:
            try:
                child = relation.related_project.pk
            except AttributeError:
                continue
            parent = relation.project.pk
        parents_of.setdefault(child, set()).add(parent)

    if parents_of:
        problem_projects = tablib.Dataset()
        problem_projects.headers = [
            'Child project ID',
            'Parent project IDs',
        ]
        children_with_parents = [
            [kid, ", ".join([str(p) for p in list(parents_of[kid])])] for
            kid in parents_of if len(parents_of[kid]) > 1
        ]
        ordered = sorted(children_with_parents, key=lambda bit: bit[0])
        for data in ordered:
            problem_projects.append(data)
        print("Projects that have more than one parent project")
        print(problem_projects.export('csv'))
    else:
        print("No child projects with multiple parents")
    print("\n\n")


def results_with_nonfamilial_parents():
    problem_results = tablib.Dataset()
    problem_results.headers = [
        'Project ID',
        'Result ID',
        'Project parent project IDs',
        'Parent result project ID',
        'Project title',
        'Result title',
        'Parent result project title'
    ]
    for result in get_with_non_familial_parents():
        problem_results.append([
            result.project.pk,
            result.pk,
            ", ".join([str(parent.pk) for parent in get_project_parents(result.project)]),
            result.parent_result.project.pk,
            result.project.title,
            result.title,
            result.parent_result.project.title,
        ])
    if len(problem_results):
        print("Results where Result.parent_result.project is not in result.project.parents_all()")
        print(problem_results.export('csv'))
    else:
        print("No problems with results and their projects")
    print("\n\n")


def results_with_multiproject_parents():
    header = "Projects with results that have parent results from different projects"
    multi_project_parents = get_with_multi_project_parents()
    if not multi_project_parents:
        print(f"NO {header}")
        return

    print(header)

    for project, parent_with_results in multi_project_parents.items():
        write_project(project)

        for parent, results in parent_with_results.items():
            write_project(parent, prefix="parent", tab_count=1)

            for result in results:
                write(f"parent result {result.parent_result.id}: {result.parent_result.title}", 2)
                write(f"result {result.id}: {result.title}", 3)
        print_actual_parent(project, 1)


def inconsistent_indicators():
    problem_indicators = tablib.Dataset()
    problem_indicators.headers = [
        'Project ID',
        'Indicator ID',
        'Parent indicator result ID',
        'Indicator result parent result ID',
        'Indicator title',
        'Project title',
        'Result ID',
        'Result title',
    ]
    for indicator in get_inconsistent_indicators():
        problem_indicators.append([
            indicator.pk,
            indicator.parent_indicator.result,
            indicator.result.parent_result,
            indicator.title,
            indicator.result.project.pk,
            indicator.result.project.title,
            indicator.result.pk,
            indicator.result.title,
        ])

    if len(problem_indicators):
        print("Indicators where the parent results don't match")
        print(problem_indicators.export('csv'))
    else:
        print("No problems with indicators and their results")
    print("\n\n")


def inconsistent_periods():
    problem_periods = tablib.Dataset()
    problem_periods.headers = [
        'Period ID',
        'Parent period indicator ID',
        'Indicator parent indicator ID',
        'Period start and end',
        'Project ID',
        'Project title',
        'Result ID',
        'Result title',
        'Indicator ID',
        'Indicator title',
    ]
    print("Indicator periods where parent indicators don't match")
    print(problem_periods.export('csv'), end=' ')

    for period in get_inconsistent_periods():
        problem_periods.wipe()
        problem_periods.append([
            period.pk,
            period.parent_period.indicator.pk if period.parent_period.indicator else "None",
            period.indicator.parent_indicator.pk if period.indicator.parent_indicator else "None",
            "{} : {}".format(period.period_start, period.period_end),
            period.indicator.result.project.pk,
            period.indicator.result.project.title,
            period.indicator.result.pk,
            period.indicator.result.title,
            period.indicator.pk,
            period.indicator.title,
        ])
        print(problem_periods.export('csv'), end=' ')
    print("\n\n")


CHECKS = {
    method.__name__: method
    for method in [
        results_with_multiproject_parents,
        results_with_nonfamilial_parents,
        inconsistent_indicators,
        inconsistent_periods,
        projects_with_multiple_parents,
    ]
}


class Command(BaseCommand):
    args = ''
    help = ('Script analyzing the results framework for problems')

    def add_arguments(self, parser: ArgumentParser):
        parser.add_argument(
            "checks",
            help="The name of the check to run (by default all checks will be run)",
            choices=list(CHECKS.keys()),
            nargs="*",
        )

    def handle(self, *args, **options):
        check_names = options.get("checks", [])
        for check_name in sorted(check_names):
            print(f"===Running check {check_name}")
            CHECKS[check_name]()

        print("DONE!")
