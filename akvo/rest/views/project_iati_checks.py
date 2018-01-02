# Akvo RSR is covered by the GNU Affero General Public License. See more
# details in the license.txt file located at the root folder of the Akvo RSR
# module. For additional details on the GNU license please see
# <http://www.gnu.org/licenses/agpl.html>.

from akvo.rsr.models import Project
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response


class ProjectIatiCheckView(APIView):
    """
    List the result of IATI checks of a Project.
    """

    def get_object(self, pk):
        try:
            return Project.objects.get(pk=pk)
        except Project.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        project = self.get_object(pk)
        check_results = project.check_mandatory_fields()
        response = {
            'project': project.id,
            'all_checks_passed': str(check_results[0]),
            'checks': check_results[1],
        }

        return Response(response)
