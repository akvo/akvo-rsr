# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from akvo.rsr.models import (Indicator, IndicatorPeriod, IndicatorPeriodData,
                             IndicatorPeriodDataComment)

from ..serializers import (IndicatorSerializer, IndicatorPeriodSerializer,
                           IndicatorPeriodDataSerializer, IndicatorPeriodDataCommentSerializer)
from ..viewsets import PublicProjectViewSet

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


class IndicatorViewSet(PublicProjectViewSet):
    """
    """
    queryset = Indicator.objects.all()
    serializer_class = IndicatorSerializer
    filter_fields = ('result', )
    project_relation = 'result__project__'


class IndicatorPeriodViewSet(PublicProjectViewSet):
    """
    """
    queryset = IndicatorPeriod.objects.all()
    serializer_class = IndicatorPeriodSerializer
    filter_fields = ('indicator', )
    project_relation = 'indicator__result__project__'


class IndicatorPeriodDataViewSet(PublicProjectViewSet):
    """
    """
    queryset = IndicatorPeriodData.objects.all()
    serializer_class = IndicatorPeriodDataSerializer
    filter_fields = ('period', 'user', 'relative_data', 'status', 'update_method')
    project_relation = 'period__indicator__result__project__'


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def indicator_upload_file(request, pk=None):
    """
    Special API call for directly uploading a file.

    :param request; A Django request object.
    :param pk; The primary key of an IndicatorPeriodData instance.
    """
    update = IndicatorPeriodData.objects.get(pk=pk)
    upload_file = request.FILES['file']

    # TODO: Permissions
    user = request.user

    file_type = request.POST.copy()['type']
    if file_type == 'photo':
        update.photo = upload_file
        update.save(update_fields=['photo'])
        return Response({'file': update.photo.url})
    elif file_type == 'file':
        update.file = upload_file
        update.save(update_fields=['file'])
        return Response({'file': update.file.url})

    # TODO: Error response
    return Response({})


class IndicatorPeriodDataCommentViewSet(PublicProjectViewSet):
    """
    """
    queryset = IndicatorPeriodDataComment.objects.all()
    serializer_class = IndicatorPeriodDataCommentSerializer
    filter_fields = ('data', 'user')
    project_relation = 'period__indicator__result__project__'
