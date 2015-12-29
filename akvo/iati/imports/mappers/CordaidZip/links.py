# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from os.path import basename, splitext
from urlparse import urlparse
from django.core.files import File
from django.core.files.temp import NamedTemporaryFile

from akvo.utils import file_from_zip_archive, model_and_instance_based_filename
from akvo.rsr.models.project import image_path

from ... import ImportMapper, akvo_ns

VALID_IMAGE_EXTENSIONS = ['.gif', '.jpg', '.jpeg', '.png', '.tiff']


class CurrentImage(ImportMapper):

    def __init__(self, iati_import_job, parent_elem, project, globals,
                 related_obj=None):
        super(CurrentImage, self).__init__(iati_import_job, parent_elem,
                                           project, globals, related_obj)

    def do_import(self):
        """

        :return: List; contains fields that have changed
        """
        changes = []
        image_meta_changes = []

        photo_id = self.get_attrib(self.parent_elem, akvo_ns('photo-id'), 'current_image')
        current_image = file_from_zip_archive(
                self.iati_import_job.iati_xml_file, "out_proj/{}.jpg".format(photo_id))
        if current_image:
            tmp_file = NamedTemporaryFile()
            for line in current_image.readlines():
                tmp_file.write(line)
            tmp_file.flush()
            filename = model_and_instance_based_filename(
                    'Project', self.project.pk, 'current_image', 'image.jpg')
            self.project.current_image.save(filename, File(tmp_file))
            changes.append('current_image')

        current_image_caption = self.get_attrib(
                self.parent_elem, akvo_ns('image-caption'), 'current_image_caption')
        if current_image_caption:
            self.project.current_image_caption = current_image_caption
            image_meta_changes.append('current_image_caption')

        current_image_credit = self.get_attrib(
                self.parent_elem, akvo_ns('photo-credit'), 'current_image_credit')
        if current_image_credit:
            self.project.current_image_credit = current_image_credit
            image_meta_changes.append('current_image_credit')

        if image_meta_changes:
            self.project.save(update_fields=image_meta_changes)

        return changes + image_meta_changes
