# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module. 
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.conf import settings
from django.shortcuts import get_object_or_404

from piston.handler import AnonymousBaseHandler

from akvo.rsr.models import Project, ProjectUpdate, Organisation

class ProjectHandler(AnonymousBaseHandler):
    """
    Returns Projects
    """
    model = Project
    exclude = ()

    #def read(self, request, project_id=0):
    #    base = Project.objects
    #    if project_id:
    #        return get_object_or_404(Project, pk=project_id)
    #    else:
    #        return base.all()

class OrgProjectsHandler(ProjectHandler):
    """
    All projects connected to an organisation
    """
    def read(self, request, org_id):
        return Organisation.projects.filter(pk=org_id).all()
    
class LEProjectHandler(OrgProjectsHandler):
    """
    All projects connected to Live Earth
    """
    def read(self, request):
        return super(LEProjectHandler, self).read(request, settings.LIVE_EARTH_ID)


class UpdateHandler(AnonymousBaseHandler):
    """
    Returns ProjectUpdates
    """
    model = ProjectUpdate
    fields = ('id', 'title', 'text', 'photo', 'photo_caption', 'photo_credit', 'time', ('project', ('id', 'name')))
    exclude = ('user')

    def read(self, request, update_id=0, project_id=0):
        base = ProjectUpdate.objects
        if update_id:
            return get_object_or_404(ProjectUpdate, pk=update_id)
        elif project_id:
            return base.filter(project__pk=project_id)
        else:
            return base.all()