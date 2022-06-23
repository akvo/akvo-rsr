# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import json
import os

from akvo.rsr.models import IndicatorPeriodData, IndicatorPeriodDataComment, Project
from akvo.rest.authentication import TastyTokenAuthentication, JWTAuthentication
from akvo.rsr.models.result.utils import QUANTITATIVE, PERCENTAGE_MEASURE

from ..serializers import (IndicatorPeriodDataSerializer, IndicatorPeriodDataFrameworkSerializer,
                           IndicatorPeriodDataCommentSerializer)
from ..viewsets import PublicProjectViewSet

from django.shortcuts import get_object_or_404
from django.http import HttpResponseBadRequest, HttpResponseForbidden
from django.contrib.admin.models import LogEntry, ADDITION, CHANGE, DELETION
from django.contrib.contenttypes.models import ContentType
from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import api_view, authentication_classes
from rest_framework.response import Response
from rest_framework.utils.encoders import JSONEncoder


class IndicatorPeriodDataViewSet(PublicProjectViewSet):
    """
    """
    queryset = IndicatorPeriodData.objects.select_related('user', 'approved_by').all()
    serializer_class = IndicatorPeriodDataSerializer

    project_relation = 'period__indicator__result__project__'

    def filter_queryset(self, queryset):
        queryset = super(IndicatorPeriodDataViewSet, self).filter_queryset(queryset)
        return IndicatorPeriodData.get_user_viewable_updates(
            queryset, self.request.user
        )

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class IndicatorPeriodDataFrameworkViewSet(PublicProjectViewSet):
    """
    """
    authentication_classes = (SessionAuthentication, TastyTokenAuthentication, JWTAuthentication)

    queryset = IndicatorPeriodData.objects.select_related(
        'period',
        'user',
        'approved_by',
    ).prefetch_related(
        'comments',
        'disaggregations',
    ).all()
    serializer_class = IndicatorPeriodDataFrameworkSerializer
    project_relation = 'period__indicator__result__project__'

    def get_object(self):
        obj = get_object_or_404(self.get_queryset(), pk=self.kwargs['pk'])
        # check whether the user has permission
        viewables = IndicatorPeriodData.get_user_viewable_updates(
            self.get_queryset().filter(pk=self.kwargs['pk']),
            self.request.user
        )
        if viewables.count() == 0:
            self.permission_denied(self.request)
        return obj

    def filter_queryset(self, queryset):
        queryset = super().filter_queryset(queryset)
        queryset = IndicatorPeriodData.get_user_viewable_updates(
            queryset, self.request.user
        )
        return queryset

    def perform_create(self, serializer):
        data = {key: value for key, value in serializer.validated_data.items() if key not in ['period', 'files', 'photos', 'approved_by']}
        if len(serializer._disaggregations_data) > 0:
            data['disaggregations'] = [
                {key: value for key, value in dsg.items() if key in ['id', 'dimension_value', 'value', 'numerator', 'denominator']}
                for dsg in serializer._disaggregations_data
            ]
        user = self.request.user
        serializer.save(user=user)
        instance = serializer.instance
        log_data = {'audit_trail': True, 'data': data}
        LogEntry.objects.log_action(
            user_id=user.id,
            content_type_id=ContentType.objects.get_for_model(IndicatorPeriodData).id,
            object_id=instance.id,
            object_repr=str(instance),
            action_flag=ADDITION,
            change_message=json.dumps(log_data, cls=JSONEncoder)
        )

    def perform_update(self, serializer):
        instance = serializer.instance
        data = {
            key: value
            for key, value in serializer.validated_data.items()
            if key not in ['period', 'files', 'photos', 'approved_by'] and (key == 'comments' or getattr(instance, key) != value)
        }
        if len(serializer._disaggregations_data) > 0:
            indicator = instance.period.indicator
            is_percentage = indicator.type == QUANTITATIVE and indicator.measure == PERCENTAGE_MEASURE
            dsg_attrs = ['id', 'dimension_value', 'numerator', 'denominator'] if is_percentage else ['id', 'dimension_value', 'value']
            data['disaggregations'] = [
                {key: value for key, value in dsg.items() if key in dsg_attrs}
                for dsg in serializer._disaggregations_data
            ]
        user = self.request.user
        status = data.get('status', None)
        if status == 'R' or status == 'A':
            serializer.save()
        else:
            serializer.save(user=user)
        log_data = {'audit_trail': True, 'data': data}
        LogEntry.objects.log_action(
            user_id=user.id,
            content_type_id=ContentType.objects.get_for_model(IndicatorPeriodData).id,
            object_id=instance.id,
            object_repr=str(instance),
            action_flag=CHANGE,
            change_message=json.dumps(log_data, cls=JSONEncoder)
        )

    def perform_destroy(self, instance):
        object_id = instance.id
        object_repr = str(instance)
        super().perform_destroy(instance)
        LogEntry.objects.log_action(
            user_id=self.request.user.id,
            content_type_id=ContentType.objects.get_for_model(IndicatorPeriodData).id,
            object_id=object_id,
            object_repr=object_repr,
            action_flag=DELETION,
            change_message=json.dumps({'audit_trail': True})
        )


class IndicatorPeriodDataCommentViewSet(PublicProjectViewSet):
    """
    """
    authentication_classes = (SessionAuthentication, TastyTokenAuthentication, JWTAuthentication)

    # TODO: Is there more optimization possible?
    queryset = IndicatorPeriodDataComment.objects.select_related(
        'user'
    ).prefetch_related(
        'user__employers', 'user__employers__organisation'
    )
    serializer_class = IndicatorPeriodDataCommentSerializer
    project_relation = 'data__period__indicator__result__project__'

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


@api_view(['POST', 'DELETE'])
@authentication_classes([SessionAuthentication, TastyTokenAuthentication, JWTAuthentication])
def period_update_files(request, update_pk, file_pk=None):
    update = get_object_or_404(IndicatorPeriodData, pk=update_pk)
    user = request.user
    if not user.has_perm('rsr.change_indicatorperioddata', update):
        return Response({'error': 'User has no permission to add/remove files'}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'POST' and not file_pk:
        serializer = IndicatorPeriodDataFrameworkSerializer(instance=update, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        files = [f"Uploaded file \"{file.name}\"" for file in serializer.validated_data.get('files', [])]
        serializer.save(user=user)
        log_data = {'audit_trail': True, 'data': {'files': files}}
        LogEntry.objects.log_action(
            user_id=user.id,
            content_type_id=ContentType.objects.get_for_model(IndicatorPeriodData).id,
            object_id=update.id,
            object_repr=str(update),
            action_flag=CHANGE,
            change_message=json.dumps(log_data)
        )
        return Response(serializer.data['file_set'])

    if request.method == 'DELETE' and file_pk:
        file = update.indicatorperioddatafile_set.get(pk=file_pk)
        filename = os.path.basename(file.file.name)
        file.delete()
        update.user = user
        update.save(update_fields=['user'])
        log_data = {'audit_trail': True, 'data': {'files': [f"Removed file \"{filename}\""]}}
        LogEntry.objects.log_action(
            user_id=user.id,
            content_type_id=ContentType.objects.get_for_model(IndicatorPeriodData).id,
            object_id=update.id,
            object_repr=str(update),
            action_flag=CHANGE,
            change_message=json.dumps(log_data)
        )
        return Response(status=status.HTTP_204_NO_CONTENT)

    return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)


@api_view(['POST', 'DELETE'])
@authentication_classes([SessionAuthentication, TastyTokenAuthentication, JWTAuthentication])
def period_update_photos(request, update_pk, photo_pk=None):
    update = get_object_or_404(IndicatorPeriodData, pk=update_pk)
    user = request.user
    if user != update.user:
        return Response({'error': 'User has no permission to add/remove photos'}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'POST' and not photo_pk:
        serializer = IndicatorPeriodDataFrameworkSerializer(instance=update, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=user)
        return Response(serializer.data['photo_set'])

    if request.method == 'DELETE' and photo_pk:
        photo = update.indicatorperioddataphoto_set.get(pk=photo_pk)
        photo.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)


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


@api_view(['POST'])
@authentication_classes([SessionAuthentication, TastyTokenAuthentication])
def set_updates_status(request, project_pk):
    """Bulk update IndicatorPeriodData.status attributes of a project.
    """
    update_ids = request.data.get('updates', [])
    status = request.data.get('status', None)
    if len(update_ids) < 1 or status is None:
        return HttpResponseBadRequest()
    user = request.user
    project = get_object_or_404(Project, pk=project_pk)
    if not user.has_perm('rsr.change_project', project):
        return HttpResponseForbidden()
    IndicatorPeriodData.objects\
        .filter(id__in=update_ids, period__indicator__result__project=project)\
        .update(status=status)
    log_data = {'audit_trail': True, 'data': {'status': status}}
    for update_id in update_ids:
        LogEntry.objects.log_action(
            user_id=user.id,
            content_type_id=ContentType.objects.get_for_model(IndicatorPeriodData).id,
            object_id=update_id,
            object_repr='IndicatorPeriodData',
            action_flag=CHANGE,
            change_message=json.dumps(log_data)
        )
    return Response({'success': True})


@api_view(['GET'])
@authentication_classes([SessionAuthentication, TastyTokenAuthentication])
def indicator_updates_by_period_id(request, program_pk):
    program = get_object_or_404(Project, pk=program_pk)
    user = request.user
    if not user.has_perm('rsr.view_project', program):
        return HttpResponseForbidden()
    period_ids = {id for id in request.GET.get('ids', '').split(',') if id}
    contributors = program.descendants()
    queryset = IndicatorPeriodData.objects\
        .select_related(
            'period',
            'user',
            'approved_by',
        ).prefetch_related(
            'comments',
            'disaggregations',
        ).filter(
            status=IndicatorPeriodData.STATUS_APPROVED_CODE,
            period__indicator__result__project__in=contributors,
            period__in=period_ids
        )
    serializer = IndicatorPeriodDataFrameworkSerializer(queryset, many=True)
    return Response(serializer.data)
