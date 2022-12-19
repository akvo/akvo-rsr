# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.http import HttpResponseForbidden
from django.shortcuts import get_object_or_404
from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import api_view, authentication_classes
from rest_framework.response import Response
from akvo.rest.authentication import TastyTokenAuthentication
from akvo.rest.serializers import IndicatorSerializer, IndicatorFrameworkSerializer
from akvo.rest.viewsets import PublicProjectViewSet
from akvo.rsr.models import Indicator
from akvo.rsr.usecases.indicator_contribution import get_indicator_contribution_count


class IndicatorViewSet(PublicProjectViewSet):
    """
    """
    queryset = Indicator.objects.all().select_related(
        'result',
        'result__project',
    ).prefetch_related(
        'child_indicators'
    )
    serializer_class = IndicatorSerializer
    project_relation = 'result__project__'


class IndicatorFrameworkViewSet(PublicProjectViewSet):
    """
    """
    queryset = Indicator.objects.all().select_related(
        'result',
        'result__project',
    ).prefetch_related(
        'child_indicators',
        'periods',
        'periods__disaggregation_targets',
    )
    serializer_class = IndicatorFrameworkSerializer
    project_relation = 'result__project__'


@api_view(["GET"])
@authentication_classes([SessionAuthentication, TastyTokenAuthentication])
def indicator_contribution_count(request, project_pk, indicator_pk):
    """The main purpose of this endpoint is as a way for the Frontend to determine whether the user can enable or disable cumulative reporting."""
    user = request.user
    queryset = Indicator.objects.select_related("result__project")
    indicator = get_object_or_404(queryset, pk=indicator_pk)
    project = indicator.result.project
    if project.id != int(project_pk) or not user.has_perm("rsr.view_project", project):
        return HttpResponseForbidden()
    count = get_indicator_contribution_count(indicator)
    return Response({"count": count})
