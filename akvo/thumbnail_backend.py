# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from sorl.thumbnail.base import ThumbnailBackend, EXTENSIONS
from sorl.thumbnail.conf import settings
from sorl.thumbnail.helpers import tokey, serialize


class CustomThumbnailBackend(ThumbnailBackend):

    def _get_thumbnail_filename(self, source, geometry_string, options):
        """Computes the destination filename.

        Overridden to generate the same filename as generated with
        'django.core.files.storage.FileSystemStorage' backend, irrespective of
        what the current storage back-end is.

        """
        source_key = tokey(source.name, 'django.core.files.storage.FileSystemStorage')
        key = tokey(source_key, geometry_string, serialize(options))
        path = '%s/%s/%s' % (key[:2], key[2:4], key)
        return '%s%s.%s' % (settings.THUMBNAIL_PREFIX, path, EXTENSIONS[options['format']])
