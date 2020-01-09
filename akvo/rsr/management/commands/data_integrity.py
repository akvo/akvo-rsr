# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import tablib

from django.core.management.base import BaseCommand
from django.db.models import F

from akvo.rsr.models import Result, Indicator, IndicatorPeriod
from ...models import RelatedProject


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


def inconsistent_results():
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
    for result in Result.objects.all().select_related(
            'project', 'parent_result', 'parent_result__project'
    ).exclude(
        parent_result=None
    ).order_by('project__pk'):
        if result.parent_result.project not in result.project.parents_all():
            problem_results.append([
                result.project.pk,
                result.pk,
                ", ".join([str(parent.pk) for parent in result.project.parents_all()]),
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
    for indicator in Indicator.objects.exclude(
        parent_indicator=None
    ).exclude(
        parent_indicator__result__pk=F('result__parent_result__pk')
    ).select_related(
        'result__parent_result', 'parent_indicator', 'parent_indicator__result',
        'result__project',
    ).order_by(
        'result__project__pk', 'result__pk'
    ):
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

    for period in IndicatorPeriod.objects.exclude(
        parent_period=None
    ).exclude(
        parent_period__indicator__pk=F('indicator__parent_indicator__pk')
    ).select_related(
        'parent_period', 'parent_period__indicator', 'indicator__parent_indicator',
        'indicator__result__project',
    ).order_by(
        'indicator__result__project__pk', 'indicator__result__pk', 'indicator__pk'
    ):
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


class Command(BaseCommand):
    args = ''
    help = ('Script analyzing the results framework for problems')

    def handle(self, *args, **options):
        projects_with_multiple_parents()
        inconsistent_results()
        inconsistent_indicators()
        inconsistent_periods()

        print("DONE!")
