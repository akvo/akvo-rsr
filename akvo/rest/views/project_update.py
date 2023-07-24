# -*- coding: utf-8 -*-
"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from re import match

from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import ParseError

from akvo.rest.authentication import TastyTokenAuthentication, JWTAuthentication
from akvo.rest.serializers import (
    ProjectUpdateSerializer, ProjectUpdateExtraSerializer, ProjectUpdatePhotoSerializer,
)
from akvo.rest.viewsets import PublicProjectViewSet
from akvo.rsr.models import ProjectUpdate, ProjectUpdatePhoto


class ProjectUpdateViewSet(PublicProjectViewSet):

    """."""
    queryset = ProjectUpdate.objects.select_related('project',
                                                    'user').prefetch_related('locations')
    serializer_class = ProjectUpdateSerializer

    paginate_by_param = 'limit'
    max_paginate_by = 1000

    def filter_queryset(self, queryset):
        """
        Allow simple filtering on selected fields.
        We don't use the default filter_fields, because Up filters on
        datetime for last_modified_at, and they only support a date, not datetime.
        """
        # FIXME: Add filter for event_date?
        created_at__gt = validate_date(self.request.query_params.get('created_at__gt', None))
        if created_at__gt is not None:
            queryset = queryset.filter(created_at__gt=created_at__gt)
        created_at__lt = validate_date(self.request.query_params.get('created_at__lt', None))
        if created_at__lt is not None:
            queryset = queryset.filter(created_at__lt=created_at__lt)
        last_modified_at__gt = validate_date(self.request.query_params.get('last_modified_at__gt', None))
        if last_modified_at__gt is not None:
            queryset = queryset.filter(last_modified_at__gt=last_modified_at__gt)
        last_modified_at__lt = validate_date(self.request.query_params.get('last_modified_at__lt', None))
        if last_modified_at__lt is not None:
            queryset = queryset.filter(last_modified_at__lt=last_modified_at__lt)
        # Get updates per organisation
        project__partners = self.request.query_params.get('project__partners', None)
        if project__partners:
            queryset = queryset.filter(project__partners=project__partners)
        user__organisations = self.request.query_params.get('user__organisations', None)
        if user__organisations:
            queryset = queryset.filter(user__organisations=user__organisations)
        return super().filter_queryset(queryset)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# validate date strings from URL
def validate_date(date):

    if date is None:
        return None
    # if yyyy-mm-ddThh:mm:ss
    elif match(
            r'^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])T[0-2]\d{1}:[0-5]\d{1}:[0-5]\d{1}$',
            date) is not None:
        return date
    # if yyyy-mm-dd
    elif match(r'^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$', date) is not None:
        return date
    # if yyyy-mm
    elif match(r'^\d{4}\-(0?[1-9]|1[012])$', date) is not None:
        return date + '-01'
    else:
        raise ParseError(
            'Invalid date: created_at and last_modified_at dates must be in one of the following '
            'formats: yyyy-mm, yyyy-mm-dd or yyyy-mm-ddThh:mm:ss'
        )


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def upload_indicator_update_photo(request, pk=None):
    update = ProjectUpdate.objects.get(pk=pk)

    # TODO: permissions

    data = request.data
    if 'photo' in data:
        update.photo = data['photo']
        update.save(update_fields=['photo'])

    return Response(ProjectUpdateExtraSerializer(update).data)


@api_view(['POST', 'PATCH', 'DELETE'])
@authentication_classes([SessionAuthentication, TastyTokenAuthentication, JWTAuthentication])
def project_update_photos(request, update_pk, photo_pk=None):
    update = get_object_or_404(ProjectUpdate, pk=update_pk)
    user = request.user
    if not user.has_perm('rsr.change_projectupdate', update):
        return Response({'error': 'User has no permission to add/remove photo'}, status=status.HTTP_403_FORBIDDEN)
    if request.method == 'POST' and not photo_pk:
        data = request.data
        data['update'] = update.id
        serializer = ProjectUpdatePhotoSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    if request.method == 'PATCH' and photo_pk:
        data = request.data
        instance = get_object_or_404(ProjectUpdatePhoto, pk=photo_pk)
        serializer = ProjectUpdatePhotoSerializer(instance=instance, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    if request.method == 'DELETE' and photo_pk:
        photo = update.photos.get(pk=photo_pk)
        photo.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
