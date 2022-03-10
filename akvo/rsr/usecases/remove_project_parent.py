# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from akvo.rsr.models import RelatedProject
from akvo.rsr.usecases.utils import RF_MODELS_CONFIG


def remove_parent(project):
    for (model, parent_attr, project_relation, _) in RF_MODELS_CONFIG.values():
        model.objects.filter(**{project_relation: project}).update(**{parent_attr: None})

    RelatedProject.objects.filter(related_project=project, relation='2').delete()
    RelatedProject.objects.filter(project=project, relation='1').delete()
