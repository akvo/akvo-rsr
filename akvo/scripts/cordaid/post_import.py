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
    print_log, log, ACTION_FUNDING_SET, ACTION_FUNDING_FOUND, ERROR_IMAGE_UPLOAD, ACTION_SET_IMAGE,
    CORDAID_ACTIVITIES_CSV_FILE,
    init_log
)


def import_images(image_dir, img_to_proj_map):
    for image_name in os.listdir(image_dir):
        photo_id, ext = splitext(image_name)
        if ext.lower() in ['.png', '.jpg', '.jpeg', '.gif']:
            try:
                internal_id=img_to_proj_map.get(
                    photo_id, {'internal_project_id': None}
                )['internal_project_id']
                project = Project.objects.get(
                    partnerships__internal_id=internal_id
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
                project.current_image_caption = img_to_proj_map.get(
                    photo_id, {'image_caption': ''}
                )['image_caption']
                project.save()
                log(
                    u"Uploaded image to project {pk}",
                    dict(internal_id=internal_id, pk=project.pk, event=ACTION_SET_IMAGE))
            except Exception, e:
                log(
                    u"Upload failed. internal_id: {internal_id} Exception class: {extra}",
                    dict(internal_id=internal_id, event=ERROR_IMAGE_UPLOAD, extra=e.__class__),
                )

def fix_funding(img_to_proj_map):
    """
    Add Cordaid as a funding partner to all its projects and "fill the project up"
    """
    cordaid = Organisation.objects.get(pk=CORDAID_ORG_ID)
    for project_data in img_to_proj_map.values():
        internal_id = project_data['internal_project_id']
        try:
            project = None
            project = Project.objects.get(
                partnerships__internal_id=internal_id, partnerships__organisation=cordaid
            )
            funds_needed = project.funds_needed
            if funds_needed > 0:
                cordaid_funding_partnership, created = Partnership.objects.get_or_create(
                    organisation=cordaid,
                    project=project,
                    partner_type=Partnership.FUNDING_PARTNER,
                    defaults={'funding_amount': funds_needed}
                )
                if created:
                    log(
                        u"Added Cordaid as funding partner to project {pk}, funding amount: {extra}",
                        dict(internal_id=internal_id, pk=project.pk, event=ACTION_FUNDING_SET, extra=funds_needed)
                    )
                else:
                    # since Cordaid already is funding, we need to add thatamount to funds_needed to get to fully funded
                    cordaid_funding_partnership.funding_amount = funds_needed + cordaid_funding_partnership.funding_amount
                    cordaid_funding_partnership.save()
                    log(
                        u"Found Cordaid as funding partner to project {pk}, setting funding amount: {extra}",
                        dict(internal_id=internal_id, pk=project.pk, event=ACTION_FUNDING_FOUND, extra=funds_needed)
                    )
            else:
                log(
                    u"Project {pk} is fully funded",
                    dict(internal_id=internal_id, pk=project.pk, event=ACTION_FUNDING_FOUND,)
                )
        except Exception, e:
            log(u"Error trying to set up Cordaid as funding partner to project {pk}\nException class: {extra}",
                dict(internal_id=internal_id, pk=getattr(project, 'pk', None), event=e.__class__, extra=e.message),
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
            ] = dict(
                internal_project_id=activity.get('{http://www.akvo.org}internal-project-id'),
                image_caption=activity.get('{http://www.akvo.org}image-caption', '').strip()
            )
        return images_to_projects

if __name__ == '__main__':
    init_log()
    img_to_proj_map = create_mapping_images_to_projects()
    import_images(CORDAID_PROJECT_IMAGES_DIR, img_to_proj_map)
    fix_funding(img_to_proj_map)
    log_file = init_log(CORDAID_ACTIVITIES_CSV_FILE)
    names = (u'internal_id', u'pk', u'label', u'event', u'extra')
    print_log(log_file, names)