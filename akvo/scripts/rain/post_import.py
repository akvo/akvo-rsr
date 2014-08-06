# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from decimal import Decimal
from lxml import etree

from django.core.management import setup_environ
import akvo.settings

setup_environ(akvo.settings)

from django.core.files import File
from django.core.files.temp import NamedTemporaryFile

from akvo.rsr.models import Project, Partnership, Organisation, BudgetItem, BudgetItemLabel, PublishingStatus
from akvo.utils import model_and_instance_based_filename, who_am_i

from akvo.scripts.rain import (
        RAIN_IATI_ACTIVITIES_XML, RAIN_PROJECT_IMAGES_DIR, RAIN_ORG_ID, OTHERS_ORG_ID,
        print_log, log, ACTION_FUNDING_SET, ACTION_FUNDING_FOUND, ERROR_IMAGE_UPLOAD, ACTION_SET_IMAGE,
        RAIN_ACTIVITIES_CSV_FILE, init_log, ACTION_BUDGET_SET, outsys,
        ACTION_PUBLISHING_SET, ImageImporter, RAIN_LOG_FILE
    )

import logging
logger = logging.getLogger(__name__)

ID_TYPE_RSR, ID_TYPE_INTERNAL, ID_TYPE_IATI = 1, 2, 3

run_settings = dict(id_type=ID_TYPE_INTERNAL)


class CordaidOrgs():
    """ The organisations "Cordaid" and "Institutional donors", used in Cordaid's projects to set up funding
    """
    def __init__(self):
        self.rain = Organisation.objects.get(pk=RAIN_ORG_ID)
        self.others = Organisation.objects.get(pk=OTHERS_ORG_ID)


# TODO: this is in reality the CordaidActivity, so there should be a more generic base class from which this inherits
class Activity():
    """ This class holds an etree representation of an activity and is responsible for mapping the relevant bits in the
        activity to the model fields in RSR (or closely related data)
    """
    def __init__(self, tree, ns, rain_orgs):
        # the iati-lactivity etree
        self.tree = tree
        # the Akvo XML namespace
        self.akvo_ns = ns
        # "Cordaid" and "Other organisations"
        self.rain_orgs = rain_orgs

    def internal_id(self):
        return self.tree.get(self.akvo_ns + 'internal-project-id')

    def current_image(self):
        return self.tree.get(self.akvo_ns + 'photo-id')

    def current_image_caption(self):
        return self.tree.get(self.akvo_ns + 'image-caption', '').strip()

    def current_image_credit(self):
        return self.tree.get(self.akvo_ns + 'photo-credit', '').strip()

    def _rain_funding(self):
        rain_budget = self.tree.findall('budget[@' + self.akvo_ns +'budget-from="Cordaid"]')
        return Decimal(rain_budget[0].find('value').text if rain_budget else 0)

    @property
    def rain_funding(self):
        return self._rain_funding()

    def _others_funding(self):
        others_budget = self.tree.findall('budget[@' + self.akvo_ns +'budget-from="Others"]')
        return Decimal(others_budget[0].find('value').text if others_budget else 0)

    @property
    def others_funding(self):
        return self._others_funding()

    def publishing_status(self):
        return self.tree.get(self.akvo_ns + 'publish') == 'true'


class ProjectSaver():
    """ Perform the post import saving steps for the project, all related to the project image
    """
    def __init__(self, activity, importing_org):
        self.activity = activity
        self.project = Project.objects.get(
                partnerships__internal_id=activity.internal_id(),
                partnerships__organisation=importing_org,
            )

    def _current_image(self):
        image = ImageImporter(self.activity.current_image(), RAIN_PROJECT_IMAGES_DIR)
        image.get_image()
        if image.image:
            filename = model_and_instance_based_filename(
                'Project', self.project.pk, 'current_image', image.filename
            )
            image_temp = NamedTemporaryFile(delete=True)
            image_temp.write(image.image)
            image_temp.flush()
            self.project.current_image.save(filename, File(image_temp), save=True)

    def _current_image_caption(self):
        self.project.current_image_caption = self.activity.current_image_caption()

    def _current_image_credit(self):
        self.project.current_image_credit = self.activity.current_image_credit()

    def save(self):
        self._current_image()
        self._current_image_caption()
        self._current_image_credit()
        self.project.save()


class FundingSaver():
    """ Perform the post import saving steps for (Cordaid) funding and budget
    """
    def __init__(self, activity, project):
        self.activity = activity
        self.project = project

    def _assign_funding_partner(self, organisation, amount):
        funding_partnership, created = Partnership.objects.get_or_create(
                organisation=organisation,
                project=self.project,
                partner_type=Partnership.FUNDING_PARTNER,
                defaults={'funding_amount': amount}
            )
        if created:
            pass
            # TODO: log creation
        else:
            funding_partnership.funding_amount = amount
            funding_partnership.save()
            # TODO: log update

    def save(self):
        """ Set up Cordaid and Institutional donors as funding partners for each project.
            The project's total budget is the sum of those two funding partner's funds.
        """
        rain_funding = self.activity.rain_funding
        others_funding = self.activity.others_funding
        if rain_funding:
            self._assign_funding_partner(self.activity.rain_orgs.rain, rain_funding)
        if others_funding:
            self._assign_funding_partner(self.activity.rain_orgs.others, others_funding)
        total_budget = rain_funding + others_funding
        old_budgets = BudgetItem.objects.filter(project=self.project)
        old_budgets.delete()
        BudgetItem.objects.create(
                project=self.project,
                # TODO: check budget item label ID
                label = BudgetItemLabel.objects.get(pk=13), #total budget label
                amount = total_budget
            )


class PublishingSaver():
    """ Perform the post import saving steps for (Cordaid) publishing status
    """
    def __init__(self, activity, project):
        self.activity = activity
        self.project = project

    def save(self):
        status = PublishingStatus.objects.get(project=self.project)
        status.status = 'published' if self.activity.publishing_status() else 'unpublished'
        status.save()


class PostImporter():
    """ This class manages the post import process.
    """
    def __init__(self, importing_org_id):
        self.importing_org = Organisation.objects.get(pk=importing_org_id)

    def setup(self):
        """ Create a list where each list item is one Activity object
        """
        self.activities = []
        rain_orgs = CordaidOrgs()
        outsys("\nRunning {}() ".format(who_am_i()))
        with open(RAIN_IATI_ACTIVITIES_XML, 'r') as f:
            iati_activities = etree.fromstring(f.read())
            iati_activity_list = iati_activities.xpath('//iati-activity')
            akvo_ns = '{{{akvo_ns}}}'.format(akvo_ns=iati_activities.nsmap['akvo'])
            for i, iati_activity in enumerate(iati_activity_list):
                outsys(".")
                if run_settings['id_type'] == ID_TYPE_RSR:
                    raise NotImplementedError
                elif run_settings['id_type'] == ID_TYPE_INTERNAL:
                    self.activities.append(Activity(iati_activity, akvo_ns, rain_orgs))
                elif run_settings['id_type'] == ID_TYPE_IATI:
                    raise NotImplementedError
                else:
                    raise NotImplementedError

    def run(self):
        for activity in self.activities:
            project = self._process_project(activity)
            if project:
                self._process_funding(activity, project)
                self._process_publishing_status(activity, project)

    def _process_project(self, activity):
        try:
            project_saver = ProjectSaver(activity, self.importing_org)
        except Project.DoesNotExist, e:
            # TODO: log error
            print "No project with internal ID: {}".format(activity.internal_id())
            return None
        project_saver.save()
        return project_saver.project

    def _process_funding(self, activity, project):
        funding_saver = FundingSaver(activity, project)
        funding_saver.save()

    def _process_publishing_status(self, activity, project):
        publishing_saver = PublishingSaver(activity, project)
        publishing_saver.save()


if __name__ == '__main__':
    logging.debug("Starting post import.")
    importer = PostImporter(RAIN_ORG_ID)
    importer.setup()
    importer.run()
    logging.debug("Post import done.")
