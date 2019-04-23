# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import tablib
from django.conf import settings

from django.core.management.base import BaseCommand

from akvo.rsr.models import IndicatorPeriod
from akvo.utils import rsr_send_mail
from ...models import Project, Result, Indicator

INDICATORS = 'indicators'
PERIODS = 'periods'


class Command(BaseCommand):
    args = ''
    help = ('Script that checks the EUTF results framework "core indicators" for errors')

    def __init__(self):
        super(Command, self).__init__()
        self.root = Project.objects.get(pk=settings.EUTF_ROOT_PROJECT)
        self.all_projects = self.root.descendants()
        self.eutf_results = Result.objects.filter(project=self.root)
        self.dec_results = Result.objects.filter(parent_result__in=self.eutf_results)
        self.ctr_results = Result.objects.filter(parent_result__in=self.dec_results)

        self.missing_results = []
        self.indicator_orphans = []
        self.period_orphans = []

    @staticmethod
    def find_indicator_orphans(results, results_above):
        orphans = Indicator.objects.none()
        if Indicator.objects.filter(result__in=results,
                                    parent_indicator__isnull=True).exists():
            orphans = Indicator.objects.filter(result__in=results, parent_indicator__isnull=True)
        if Indicator.objects.filter(parent_indicator__result__in=results_above,
                                    result__isnull=True).exists():
            orphans = orphans | Indicator.objects.filter(parent_indicator__result__in=results_above,
                                                         result__isnull=True)
        return orphans.distinct()

    @staticmethod
    def find_period_orphans(results, results_above):
        orphans = IndicatorPeriod.objects.none()
        if IndicatorPeriod.objects.filter(indicator__result__in=results,
                                          parent_period__isnull=True).exists():
            orphans = IndicatorPeriod.objects.filter(indicator__result__in=results,
                                                     parent_period__isnull=True)
        if IndicatorPeriod.objects.filter(parent_period__indicator__result__in=results_above,
                                          indicator__isnull=True).exists():
            orphans = orphans | IndicatorPeriod.objects.filter(
                parent_period__indicator__result__in=results_above, indicator__isnull=True)

        return orphans.distinct()

    @staticmethod
    def create_indicator_report(orphans):
        problem_indicators = tablib.Dataset()
        problem_indicators.headers = [
            'Indicator ID',
            'Result ID',
            'Result parent result ID',
            'Project ID',
            'Parent result project ID',
            'Indicator title',
            'Result title',
            'Project title',
            'Parent result project title',
        ]

        for orphan in orphans:
            pk = orphan.pk
            title = orphan.title,
            result_pk = orphan.result.pk if orphan.result else None
            result_title = orphan.result.title if result_pk else None
            project_pk = orphan.result.project.pk if result_pk and orphan.result.project else None
            project_title = orphan.result.project.title if project_pk else None
            result_parent_result_pk = (orphan.result.parent_result.pk
                                       if result_pk and orphan.result.parent_result else None)
            result_parent_result_project_pk = (orphan.result.parent_result.project.pk
                                               if result_parent_result_pk and
                                               orphan.result.parent_result.project else None)
            result_parent_result_project_title = (orphan.result.parent_result.project.title
                                                  if result_parent_result_pk and
                                                  orphan.result.parent_result.project else None)
            problem_indicators.append([
                pk,
                result_pk,
                result_parent_result_pk,
                project_pk,
                result_parent_result_project_pk,
                title,
                result_title,
                project_title,
                result_parent_result_project_title,
            ])

        return problem_indicators

    @staticmethod
    def create_period_report(orphans):
        problem_periods = tablib.Dataset()
        problem_periods.headers = [
            'Period ID',
            'Parent period ID',
            'Indicator ID',
            'Indicator parent indicator ID',
            'Parent period indicator ID',
            'Result ID',
            'Project ID',
            'Project title',
            'Result title',
            'Indicator title',
            'Period start and end',
        ]

        for orphan in orphans:
            pk = orphan.pk
            parent_period_pk = orphan.parent_period.pk if orphan.parent_period else None
            indicator_pk = orphan.indicator.pk if orphan.indicator else None
            indicator_parent_indicator_pk = (orphan.indicator.parent_indicator.pk
                                             if indicator_pk and orphan.indicator.parent_indicator
                                             else None)
            parent_period_indicator_pk = (orphan.parent_period.indicator.pk
                                          if parent_period_pk and orphan.parent_period.indicator
                                          else None)
            result_pk = (orphan.indicator.result.pk
                         if indicator_pk and orphan.indicator.result else None)
            project_pk = (orphan.indicator.result.project.pk
                          if result_pk and orphan.indicator.result.project else None)
            project_title = orphan.indicator.result.project.title if project_pk else None
            result_title = (orphan.indicator.result.title
                            if indicator_pk and orphan.indicator.result else None)
            indicator_title = orphan.indicator.title if indicator_pk else None
            problem_periods.append([
                pk,
                parent_period_pk,
                indicator_pk,
                indicator_parent_indicator_pk,
                parent_period_indicator_pk,
                result_pk,
                project_pk,
                project_title,
                result_title,
                indicator_title,
                "{} : {}".format(orphan.period_start, orphan.period_end),
            ])

        return problem_periods

    def analyze_indicators(self):

        self.indicator_orphans = self.find_indicator_orphans(self.dec_results, self.eutf_results)
        self.indicator_orphans = self.indicator_orphans | self.find_indicator_orphans(
            self.ctr_results, self.dec_results
        )

    def analyze_periods(self):

        self.period_orphans = self.find_period_orphans(self.dec_results, self.eutf_results)
        self.period_orphans = self.period_orphans | self.find_period_orphans(
            self.ctr_results, self.dec_results
        )

    @staticmethod
    def send_eutf_error_email(error_type, attachments):
        recipients = getattr(
            settings,
            'EUTF_HIERARCHY_ERROR_RECIPIENTS',
            ['rsr@akvo.org', ]
        )

        rsr_send_mail(
            recipients,
            subject='results_framework/eutf_hierarchy_error_subject.txt',
            message='results_framework/eutf_hierarchy_error_message.txt',
            msg_context={'error_type': error_type},
            html_message='results_framework/eutf_hierarchy_error_message.html',
            attachments=attachments
        )

    def handle(self, *args, **options):

        self.analyze_indicators()
        if self.indicator_orphans:
            problem_indicators = self.create_indicator_report(self.indicator_orphans)
            content = "The following problem indicators were detected\n\n{}".format(
                problem_indicators.export('tsv'))
            attachment = [{
                'filename': 'eutf_hierarchy_indicator_errors.tsv',
                'content': content,
                'mimetype': 'text/tab-separated-values'
            }]
            self.send_eutf_error_email(INDICATORS, attachment)
            return

        self.analyze_periods()
        if self.period_orphans:
            problem_periods = self.create_period_report(self.period_orphans)
            content = "The following problem periods were detected\n\n{}".format(
                problem_periods.export('tsv'))
            attachment = [{
                'filename': 'eutf_hierarchy_period_errors.tsv',
                'content': content,
                'mimetype': 'text/tab-separated-values'
            }]
            self.send_eutf_error_email(PERIODS, attachment)
