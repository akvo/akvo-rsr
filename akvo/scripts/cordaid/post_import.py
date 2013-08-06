# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import datetime
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

from akvo.scripts.cordaid import (
    CORDAID_IATI_ACTIVITIES_XML, CORDAID_PROJECT_IMAGES_DIR, CORDAID_ORG_ID,
    print_log, log
)


def init_log():
    log("\n***** post_import.py log at {time} *****\n", dict(time=datetime.datetime.now()))

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
                log(u"Uploaded image to project {pk}", dict(pk=project.pk))
            except Exception, e:
                log(
                    u"Upload failed. internal_id: {internal_id} Error msg: {message}",
                    dict(internal_id=img_to_proj_map.get(photo_id), message=e.message),
                    'error',
                )

def fix_funding(img_to_proj_map):
    cordaid = Organisation.objects.get(pk=CORDAID_ORG_ID)
    for internal_id in img_to_proj_map.values():
        try:
            project = None
            project = Project.objects.get(
                partnerships__internal_id=internal_id, partnerships__organisation=cordaid
            )
            funds_needed = project.funds_needed
            if funds_needed > 0:
                cord_fund = Partnership.objects.create(
                    organisation=cordaid,
                    project=project,
                    partner_type=Partnership.FUNDING_PARTNER,
                    funding_amount = funds_needed,
                )
                log(
                    u"Added Cordaid as funding partner to project {pk}, funding amount: {funding_amount}",
                    dict(pk=project.pk, funding_amount=funds_needed)
                )
            else:
                log(
                    u"Project {pk} is fully funded",
                    dict(pk=project.pk,)
                )
        except Exception, e:
            log(u"Error trying to set up Cordaid as funding partner to project {pk}\nError message: {message}",
                dict(pk=getattr(project, 'pk', None), message=e.message),
                'error'
            )

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
    init_log()
    img_to_proj_map = create_mapping_images_to_projects()
    import_images(CORDAID_PROJECT_IMAGES_DIR, img_to_proj_map)
    fix_funding(img_to_proj_map)
    print_log()