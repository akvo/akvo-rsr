# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.

# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from unittest.mock import patch

from akvo.rsr.models import Result, Indicator, IndicatorPeriod, IndicatorPeriodData
from akvo.rsr.tests.base import BaseTestCase
from akvo.rsr.models.result.utils import QUANTITATIVE, QUALITATIVE, PERCENTAGE_MEASURE


class QuantitativeUnitAggregationTestCase(BaseTestCase):
    def test_updates_from_contributing_projects_are_aggregated_to_lead_project(self):
        url = ProjectHierarchyFixtureBuilder(self)\
            .with_hierarchy({
                'title': 'A',
                'contributors': [
                    {'title': 'B'},
                    {'title': 'C'},
                ]
            })\
            .with_updates_on('B', [{'value': 1}])\
            .with_updates_on('C', [{'value': 2}])\
            .build_and_get_url()

        response = self.c.get(url)

        final_value = response.data['indicators'][0]['periods'][0]['actual_value']
        self.assertEqual(final_value, 1 + 2)

    def test_updates_from_every_level_of_hierarchy_are_calculated_for_final_value(self):
        url = ProjectHierarchyFixtureBuilder(self)\
            .with_hierarchy({
                'title': 'A',
                'contributors': [
                    {
                        'title': 'B',
                        'contributors': [
                            {'title': 'C'}
                        ]
                    },
                ]
            })\
            .with_updates_on('A', [{'value': 1}])\
            .with_updates_on('B', [{'value': 2}])\
            .with_updates_on('C', [{'value': 3}])\
            .build_and_get_url()

        response = self.c.get(url)

        final_value = response.data['indicators'][0]['periods'][0]['actual_value']
        self.assertEqual(final_value, 1 + 2 + 3)

    def test_local_updates_value_on_contributing_project_are_calculated(self):
        url = ProjectHierarchyFixtureBuilder(self)\
            .with_hierarchy({
                'title': 'A',
                'contributors': [
                    {'title': 'B'},
                ]
            })\
            .with_updates_on('B', [{'value': 1}, {'value': 1}])\
            .build_and_get_url()

        response = self.c.get(url)

        updates_value = response.data['indicators'][0]['periods'][0]['contributors'][0]['updates_value']
        self.assertEqual(updates_value, 1 + 1)

    def test_local_updates_value_on_lead_project_are_calculated(self):
        url = ProjectHierarchyFixtureBuilder(self)\
            .with_hierarchy({
                'title': 'A',
                'contributors': [
                    {'title': 'B'}
                ]
            })\
            .with_updates_on('A', [{'value': 1}, {'value': 1}])\
            .with_updates_on('B', [{'value': 1}])\
            .build_and_get_url()

        response = self.c.get(url)

        updates_value = response.data['indicators'][0]['periods'][0]['updates_value']
        self.assertEqual(updates_value, 1 + 1)

    def test_only_approved_updates_on_contributing_project_are_calculated(self):
        url = ProjectHierarchyFixtureBuilder(self)\
            .with_hierarchy({
                'title': 'A',
                'contributors': [
                    {'title': 'B'},
                ]
            })\
            .with_updates_on('B', [
                {'value': 1, 'status': IndicatorPeriodData.STATUS_DRAFT_CODE},
                {'value': 2},
            ])\
            .build_and_get_url()

        response = self.c.get(url)

        updates_value = response.data['indicators'][0]['periods'][0]['contributors'][0]['updates_value']
        self.assertEqual(updates_value, 2)

    def test_only_approved_updates_on_lead_project_are_calculated(self):
        url = ProjectHierarchyFixtureBuilder(self)\
            .with_hierarchy({
                'title': 'A',
                'contributors': [
                    {'title': 'B'},
                ]
            })\
            .with_updates_on('A', [
                {'value': 1, 'status': IndicatorPeriodData.STATUS_DRAFT_CODE},
                {'value': 2},
            ])\
            .build_and_get_url()

        response = self.c.get(url)

        updates_value = response.data['indicators'][0]['periods'][0]['updates_value']
        self.assertEqual(updates_value, 2)

    def test_handle_update_with_null_value(self):
        url = ProjectHierarchyFixtureBuilder(self)\
            .with_hierarchy({
                'title': 'A',
                'contributors': [
                    {'title': 'B'},
                ]
            })\
            .with_updates_on('B', [
                {'value': None},
                {'value': 2},
            ])\
            .build_and_get_url()

        response = self.c.get(url)

        updates_value = response.data['indicators'][0]['periods'][0]['contributors'][0]['updates_value']
        self.assertEqual(updates_value, 2)


class QuantitativePercentageAggregationTestCase(BaseTestCase):
    def test_updates_from_contributing_projects_are_aggregated_to_lead_project(self):
        url = ProjectHierarchyFixtureBuilder(self)\
            .with_hierarchy({
                'title': 'A',
                'contributors': [
                    {'title': 'B'},
                    {'title': 'C'},
                ]
            })\
            .with_percentage_indicators()\
            .with_updates_on('B', [{'numerator': 1, 'denominator': 5}])\
            .with_updates_on('C', [{'numerator': 2, 'denominator': 5}])\
            .build_and_get_url()

        response = self.c.get(url)

        final_numerator = response.data['indicators'][0]['periods'][0]['actual_numerator']
        self.assertEqual(final_numerator, 1 + 2)

        final_denominator = response.data['indicators'][0]['periods'][0]['actual_denominator']
        self.assertEqual(final_denominator, 5 + 5)

        final_value = response.data['indicators'][0]['periods'][0]['actual_value']
        self.assertEqual(final_value, (final_numerator / final_denominator) * 100)

    def test_updates_from_every_level_of_hierarchy_are_calculated_for_final_values(self):
        url = ProjectHierarchyFixtureBuilder(self)\
            .with_hierarchy({
                'title': 'A',
                'contributors': [
                    {
                        'title': 'B',
                        'contributors': [
                            {'title': 'C'}
                        ]
                    },
                ]
            })\
            .with_percentage_indicators()\
            .with_updates_on('A', [{'numerator': 1, 'denominator': 5}])\
            .with_updates_on('B', [{'numerator': 2, 'denominator': 5}])\
            .with_updates_on('C', [{'numerator': 3, 'denominator': 5}])\
            .build_and_get_url()

        response = self.c.get(url)

        final_numerator = response.data['indicators'][0]['periods'][0]['actual_numerator']
        self.assertEqual(final_numerator, 1 + 2 + 3)

        final_denominator = response.data['indicators'][0]['periods'][0]['actual_denominator']
        self.assertEqual(final_denominator, 5 + 5 + 5)

        final_value = response.data['indicators'][0]['periods'][0]['actual_value']
        self.assertEqual(final_value, (final_numerator / final_denominator) * 100)

    def test_local_updates_values_on_contributing_project_are_calculated(self):
        url = ProjectHierarchyFixtureBuilder(self)\
            .with_hierarchy({
                'title': 'A',
                'contributors': [
                    {'title': 'B'},
                ]
            })\
            .with_percentage_indicators()\
            .with_updates_on('B', [
                {'numerator': 1, 'denominator': 5},
            ])\
            .build_and_get_url()

        response = self.c.get(url)

        updates_numerator = response.data['indicators'][0]['periods'][0]['contributors'][0]['updates_numerator']
        self.assertEqual(updates_numerator, 1)

        updates_denominator = response.data['indicators'][0]['periods'][0]['contributors'][0]['updates_denominator']
        self.assertEqual(updates_denominator, 5)

        updates_value = response.data['indicators'][0]['periods'][0]['contributors'][0]['updates_value']
        self.assertEqual(updates_value, (updates_numerator / updates_denominator) * 100)

    def test_local_updates_values_on_lead_project_are_calculated(self):
        url = ProjectHierarchyFixtureBuilder(self)\
            .with_hierarchy({
                'title': 'A',
                'contributors': [
                    {'title': 'B'},
                ]
            })\
            .with_percentage_indicators()\
            .with_updates_on('A', [{'numerator': 1, 'denominator': 5}])\
            .with_updates_on('B', [{'numerator': 1, 'denominator': 5}])\
            .build_and_get_url()

        response = self.c.get(url)

        updates_numerator = response.data['indicators'][0]['periods'][0]['updates_numerator']
        self.assertEqual(updates_numerator, 1)

        updates_denominator = response.data['indicators'][0]['periods'][0]['updates_denominator']
        self.assertEqual(updates_denominator, 5)

        updates_value = response.data['indicators'][0]['periods'][0]['updates_value']
        self.assertEqual(updates_value, (updates_numerator / updates_denominator) * 100)

    def test_calculate_only_approved_updates(self):
        url = ProjectHierarchyFixtureBuilder(self)\
            .with_hierarchy({
                'title': 'A',
                'contributors': [
                    {'title': 'B'},
                ]
            })\
            .with_percentage_indicators()\
            .with_updates_on('A', [{
                'numerator': 1, 'denominator': 5, 'status': IndicatorPeriodData.STATUS_DRAFT_CODE
            }])\
            .with_updates_on('B', [{
                'numerator': 2, 'denominator': 5
            }])\
            .build_and_get_url()

        response = self.c.get(url)

        final_numerator = response.data['indicators'][0]['periods'][0]['actual_numerator']
        self.assertEqual(final_numerator, 2)

        final_denominator = response.data['indicators'][0]['periods'][0]['actual_denominator']
        self.assertEqual(final_denominator, 5)

        final_value = response.data['indicators'][0]['periods'][0]['actual_value']
        self.assertEqual(final_value, (final_numerator / final_denominator) * 100)

    def test_handle_update_with_null_value(self):
        url = ProjectHierarchyFixtureBuilder(self)\
            .with_hierarchy({
                'title': 'A',
                'contributors': [
                    {'title': 'B'},
                ]
            })\
            .with_percentage_indicators()\
            .with_updates_on('A', [{
                'numerator': None, 'denominator': 5
            }])\
            .with_updates_on('B', [{
                'numerator': 2, 'denominator': 5
            }])\
            .build_and_get_url()

        response = self.c.get(url)

        final_numerator = response.data['indicators'][0]['periods'][0]['actual_numerator']
        self.assertEqual(final_numerator, 2)

        final_denominator = response.data['indicators'][0]['periods'][0]['actual_denominator']
        self.assertEqual(final_denominator, 5)

        final_value = response.data['indicators'][0]['periods'][0]['actual_value']
        self.assertEqual(final_value, (final_numerator / final_denominator) * 100)


class QualitativeScoresAggregationTestCase(BaseTestCase):

    def test_updates_from_contributing_projects_are_aggregated_to_lead_project(self):
        url = ProjectHierarchyFixtureBuilder(self)\
            .with_hierarchy({
                'title': 'A',
                'contributors': [
                    {'title': 'B'},
                    {'title': 'C'},
                ]
            })\
            .with_score_indicators()\
            .with_updates_on('B', [{'score_index': 0}, {'score_index': 1}])\
            .with_updates_on('C', [{'score_index': 2}])\
            .build_and_get_url()

        response = self.c.get(url)

        period = response.data['indicators'][0]['periods'][0]
        contributors = period['contributors']

        self.assertEqual(contributors[0]['score_index'], 2)
        self.assertEqual(contributors[1]['score_index'], 1)


class AggregatedTargetTestCase(BaseTestCase):

    def setUp(self):
        super(AggregatedTargetTestCase, self).setUp()
        self.user = self.create_user("user@akvo.org", "password", is_admin=True)
        self.c.login(username=self.user.username, password="password")

        self.root = self.create_project('Root')
        self.result = Result.objects.create(project=self.root, title="Result #1", type="1")

    def test_targets_are_not_aggregated_on_regular_project(self):
        indicator = self.create_unit_indicator('Indicator #1', self.result)
        IndicatorPeriod.objects.create(indicator=indicator, period_start='2020-01-01', period_end='2020-12-31')

        p1 = self.create_contributor('P1', self.root)
        self.create_contributor('P2', self.root)

        self.get_periods(p1).update(target_value='1')

        response = self.c.get(
            '/rest/v1/project/{}/result/{}/?format=json'.format(self.root.pk, self.result.pk))

        target = response.data['indicators'][0]['periods'][0]['target_value']
        self.assertEqual(target, 0)

    @patch('akvo.rest.views.project_overview.is_eutf_syria_program', lambda x: True)
    def test_targets_are_aggregated_on_eutf_syria_progam(self):
        org = self.create_organisation('Org')
        self.create_project_hierarchy(org, self.root, 2)

        indicator = self.create_unit_indicator('Indicator #1', self.result)
        IndicatorPeriod.objects.create(indicator=indicator, period_start='2020-01-01', period_end='2020-12-31')

        p1 = self.create_contributor('P1', self.root)
        p2 = self.create_contributor('P2', self.root)
        p10 = self.create_contributor('P11', p1)
        p20 = self.create_contributor('P20', p2)

        self.get_periods(p1).update(target_value='1')
        self.get_periods(p10).update(target_value='1')
        self.get_periods(p20).update(target_value='1')

        response = self.c.get(
            '/rest/v1/project/{}/result/{}/?format=json'.format(self.root.pk, self.result.pk))

        target = response.data['indicators'][0]['periods'][0]['target_value']
        self.assertEqual(target, 1 + 1 + 1)

    def test_targets_are_not_aggregated_on_other_program(self):
        org = self.create_organisation('Org')
        self.create_project_hierarchy(org, self.root, 2)

        indicator = self.create_unit_indicator('Indicator #1', self.result)
        IndicatorPeriod.objects.create(indicator=indicator, period_start='2020-01-01', period_end='2020-12-31')

        p1 = self.create_contributor('P1', self.root)
        p2 = self.create_contributor('P2', self.root)
        p10 = self.create_contributor('P11', p1)
        p20 = self.create_contributor('P20', p2)

        self.get_periods(self.root).update(target_value='1')
        self.get_periods(p1).update(target_value='1')
        self.get_periods(p10).update(target_value='1')
        self.get_periods(p20).update(target_value='1')

        response = self.c.get(
            '/rest/v1/project/{}/result/{}/?format=json'.format(self.root.pk, self.result.pk))

        target = response.data['indicators'][0]['periods'][0]['target_value']
        self.assertEqual(target, 1)

    @patch('akvo.rest.views.project_overview.is_eutf_syria_program', lambda x: True)
    def test_targets_are_not_aggregated_on_program_indicator_with_percentage_measure(self):
        org = self.create_organisation('Org')
        self.create_project_hierarchy(org, self.root, 2)

        indicator = self.create_percentage_indicator('Indicator #1', self.result)
        IndicatorPeriod.objects.create(indicator=indicator, period_start='2020-01-01', period_end='2020-12-31')

        p1 = self.create_contributor('P1', self.root)
        p2 = self.create_contributor('P2', self.root)

        self.get_periods(p1).update(target_value='10')
        self.get_periods(p2).update(target_value='20')

        response = self.c.get(
            '/rest/v1/project/{}/result/{}/?format=json'.format(self.root.pk, self.result.pk))

        target = response.data['indicators'][0]['periods'][0]['target_value']
        self.assertEqual(target, 0)

    @patch('akvo.rest.views.project_overview.is_eutf_syria_program', lambda x: True)
    def test_targets_are_not_aggregated_on_program_qualitative_indicator(self):
        org = self.create_organisation('Org')
        self.create_project_hierarchy(org, self.root, 2)

        indicator = self.create_qualitative_indicator('Indicator #1', self.result)
        IndicatorPeriod.objects.create(indicator=indicator, period_start='2020-01-01', period_end='2020-12-31')

        p1 = self.create_contributor('P1', self.root)
        p2 = self.create_contributor('P2', self.root)

        self.get_periods(p1).update(target_value='1')
        self.get_periods(p2).update(target_value='2')

        response = self.c.get(
            '/rest/v1/project/{}/result/{}/?format=json'.format(self.root.pk, self.result.pk))

        target = response.data['indicators'][0]['periods'][0]['target_value']
        self.assertEqual(target, '')

    @staticmethod
    def get_periods(project):
        return IndicatorPeriod.objects.filter(indicator__result__project=project)

    @staticmethod
    def create_unit_indicator(title, result):
        return Indicator.objects.create(result=result, title="Indicator #1", type=QUANTITATIVE, measure="1")

    @staticmethod
    def create_percentage_indicator(title, result):
        return Indicator.objects.create(result=result, title="Indicator #1", type=QUANTITATIVE, measure=PERCENTAGE_MEASURE)

    @staticmethod
    def create_qualitative_indicator(title, result):
        return Indicator.objects.create(result=result, title="Indicator #1", type=QUALITATIVE)


class ProjectHierarchyFixtureBuilder(object):
    def __init__(self, test):
        self.test = test
        self.project_tree = {}
        self.updates = {}
        self.project_list = []
        self.is_percentage = False
        self.is_score = False

    def with_hierarchy(self, project_tree):
        self.project_tree = project_tree
        return self

    def with_percentage_indicators(self, flag=True):
        self.is_percentage = flag
        return self

    def with_score_indicators(self, flag=True):
        self.is_score = flag
        return self

    def with_updates_on(self, project_title, updates):
        self.updates[project_title] = updates
        return self

    def build_and_get_url(self):
        user = self.test.create_user("user@akvo.org", "password", is_admin=True)
        self.test.c.login(username=user.username, password="password")

        project_map = ProjectMapHelper()
        title = self.project_tree['title']
        root, result = self._build_root(title)
        project_map.add(root)
        self._build_contributors(self.project_tree.get('contributors', []), root, project_map)
        self._handle_updates(project_map, user)

        return '/rest/v1/project/{}/result/{}/?format=json'.format(root.pk, result.pk)

    def _build_root(self, title):
        root = self.test.create_project(title)
        result = Result.objects.create(project=root, title='Result #1', type='1')
        if self.is_percentage:
            indicator = self._build_percentage_indicator(result)
        elif self.is_score:
            indicator = self._build_score_indicator(result)
        else:
            indicator = self._build_unit_indicator(result)
        IndicatorPeriod.objects.create(indicator=indicator, period_start='2020-01-01', period_end='2020-12-31')
        return root, result

    def _build_percentage_indicator(self, result):
        return Indicator.objects.create(result=result, type=QUANTITATIVE, measure=PERCENTAGE_MEASURE)

    def _build_score_indicator(self, result):
        return Indicator.objects.create(result=result, type=QUALITATIVE, scores=['Good', 'Bad', 'Ugly'])

    def _build_unit_indicator(self, result):
        return Indicator.objects.create(result=result, type=QUANTITATIVE, measure="1")

    def _build_contributors(self, contributors, lead, project_map):
        for contributor in contributors:
            title = contributor['title']
            project = self.test.create_contributor(title, lead)
            project_map.add(project)
            self._build_contributors(contributor.get('contributors', []), project, project_map)

    def _handle_updates(self, project_map, user):
        for project_title, updates in self.updates.items():
            period = project_map.get_period_of(project_title)
            for update in updates:
                IndicatorPeriodData.objects.create(
                    period=period,
                    user=user,
                    value=update.get('value', None),
                    numerator=update.get('numerator', None),
                    denominator=update.get('denominator', None),
                    score_index=update.get('score_index', None),
                    status=update.get('status', 'A')
                )


class ProjectMapHelper(object):
    def __init__(self):
        self.map = {}

    def add(self, project):
        self.map[project.title] = project

    def get_period_of(self, project_title):
        project = self.map[project_title]
        return IndicatorPeriod.objects.get(indicator__result__project=project)
