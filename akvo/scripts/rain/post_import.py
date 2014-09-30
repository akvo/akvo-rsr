# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.core.exceptions import ValidationError

import os
os.environ['DJANGO_SETTINGS_MODULE'] = 'akvo.settings'

from django.core.files import File
from django.core.files.temp import NamedTemporaryFile

from lxml import etree

from akvo.api_utils import ImageImporter
from akvo.rsr.models import Project, Organisation, Category, PublishingStatus
from akvo.utils import model_and_instance_based_filename, who_am_i

from akvo.scripts.rain import (
    RAIN_ORG_ID, print_log, log, ERROR_IMAGE_UPLOAD, ACTION_SET_IMAGE, init_log, outsys, RainActivity, RAIN_ACTIVITY_NS,
    AKVO_NS, RAIN_POST_PROCESS_CSV_FILE,ERROR_PROJECT_NOT_FOUND, ERROR_PROJECT_DATA_INVALID, ERROR_PROJECT_NOT_SAVED,
    ERROR_IMAGE_NOT_FOUND, ACTION_PROJECT_POST_PROCESS_DONE, load_xml, RAIN_IATI_ACTIVITES_URL
)

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
                return
            except Project.DoesNotExist, e:
                msg = "Could not find project with ID: {rsr_id}"
                log(
                    msg,
                    dict(
                        rsr_id=activity.rsr_id(),
                        internal_id=activity.internal_id(),
                        iati_id=activity.iati_id(),
                        event=ERROR_IMAGE_UPLOAD,
                        extra=msg.format(rsr_id=activity.rsr_id())
                    )
                )
        elif activity.internal_id():
            try:
                self.project = Project.objects.get(
                    partnerships__internal_id=activity.internal_id(), partnerships__organisation=RAIN_ORG_ID
                )
                return
            except Project.DoesNotExist, e:
                msg = "Could not find project with RAIN internal ID: {internal_id}"
                log(
                    msg,
                    dict(
                        rsr_id=self.activity.rsr_id(),
                        internal_id=self.activity.internal_id(),
                        iati_id=self.activity.iati_id(),
                        event=ERROR_IMAGE_UPLOAD,
                        extra=msg.format(internal_id=activity.internal_id())
                    )
                )
        elif activity.iati_id():
            try:
                self.project = Project.objects.get(
                    partnerships__iati_activity_id = activity.iati_id(), partnerships__organisation=RAIN_ORG_ID
                )
                return
            except Project.DoesNotExist, e:
                msg = "Could not find project with IATI ID: {iati_id}"
                log(
                    msg,
                    dict(
                        rsr_id=self.activity.rsr_id(),
                        internal_id=self.activity.internal_id(),
                        iati_id=self.activity.iati_id(),
                        event=ERROR_IMAGE_UPLOAD,
                        extra=msg.format(iati_id=activity.iati_id())
                    )
                )
        raise Project.DoesNotExist


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
                   rsr_id=self.activity.rsr_id(),
                   internal_id=self.activity.internal_id(),
                   iati_id=self.activity.iati_id(),
                   event=ACTION_SET_IMAGE,
                   extra=filename
               )
            )
        else:
            log(
                "No image found for project: {rsr_id}",
                dict(
                    rsr_id=self.activity.rsr_id(),
                    internal_id=self.activity.internal_id(),
                    iati_id=self.activity.iati_id(),
                    event=ERROR_IMAGE_NOT_FOUND,
                )
            )


    def _current_image_caption(self):
        self.project.current_image_caption = self.activity.current_image_caption()

    def _current_image_credit(self):
        self.project.current_image_credit = self.activity.current_image_credit()

    def _category(self):
        watsan_cat = Category.objects.get(name='Water, Sanitation and Hygiene')
        try:
            self.project.categories.add(watsan_cat)
        except:
            print "Cat is not in the bag!"

    def _sync_owner(self):
        rain = Organisation.objects.get(id=RAIN_ORG_ID)
        self.project.sync_owner = rain

    def _publish(self):
        self.project.publishingstatus.status = PublishingStatus.STATUS_PUBLISHED
        self.project.publishingstatus.save()

    def process(self):
        self._current_image()
        self._current_image_caption()
        self._current_image_credit()
        self._category()
        self._sync_owner()
        self._publish()
        try:
            self.project.full_clean()
        except ValidationError, e:
            log(
               "Warning: data validation error when saving project ID: {rsr_id}:\n{extra}",
               dict(
                   rsr_id=self.project.pk,
                   internal_id=self.activity.internal_id(),
                   iati_id=self.activity.iati_id(),
                   event=ERROR_PROJECT_DATA_INVALID,
                   extra=e,
               )
            )
            # return
        try:
            self.project.save()
            log(
               "Saved project ID: {rsr_id}:\n{extra}",
               dict(
                   rsr_id=self.project.pk,
                   internal_id=self.activity.internal_id(),
                   iati_id=self.activity.iati_id(),
                   event=ACTION_PROJECT_POST_PROCESS_DONE,
               )
            )
        except Exception, e:
            log(
               "Couldn't save project ID: {rsr_id}:\n{extra}",
               dict(
                   rsr_id=self.project.pk,
                   internal_id=self.activity.internal_id(),
                   iati_id=self.activity.iati_id(),
                   event=ERROR_PROJECT_NOT_SAVED,
                   extra=e,
               )
            )
            return


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
                self.activities.append(RainActivity(iati_activity, RAIN_ACTIVITY_NS, AKVO_NS))

    def run(self):
        for activity in self.activities:
            project = self._process_project(activity)
            # if project:
            #     self._process_publishing_status(activity, project)

    def _process_project(self, activity):
        try:
            project_saver = ProjectSaver(activity, self.importing_org)
        except Project.DoesNotExist, e:
            log(
               "Couldn't find project ID: {rsr_id} IATI ID: {iati_id} internal ID: {internal_id}",
               dict(
                   internal_id=activity.internal_id(),
                   rsr_id=activity.rsr_id(),
                   iati_id=activity.iati_id(),
                   event=ERROR_PROJECT_NOT_FOUND,
               )
            )
            return None
        project_saver.process()
        return project_saver.project

    # def _process_publishing_status(self, activity, project):
    #     publishing_saver = PublishingSaver(activity, project)
    #     publishing_saver.save()


if __name__ == '__main__':
    log_file = init_log(RAIN_POST_PROCESS_CSV_FILE)
    importer = PostImporter(RAIN_ORG_ID)
    importer.setup()
    importer.run()
    #logging.debug("Post import done.")
    names = (u'internal_id', u'rsr_id', u'iati_id', u'event', u'extra')
    print_log(log_file, names)
