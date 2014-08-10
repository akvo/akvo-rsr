# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import os
os.environ['DJANGO_SETTINGS_MODULE'] = 'akvo.settings'

from django.core.files import File
from django.core.files.temp import NamedTemporaryFile

from lxml import etree

from akvo.api_utils import ImageImporter
from akvo.rsr.models import Project, Organisation
from akvo.utils import model_and_instance_based_filename, who_am_i

from akvo.scripts.rain import (
    RAIN_IATI_ACTIVITIES_XML, RAIN_PROJECT_IMAGES_DIR, RAIN_ORG_ID,
    print_log, log, ACTION_FUNDING_SET, ACTION_FUNDING_FOUND, ERROR_IMAGE_UPLOAD, ACTION_SET_IMAGE,
    RAIN_ACTIVITIES_CSV_FILE, init_log, ACTION_BUDGET_SET, outsys,
    ACTION_PUBLISHING_SET, RAIN_LOG_FILE, RainActivity,
    RAIN_NS, AKVO_NS, RAIN_UPLOAD_CSV_FILE)

import logging
logger = logging.getLogger(__name__)


class ProjectSaver():
    """ Perform the post import saving steps for the project, all related to the project image
    """
    def __init__(self, activity, importing_org):
        self.activity = activity
        if activity.rsr_id():
            try:
                self.project = Project.objects.get(id=activity.rsr_id())
            except Project.DoesNotExist, e:
                log(
                    "Could not find project with ID: {rsr_id}",
                    dict(
                        rsr_id=activity.rsr_id(),
                        event=ERROR_IMAGE_UPLOAD,
                    )
                )
        elif activity.internal_id():
            try:
                self.project = Project.objects.get(
                    partnerships__internal_id=activity.internal_id(), partnerships__organisation=RAIN_ORG_ID
                )
            except Project.DoesNotExist, e:
                log(
                    "Could not find project with RAIN internal ID: {internal_id}",
                    dict(
                        internal_id=activity.internal_id(),
                        event=ERROR_IMAGE_UPLOAD,
                    )
                )
        elif activity.iati_id():
            try:
                self.project = Project.objects.get(id=activity.iati_id())
            except Project.DoesNotExist, e:
                log(
                    "Could not find project with IATI ID: {iati_id}",
                    dict(
                        iati_id=activity.iati_id(),
                        event=ERROR_IMAGE_UPLOAD,
                    )
                )


    def _current_image(self):
        image = ImageImporter(self.activity.current_image())
        try:
            image.get_image()
        except Exception, e:
            log(
                "Error trying to fetch image to project. Image URL: {extra}",
                dict(
                    rsr_id=self.activity.rsr_id(),
                    internal_id=self.activity.internal_id(),
                    iati_id=self.activity.iati_id(),
                    event=ERROR_IMAGE_UPLOAD,
                    extra=self.activity.current_image()
                )
            )

        if image.image:
            filename = model_and_instance_based_filename(
                'Project', self.project.pk, 'current_image', image.filename
            )
            image_temp = NamedTemporaryFile(delete=True)
            image_temp.write(image.image)
            image_temp.flush()
            self.project.current_image.save(filename, File(image_temp), save=True)
            log(
               "Save project image: {extra}",
               dict(
                   internal_id=self.activity.internal_id(),
                   rsr_id=self.activity.rsr_id(),
                   iati_id=self.activity.iati_id(),
                   event=ACTION_SET_IMAGE,
                   extra=filename
               )
            )


    def _current_image_caption(self):
        self.project.current_image_caption = self.activity.current_image_caption()

    def _current_image_credit(self):
        self.project.current_image_credit = self.activity.current_image_credit()

    def save(self):
        self._current_image()
        self._current_image_caption()
        self._current_image_credit()
        self.project.save()


# class PublishingSaver():
#     """ Perform the post import saving steps for (Cordaid) publishing status
#     """
#     def __init__(self, activity, project):
#         self.activity = activity
#         self.project = project
#
#     def save(self):
#         status = PublishingStatus.objects.get(project=self.project)
#         status.status = 'published' if self.activity.publishing_status() else 'unpublished'
#         status.save()


class PostImporter():
    """ This class manages the post import process.
    """
    def __init__(self, importing_org_id):
        self.importing_org = Organisation.objects.get(pk=importing_org_id)

    def setup(self):
        """ Create a list where each list item is one Activity object
        """
        self.activities = []
        # rain_orgs = CordaidOrgs()
        outsys("\nRunning {}() ".format(who_am_i()))
        with open(RAIN_IATI_ACTIVITIES_XML, 'r') as f:
            iati_activities = etree.fromstring(f.read())
            iati_activity_list = iati_activities.xpath('//iati-activity')
            for iati_activity in iati_activity_list:
                outsys(".")
                self.activities.append(RainActivity(iati_activity, RAIN_NS, AKVO_NS))

    def run(self):
        for activity in self.activities:
            project = self._process_project(activity)
            # if project:
            #     self._process_publishing_status(activity, project)

    def _process_project(self, activity):
        try:
            project_saver = ProjectSaver(activity, self.importing_org)
        except Project.DoesNotExist, e:
            return None
        project_saver.save()
        return project_saver.project

    # def _process_publishing_status(self, activity, project):
    #     publishing_saver = PublishingSaver(activity, project)
    #     publishing_saver.save()


if __name__ == '__main__':
    log_file = init_log(RAIN_UPLOAD_CSV_FILE)
    importer = PostImporter(RAIN_ORG_ID)
    importer.setup()
    importer.run()
    #logging.debug("Post import done.")
    names = (u'internal_id', u'rsr_id', u'iait_id', u'event', u'extra')
    print_log(log_file, names)
