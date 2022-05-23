# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.http import Http404
from rest_framework.decorators import api_view
from rest_framework.response import Response

from akvo.rsr.models import IndicatorPeriodLabel, Project
from ..serializers import IndicatorPeriodLabelSerializer
from ..viewsets import PublicProjectViewSet


class IndicatorPeriodLabelViewSet(PublicProjectViewSet):
    """
    """
    queryset = IndicatorPeriodLabel.objects.all()
    serializer_class = IndicatorPeriodLabelSerializer
    project_relation = 'project__'


@api_view(['GET'])
def project_period_labels(request, project_pk):
    try:
        project = Project.objects.get(id=project_pk)
    except Project.DoesNotExist:
        raise Http404

    program = project.get_root()
    serializer = IndicatorPeriodLabelSerializer(program.period_labels.all(), many=True)
    return Response(dict(period_labels=serializer.data))
