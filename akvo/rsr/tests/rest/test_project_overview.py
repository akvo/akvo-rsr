# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.

# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from akvo.rsr.models import Result, Indicator, IndicatorPeriod, IndicatorPeriodData
from akvo.rsr.tests.base import BaseTestCase
from akvo.rsr.models.result.utils import QUANTITATIVE, QUALITATIVE, PERCENTAGE_MEASURE


class QuantitativeUnitAggregationTestCase(BaseTestCase):
    def test_updates_from_contributing_projects_are_aggregated_to_lead_project(self):
        fixture = ProjectHierarchyFixtureBuilder(self)\
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

        response = fixture.hit_endpoint()

        final_value = response.data['indicators'][0]['periods'][0]['actual_value']
        self.assertEqual(final_value, 1 + 2)

    def test_updates_from_every_level_of_hierarchy_are_calculated_for_final_value(self):
        fixture = ProjectHierarchyFixtureBuilder(self)\
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

        response = fixture.hit_endpoint()

        final_value = response.data['indicators'][0]['periods'][0]['actual_value']
        self.assertEqual(final_value, 1 + 2 + 3)

    def test_local_updates_value_on_contributing_project_are_calculated(self):
        fixture = ProjectHierarchyFixtureBuilder(self)\
            .with_hierarchy({
                'title': 'A',
                'contributors': [
                    {'title': 'B'},
                ]
            })\
            .with_updates_on('B', [{'value': 1}, {'value': 1}])\
            .build()

        response = fixture.hit_endpoint()

        updates_value = response.data['indicators'][0]['periods'][0]['contributors'][0]['updates_value']
        self.assertEqual(updates_value, 1 + 1)

    def test_local_updates_value_on_lead_project_are_calculated(self):
        fixture = ProjectHierarchyFixtureBuilder(self)\
            .with_hierarchy({
                'title': 'A',
                'contributors': [
                    {'title': 'B'}
                ]
            })\
            .with_updates_on('A', [{'value': 1}, {'value': 1}])\
            .with_updates_on('B', [{'value': 1}])\
            .build()

        response = fixture.hit_endpoint()

        updates_value = response.data['indicators'][0]['periods'][0]['updates_value']
        self.assertEqual(updates_value, 1 + 1)

    def test_only_approved_updates_on_contributing_project_are_calculated(self):
        fixture = ProjectHierarchyFixtureBuilder(self)\
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

        response = fixture.hit_endpoint()

        updates_value = response.data['indicators'][0]['periods'][0]['contributors'][0]['updates_value']
        self.assertEqual(updates_value, 2)

    def test_only_approved_updates_on_lead_project_are_calculated(self):
        fixture = ProjectHierarchyFixtureBuilder(self)\
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

        response = fixture.hit_endpoint()

        updates_value = response.data['indicators'][0]['periods'][0]['updates_value']
        self.assertEqual(updates_value, 2)

    def test_handle_update_with_null_value(self):
        fixture = ProjectHierarchyFixtureBuilder(self)\
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

        response = fixture.hit_endpoint()

        updates_value = response.data['indicators'][0]['periods'][0]['contributors'][0]['updates_value']
        self.assertEqual(updates_value, 2)


class QuantitativePercentageAggregationTestCase(BaseTestCase):
    def test_updates_from_contributing_projects_are_aggregated_to_lead_project(self):
        fixture = ProjectHierarchyFixtureBuilder(self)\
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

        response = fixture.hit_endpoint()

        final_numerator = response.data['indicators'][0]['periods'][0]['actual_numerator']
        self.assertEqual(final_numerator, 1 + 2)

        final_denominator = response.data['indicators'][0]['periods'][0]['actual_denominator']
        self.assertEqual(final_denominator, 5 + 5)

        final_value = response.data['indicators'][0]['periods'][0]['actual_value']
        self.assertEqual(final_value, (final_numerator / final_denominator) * 100)

    def test_updates_from_every_level_of_hierarchy_are_calculated_for_final_values(self):
        fixture = ProjectHierarchyFixtureBuilder(self)\
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

        response = fixture.hit_endpoint()

        final_numerator = response.data['indicators'][0]['periods'][0]['actual_numerator']
        self.assertEqual(final_numerator, 1 + 2 + 3)

        final_denominator = response.data['indicators'][0]['periods'][0]['actual_denominator']
        self.assertEqual(final_denominator, 5 + 5 + 5)

        final_value = response.data['indicators'][0]['periods'][0]['actual_value']
        self.assertEqual(final_value, (final_numerator / final_denominator) * 100)

    def test_local_updates_values_on_contributing_project_are_calculated(self):
        fixture = ProjectHierarchyFixtureBuilder(self)\
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

        response = fixture.hit_endpoint()

        updates_numerator = response.data['indicators'][0]['periods'][0]['contributors'][0]['updates_numerator']
        self.assertEqual(updates_numerator, 1)

        updates_denominator = response.data['indicators'][0]['periods'][0]['contributors'][0]['updates_denominator']
        self.assertEqual(updates_denominator, 5)

        updates_value = response.data['indicators'][0]['periods'][0]['contributors'][0]['updates_value']
        self.assertEqual(updates_value, (updates_numerator / updates_denominator) * 100)

    def test_local_updates_values_on_lead_project_are_calculated(self):
        fixture = ProjectHierarchyFixtureBuilder(self)\
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

        response = fixture.hit_endpoint()

        updates_numerator = response.data['indicators'][0]['periods'][0]['updates_numerator']
        self.assertEqual(updates_numerator, 1)

        updates_denominator = response.data['indicators'][0]['periods'][0]['updates_denominator']
        self.assertEqual(updates_denominator, 5)

        updates_value = response.data['indicators'][0]['periods'][0]['updates_value']
        self.assertEqual(updates_value, (updates_numerator / updates_denominator) * 100)

    def test_calculate_only_approved_updates(self):
        fixture = ProjectHierarchyFixtureBuilder(self)\
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

        response = fixture.hit_endpoint()

        final_numerator = response.data['indicators'][0]['periods'][0]['actual_numerator']
        self.assertEqual(final_numerator, 2)

        final_denominator = response.data['indicators'][0]['periods'][0]['actual_denominator']
        self.assertEqual(final_denominator, 5)

        final_value = response.data['indicators'][0]['periods'][0]['actual_value']
        self.assertEqual(final_value, (final_numerator / final_denominator) * 100)

    def test_handle_update_with_null_value(self):
        fixture = ProjectHierarchyFixtureBuilder(self)\
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

        response = fixture.hit_endpoint()

        final_numerator = response.data['indicators'][0]['periods'][0]['actual_numerator']
        self.assertEqual(final_numerator, 2)

        final_denominator = response.data['indicators'][0]['periods'][0]['actual_denominator']
        self.assertEqual(final_denominator, 5)

        final_value = response.data['indicators'][0]['periods'][0]['actual_value']
        self.assertEqual(final_value, (final_numerator / final_denominator) * 100)


class ProjectHierarchyFixtureBuilder(object):
    def __init__(self, test):
        self.test = test
        self.project_tree = {}
        self.updates = {}
        self.project_list = []
        self.is_percentage = False

    def with_hierarchy(self, project_tree):
        self.project_tree = project_tree
        return self

    def with_percentage_indicators(self, flag=True):
        self.is_percentage = flag
        return self

    def with_updates_on(self, project_title, updates):
        self.updates[project_title] = updates
        return self

    def build(self):
        user = self.test.create_user("user@akvo.org", "password", is_admin=True)
        self.test.c.login(username=user.username, password="password")

        project_map = {}
        title = self.project_tree['title']
        root, result = self._build_root(title)
        project_map[title] = root
        url = '/rest/v1/project/{}/result/{}/?format=json'.format(root.pk, result.pk)
        self._build_contributors(self.project_tree.get('contributors', []), root, project_map)

        fixture = ProjectHierarchyFixture(self.test, url, project_map)
        self._handle_updates(fixture, user, project_map)

        return fixture

    def _build_root(self, title):
        root = self.test.create_project(title)
        result = Result.objects.create(project=root, title='Result #1', type='1')
        indicator = self._build_percentage_indicator(result) \
            if self.is_percentage \
            else self._build_unit_indicator(result)
        IndicatorPeriod.objects.create(indicator=indicator, period_start='2020-01-01', period_end='2020-12-31')
        return root, result

    def _build_percentage_indicator(self, result):
        return Indicator.objects.create(result=result, type=QUANTITATIVE, measure=PERCENTAGE_MEASURE)

    def _build_unit_indicator(self, result):
        return Indicator.objects.create(result=result, type=QUANTITATIVE, measure="1")

    def _build_contributors(self, contributors, lead, project_map):
        for contributor in contributors:
            title = contributor['title']
            project = self.test.create_contributor(title, lead)
            project_map[title] = project
            self._build_contributors(contributor.get('contributors', []), project, project_map)

    def _handle_updates(self, fixture, user, project_map):
        for project_title, updates in self.updates.items():
            period = fixture.get_period_of(project_title)
            for update in updates:
                IndicatorPeriodData.objects.create(
                    period=period,
                    user=user,
                    value=update.get('value', None),
                    numerator=update.get('numerator', None),
                    denominator=update.get('denominator', None),
                    status=update.get('status', 'A')
                )


class ProjectHierarchyFixture(object):
    def __init__(self, test, url, project_map):
        self.test = test
        self.url = url
        self.project_map = project_map

    def hit_endpoint(self):
        return self.test.c.get(self.url)

    def get_period_of(self, project_title):
        project = self.project_map[project_title]
        return IndicatorPeriod.objects.get(indicator__result__project=project)


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
        self.assertEqual(period['aggregated_numerator'], None)
        self.assertEqual(period['aggregated_denominator'], None)
        # Check percentage aggregations
        period = percentage['periods'][0]
        self.assertEqual(period['aggregated_numerator'], (3 * 2) + (2 * 4))
        self.assertEqual(period['aggregated_denominator'], (4 * 2) + (5 * 4))
        actual = (100 * period['aggregated_numerator']) / period['aggregated_denominator']
        self.assertEqual(period['actual_value'], actual)
        self.assertEqual(period['aggregated_value'], None)

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
        self.assertEqual(period['aggregated_numerator'], None)
        self.assertEqual(period['aggregated_denominator'], None)
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
        self.assertEqual(period['aggregated_value'], None)

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
        self.parent_indicators = [
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
