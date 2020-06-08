# -*- coding: utf-8 -*-
"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from akvo.rest.models import TastyTokenAuthentication
from akvo.rsr.models import Result, Project
from django.shortcuts import get_object_or_404
from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import api_view, authentication_classes
from rest_framework.response import Response
from ..serializers import (ResultSerializer, ResultsFrameworkSerializer, ResultSerializerV2,
                           ResultsFrameworkLiteSerializer, ResultFrameworkNotSoLiteSerializer)
from ..viewsets import PublicProjectViewSet


class ResultsViewSet(PublicProjectViewSet):
    """Results resource."""

    queryset = Result.objects.all().select_related('project', 'parent_result')

    def get_serializer_class(self):
        if self.request.version == 'v2':
            return ResultSerializerV2
        return ResultSerializer


class ResultsFrameworkViewSet(PublicProjectViewSet):
    """Results framework resource."""

    queryset = Result.objects.select_related('project').prefetch_related(
        'indicators',
        'indicators__dimension_names',
        'indicators__periods',
        'indicators__periods__data',
        'indicators__periods__data__comments',
        'indicators__periods__disaggregation_targets',
    )
    serializer_class = ResultsFrameworkSerializer


class ResultsFrameworkLiteViewSet(PublicProjectViewSet):
    """Results framework lite resource."""

    queryset = Result.objects.select_related('project').prefetch_related(
        'indicators',
        'indicators__dimension_names',
        'indicators__periods',
        'indicators__periods__disaggregation_targets',
    )
    serializer_class = ResultsFrameworkLiteSerializer


@api_view(['GET'])
@authentication_classes([SessionAuthentication, TastyTokenAuthentication])
def project_results_framework(request, project_pk):
    project = get_object_or_404(Project, pk=project_pk)

    queryset = Result.objects.filter(project=project).select_related('project').prefetch_related(
        'indicators',
        'indicators__dimension_names',
        'indicators__periods',
        'indicators__periods__disaggregations',
        'indicators__periods__disaggregation_targets',
    )
    serializer = ResultFrameworkNotSoLiteSerializer(queryset, many=True, context={'request': request})

    return Response({'results': serializer.data})
