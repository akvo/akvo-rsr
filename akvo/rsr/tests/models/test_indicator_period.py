# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.

# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.contrib.auth import get_user_model
from django.db.models import ProtectedError

from akvo.rsr.models import Indicator, IndicatorPeriod, IndicatorPeriodData, Project, Result
from akvo.rsr.models.result.utils import QUALITATIVE, QUANTITATIVE
from akvo.rsr.tests.base import BaseTestCase


User = get_user_model()


class IndicatorPeriodModelTestCase(BaseTestCase):
    """Tests for the indicator period model"""

    def setUp(self):
        # Setup a project with results framework and a user
        self.project = Project.objects.create(title="Test project 1")
        self.result = Result.objects.create(project=self.project, title='Test Result')
        self.indicator = Indicator.objects.create(result=self.result, title='Test Indicator')
        self.period = IndicatorPeriod.objects.create(indicator=self.indicator,
                                                     actual_comment='initial actual comment')
        self.user = User.objects.create(username='user1@com.com', email='user1@com.com')

    def test_unapproved_period_data_does_not_update_actual_comment(self):
        """Unapproved IndicatorPeriodData doesn't update IndicatorPeriod.actual_comment."""

        # Given
        period = self.period
        user = self.user

        # When
        data = IndicatorPeriodData.objects.create(text='period data comment',
                                                  period=period,
                                                  user=user)

        # Then
        period = IndicatorPeriod.objects.get(id=period.id)
        self.assertNotIn(data.text, period.actual_comment)

    def test_period_data_updates_actual_comment(self):
        """Adding IndicatorPeriodData updates IndicatorPeriod.actual_comment."""

        # Given
        period = self.period
        user = self.user

        # When
        data = IndicatorPeriodData.objects.create(text='period data comment',
                                                  period=period,
                                                  user=user,
                                                  status=IndicatorPeriodData.STATUS_APPROVED_CODE)

        # Then
        period = IndicatorPeriod.objects.get(id=period.id)
        self.assertIn(data.text, period.actual_comment)

    def test_approved_period_data_with_empty_text_does_not_update_actual_comment(self):
        # Given
        period = self.period
        user = self.user

        # When
        IndicatorPeriodData.objects.create(text=' ',
                                           period=period,
                                           user=user,
                                           status=IndicatorPeriodData.STATUS_APPROVED_CODE)

        # Then
        period = IndicatorPeriod.objects.get(id=period.id)
        self.assertEqual('', period.actual_comment)

    def test_period_data_non_ascii_updates_actual_comment(self):
        """Test that adding IndicatorPeriodData with unicode text works."""

        # Given
        period = self.period
        user = self.user

        # When
        data = IndicatorPeriodData.objects.create(text='perïöd data comment',
                                                  period=period,
                                                  user=user,
                                                  status=IndicatorPeriodData.STATUS_APPROVED_CODE)

        # Then
        period = IndicatorPeriod.objects.get(id=period.id)
        self.assertIn(data.text, period.actual_comment)

    def test_multiple_period_data_updates_actual_comment(self):
        """Test that adding multiple IndicatorPeriodData updates actual_comment."""

        # Given
        period = self.period
        user = self.user

        # When
        data_1 = IndicatorPeriodData.objects.create(text='perïöd data_1 comment',
                                                    period=period,
                                                    user=user,
                                                    status=IndicatorPeriodData.STATUS_APPROVED_CODE)
        data_2 = IndicatorPeriodData.objects.create(text='perïöd data_2 comment',
                                                    period=period,
                                                    user=user,
                                                    status=IndicatorPeriodData.STATUS_APPROVED_CODE)

        # Then
        period = IndicatorPeriod.objects.get(id=period.id)
        self.assertIn(data_2.text, period.actual_comment)
        self.assertIn(data_1.text, period.actual_comment)
        # newer update's text appears before older one's
        self.assertLess(period.actual_comment.index(data_2.text), period.actual_comment.index(data_1.text))

    def test_period_data_deletion_updates_actual_comment(self):

        # Given
        period = self.period
        user = self.user
        data = IndicatorPeriodData.objects.create(text='period data comment',
                                                  period=period,
                                                  user=user,
                                                  status=IndicatorPeriodData.STATUS_APPROVED_CODE)

        # When
        data.delete()

        # Then
        period = IndicatorPeriod.objects.get(id=period.id)
        self.assertNotIn(data.text, period.actual_comment)

    def test_indicator_period_data_prevents_deletion(self):
        # Given
        period = self.period
        user = self.user
        IndicatorPeriodData.objects.create(text='period data comment',
                                           period=period,
                                           user=user,
                                           status=IndicatorPeriodData.STATUS_APPROVED_CODE)

        # When/Then
        with self.assertRaises(ProtectedError):
            period.delete()
        IndicatorPeriod.objects.get(pk=period.pk)

        with self.assertRaises(ProtectedError):
            self.indicator.delete()
        Indicator.objects.get(pk=self.indicator.pk)

        with self.assertRaises(ProtectedError):
            self.result.delete()
        Result.objects.get(pk=self.result.pk)

        with self.assertRaises(ProtectedError):
            self.project.delete()
        Project.objects.get(pk=self.project.pk)

    def test_update_score(self):
        # Quantitative updates don't try to update score
        indicator = Indicator.objects.create(
            result=self.result, title='Test Indicator', type=QUANTITATIVE,
            scores=['Good', 'Bad', 'Ugly'])
        period = IndicatorPeriod.objects.create(indicator=indicator)
        self.assertIsNone(period.score_index)
        IndicatorPeriodData.objects.create(user=self.user, score_index=0, period=period,
                                           status=IndicatorPeriodData.STATUS_APPROVED_CODE)
        self.assertIsNone(period.score_index)

        # Qualitative updates don't update score if no scores on indicator
        quant_indicator = Indicator.objects.create(
            result=self.result, title='Test Indicator', type=QUALITATIVE)
        period = IndicatorPeriod.objects.create(indicator=quant_indicator)
        self.assertIsNone(period.score_index)
        IndicatorPeriodData.objects.create(user=self.user, score_index=0, period=period,
                                           status=IndicatorPeriodData.STATUS_APPROVED_CODE)
        self.assertIsNone(period.score_index)

        # Qualitative updates update score for new approved updates
        quant_indicator = Indicator.objects.create(
            result=self.result, title='Test Indicator', type=QUALITATIVE,
            scores=['Good', 'Bad', 'Ugly'])
        period = IndicatorPeriod.objects.create(indicator=quant_indicator)
        self.assertIsNone(period.score_index)
        update = IndicatorPeriodData.objects.create(user=self.user, score_index=0, period=period,
                                                    status=IndicatorPeriodData.STATUS_APPROVED_CODE)
        self.assertEqual(period.score_index, update.score_index)

        # Changing update state to draft resets score
        update.status = IndicatorPeriodData.STATUS_DRAFT_CODE
        update.save(update_fields=['status'])
        period.refresh_from_db()
        self.assertIsNone(period.score_index)

    def test_deleting_parent_period(self):
        """Child periods should be deleted when a parent is deleted"""
        child_project = Project.objects.create(title="Child Test project 1")
        child_project.set_parent(self.project)
        child_result = Result.objects.create(project=child_project, title='Child Test Result')
        child_indicator = Indicator.objects.create(result=child_result, title='Child Test Indicator')
        child_period = IndicatorPeriod.objects.create(
            indicator=child_indicator,
            actual_comment='child initial actual comment',
            parent_period=self.period
        )

        self.period.delete()

        self.assertIsNone(IndicatorPeriod.objects.filter(id=child_period.id).first())
        self.assertEqual(child_indicator.periods.count(), 0)
