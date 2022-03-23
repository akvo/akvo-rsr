# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from akvo.rsr.tests.base import BaseTestCase
from akvo.rsr.tests.utils import ProjectFixtureBuilder, ProjectFacade
from akvo.rsr.usecases import fix_inconsistent_results as command


class SimulateMultiProjectParentResultsTestCase(BaseTestCase):

    def setUp(self):
        super().setUp()
        self.root = ProjectFixtureBuilder()\
            .with_results([
                {'title': 'Result #1'},
                {'title': 'Result #2'}
            ]).with_contributors([
                {'title': 'L1.A', 'contributors': [{'title': 'L2.A'}]},
                {'title': 'L1.B'}
            ]).build()
        self.lead = self.root\
            .get_contributor(title='L1.A')\
            .get_contributor(title='L2.A')
        self.lead.results.filter(title='Result #2').delete()
        self.lead_result = self.lead.results.first()
        self.lead_indicator = self.lead.indicators.first()
        self.lead_period = self.lead.periods.first()

        self.false_lead = self.root.get_contributor(title='L1.B')
        self.false_lead.results.filter(title='Result #1').delete()
        self.false_lead_result = self.false_lead.results.first()
        self.false_lead_indicator = self.false_lead.indicators.first()
        self.false_lead_period = self.false_lead.periods.first()

        self.project = ProjectFacade(self.create_contributor('L3.A', self.lead.object))
        self.project.object.do_import_results(self.false_lead.object)

    def test_initial_states(self):
        result1 = self.project.results.get(title='Result #1')
        self.assertEqual(result1.parent_result, self.lead_result)
        self.assertEqual(self.project.indicators.get(result=result1).parent_indicator, self.lead_indicator)
        self.assertEqual(self.project.periods.get(indicator__result=result1).parent_period, self.lead_period)

        result2 = self.project.results.get(title='Result #2')
        self.assertEqual(result2.parent_result, self.false_lead_result)
        self.assertEqual(self.project.indicators.get(result=result2).parent_indicator, self.false_lead_indicator)
        self.assertEqual(self.project.periods.get(indicator__result=result2).parent_period, self.false_lead_period)

    def test_leave_correct_parents_untouched(self):
        command.fix_inconsistent_results(self.project.results.all())

        result1 = self.project.results.get(title='Result #1')
        self.assertEqual(result1.parent_result, self.lead_result)
        self.assertEqual(self.project.indicators.get(result=result1).parent_indicator, self.lead_indicator)
        self.assertEqual(self.project.periods.get(indicator__result=result1).parent_period, self.lead_period)

    def test_delete_false_parents(self):
        command.fix_inconsistent_results(self.project.results.all())

        result2 = self.project.results.get(title='Result #2')
        self.assertIsNone(result2.parent_result)
        self.assertIsNone(self.project.indicators.get(result=result2).parent_indicator)
        self.assertIsNone(self.project.periods.get(indicator__result=result2).parent_period)


class SimulateDetachedProjectTestCase(BaseTestCase):

    def setUp(self):
        self.root = ProjectFixtureBuilder()\
            .with_results([{'title': 'Result #1'}])\
            .with_contributors([{'title': 'L1'}])\
            .build()
        self.false_lead = self.root.get_contributor(title='L1')
        self.false_lead_result = self.false_lead.results.first()
        self.false_lead_indicator = self.false_lead.indicators.first()
        self.false_lead_period = self.false_lead.periods.first()
        self.project = ProjectFixtureBuilder().build()
        self.project.object.do_import_results(self.false_lead.object)

    def test_initial_states(self):
        result = self.project.results.get(title='Result #1')
        self.assertEqual(result.parent_result, self.false_lead_result)
        self.assertEqual(self.project.indicators.get(result=result).parent_indicator, self.false_lead_indicator)
        self.assertEqual(self.project.periods.get(indicator__result=result).parent_period, self.false_lead_period)

    def test_delete_false_parents(self):
        command.fix_inconsistent_results(self.project.results.all())

        result = self.project.results.get(title='Result #1')
        self.assertIsNone(result.parent_result)
        self.assertIsNone(self.project.indicators.get(result=result).parent_indicator)
        self.assertIsNone(self.project.periods.get(indicator__result=result).parent_period)


class SimulateDetachedParentProjectTestCase(BaseTestCase):

    def setUp(self):
        super().setUp()
        self.lead = ProjectFixtureBuilder()\
            .with_title('Parent project')\
            .with_contributors([{'title': 'L1'}])\
            .build()
        self.lead_result = self.lead.results.first()
        self.lead_indicator = self.lead.indicators.first()
        self.lead_period = self.lead.periods.first()

        self.false_lead = ProjectFixtureBuilder()\
            .with_results([{'title': 'Result #1'}])\
            .build()
        self.false_lead_result = self.false_lead.results.first()
        self.false_lead_indicator = self.false_lead.indicators.first()
        self.false_lead_period = self.false_lead.periods.first()

        self.project = self.lead.get_contributor(title='L1')
        self.project.object.do_import_results(self.false_lead.object)

    def test_initial_states(self):
        result = self.project.results.get(title='Result #1')
        self.assertEqual(result.parent_result, self.false_lead_result)
        self.assertEqual(self.project.indicators.get(result=result).parent_indicator, self.false_lead_indicator)
        self.assertEqual(self.project.periods.get(indicator__result=result).parent_period, self.false_lead_period)

    def test_delete_false_parents(self):
        command.fix_inconsistent_results(self.project.results.all())

        result = self.project.results.get(title='Result #1')
        self.assertIsNone(result.parent_result)
        self.assertIsNone(self.project.indicators.get(result=result).parent_indicator)
        self.assertIsNone(self.project.periods.get(indicator__result=result).parent_period)


class SimulateWrongHierarchyLevelProjectParentResultsTestCase(BaseTestCase):

    def setUp(self):
        super().setUp()
        self.root_project = ProjectFixtureBuilder()\
            .with_results([{'title': 'Result #1'}])\
            .with_contributors([{
                'title': 'L1 Project',
                'contributors': [{
                    'title': 'L2 Project'
                }]
            }])\
            .build()
        self.root_result = self.root_project.results.get(title='Result #1')

        self.l1_project = self.root_project.get_contributor(title='L1 Project')
        self.l1_result = self.l1_project.results.get(title='Result #1')

        self.l2_project = self.l1_project.get_contributor(title='L2 Project')
        self.l2_project.results.all().delete()
        self.l2_project.object.do_import_results(self.root_project.object)

    def test_initial_states(self):
        l2_result = self.l2_project.results.get(title='Result #1')
        self.assertEqual(l2_result.parent_result, self.root_result)

    def test_fix_parent_level(self):
        command.fix_inconsistent_results(self.l2_project.results.all())

        l2_result = self.l2_project.results.get(title='Result #1')
        self.assertEqual(l2_result.parent_result, self.l1_result)
