# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from akvo.rsr.models import Project
from akvo.rsr.usecases.change_project_parent import RF_MODELS_CONFIG


def remove_parent(project: Project):
    if not project.has_ancestors:
        return

    # Update related objects
    for (model, parent_attr, project_relation) in RF_MODELS_CONFIG.values():
        model.objects.filter(**{project_relation: project}).update(**{parent_attr: None})

    project.delete_parent(force=True).save()
