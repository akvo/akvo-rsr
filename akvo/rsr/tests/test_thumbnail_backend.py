# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from mock import patch

from sorl.thumbnail.helpers import get_module_class
from sorl.thumbnail import get_thumbnail
from sorl.thumbnail.images import ImageFile

from akvo.rsr.tests.base import BaseTestCase

GOOGLE_STORAGE = 'storages.backends.gcloud.GoogleCloudStorage'


class DummyImageFile(ImageFile):
    def exists(self):
        return True

    def serialize_storage(self):
        return GOOGLE_STORAGE


class DummyKVStore(object):
    def get(self, key):
        return False

    def get_or_set(self, source):
        return False

    def set(self, thumbnail, source):
        assert thumbnail.serialize_storage() == GOOGLE_STORAGE
        return False


class CustomThumbnailBackendTestCase(BaseTestCase):

    def test_generates_same_path_with_any_storage_backend(self):
        # Given
        image = 'foo'
        geometry = '400x400'

        filesystem_thumbnail = get_thumbnail(image, geometry)

        with patch('sorl.thumbnail.base.ImageFile', DummyImageFile):
            with patch('sorl.thumbnail.default.storage', new_callable=get_module_class(GOOGLE_STORAGE)):
                with patch('sorl.thumbnail.default.kvstore', new_callable=DummyKVStore):
                    google_thumbnail = get_thumbnail(image, geometry)

        self.assertEqual(google_thumbnail.name, filesystem_thumbnail.name)
