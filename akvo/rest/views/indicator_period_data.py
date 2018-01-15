# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from akvo.rsr.models import IndicatorPeriodData, IndicatorPeriodDataComment

from ..serializers import (IndicatorPeriodDataSerializer, IndicatorPeriodDataFrameworkSerializer,
                           IndicatorPeriodDataCommentSerializer)
from ..viewsets import PublicProjectViewSet


from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response


class IndicatorPeriodDataViewSet(PublicProjectViewSet):
    """
    """
    queryset = IndicatorPeriodData.objects.select_related('user', 'approved_by').all()
    serializer_class = IndicatorPeriodDataSerializer

    project_relation = 'period__indicator__result__project__'

    def get_queryset(self):
        queryset = super(IndicatorPeriodDataViewSet, self).get_queryset()
        return IndicatorPeriodData.get_user_viewable_updates(
            queryset, self.request.user
        )


class IndicatorPeriodDataFrameworkViewSet(PublicProjectViewSet):
    """
    """
    queryset = IndicatorPeriodData.objects.select_related(
        'period',
        'user',
        'approved_by',
    ).prefetch_related(
        'comments',
        'comments__user',
        'disaggregations',
    ).all()
    serializer_class = IndicatorPeriodDataFrameworkSerializer
    project_relation = 'period__indicator__result__project__'

    def get_queryset(self):
        queryset = super(IndicatorPeriodDataFrameworkViewSet, self).get_queryset()
        return IndicatorPeriodData.get_user_viewable_updates(
            queryset, self.request.user
        )


class IndicatorPeriodDataCommentViewSet(PublicProjectViewSet):
    """
    """
    # TODO: Is there more optimization possible?
    queryset = IndicatorPeriodDataComment.objects.select_related(
        'user'
    ).prefetch_related(
        'user__employers', 'user__employers__organisation'
    )
    serializer_class = IndicatorPeriodDataCommentSerializer
    project_relation = 'data__period__indicator__result__project__'


@api_view(['POST', 'DELETE'])
def indicator_upload_file(request, pk=None):
    """
    Special API call for directly uploading a file.

    :param request; A Django request object.
    :param pk; The primary key of an IndicatorPeriodData instance.
    """
    # Permissions
    user = getattr(request, 'user', None)
    if not user:
        return Response({'error': 'User is not logged in'}, status=status.HTTP_403_FORBIDDEN)
    # TODO: Check if user is allowed to upload a file
    # if not user.has_perm('rsr.change_project', update.period.indicator.result.project):
    #     return Response({'error': 'User has no permission to place an update'},
    #                     status=status.HTTP_403_FORBIDDEN)

    update = IndicatorPeriodData.objects.get(pk=pk)
    if request.method == 'DELETE':
        try:
            if request.data['type'] == 'photo':
                update.photo = ''
                update.save(update_fields=['photo'])
                return Response({}, status=status.HTTP_204_NO_CONTENT)
            elif request.data['type'] == 'file':
                update.file = ''
                update.save(update_fields=['file'])
                return Response({}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    else:  # POST
        upload_file = request.data['file']
        try:
            file_type = request.POST.copy()['type']
            if file_type == 'photo':
                update.photo = upload_file
                update.save(update_fields=['photo'])
                # Add photo member to be able to distinguish from file URL in new results version
                # while keeping the old API
                return Response({'file': update.photo.url, 'photo': update.photo.url})
            elif file_type == 'file':
                update.file = upload_file
                update.save(update_fields=['file'])
                return Response({'file': update.file.url})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
