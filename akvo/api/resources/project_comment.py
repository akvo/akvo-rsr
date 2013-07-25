# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from tastypie.constants import ALL, ALL_WITH_RELATIONS


from akvo.api.fields import ConditionalFullToOneField

from akvo.rsr.models import ProjectComment

from .resources import ConditionalFullResource


class ProjectCommentResource(ConditionalFullResource):
    project = ConditionalFullToOneField('akvo.api.resources.ProjectResource', 'project')

    class Meta:
        allowed_methods = ['get']
        queryset        = ProjectComment.objects.all()
        resource_name   = 'project_comment'
        filtering       = dict(
            # other fields
            time        = ALL,
            # foreign keys
            project     = ALL_WITH_RELATIONS,
            user        = ALL_WITH_RELATIONS,
        )
