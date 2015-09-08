# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.core.exceptions import ObjectDoesNotExist
from django.db.models import get_model


def related_projects(activity, project, activities_globals):
    """
    Retrieve and store the related projects.
    The related projects will be extracted from the 'related-activity' elements.

    :param activity: ElementTree; contains all data for the activity
    :param project: Project instance
    :param activities_globals: Dictionary; contains all global activities information
    :return: List; contains fields that have changed
    """
    imported_related_projects = []
    changes = []

    for related_project in activity.findall('related-activity'):
        prj_ref = related_project.attrib['ref'] if 'ref' in related_project.attrib.keys() else ''
        prj_type = related_project.attrib['type'] if 'type' in related_project.attrib.keys() else ''

        try:
            related_project_prj = get_model('rsr', 'project').objects.get(iati_activity_id=prj_ref)
        except ObjectDoesNotExist:
            related_project_prj = prj_ref

        if isinstance(related_project_prj, basestring):
            rp, created = get_model('rsr', 'relatedproject').objects.get_or_create(
                project=project,
                related_iati_id=related_project_prj,
                relation=prj_type
            )
        else:
            rp, created = get_model('rsr', 'relatedproject').objects.get_or_create(
                project=project,
                related_project=related_project_prj,
                relation=prj_type
            )
        imported_related_projects.append(rp)
        if created:
            changes.append(u'added related project (id: %s): %s' % (str(rp.pk), rp))

    for related_project in project.related_projects.all():
        if not related_project in imported_related_projects:
            changes.append(u'deleted related project (id: %s): %s' %
                           (str(related_project.pk),
                            related_project.__unicode__()))
            related_project.delete()

    return changes
