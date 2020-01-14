# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from ....rsr.models.related_project import RelatedProject

from .. import ImportMapper

from django.core.exceptions import ObjectDoesNotExist


class RelatedProjects(ImportMapper):

    def __init__(self, iati_import_job, parent_elem, project, globals,
                 related_obj=None):
        super(RelatedProjects, self).__init__(iati_import_job, parent_elem,
                                              project, globals)
        self.model = RelatedProject

    def do_import(self):
        """
        Retrieve and store the related projects.
        The related projects will be extracted from the 'related-activity' elements.

        :return: List; contains fields that have changed
        """

        from akvo.rsr.models.project import Project

        imported_related_projects = []
        changes = []

        # Check if import should ignore this kind of data
        if self.skip_importing('related-activity'):
            return changes

        for related_activity in self.parent_elem.findall('related-activity'):

            related_iati_id = self.get_attrib(related_activity, 'ref', 'related_iati_id')
            relation = self.get_attrib(related_activity, 'type', 'relation')

            try:
                related_project = Project.objects.get(iati_activity_id=related_iati_id)
            except ObjectDoesNotExist:
                related_project = None

            rp, created = RelatedProject.objects.get_or_create(
                project=self.project,
                related_project=related_project,
                related_iati_id=related_iati_id if not related_project else '',
                relation=relation
            )
            if created:
                changes.append('added related project (id: {}): {}'.format(rp.pk, rp))
            imported_related_projects.append(rp)

        changes += self.delete_objects(
            self.project.related_projects, imported_related_projects, 'related project')
        return changes
