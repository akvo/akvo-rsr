# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from akvo.rsr.models import IndicatorPeriodData, IndicatorPeriodDataComment

from ..serializers import (IndicatorPeriodDataSerializer, IndicatorPeriodDataFrameworkSerializer,
                           IndicatorPeriodDataCommentSerializer)
from ..viewsets import PublicProjectViewSet

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


class IndicatorPeriodDataViewSet(PublicProjectViewSet):
    """
    """
    queryset = IndicatorPeriodData.objects.all()
    serializer_class = IndicatorPeriodDataSerializer
    filter_fields = {
        'period': ['exact'],
        'period__indicator': ['exact'],
        'period__indicator__result': ['exact'],
        'period__indicator__result__project': ['exact'],
        'user': ['exact'],
        'status': ['exact'],
        'created_at': ['exact', 'gt', 'gte', 'lt', 'lte', ],
        'last_modified_at': ['exact', 'gt', 'gte', 'lt', 'lte', ],
        'relative_data': ['exact'],
        'data': ['exact', 'gt', 'gte', 'lt', 'lte', ],
        'period_actual_value': ['exact', 'gt', 'gte', 'lt', 'lte', ],
        'update_method': ['exact']
    }

    project_relation = 'period__indicator__result__project__'


class IndicatorPeriodDataFrameworkViewSet(PublicProjectViewSet):
    """
    """
    queryset = IndicatorPeriodData.objects.all()
    serializer_class = IndicatorPeriodDataFrameworkSerializer
    filter_fields = {
        'period': ['exact'],
        'period__indicator': ['exact'],
        'period__indicator__result': ['exact'],
        'period__indicator__result__project': ['exact'],
        'user': ['exact'],
        'status': ['exact'],
        'created_at': ['exact', 'gt', 'gte', 'lt', 'lte', ],
        'last_modified_at': ['exact', 'gt', 'gte', 'lt', 'lte', ],
        'relative_data': ['exact'],
        'data': ['exact', 'gt', 'gte', 'lt', 'lte', ],
        'period_actual_value': ['exact', 'gt', 'gte', 'lt', 'lte', ],
        'update_method': ['exact']
    }
    project_relation = 'period__indicator__result__project__'


class IndicatorPeriodDataCommentViewSet(PublicProjectViewSet):
    """
    """
    queryset = IndicatorPeriodDataComment.objects.all()
    serializer_class = IndicatorPeriodDataCommentSerializer
    filter_fields = {
        'data': ['exact'],
        'data__period': ['exact'],
        'data__period__indicator': ['exact'],
        'data__period__indicator__result': ['exact'],
        'data__period__indicator__result__project': ['exact'],
        'user': ['exact'],
        'created_at': ['exact', 'gt', 'gte', 'lt', 'lte', ],
        'last_modified_at': ['exact', 'gt', 'gte', 'lt', 'lte', ]
    }
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
    # user = request.user

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
