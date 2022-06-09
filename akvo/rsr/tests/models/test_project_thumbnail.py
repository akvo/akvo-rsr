# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
from pathlib import Path

from django.core.files.uploadedfile import SimpleUploadedFile

from akvo.rsr.models import (
    Project,
)
from akvo.rsr.models.project_thumbnail import get_cached_thumbnail
from akvo.rsr.tests.base import BaseTestCase

FILE = Path(__file__)
DIR = FILE.parent
PARENT = DIR.parent

IMAGE_PATH = PARENT / "iati_export" / "test_image.jpg"


class ProjectThumbnailModelTestCase(BaseTestCase):
    """Tests for the project model"""

    def test_signal_without_image(self):
        project = Project.objects.create(title="Test project")
        self.assertFalse(project.thumbnails.all().exists())

    def test_signal_with_image(self):
        project = Project.objects.create(
            title="Test project",
            current_image=SimpleUploadedFile(
                name='test_image.jpg',
                content=open(IMAGE_PATH, 'rb').read(),
                content_type='image/jpeg'
            )
        )
        self.assertEqual(project.thumbnails.all().count(), 1)

        project.title = "Not a test project anymore"
        project.save()

        # Saving shouldn't change the number of thumbnails
        self.assertEqual(project.thumbnails.all().count(), 1)


class GetCachedThumbnailTestCase(BaseTestCase):
    def test_without_image(self):
        project = Project.objects.create(title="Test project")
        self.assertIsNone(get_cached_thumbnail(project, "350x200"))


class GetCachedThumbnailWithImageTestCase(BaseTestCase):

    def setUp(self):
        super().setUp()
        self.project = Project.objects.create(
            title="Test project",
            current_image=SimpleUploadedFile(
                name='test_image.jpg',
                content=open(IMAGE_PATH, 'rb').read(),
                content_type='image/jpeg'
            )
        )

    def test_from_get(self):
        thumb = get_cached_thumbnail(self.project, "350x200")
        self.assertEqual(thumb, self.project.thumbnails.first())

    def test_from_prefetched(self):
        prefetched_project = Project.objects.filter(id=self.project.id).prefetch_related("thumbnails").first()
        thumb = get_cached_thumbnail(prefetched_project, "350x200")
        self.assertEqual(thumb, self.project.thumbnails.first())

    def test_get_missing_thumbnail(self):
        """Should generate a new thumbnail on the fly"""
        count_before = self.project.thumbnails.all().count()

        thumb = get_cached_thumbnail(self.project, "100x100")

        count_after = self.project.thumbnails.all().count()
        self.assertEqual(count_after - count_before, 1)

        self.assertEqual(thumb, self.project.thumbnails.filter(geometry="100x100").first())
