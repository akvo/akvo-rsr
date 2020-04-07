# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.

# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from unittest.mock import patch

from akvo.rsr.models import Result, Indicator, IndicatorPeriod, IndicatorPeriodData
from akvo.rsr.tests.base import BaseTestCase
from akvo.rsr.models.result.utils import QUANTITATIVE, QUALITATIVE, PERCENTAGE_MEASURE

from akvo.rest.views.project_overview import PeriodTransformer, ContributorTransformer, IndicatorType
from .util import ProjectFixtureBuilder, ProjectHierarchyFixtureBuilder


class ContributorTransformerTestCase(BaseTestCase):
    def test_attributes(self):
        project = ProjectFixtureBuilder()\
            .build()

        transformer = ContributorTransformer({'item': project.period})
        result = transformer.data

        self.assertEqual(list(result.keys()), [
            'project_id',
            'project_title',
            'period_id',
            'country',
            'actual_comment',
            'actual_value',
            'actual_numerator',
            'actual_denominator',
            'updates',
            'updates_value',
            'updates_numerator',
            'updates_denominator',
            'contributors',
            'disaggregation_contributions',
            'disaggregation_targets',
        ])

    def test_quantitative_unit_indicator_value_without_sub_contributors(self):
        user = self.create_user('user@akvo.org', 'password')
        project = ProjectFixtureBuilder()\
            .build()
        project.add_update(user, value=1)
        project.add_update(user, value=2)

        transformer = ContributorTransformer({'item': project.period})
        result = transformer.data

        self.assertEqual(len(result['updates']), 2)
        self.assertEqual(result['updates_value'], 1 + 2)
        self.assertEqual(result['actual_value'], 1 + 2)

    def test_calculate_only_approved_updates_on_quantitative_unit_indicator_value(self):
        user = self.create_user('user@akvo.org', 'password')
        project = ProjectFixtureBuilder()\
            .build()
        project.add_update(user, value=1, status=IndicatorPeriodData.STATUS_DRAFT_CODE)
        project.add_update(user, value=2)

        transformer = ContributorTransformer({'item': project.period})
        result = transformer.data

        self.assertEqual(len(result['updates']), 2)
        self.assertEqual(result['updates_value'], 2)
        self.assertEqual(result['actual_value'], 2)

    def test_quantitative_percentage_indicator_values_without_sub_contributors(self):
        user = self.create_user('user@akvo.org', 'password')
        project = ProjectFixtureBuilder()\
            .with_percentage_indicator()\
            .build()
        project.add_update(user, numerator=1, denominator=5)

        transformer = ContributorTransformer({'item': project.period}, IndicatorType.PERCENTAGE)
        result = transformer.data

        self.assertEqual(result['updates_numerator'], 1)
        self.assertEqual(result['updates_denominator'], 5)
        percentage = result['updates_numerator'] * 100 / result['updates_denominator']
        self.assertEqual(result['updates_value'], percentage)
        self.assertEqual(result['actual_value'], percentage)
        self.assertEqual(result['actual_numerator'], 1)
        self.assertEqual(result['actual_denominator'], 5)

    def test_calculate_only_approved_updates_on_quantitative_percentage_indicator_value(self):
        user = self.create_user('user@akvo.org', 'password')
        project = ProjectFixtureBuilder()\
            .with_percentage_indicator()\
            .build()
        project.add_update(user, numerator=1, denominator=5, status=IndicatorPeriodData.STATUS_DRAFT_CODE)

        transformer = ContributorTransformer({'item': project.period}, IndicatorType.PERCENTAGE)
        result = transformer.data

        self.assertEqual(len(result['updates']), 1)
        self.assertEqual(result['updates_numerator'], 0)
        self.assertEqual(result['updates_denominator'], 0)
        self.assertEqual(result['updates_value'], 0)
        self.assertEqual(result['actual_value'], 0)
        self.assertEqual(result['actual_numerator'], 0)
        self.assertEqual(result['actual_denominator'], 0)

    def test_quantitative_unit_indicator_value_with_sub_contributors(self):
        project_tree = ProjectHierarchyFixtureBuilder()\
            .with_hierarchy({
                'title': 'A',
                'contributors': [
                    {'title': 'B'},
                    {'title': 'C'},
                ]
            })\
            .with_updates_on('A', [{'value': 1}])\
            .with_updates_on('B', [{'value': 2}])\
            .with_updates_on('C', [{'value': 3}])\
            .build()

        transformer = ContributorTransformer(project_tree.period_tree)
        result = transformer.data

        self.assertEqual(len(result['updates']), 1)
        self.assertEqual(result['updates_value'], 1)
        self.assertEqual(len(result['contributors']), 2)
        self.assertEqual(transformer.contributors.total_value, 2 + 3)
        self.assertEqual(result['actual_value'], 1 + 2 + 3)

    def test_quantitative_percentage_indicator_values_with_sub_contributors(self):
        project_tree = ProjectHierarchyFixtureBuilder()\
            .with_hierarchy({
                'title': 'A',
                'contributors': [
                    {'title': 'B'},
                    {'title': 'C'},
                ]
            })\
            .with_percentage_indicators()\
            .with_updates_on('A', [{'numerator': 1, 'denominator': 5}])\
            .with_updates_on('B', [{'numerator': 2, 'denominator': 5}])\
            .with_updates_on('C', [{'numerator': 3, 'denominator': 5}])\
            .build()

        transformer = ContributorTransformer(project_tree.period_tree, IndicatorType.PERCENTAGE)
        result = transformer.data

        self.assertEqual(result['updates_numerator'], 1)
        self.assertEqual(result['updates_denominator'], 5)
        self.assertEqual(result['updates_value'], result['updates_numerator'] * 100 / result['updates_denominator'])
        self.assertEqual(len(result['contributors']), 2)
        self.assertEqual(transformer.contributors.total_numerator, 2 + 3)
        self.assertEqual(transformer.contributors.total_denominator, 5 + 5)
        self.assertEqual(transformer.contributors.total_value, None)
        self.assertEqual(result['actual_numerator'], 1 + 2 + 3)
        self.assertEqual(result['actual_denominator'], 5 + 5 + 5)
        self.assertEqual(result['actual_value'], result['actual_numerator'] * 100 / result['actual_denominator'])

    def test_quantitative_unit_indicator_value_with_no_aggregate_children(self):
        project_tree = ProjectHierarchyFixtureBuilder()\
            .with_hierarchy({
                'title': 'A',
                'aggregate_children': False,
                'contributors': [
                    {'title': 'B'},
                    {'title': 'C'},
                ]
            })\
            .with_updates_on('A', [{'value': 1}])\
            .with_updates_on('B', [{'value': 2}])\
            .with_updates_on('C', [{'value': 3}])\
            .build()

        transformer = ContributorTransformer(project_tree.period_tree)
        result = transformer.data

        self.assertEqual(len(result['contributors']), 0)
        self.assertEqual(transformer.contributors.total_value, 0)
        self.assertEqual(result['actual_value'], 1)

    def test_quantitative_percentage_indicator_values_with_no_aggregate_children(self):
        project_tree = ProjectHierarchyFixtureBuilder()\
            .with_hierarchy({
                'title': 'A',
                'aggregate_children': False,
                'contributors': [
                    {'title': 'B'},
                    {'title': 'C'},
                ]
            })\
            .with_percentage_indicators()\
            .with_updates_on('A', [{'numerator': 1, 'denominator': 5}])\
            .with_updates_on('B', [{'numerator': 2, 'denominator': 5}])\
            .with_updates_on('C', [{'numerator': 3, 'denominator': 5}])\
            .build()

        transformer = ContributorTransformer(project_tree.period_tree, IndicatorType.PERCENTAGE)
        result = transformer.data

        self.assertEqual(len(result['contributors']), 0)
        self.assertEqual(transformer.contributors.total_numerator, 0)
        self.assertEqual(transformer.contributors.total_denominator, 0)
        self.assertEqual(result['actual_numerator'], 1)
        self.assertEqual(result['actual_denominator'], 5)

    def test_quantitative_unit_indicator_value_with_no_aggregate_to_parent(self):
        project_tree = ProjectHierarchyFixtureBuilder()\
            .with_hierarchy({
                'title': 'A',
                'contributors': [
                    {'title': 'B', 'aggregate_to_parent': False},
                    {'title': 'C'},
                ]
            })\
            .with_updates_on('A', [{'value': 1}])\
            .with_updates_on('B', [{'value': 2}])\
            .with_updates_on('C', [{'value': 3}])\
            .build()

        transformer = ContributorTransformer(project_tree.period_tree)
        result = transformer.data

        self.assertEqual(len(result['contributors']), 1)
        self.assertEqual(transformer.contributors.total_value, 3)
        self.assertEqual(result['actual_value'], 1 + 3)

    def test_quantitative_percentage_indicator_values_with_no_aggregate_to_parent(self):
        project_tree = ProjectHierarchyFixtureBuilder()\
            .with_hierarchy({
                'title': 'A',
                'contributors': [
                    {'title': 'B', 'aggregate_to_parent': False},
                    {'title': 'C'},
                ]
            })\
            .with_percentage_indicators()\
            .with_updates_on('A', [{'numerator': 1, 'denominator': 5}])\
            .with_updates_on('B', [{'numerator': 2, 'denominator': 5}])\
            .with_updates_on('C', [{'numerator': 3, 'denominator': 5}])\
            .build()

        transformer = ContributorTransformer(project_tree.period_tree, IndicatorType.PERCENTAGE)
        result = transformer.data

        self.assertEqual(len(result['contributors']), 1)
        self.assertEqual(transformer.contributors.total_numerator, 3)
        self.assertEqual(transformer.contributors.total_denominator, 5)
        self.assertEqual(result['actual_numerator'], 4)
        self.assertEqual(result['actual_denominator'], 10)


class PeriodTransformerTestCase(BaseTestCase):
    def test_attributes(self):
        project = ProjectFixtureBuilder()\
            .build()

        transformer = PeriodTransformer({'item': project.period})
        result = transformer.data

        self.assertEqual(list(result.keys()), [
            'period_id',
            'period_start',
            'period_end',
            'actual_comment',
            'actual_value',
            'actual_numerator',
            'actual_denominator',
            'target_value',
            'countries',
            'updates',
            'updates_value',
            'updates_numerator',
            'updates_denominator',
            'contributors',
            'disaggregation_contributions',
            'disaggregation_targets',
        ])

    def test_quantitative_unit_indicator_value_without_contributors(self):
        user = self.create_user('user@akvo.org', 'password')
        project = ProjectFixtureBuilder()\
            .build()
        project.add_update(user, value=1)
        project.add_update(user, value=2)

        transformer = PeriodTransformer({'item': project.period})
        result = transformer.data

        self.assertEqual(len(result['updates']), 2)
        self.assertEqual(result['updates_value'], 1 + 2)
        self.assertEqual(result['actual_value'], 1 + 2)

    def test_quantitative_percentage_indicator_values_without_contributors(self):
        user = self.create_user('user@akvo.org', 'password')
        project = ProjectFixtureBuilder()\
            .with_percentage_indicator()\
            .build()
        project.add_update(user, numerator=1, denominator=5)

        transformer = PeriodTransformer({'item': project.period}, IndicatorType.PERCENTAGE)
        result = transformer.data

        self.assertEqual(result['updates_numerator'], 1)
        self.assertEqual(result['updates_denominator'], 5)
        percentage = result['updates_numerator'] * 100 / result['updates_denominator']
        self.assertEqual(result['updates_value'], percentage)
        self.assertEqual(result['actual_value'], percentage)
        self.assertEqual(result['actual_numerator'], 1)
        self.assertEqual(result['actual_denominator'], 5)

    def test_quantitative_unit_indicator_value_with_contributors(self):
        project_tree = ProjectHierarchyFixtureBuilder()\
            .with_hierarchy({
                'title': 'A',
                'contributors': [
                    {'title': 'B'},
                    {'title': 'C'},
                ]
            })\
            .with_updates_on('A', [{'value': 1}])\
            .with_updates_on('B', [{'value': 2}])\
            .with_updates_on('C', [{'value': 3}])\
            .build()

        transformer = PeriodTransformer(project_tree.period_tree)
        result = transformer.data

        self.assertEqual(len(result['updates']), 1)
        self.assertEqual(result['updates_value'], 1)
        self.assertEqual(result['actual_value'], 1 + 2 + 3)

    def test_quantitative_percentage_indicator_values_with_contributors(self):
        project_tree = ProjectHierarchyFixtureBuilder()\
            .with_hierarchy({
                'title': 'A',
                'contributors': [
                    {'title': 'B'},
                    {'title': 'C'},
                ]
            })\
            .with_percentage_indicators()\
            .with_updates_on('A', [{'numerator': 1, 'denominator': 5}])\
            .with_updates_on('B', [{'numerator': 2, 'denominator': 5}])\
            .with_updates_on('C', [{'numerator': 3, 'denominator': 5}])\
            .build()

        transformer = PeriodTransformer(project_tree.period_tree, IndicatorType.PERCENTAGE)
        result = transformer.data

        self.assertEqual(result['updates_numerator'], 1)
        self.assertEqual(result['updates_denominator'], 5)
        self.assertEqual(result['updates_value'], result['updates_numerator'] * 100 / result['updates_denominator'])
        self.assertEqual(result['actual_numerator'], 1 + 2 + 3)
        self.assertEqual(result['actual_denominator'], 5 + 5 + 5)
        self.assertEqual(result['actual_value'], result['actual_numerator'] * 100 / result['actual_denominator'])

    def test_quantitative_unit_indicator_value_with_no_aggregate_children(self):
        project_tree = ProjectHierarchyFixtureBuilder()\
            .with_hierarchy({
                'title': 'A',
                'aggregate_children': False,
                'contributors': [
                    {'title': 'B'},
                    {'title': 'C'},
                ]
            })\
            .with_updates_on('A', [{'value': 1}])\
            .with_updates_on('B', [{'value': 2}])\
            .with_updates_on('C', [{'value': 3}])\
            .build()

        transformer = PeriodTransformer(project_tree.period_tree)
        result = transformer.data

        self.assertEqual(len(result['contributors']), 0)
        self.assertEqual(transformer.contributors.total_value, 0)
        self.assertEqual(result['actual_value'], 1)

    def test_quantitative_percentage_indicator_values_with_no_aggregate_children(self):
        project_tree = ProjectHierarchyFixtureBuilder()\
            .with_hierarchy({
                'title': 'A',
                'aggregate_children': False,
                'contributors': [
                    {'title': 'B'},
                    {'title': 'C'},
                ]
            })\
            .with_percentage_indicators()\
            .with_updates_on('A', [{'numerator': 1, 'denominator': 5}])\
            .with_updates_on('B', [{'numerator': 2, 'denominator': 5}])\
            .with_updates_on('C', [{'numerator': 3, 'denominator': 5}])\
            .build()

        transformer = PeriodTransformer(project_tree.period_tree, IndicatorType.PERCENTAGE)
        result = transformer.data

        self.assertEqual(len(result['contributors']), 0)
        self.assertEqual(transformer.contributors.total_numerator, 0)
        self.assertEqual(transformer.contributors.total_denominator, 0)
        self.assertEqual(result['actual_numerator'], 1)
        self.assertEqual(result['actual_denominator'], 5)


class QuantitativeUnitAggregationTestCase(BaseTestCase):
    def send_request(self, project):
        user = self.create_user("user1@akvo.org", "password", is_admin=True)
        self.c.login(username=user.username, password="password")
        url = '/rest/v1/project/{}/result/{}/?format=json'.format(project.object.pk, project.result.pk)
        return self.c.get(url)

    def test_updates_from_contributing_projects_are_aggregated_to_lead_project(self):
        project_tree = ProjectHierarchyFixtureBuilder()\
            .with_hierarchy({
                'title': 'A',
                'contributors': [
                    {'title': 'B'},
                    {'title': 'C'},
                ]
            })\
            .with_updates_on('B', [{'value': 1}])\
            .with_updates_on('C', [{'value': 2}])\
            .build()

        response = self.send_request(project_tree.root)

        final_value = response.data['indicators'][0]['periods'][0]['actual_value']
        self.assertEqual(final_value, 1 + 2)

    def test_updates_from_every_level_of_hierarchy_are_calculated_for_final_value(self):
        project_tree = ProjectHierarchyFixtureBuilder()\
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
            .build()

        response = self.send_request(project_tree.root)

        final_value = response.data['indicators'][0]['periods'][0]['actual_value']
        self.assertEqual(final_value, 1 + 2 + 3)

    def test_local_updates_value_on_contributing_project_are_calculated(self):
        project_tree = ProjectHierarchyFixtureBuilder()\
            .with_hierarchy({
                'title': 'A',
                'contributors': [
                    {'title': 'B'},
                ]
            })\
            .with_updates_on('B', [{'value': 1}, {'value': 1}])\
            .build()

        response = self.send_request(project_tree.root)

        updates_value = response.data['indicators'][0]['periods'][0]['contributors'][0]['updates_value']
        self.assertEqual(updates_value, 1 + 1)

    def test_local_updates_value_on_lead_project_are_calculated(self):
        project_tree = ProjectHierarchyFixtureBuilder()\
            .with_hierarchy({
                'title': 'A',
                'contributors': [
                    {'title': 'B'}
                ]
            })\
            .with_updates_on('A', [{'value': 1}, {'value': 1}])\
            .with_updates_on('B', [{'value': 1}])\
            .build()

        response = self.send_request(project_tree.root)

        updates_value = response.data['indicators'][0]['periods'][0]['updates_value']
        self.assertEqual(updates_value, 1 + 1)

    def test_only_approved_updates_on_contributing_project_are_calculated(self):
        project_tree = ProjectHierarchyFixtureBuilder()\
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
            .build()

        response = self.send_request(project_tree.root)

        updates_value = response.data['indicators'][0]['periods'][0]['contributors'][0]['updates_value']
        self.assertEqual(updates_value, 2)

    def test_only_approved_updates_on_lead_project_are_calculated(self):
        project_tree = ProjectHierarchyFixtureBuilder()\
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
            .build()

        response = self.send_request(project_tree.root)

        updates_value = response.data['indicators'][0]['periods'][0]['updates_value']
        self.assertEqual(updates_value, 2)

    def test_handle_update_with_null_value(self):
        project_tree = ProjectHierarchyFixtureBuilder()\
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
            .build()

        response = self.send_request(project_tree.root)

        updates_value = response.data['indicators'][0]['periods'][0]['contributors'][0]['updates_value']
        self.assertEqual(updates_value, 2)


class QuantitativePercentageAggregationTestCase(BaseTestCase):
    def send_request(self, project):
        user = self.create_user("user1@akvo.org", "password", is_admin=True)
        self.c.login(username=user.username, password="password")
        url = '/rest/v1/project/{}/result/{}/?format=json'.format(project.object.pk, project.result.pk)
        return self.c.get(url)

    def test_updates_from_contributing_projects_are_aggregated_to_lead_project(self):
        project_tree = ProjectHierarchyFixtureBuilder()\
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
            .build()

        response = self.send_request(project_tree.root)

        final_numerator = response.data['indicators'][0]['periods'][0]['actual_numerator']
        self.assertEqual(final_numerator, 1 + 2)

        final_denominator = response.data['indicators'][0]['periods'][0]['actual_denominator']
        self.assertEqual(final_denominator, 5 + 5)

        final_value = response.data['indicators'][0]['periods'][0]['actual_value']
        self.assertEqual(final_value, (final_numerator / final_denominator) * 100)

    def test_updates_from_every_level_of_hierarchy_are_calculated_for_final_values(self):
        project_tree = ProjectHierarchyFixtureBuilder()\
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
            .build()

        response = self.send_request(project_tree.root)

        final_numerator = response.data['indicators'][0]['periods'][0]['actual_numerator']
        self.assertEqual(final_numerator, 1 + 2 + 3)

        final_denominator = response.data['indicators'][0]['periods'][0]['actual_denominator']
        self.assertEqual(final_denominator, 5 + 5 + 5)

        final_value = response.data['indicators'][0]['periods'][0]['actual_value']
        self.assertEqual(final_value, (final_numerator / final_denominator) * 100)

    def test_local_updates_values_on_contributing_project_are_calculated(self):
        project_tree = ProjectHierarchyFixtureBuilder()\
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
            .build()

        response = self.send_request(project_tree.root)

        updates_numerator = response.data['indicators'][0]['periods'][0]['contributors'][0]['updates_numerator']
        self.assertEqual(updates_numerator, 1)

        updates_denominator = response.data['indicators'][0]['periods'][0]['contributors'][0]['updates_denominator']
        self.assertEqual(updates_denominator, 5)

        updates_value = response.data['indicators'][0]['periods'][0]['contributors'][0]['updates_value']
        self.assertEqual(updates_value, (updates_numerator / updates_denominator) * 100)

    def test_local_updates_values_on_lead_project_are_calculated(self):
        project_tree = ProjectHierarchyFixtureBuilder()\
            .with_hierarchy({
                'title': 'A',
                'contributors': [
                    {'title': 'B'},
                ]
            })\
            .with_percentage_indicators()\
            .with_updates_on('A', [{'numerator': 1, 'denominator': 5}])\
            .with_updates_on('B', [{'numerator': 1, 'denominator': 5}])\
            .build()

        response = self.send_request(project_tree.root)

        updates_numerator = response.data['indicators'][0]['periods'][0]['updates_numerator']
        self.assertEqual(updates_numerator, 1)

        updates_denominator = response.data['indicators'][0]['periods'][0]['updates_denominator']
        self.assertEqual(updates_denominator, 5)

        updates_value = response.data['indicators'][0]['periods'][0]['updates_value']
        self.assertEqual(updates_value, (updates_numerator / updates_denominator) * 100)

    def test_calculate_only_approved_updates(self):
        project_tree = ProjectHierarchyFixtureBuilder()\
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
            .build()

        response = self.send_request(project_tree.root)

        final_numerator = response.data['indicators'][0]['periods'][0]['actual_numerator']
        self.assertEqual(final_numerator, 2)

        final_denominator = response.data['indicators'][0]['periods'][0]['actual_denominator']
        self.assertEqual(final_denominator, 5)

        final_value = response.data['indicators'][0]['periods'][0]['actual_value']
        self.assertEqual(final_value, (final_numerator / final_denominator) * 100)

    def test_handle_update_with_null_value(self):
        project_tree = ProjectHierarchyFixtureBuilder()\
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
            .build()

        response = self.send_request(project_tree.root)

        final_numerator = response.data['indicators'][0]['periods'][0]['actual_numerator']
        self.assertEqual(final_numerator, 2)

        final_denominator = response.data['indicators'][0]['periods'][0]['actual_denominator']
        self.assertEqual(final_denominator, 5)

        final_value = response.data['indicators'][0]['periods'][0]['actual_value']
        self.assertEqual(final_value, (final_numerator / final_denominator) * 100)


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
