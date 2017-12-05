# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from akvo.rest.serializers import NarrativeReportSerializer
from akvo.rest.viewsets import PublicProjectViewSet
from akvo.rsr.models import NarrativeReport


class NarrativeReportViewSet(PublicProjectViewSet):
    """
    """
    queryset = NarrativeReport.objects.all().select_related(
        'project',
        'category',
    )
    serializer_class = NarrativeReportSerializer
    project_relation = 'project__'
