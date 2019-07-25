# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import datetime

from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError

from akvo.rsr.models import Indicator, IndicatorPeriod, Project, Result, RelatedProject
from akvo.rsr.tests.base import BaseTestCase
from akvo.rsr.models.result.utils import QUALITATIVE

User = get_user_model()


class IndicatorModelTestCase(BaseTestCase):
    """Tests for the indicator period model"""

    def setUp(self):
        # Clear all projects, users since some tests may not tear down!
        self.tearDown()

        self.parent_project = Project.objects.create(title="Parent project",)
        self.child_project = Project.objects.create(title="Child project",)

        RelatedProject.objects.create(project=self.parent_project,
                                      related_project=self.child_project,
                                      relation=RelatedProject.PROJECT_RELATION_CHILD)

        self.result = Result.objects.create(project=self.parent_project, title="Result #1",
                                            type="1")
        self.indicator = Indicator.objects.create(result=self.result, title="Indicator #1",
                                                  measure="1")
        self.today = datetime.date.today()
        self.period = IndicatorPeriod.objects.create(
            indicator=self.indicator, period_start=self.today,
            period_end=self.today + datetime.timedelta(days=1), target_value="100"
        )
        self.user = self.create_user('frank@example.com', password='Passw0rd!Passw0rd!')

    def tearDown(self):
        Result.objects.all().delete()
        Project.objects.all().delete()
        User.objects.all().delete()
        RelatedProject.objects.all().delete()

    def test_import_indicator(self):
        # when
        parent_indicator = Indicator.objects.get(result__project=self.parent_project)
        indicator = self.child_project.import_indicator(parent_indicator.pk)
        # then
        self.assertEqual(indicator.result.project, self.child_project)
        self.assertEqual(indicator.parent_indicator, self.indicator)

    def test_import_indicator_from_non_parent_project(self):
        # when
        parent_indicator = Indicator.objects.get(result__project=self.parent_project)
        RelatedProject.objects.all().delete()
        # then
        with self.assertRaises(Project.DoesNotExist):
            self.child_project.import_indicator(parent_indicator.pk)

    def test_import_indicator_no_parent_indicator(self):
        # when
        non_existing_indicator_id = 0
        # then
        with self.assertRaises(Indicator.DoesNotExist):
            self.child_project.import_indicator(non_existing_indicator_id)

    def test_import_indicator_wrong_parent_indicator_project(self):
        # when
        project = Project.objects.create(title="Parent project 2")
        result = Result.objects.create(project=project, title="Result #2", type="1")
        indicator = Indicator.objects.create(result=result, title="Indicator #2", measure="1")
        # then
        with self.assertRaises(ValidationError) as context:
            self.child_project.import_indicator(indicator.pk)
        exception = context.exception
        self.assertEqual(exception.message,
                         "Parent indicator's project is not the correct parent project")

    def test_import_indicator_already_present_indicator(self):
        # when
        parent_indicator = Indicator.objects.get(result__project=self.parent_project)
        self.child_project.import_results()
        # then
        with self.assertRaises(ValidationError) as context:
            self.child_project.import_indicator(parent_indicator.pk)
        exception = context.exception
        self.assertEqual(exception.message, "Indicator already exists")

    def test_qualitative_indicator_import(self):
        # Given
        parent_indicator = Indicator.objects.create(
            result=self.result,
            type=QUALITATIVE,
            title='Yet another qualitative indicator',
        )

        # When
        self.child_project.import_results()

        # Then
        child_indicator = parent_indicator.child_indicators.first()
        self.assertEqual(child_indicator.type, parent_indicator.type)
        self.assertEqual(child_indicator.title, parent_indicator.title)

    def test_indicator_type_update_propogates(self):
        # Given
        parent_indicator = Indicator.objects.get(result__project=self.parent_project)
        self.child_project.import_results()
        child_indicator = parent_indicator.child_indicators.first()
        self.assertEqual(parent_indicator.type, child_indicator.type)
        self.assertNotEqual(QUALITATIVE, parent_indicator.type)

        # When
        parent_indicator.type = QUALITATIVE
        parent_indicator.save()

        # Then
        child_indicator = parent_indicator.child_indicators.first()
        self.assertEqual(QUALITATIVE, parent_indicator.type)
        self.assertEqual(parent_indicator.type, child_indicator.type)
