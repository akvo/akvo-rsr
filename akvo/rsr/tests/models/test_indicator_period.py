# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.

# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.contrib.auth import get_user_model

from akvo.rsr.models import Indicator, IndicatorPeriod, IndicatorPeriodData, Project, Result
from akvo.rsr.tests.base import BaseTestCase


User = get_user_model()


class IndicatorPeriodModelTestCase(BaseTestCase):
    """Tests for the indicator period model"""

    def setUp(self):
        # Clear all projects, users since some tests may not tear down!
        self.tearDown()

        # Setup a project with results framework and a user
        self.project = Project.objects.create(title="Test project 1")
        self.result = Result.objects.create(project=self.project, title='Test Result')
        self.indicator = Indicator.objects.create(result=self.result, title='Test Indicator')
        self.period = IndicatorPeriod.objects.create(indicator=self.indicator,
                                                     actual_comment='initial actual comment')
        self.user = User.objects.create(username='user1@com.com', email='user1@com.com')

    def tearDown(self):
        Project.objects.all().delete()
        User.objects.all().delete()

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

    def test_period_data_non_ascii_updates_actual_comment(self):
        """Test that adding IndicatorPeriodData with unicode text works."""

        # Given
        period = self.period
        user = self.user

        # When
        data = IndicatorPeriodData.objects.create(text=u'perïöd data comment',
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
        data_1 = IndicatorPeriodData.objects.create(text=u'perïöd data_1 comment',
                                                    period=period,
                                                    user=user,
                                                    status=IndicatorPeriodData.STATUS_APPROVED_CODE)
        data_2 = IndicatorPeriodData.objects.create(text=u'perïöd data_2 comment',
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
