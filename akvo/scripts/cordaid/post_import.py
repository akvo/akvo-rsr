# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import datetime
from decimal import Decimal
from lxml import etree
from os.path import splitext

from django.core.management import setup_environ
import sys
import akvo.settings

setup_environ(akvo.settings)

import os
from django.core.files import File
from django.core.files.temp import NamedTemporaryFile

from akvo.rsr.models import Project, Partnership, Organisation, BudgetItem, BudgetItemLabel
from akvo.rsr.utils import model_and_instance_based_filename, who_am_i

from akvo.scripts.cordaid import (
    CORDAID_IATI_ACTIVITIES_XML, CORDAID_PROJECT_IMAGES_DIR, CORDAID_ORG_ID, OTHERS_ORG_ID,
    print_log, log, ACTION_FUNDING_SET, ACTION_FUNDING_FOUND, ERROR_IMAGE_UPLOAD, ACTION_SET_IMAGE,
    CORDAID_ACTIVITIES_CSV_FILE, init_log, ACTION_BUDGET_SET, outsys
)

def import_images(image_dir, photos):
    outsys("\nRunning {}() ".format(who_am_i()))
    for image_name in os.listdir(image_dir):
        outsys(".")
        photo_id, ext = splitext(image_name)
        if ext.lower() in ['.png', '.jpg', '.jpeg', '.gif']:
            try:
                internal_id=photos.get(
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
                project.current_image_caption = photos.get(
                    photo_id, {'image_caption': ''}
                )['image_caption']
                project.current_image_credit = photos.get(
                    photo_id, {'image_credit': ''}
                )['image_credit']
                project.save()
                log(
                    u"Uploaded image to project {pk}",
                    dict(internal_id=internal_id, pk=project.pk, event=ACTION_SET_IMAGE))
            except Exception, e:
                log(
                    u"Upload failed. internal_id: {internal_id} Exception class: {extra}",
                    dict(internal_id=internal_id, event=ERROR_IMAGE_UPLOAD, extra=e.__class__),
                )

def fix_funding(budgets):
    """
    Add Cordaid as a funding partner to all its projects and "fill the project up"
    """
    outsys("\nRunning {}() ".format(who_am_i()))

    def assign_funding_partner(project, organisation, amount):
        funding_partnership, created = Partnership.objects.get_or_create(
            organisation=organisation,
            project=project,
            partner_type=Partnership.FUNDING_PARTNER,
            defaults={'funding_amount': amount}
        )
        if created:
            log(
                u"Added {org_name} as funding partner to project {{pk}}, funding amount: {{extra}}".format(org_name=organisation.name),
                dict(internal_id=internal_id, pk=project.pk, event=ACTION_FUNDING_SET, extra=amount)
            )
        else:
            funding_partnership.funding_amount = amount
            funding_partnership.save()
            log(
                u"Found {org_name} as funding partner to project {{pk}}, setting funding amount: {{extra}}".format(org_name=organisation.name),
                dict(internal_id=internal_id, pk=project.pk, event=ACTION_FUNDING_FOUND, extra=amount)
            )

    cordaid = Organisation.objects.get(pk=CORDAID_ORG_ID)
    others = Organisation.objects.get(pk=OTHERS_ORG_ID)
    for budget in budgets:
        outsys(".")
        internal_id = budget['internal_project_id']
        try:
            project = None
            project = Project.objects.get(
                partnerships__internal_id=internal_id, partnerships__organisation=cordaid
            )
            cordaid_funding = budget.get('cordaid_funding', 0)
            others_funding = budget.get('others_funding', 0)
            if cordaid_funding:
                assign_funding_partner(project, cordaid, cordaid_funding)
            if others_funding:
                assign_funding_partner(project, others, others_funding)
            total_budget = cordaid_funding + others_funding
            old_budgets = BudgetItem.objects.filter(project=project)
            old_budgets.delete()
            BudgetItem.objects.create(
                project=project,
                label = BudgetItemLabel.objects.get(pk=13), #total budget label
                amount = total_budget
            )
            log(
                u"Total budget for project {pk}: {extra}",
                dict(internal_id=internal_id, pk=project.pk, event=ACTION_BUDGET_SET, extra=total_budget)
            )
        except Exception, e:
            log(u"Error setting up funding partners for project {pk}\nException class: {extra}",
                dict(internal_id=internal_id, pk=getattr(project, 'pk', None), event=e.__class__, extra=e.message),
            )
    outsys('\n')

def get_post_process_data():
    """ Create a dictionary with photo IDs as keys:
    {
        <photo-id>: {
            'internal_project_id': <internal_project_id>,
            'image_caption': <image-caption>,
            'image_credit': <image-credit>,
            'cordaid_funding': <cordaid-funding>,
            'others_funding': <others-funding>,
        }
    },
    """
    outsys("\nRunning {}() ".format(who_am_i()))
    with open(CORDAID_IATI_ACTIVITIES_XML, 'r') as f:
        root = etree.fromstring(f.read())
        AKVO_NS = '{{{akvo_ns}}}'.format(akvo_ns=root.nsmap['akvo'])
        photos = {}
        budgets = []
        for activity in root:
            outsys(".")
            photos[
                activity.get(AKVO_NS + 'photo-id')
            ] = dict(
                internal_project_id=activity.get(AKVO_NS + 'internal-project-id'),
                image_caption=activity.get(AKVO_NS + 'image-caption', '').strip(),
                image_credit=activity.get(AKVO_NS + 'image-by', '').strip(),
            )
            cordaid_budget = activity.findall('budget[@' + AKVO_NS +'budget-from="Cordaid"]')
            others_budget = activity.findall('budget[@' + AKVO_NS +'budget-from="Others"]')
            budgets.append(
                dict(
                    internal_project_id=activity.get(AKVO_NS + 'internal-project-id'),
                    cordaid_funding=Decimal(cordaid_budget[0].find('value').text if cordaid_budget else 0),
                    others_funding=Decimal(others_budget[0].find('value').text if others_budget else 0),
                )
            )
        return photos, budgets


if __name__ == '__main__':
    photos, budgets = get_post_process_data()
    import_images(CORDAID_PROJECT_IMAGES_DIR, photos)
    fix_funding(budgets)
    log_file = init_log(CORDAID_ACTIVITIES_CSV_FILE)
    names = (u'internal_id', u'pk', u'label', u'event', u'extra')
    print_log(log_file, names)