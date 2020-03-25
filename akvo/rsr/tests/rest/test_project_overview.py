# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.

# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from akvo.rsr.models import Result, Indicator, IndicatorPeriod, IndicatorPeriodData
from akvo.rsr.tests.base import BaseTestCase
from akvo.rsr.models.result.utils import QUANTITATIVE, QUALITATIVE, PERCENTAGE_MEASURE


class ProjectResultOverviewTestCase(BaseTestCase):

    def setUp(self):
        super(ProjectResultOverviewTestCase, self).setUp()
        self.user = self.create_user("user@akvo.org", "password", is_admin=True)
        self.c.login(username=self.user.username, password="password")

        self.setup_projects_and_results_frameworks()
        # Add UNIT updates on the projects
        for project in [self.project_d, self.project_e, self.project_f, self.project_g]:
            period = IndicatorPeriod.objects.get(
                indicator__result__project=project, indicator__type=QUANTITATIVE, indicator__measure='1')
            IndicatorPeriodData.objects.create(period=period, user=self.user, value=2, status='A')
            IndicatorPeriodData.objects.create(period=period, user=self.user, value=3, status='D')
        for project in [self.project_b, self.project_c]:
            period = IndicatorPeriod.objects.get(
                indicator__result__project=project, indicator__type=QUANTITATIVE, indicator__measure='1')
            IndicatorPeriodData.objects.create(period=period, user=self.user, value=4, status='A')
            IndicatorPeriodData.objects.create(period=period, user=self.user, value=5, status='D')
        # Add PERCENTAGE updates on the projects
        for project in [self.project_d, self.project_e, self.project_f, self.project_g]:
            period = IndicatorPeriod.objects.get(
                indicator__result__project=project,
                indicator__type=QUANTITATIVE, indicator__measure=PERCENTAGE_MEASURE)
            IndicatorPeriodData.objects.create(period=period, user=self.user, numerator=2, denominator=5, status='A')
        for project in [self.project_b, self.project_c]:
            period = IndicatorPeriod.objects.get(
                indicator__result__project=project,
                indicator__type=QUANTITATIVE, indicator__measure=PERCENTAGE_MEASURE)
            IndicatorPeriodData.objects.create(period=period, user=self.user, numerator=3, denominator=4, status='A')

    def test_unit_aggregation_at_project_a(self):
        # Given
        result = self.parent_result
        url = '/rest/v1/project/{}/result/{}/?format=json'.format(result.project.pk, result.pk)

        # When
        response = self.c.get(url)

        # Then
        self.assertEqual(response.status_code, 200)
        self.assertEqual(3, len(response.data['indicators']))
        unit, percentage, qualitative = response.data['indicators']
        # Check unit aggregations
        period = unit['periods'][0]
        actual = (4 * 2) + (2 * 4)
        self.assertEqual(unit['periods'][0]['aggregated_value'], actual)
        self.assertEqual(unit['periods'][0]['actual_value'], actual)
        # Check percentage aggregations
        period = percentage['periods'][0]
        self.assertEqual(period['aggregated_numerator'], (3 * 2) + (2 * 4))
        self.assertEqual(period['aggregated_denominator'], (4 * 2) + (5 * 4))
        actual = (100 * period['aggregated_numerator']) / period['aggregated_denominator']
        self.assertEqual(period['actual_value'], actual)
        self.assertEqual(period['aggregated_value'], actual)

    def test_unit_aggregation_at_project_b(self):
        # Given
        result = self.parent_result.child_results.get(project=self.project_b)
        url = '/rest/v1/project/{}/result/{}/?format=json'.format(result.project.pk, result.pk)

        # When
        response = self.c.get(url)

        # Then
        self.assertEqual(response.status_code, 200)
        self.assertEqual(3, len(response.data['indicators']))
        unit, percentage, qualitative = response.data['indicators']
        # Check unit aggregations
        period = unit['periods'][0]
        aggregated = (2 * 2)
        actual = 4 + aggregated
        self.assertEqual(unit['periods'][0]['actual_value'], actual)
        self.assertEqual(unit['periods'][0]['aggregated_value'], aggregated)
        # Check percentage aggregations
        period = percentage['periods'][0]
        aggregated_numerator = 2 * 2
        aggregated_denominator = 5 * 2
        actual_numerator = 3 + aggregated_numerator
        actual_denominator = 4 + aggregated_denominator
        self.assertEqual(period['aggregated_numerator'], aggregated_numerator)
        self.assertEqual(period['aggregated_denominator'], aggregated_denominator)
        aggregated = (100 * aggregated_numerator) / aggregated_denominator
        actual = (100 * actual_numerator) / actual_denominator
        self.assertEqual(period['actual_value'], actual)
        self.assertEqual(period['aggregated_value'], aggregated)

    def setup_projects_and_results_frameworks(self):
        r"""
                        Project-A
                       /         \
                      /           \
                     /             \
           Project-B/               \Project-C
             /    \                      /  \
            /      \                    /    \
           /        \                  /      \
        Project-D   Project-E    Project-F   Project-G

        """
        # Setup projects
        self.project_a = self.create_project('Project A')
        for name in 'bcdefg':
            project = self.create_project('Project {}'.format(name.upper()))
            setattr(self, f'project_{name}', project)
            if name in 'bc':
                self.make_parent(self.project_a, project)
            elif name in 'de':
                self.make_parent(self.project_b, project)
            elif name in 'fg':
                self.make_parent(self.project_c, project)

        # Setup Results Framework
        self.parent_result = Result.objects.create(title='Result 1', project=self.project_a)
        # Indicators
        self.parent_unit_indicator = Indicator.objects.create(
            result=self.parent_result,
            type=QUANTITATIVE,
            measure="1",
        )
        self.parent_percent_indicator = Indicator.objects.create(
            result=self.parent_result,
            type=QUANTITATIVE,
            measure=PERCENTAGE_MEASURE,
        )
        self.parent_qualitative_indicator = Indicator.objects.create(
            result=self.parent_result,
            type=QUALITATIVE,
        )
        self.parent_indicators  = [
            self.parent_unit_indicator,
            self.parent_percent_indicator,
            self.parent_qualitative_indicator]
        # Period
        for indicator in self.parent_indicators:
            IndicatorPeriod.objects.create(
                indicator=indicator, period_start='2015-01-01', period_end='2019-12-31')

        # Import results framework to children
        for name in 'bcdefg':
            project = getattr(self, f'project_{name}')
            project.import_results()
