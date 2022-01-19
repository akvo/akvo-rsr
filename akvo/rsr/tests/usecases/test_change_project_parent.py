# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from datetime import date

from akvo.rsr.models import Project
from akvo.rsr.tests.base import BaseTestCase
from akvo.rsr.tests.utils import ProjectFixtureBuilder
from akvo.rsr.usecases import change_project_parent as command


class ChangeProjectParentTestCase(BaseTestCase):

    def setUp(self):
        self.builder = ProjectFixtureBuilder()\
            .with_title('Parent project')\
            .with_disaggregations({'Foo': ['Bar']})\
            .with_results([{
                'title': 'Result #1',
                'indicators': [{
                    'title': 'Indicator #1',
                    'periods': [{
                        'period_start': date(2020, 1, 1),
                        'period_end': date(2020, 12, 31),
                    }]
                }]
            }])

    def test_change_parent_to_sibling(self):
        # Given
        root = self.builder\
            .with_contributors([
                {'title': 'Child project'},
                {'title': 'New project'}
            ])\
            .build()
        child_project = root.get_contributor(title='Child project')
        new_project = root.get_contributor(title='New project')
        # When
        command.change_parent(new_project.object, child_project.object)
        # Then
        self.assertEqual(new_project.object.parent(), child_project.project)
        self.assertEqual(
            new_project.results.get(title='Result #1').parent_result,
            child_project.results.get(title='Result #1')
        )
        self.assertEqual(
            new_project.indicators.get(title='Indicator #1').parent_indicator,
            child_project.indicators.get(title='Indicator #1')
        )
        self.assertEqual(
            new_project.periods.get(period_start=date(2020, 1, 1)).parent_period,
            child_project.periods.get(period_start=date(2020, 1, 1))
        )
        self.assertEqual(
            new_project.object.dimension_names.get(name='Foo').parent_dimension_name,
            child_project.object.dimension_names.get(name='Foo')
        )
        self.assertEqual(
            new_project.get_disaggregation('Foo', 'Bar').parent_dimension_value,
            child_project.get_disaggregation('Foo', 'Bar')
        )

    def test_change_parent_to_parent_sibling(self):
        # Given
        root = self.builder\
            .with_contributors([
                {'title': 'Child project', 'contributors': [{'title': 'Grand child project'}]},
                {'title': 'New project'}
            ])\
            .build()
        child_project2 = root.get_contributor(title='New project')
        grand_child = root.get_contributor(title='Grand child project')
        # When
        command.change_parent(grand_child.object, child_project2.object)

        child_project2.object.refresh_from_db()
        grand_child.object.refresh_from_db()

        # Then
        self.assertEqual(child_project2.object.id, grand_child.object.parent().id)
        self.assertEqual(
            grand_child.results.get(title='Result #1').parent_result,
            child_project2.results.get(title='Result #1')
        )
        self.assertEqual(
            grand_child.indicators.get(title='Indicator #1').parent_indicator,
            child_project2.indicators.get(title='Indicator #1')
        )
        self.assertEqual(
            grand_child.periods.get(period_start=date(2020, 1, 1)).parent_period,
            child_project2.periods.get(period_start=date(2020, 1, 1))
        )
        self.assertEqual(
            grand_child.object.dimension_names.get(name='Foo').parent_dimension_name,
            child_project2.object.dimension_names.get(name='Foo')
        )
        self.assertEqual(
            grand_child.get_disaggregation('Foo', 'Bar').parent_dimension_value,
            child_project2.get_disaggregation('Foo', 'Bar')
        )

    def test_set_new_parent(self):
        """
        Attempt to set a parent for a project without a parent

        This isn't currently supported, so it should fail
        """
        root = self.builder.build()
        with self.assertRaisesRegex(Project.DoesNotExist, "New parent not in DB"):
            command.change_parent(root.object, Project())


class SimulatePartialResultsOnTargetProjectTestCase(BaseTestCase):

    def setUp(self):
        super().setUp()
        self.root = ProjectFixtureBuilder()\
            .with_results([
                {'title': 'Result #1'},
                {'title': 'Result #2'}
            ]).with_contributors([
                {'title': 'L1.A', 'contributors': [{'title': 'L2.A'}]},
                {'title': 'Test project'}
            ]).build()
        self.target_lead = self.root\
            .get_contributor(title='L1.A')\
            .get_contributor(title='L2.A')
        self.target_lead.results.filter(title='Result #2').delete()
        self.project = self.root.get_contributor(title='Test project')

    def test_initial_states(self):
        root_result1 = self.root.results.get(title='Result #1')
        project_result1 = self.project.results.get(title='Result #1')
        self.assertEqual(project_result1.parent_result, root_result1)
        self.assertEqual(
            self.project.indicators.get(result=project_result1).parent_indicator,
            self.root.indicators.get(result=root_result1)
        )
        self.assertEqual(
            self.project.periods.get(indicator__result=project_result1).parent_period,
            self.root.periods.get(indicator__result=root_result1)
        )

        root_result2 = self.root.results.get(title='Result #2')
        project_result2 = self.project.results.get(title='Result #2')
        self.assertEqual(project_result2.parent_result, root_result2)
        self.assertEqual(
            self.project.indicators.get(result=project_result2).parent_indicator,
            self.root.indicators.get(result=root_result2)
        )
        self.assertEqual(
            self.project.periods.get(indicator__result=project_result2).parent_period,
            self.root.periods.get(indicator__result=root_result2)
        )

    def test_change_parent(self):
        command.change_parent(self.project.object, self.target_lead.object)

        lead_result1 = self.target_lead.results.get(title='Result #1')
        project_result1 = self.project.results.get(title='Result #1')
        self.assertEqual(project_result1.parent_result, lead_result1)
        self.assertEqual(
            self.project.indicators.get(result=project_result1).parent_indicator,
            self.target_lead.indicators.get(result=lead_result1)
        )
        self.assertEqual(
            self.project.periods.get(indicator__result=project_result1).parent_period,
            self.target_lead.periods.get(indicator__result=lead_result1)
        )

        project_result2 = self.project.results.get(title='Result #2')
        self.assertIsNone(project_result2.parent_result)
        self.assertIsNone(self.project.indicators.get(result=project_result2).parent_indicator)
        self.assertIsNone(self.project.periods.get(indicator__result=project_result2).parent_period)
