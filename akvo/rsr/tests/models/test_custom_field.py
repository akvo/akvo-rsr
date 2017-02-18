# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from unittest import TestCase

from akvo.rsr.models import Project, ProjectCustomField


class CustomFieldTestCase(TestCase):
    """Tests for the custom field models."""

    def tearDown(self):
        Project.objects.all().delete()
        ProjectCustomField.objects.all().delete()

    def test_unicode_value_custom_field(self):
        """Test that unicode value custom field doesn't raise unicode errors."""

        # Given
        value = u'Côte Divoire'
        project = Project.objects.create(title='Test project')
        field = ProjectCustomField.objects.create(
            project=project, section=1, value=value, order=1
        )

        # When/Then
        self.assertEqual(value, unicode(field))
