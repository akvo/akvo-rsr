# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from datetime import date
from akvo.rsr.tests.base import BaseTestCase
from akvo.rsr.tests.utils import ProjectFixtureBuilder
from akvo.rsr.usecases import change_project_parent as command


class ChangeProjectParentTestCase(BaseTestCase):

    def test_change_parent_to_sibling(self):
        # Given
        root = ProjectFixtureBuilder()\
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
            }])\
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
        self.assertIsNone(new_project.object.ancestors().filter(id=root.object.id).first())
        self.assertIsNotNone(new_project.object.ancestors().filter(id=child_project.object.id).first())
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
        root = ProjectFixtureBuilder()\
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
            }])\
            .with_contributors([
                {'title': 'Child project', 'contributors': [{'title': 'Grand child project'}]},
                {'title': 'New project'}
            ])\
            .build()
        child_project2 = root.get_contributor(title='New project')
        grand_child = root.get_contributor(title='Grand child project')
        # When
        command.change_parent(grand_child.object, child_project2.object)
        # Then
        parents = grand_child.object.ancestors()
        self.assertEqual(1, len(parents))
        self.assertEqual(child_project2.object.id, parents.first().id)
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
