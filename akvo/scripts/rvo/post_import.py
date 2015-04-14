# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.core.exceptions import ValidationError

import os
os.environ['DJANGO_SETTINGS_MODULE'] = 'akvo.settings'

import django

from lxml import etree

from akvo.rsr.models import Project, Organisation, PublishingStatus, Keyword
from akvo.utils import who_am_i

from akvo.scripts.rvo import (
    RVO_ORG_ID, print_log, log, init_log, outsys, RvoActivity,
    RVO_POST_PROCESS_CSV_FILE,ERROR_PROJECT_NOT_FOUND, ERROR_PROJECT_DATA_INVALID,
    ERROR_PROJECT_NOT_SAVED,ACTION_PROJECT_POST_PROCESS_DONE, load_xml, RVO_IATI_ACTIVITES_URL,
    ACTION_PROJECT_PUBLISHED, RVO_KEYWORD_ID)

import logging
logger = logging.getLogger(__name__)


class ProjectSaver():
    """ Perform the post import saving steps for the project, all related to the project image
    """
    def __init__(self, activity, importing_org):
        self.activity = activity
        if activity.iati_id():
            try:
                self.project = Project.objects.get(
                    iati_activity_id=activity.iati_id()
                )
                return
            except:
                msg = "Could not find project or multiple projects found with IATI ID: {iati_id}"
                log(
                    msg,
                    dict(
                        iati_id=self.activity.iati_id(),
                    )
                )
        raise Project.DoesNotExist

    def _sync_owner(self):
        rvo = Organisation.objects.get(id=RVO_ORG_ID)
        self.project.sync_owner = rvo

    def _publish(self):
        self.project.publishingstatus.status = PublishingStatus.STATUS_PUBLISHED
        log(
           "Project ID: {iati_id} published",
           dict(
               iati_id=self.activity.iati_id(),
               event=ACTION_PROJECT_PUBLISHED,
           )
        )
        self.project.publishingstatus.save()

    def _keywords(self):
        keyword = Keyword.objects.get(pk=RVO_KEYWORD_ID)
        self.project.keywords.add(keyword)

    def process(self):
        self._sync_owner()
        self._publish()
        self._keywords()
        try:
            self.project.full_clean()
        except ValidationError, e:
            log(
               "Warning: data validation error when saving project ID: {iati_id}:\n{extra}",
               dict(
                   iati_id=self.activity.iati_id(),
                   event=ERROR_PROJECT_DATA_INVALID,
                   extra=e,
               )
            )
            # return
        try:
            self.project.save()
            log(
               "Saved project IATI ID: {iati_id}:\n{extra}",
               dict(
                   iati_id=self.activity.iati_id(),
                   event=ACTION_PROJECT_POST_PROCESS_DONE,
               )
            )
        except Exception, e:
            log(
               "Couldn't save project ID: {iati_id}:\n{extra}",
               dict(
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
        outsys("\nRunning {}() ".format(who_am_i()))
        xml = load_xml(RVO_IATI_ACTIVITES_URL)
        if xml:
            parser = etree.XMLParser(ns_clean=True, recover=True, encoding='utf-8')
            iati_activities = etree.fromstring(xml, parser=parser)
            iati_activity_list = iati_activities.xpath('//iati-activity')
            for iati_activity in iati_activity_list:
                outsys(".")
                self.activities.append(RvoActivity(iati_activity))

    def run(self):
        outsys("\nProcessing projects")
        for activity in self.activities:
            outsys(".")
            project = self._process_project(activity)

    def _process_project(self, activity):
        try:
            project_saver = ProjectSaver(activity, self.importing_org)
        except Project.DoesNotExist, e:
            log(
               "Couldn't find project IATI ID: {iati_id}",
               dict(
                   iati_id=activity.iati_id(),
                   event=ERROR_PROJECT_NOT_FOUND,
               )
            )
            return None
        project_saver.process()
        return project_saver.project


if __name__ == '__main__':
    django.setup()
    log_file = init_log(RVO_POST_PROCESS_CSV_FILE)
    importer = PostImporter(RVO_ORG_ID)
    importer.setup()
    importer.run()
    #logging.debug("Post import done.")
    names = (u'iati_id', u'event', u'extra')
    print
    print_log(log_file, names)
