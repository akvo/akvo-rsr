# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
from lxml import etree
from os.path import splitext

from django.core.management import setup_environ
import settings

setup_environ(settings)

import os
from django.core.files import File
from django.core.files.temp import NamedTemporaryFile

from akvo.rsr.models import Project
from akvo.rsr.utils import model_and_instance_based_filename

FILE_CORDAID_XML = './api/xml/cordaid_iati_activities.xml'
DIR_CORDAID_IMAGES = 'api/xml/cordaid/20130423_export_xml'

def import_images(image_dir, img_to_proj_map):
    for image_name in os.listdir(image_dir):
        photo_id, ext = splitext(image_name)
        if ext in ['.png', '.jpg', '.jpeg', '.gif']:
            try:
                project = Project.objects.get(partnerships__internal_id=img_to_proj_map.get(photo_id))
                filename = model_and_instance_based_filename('Project', project.pk, 'current_image', ext)
                with open(os.path.join(os.path.dirname(os.path.realpath(__file__)), image_dir, image_name), 'rb') as f:
                    image_data = f.read()
                    image_temp = NamedTemporaryFile(delete=True)
                    image_temp.write(image_data)
                    image_temp.flush()
                    project.current_image.save(filename, File(image_temp), save=True)
                f.close()
                print "Uploaded image to project {pk}".format(pk=project.pk)
            except:
                print "Upload failed. internal_id={internal_id}".format(internal_id=img_to_proj_map.get(photo_id))

def create_mapping_images_to_projects():
    """ Create a dict that maps the photo-ids in cordaid's xml to the internal-project-id of the same activity
    This allows us to find the project to add the current image to
    """
    with open(FILE_CORDAID_XML, 'r') as f:
        root = etree.fromstring(f.read())
        images_to_projects = {}
        for i in range(len(root)):
            activity = root[i]
            images_to_projects[
                activity.get('{http://www.akvo.org}photo-id')
            ] = activity.get('{http://www.akvo.org}internal-project-id')
        return images_to_projects

if __name__ == '__main__':
    img_to_proj_map = create_mapping_images_to_projects()
    import_images(DIR_CORDAID_IMAGES, img_to_proj_map)