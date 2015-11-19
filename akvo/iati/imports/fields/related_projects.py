# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from ....rsr.models.project import Project
from ....rsr.models.related_project import RelatedProject

from ..utils import add_log, ImporterHelper

from django.core.exceptions import ObjectDoesNotExist


class RelatedProjects(ImporterHelper):

    def __init__(self, iati_import, parent_elem, project, globals, related_obj=None):
        super(RelatedProjects, self).__init__(iati_import, parent_elem, project, globals)
        self.model = RelatedProject

    def do_import(self):
        """
        Retrieve and store the related projects.
        The related projects will be extracted from the 'related-activity' elements.

        :return: List; contains fields that have changed
        """
        imported_related_projects = []
        changes = []

        for related_activity in self.parent_elem.findall('related-activity'):
            project_reference = ''
            project_type = ''
            related_project_project = None

            related_iati_id = self.get_attrib(related_activity, 'ref', 'related_iati_id')
            # if 'ref' in related_activity.attrib.keys():
            #     project_reference = related_activity.attrib['ref']

            relation = self.get_attrib(related_activity, 'type', 'relation')
            # if 'type' in related_activity.attrib.keys():
            #     if not len(related_activity.attrib['type']) > 1:
            #         project_type = related_activity.attrib['type']
            #     else:
            #         add_log(iati_import, 'related_activity_type',
            #                 'type is too long (1 character allowed)', project)

            # TODO: I don't fully understand the original logic, need Kasper's explanation
            try:
                related_project = Project.objects.get(iati_activity_id=related_iati_id)
            except ObjectDoesNotExist:
                related_project = None

            rp, created = RelatedProject.objects.get_or_create(
                project=self.project,
                related_project=related_project,
                related_iati_id=related_iati_id if not related_activity else '',
                relation=relation
            )

            if created:
                changes.append(u'added related project (id: {}): {}'.format(rp.pk, rp))

            imported_related_projects.append(rp)

        changes += self.delete_objects(
                self.project.related_projects, imported_related_projects, 'related project')
        # for related_project in self.project.related_projects.all():
        #     if not related_project in imported_related_projects:
        #         changes.append(u'deleted related project (id: {}): {}'.format(
        #                 related_project.pk, related_project.__unicode__()))
        #         related_project.delete()
        return changes
