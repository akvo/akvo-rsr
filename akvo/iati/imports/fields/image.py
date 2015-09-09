# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from ..utils import get_text

from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.files import File
from django.core.files.temp import NamedTemporaryFile

import urllib2

VALID_IMAGE_EXTENSIONS = [
    'gif',
    'jpg',
    'jpeg',
    'png',
    'tiff'
]


def current_image(activity, project, activities_globals):
    """
    Retrieve and store the current image, as well as the image caption and credit.
    The image will be extracted from the 'url' attribute of the first 'document-link' element. If
    an image is successfully retrieved, the image caption will be based on the underlying 'title'
    element and the image credit will be based on the akvo photo-credit attribute of the
    'document-link' element.

    :param activity: ElementTree; contains all data for the activity
    :param project: Project instance
    :param activities_globals: Dictionary; contains all global activities information
    :return: List; contains fields that have changed
    """
    changes = []
    document_link_element = activity.find('document-link')

    if document_link_element is not None:
        if 'url' in document_link_element.attrib.keys():
            image_url = document_link_element.attrib['url']
            image_filename = image_url.rsplit('/', 1)[1]
            image_extension = image_url.rsplit('.', 1)[1].lower()

            if not image_extension in VALID_IMAGE_EXTENSIONS:
                raise ValidationError(u'%s is not a valid image extension' % image_extension)

            if not project.current_image or \
                    (project.current_image and
                     not project.current_image.name.rsplit('/', 1)[1] == image_filename):
                tmp_file = NamedTemporaryFile(delete=True)
                tmp_file.write(urllib2.urlopen(image_url, timeout=100).read())
                tmp_file.flush()
                project.current_image.save(image_filename, File(tmp_file))
                project.save(update_fields=['current_image'])
                changes.append('current_image')

                # Image caption
                image_caption = ''

                title_element = document_link_element.find('title')
                if title_element is not None:
                    image_caption = get_text(title_element, activities_globals['version'])

                if project.current_image_caption != image_caption[:50]:
                    project.current_image_caption = image_caption[:50]
                    project.save(update_fields=['current_image_caption'])
                    changes.append('current_image_caption')

                # Image credit
                image_credit = ''

                if '{%s}photo-credit' % settings.AKVO_NS in document_link_element.attrib.keys():
                    image_credit = document_link_element.attrib[
                        '{%s}photo-credit' % settings.AKVO_NS
                    ]

                if project.current_image_credit != image_credit[:50]:
                    project.current_image_credit = image_credit[:50]
                    project.save(update_fields=['current_image_credit'])
                    changes.append('current_image_credit')

    return changes
