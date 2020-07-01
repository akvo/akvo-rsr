# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from collections import namedtuple

from django.conf import settings
from django.contrib.staticfiles.finders import FileSystemFinder

from akvo.rsr.tests.base import BaseTestCase
from akvo.rsr.templatetags import maps, rsr_filters


class TemplateTagsTestCase(BaseTestCase):
    """Tests for template tags."""

    def test_og_image_url(self):
        Image = namedtuple('Image', ['url'])

        image = Image('/media/foo.jpg')
        og_img_url = rsr_filters.og_image_url(image, 'localhost')
        self.assertEqual(og_img_url, 'https://localhost/media/foo.jpg')

        url = 'https://storage.googleapis.com/akvo-rsr-test-media-files/cache/03/3d/foo.jpg'
        image = Image(url)
        og_img_url = rsr_filters.og_image_url(image, 'rsr.akvo.org')
        self.assertEqual(og_img_url, url)

        image = None
        og_img_url = rsr_filters.og_image_url(image, 'rsr.akvo.org')
        self.assertTrue(og_img_url.endswith('rsrLogo.svg'))


class MapsTestCase(BaseTestCase):
    """Test case for the maps templatetags"""

    def test_maps_markers_exist(self):
        # Given
        icons = [
            getattr(maps, attr) for attr in dir(maps) if attr.endswith('_ICON')
        ]
        finder = FileSystemFinder()
        relative_paths = [
            icon.lstrip(settings.STATIC_URL) for icon in icons
        ]

        # When
        absolute_paths = [finder.find(path) for path in relative_paths]

        # Then
        for path in absolute_paths:
            self.assertTrue(path)
