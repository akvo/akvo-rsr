# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from django.core import management
from django.test import TestCase

from akvo.rsr.models import Indicator, IndicatorPeriod, Keyword, Project, Result


class LockUnlockPeriodsTestCase(TestCase):
    """Testing that locking and unlocking management command works correctly."""

    def setUp(self):
        self.tearDown()
        self.project_ids = []
        self.unlocked_period_ids = []
        for i in range(1, 3):
            project = Project.objects.create(title='Project-{}'.format(i))
            self.project_ids.append(project.id)
            keyword = Keyword.objects.create(label='Keyword-{}'.format(i))
            project.keywords.add(keyword)
            result = Result.objects.create(project=project)
            indicator = Indicator.objects.create(result=result)
            for j in range(1, 3):
                period = IndicatorPeriod.objects.create(indicator=indicator, locked=j % 2)
                if not period.locked:
                    self.unlocked_period_ids.append(period.id)

    def tearDown(self):
        Project.objects.all().delete()
        Keyword.objects.all().delete()

    def test_should_not_run_without_keyword(self):
        """Test that command doesn't run if no keyword is supplied."""

        # When
        with self.assertRaises(SystemExit):
            management.call_command('lock_unlock_periods', 'unlock')

    def test_unlocking_periods_works(self):
        """Test that all matching periods are unlocked."""
        # When
        management.call_command('lock_unlock_periods', 'unlock', keyword='Keyword-1')

        # Then
        project_id = self.project_ids[0]
        for period in IndicatorPeriod.objects.filter(indicator__result__project_id=project_id):
            self.assertFalse(period.locked)

        project_id = self.project_ids[1]
        for period in IndicatorPeriod.objects.filter(indicator__result__project_id=project_id):
            self.assertEqual(period.locked, period.id not in self.unlocked_period_ids)

    def test_locking_periods_works(self):
        """Test that all matching periods are locked."""
        # When
        management.call_command('lock_unlock_periods', 'lock', keyword='Keyword-2')

        # Then
        project_id = self.project_ids[0]
        for period in IndicatorPeriod.objects.filter(indicator__result__project_id=project_id):
            self.assertEqual(period.locked, period.id not in self.unlocked_period_ids)

        project_id = self.project_ids[1]
        for period in IndicatorPeriod.objects.filter(indicator__result__project_id=project_id):
            self.assertTrue(period.locked)
