# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.core.files import File
from django.core.files.temp import NamedTemporaryFile

from akvo.utils import file_from_zip_archive, model_and_instance_based_filename

from ... import ImportMapper, akvo_ns


class CurrentImage(ImportMapper):

    def __init__(self, iati_import_job, parent_elem, project, globals,
                 related_obj=None):
        super(CurrentImage, self).__init__(iati_import_job, parent_elem,
                                           project, globals, related_obj)

    def do_import(self):
        """
        :return: List; contains fields that have changed
        """
        from . import same_data

        changes = []

        photo_id = self.get_attrib(self.parent_elem, akvo_ns('photo-id'), 'current_image')
        current_image = file_from_zip_archive(
            self.iati_import_job.iati_xml_file, "out_proj/{}.jpg".format(photo_id))
        if current_image:
            tmp_file = NamedTemporaryFile()
            for line in current_image.readlines():
                tmp_file.write(line)
            tmp_file.flush()
            # update current image if it's different from the existing one
            try:
                old_file = self.project.current_image.file
            except (IOError, ValueError):
                old_file = None
            new_file = File(tmp_file)
            if not same_data(old_file, new_file):
                filename = model_and_instance_based_filename(
                    'Project', self.project.pk, 'current_image', 'image.jpg')
                new_file.seek(0)
                self.project.current_image.save(filename, new_file)
                changes += ['current_image']

        current_image_caption = self.get_attrib(
            self.parent_elem, akvo_ns('image-caption'), 'current_image_caption')
        if current_image_caption:
            changes += self.update_project_field('current_image_caption', current_image_caption)

        current_image_credit = self.get_attrib(
            self.parent_elem, akvo_ns('photo-credit'), 'current_image_credit')
        if current_image_credit:
            changes += self.update_project_field('current_image_credit', current_image_credit)

        return changes
