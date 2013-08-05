# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
from django.core.files.uploadedfile import UploadedFile

from lxml import etree
from os.path import splitext

from django.core.management import setup_environ
import akvo.settings

setup_environ(akvo.settings)

import os
from django.core.files import File
from django.core.files.temp import NamedTemporaryFile

from akvo.rsr.models import Project, Partnership, Organisation
from akvo.rsr.utils import model_and_instance_based_filename

from akvo.scripts.cordaid import CORDAID_IATI_ACTIVITIES_XML, CORDAID_PROJECT_IMAGES_DIR, CORDAID_ORG_ID

def import_images(image_dir, img_to_proj_map):
    for image_name in os.listdir(image_dir):
        photo_id, ext = splitext(image_name)
        if ext.lower() in ['.png', '.jpg', '.jpeg', '.gif']:
            try:
                project = Project.objects.get(
                    partnerships__internal_id=img_to_proj_map.get(photo_id)
                )
                filename = model_and_instance_based_filename(
                    'Project', project.pk, 'current_image', image_name
                )
                with open(os.path.join(image_dir, image_name), 'rb') as f:
                    image_data = f.read()
                    image_temp = NamedTemporaryFile(delete=True)
                    image_temp.write(image_data)
                    image_temp.flush()
                    project.current_image.save(filename, File(image_temp), save=True)
                f.close()
                print "Uploaded image to project {pk}".format(pk=project.pk)
            except Exception, e:
                print "Upload failed. internal_id: {internal_id} Error msg: {message}".format(
                    internal_id=img_to_proj_map.get(photo_id), message=e.message
                )

def fix_funding(img_to_proj_map):
    import pdb
    pdb.set_trace()
    cordaid = Organisation.objects.get(pk=CORDAID_ORG_ID)
    for internal_id in img_to_proj_map.keys():
        try:
            project = None
            project = Project.objects.get(
                partnerships__internal_id=internal_id, partnerships__organisation=cordaid
            )
            if project.funds_needed > 0:
                cord_fund = Partnership.objects.create(
                    organisation=cordaid,
                    project=project,
                    partner_type=Partnership.FUNDING_PARTNER,
                    funding_amount = project.funds_needed,
                )
            print(
                "Added Cordaid as funding partner to project {pk}, funding amount: {funding_amount}"
            ).format(pk=project.pk, funding_amount=project.funds_needed)
        except Exception, e:
            print("Error trying to set up Cordaid as funding partner to project {pk}\nError message: {message}"
            ).format(pk=getattr(project, 'pk', None), message=e.message)

def create_mapping_images_to_projects():
    """ Create a dict that maps the photo-ids in cordaid's xml to the internal-project-id of the same activity
    This allows us to find the project to add the current image to
    """
    with open(CORDAID_IATI_ACTIVITIES_XML, 'r') as f:
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
    import_images(CORDAID_PROJECT_IMAGES_DIR, img_to_proj_map)
    fix_funding(img_to_proj_map)