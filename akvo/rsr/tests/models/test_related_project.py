# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.contrib.auth import get_user_model
from django.db import IntegrityError
from django.test import TestCase

from akvo.rsr.models import Project, RelatedProject
from akvo.rsr.models.related_project import CyclicRelationship, SelfParentDisallowed

User = get_user_model()


class RelatedProjectTestCase(TestCase):
    """Tests for the related project model."""

    def setUp(self):
        # Setup a project with results framework and a user
        self.project_1 = Project.objects.create(title="Test project 1")
        self.project_1.publish()
        self.project_2 = Project.objects.create(title="Test project 2")
        self.project_2.publish()

    def test_prevent_cyclic_relationships(self):
        # Given
        RelatedProject.objects.create(
            project=self.project_1,
            related_project=self.project_2,
            relation=RelatedProject.PROJECT_RELATION_CHILD
        )

        # When/Then
        with self.assertRaises(CyclicRelationship):
            RelatedProject.objects.create(
                project=self.project_2,
                related_project=self.project_1,
                relation=RelatedProject.PROJECT_RELATION_CHILD
            )

    def test_prevent_same_project_with_different_relationships(self):
        # Given
        RelatedProject.objects.create(
            project=self.project_1,
            related_project=self.project_2,
            relation=RelatedProject.PROJECT_RELATION_CHILD
        )

        # When/Then
        with self.assertRaises(IntegrityError):
            RelatedProject.objects.create(
                project=self.project_1,
                related_project=self.project_2,
                relation=RelatedProject.PROJECT_RELATION_PARENT
            )

    def test_prevent_setting_self_as_child_or_parent(self):
        # When/Then
        with self.assertRaises(SelfParentDisallowed):
            RelatedProject.objects.create(
                project=self.project_1,
                related_project=self.project_1,
                relation=RelatedProject.PROJECT_RELATION_PARENT
            )

        # When/Then
        with self.assertRaises(SelfParentDisallowed):
            RelatedProject.objects.create(
                project=self.project_1,
                related_project=self.project_1,
                relation=RelatedProject.PROJECT_RELATION_CHILD
            )
