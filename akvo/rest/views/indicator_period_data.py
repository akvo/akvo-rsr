# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from akvo.rsr.models import IndicatorPeriod, IndicatorPeriodData, IndicatorPeriodDataComment, Project
from akvo.rest.models import TastyTokenAuthentication, JWTAuthentication

from ..serializers import (IndicatorPeriodDataSerializer, IndicatorPeriodDataFrameworkSerializer,
                           IndicatorPeriodDataCommentSerializer)
from ..viewsets import PublicProjectViewSet


from django.shortcuts import get_object_or_404
from django.http import HttpResponseBadRequest, HttpResponseForbidden
from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import api_view, authentication_classes
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

    def get_queryset(self):
        queryset = getattr(self, '_c_queryset', None)
        if queryset is None:
            queryset = super(IndicatorPeriodDataFrameworkViewSet, self).get_queryset()
            queryset = IndicatorPeriodData.get_user_viewable_updates(
                queryset, self.request.user
            )
            self._c_queryset = queryset

        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


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
    if user != update.user:
        return Response({'error': 'User has no permission to add/remove files'}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'POST' and not file_pk:
        serializer = IndicatorPeriodDataFrameworkSerializer(instance=update, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data['file_set'])

    if request.method == 'DELETE' and file_pk:
        file = update.indicatorperioddatafile_set.get(pk=file_pk)
        file.delete()
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
        serializer.save()

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

    return Response({'success': True})


@api_view(['GET'])
@authentication_classes([SessionAuthentication, TastyTokenAuthentication])
def get_program_period_updates_for_approvals(request, program_pk):
    program = get_object_or_404(Project, pk=program_pk)
    root_period_ids = IndicatorPeriod.objects\
        .filter(indicator__result__project=program)\
        .values_list('id', flat=True)
    period_ids = set(root_period_ids)
    while True:
        children = set(
            IndicatorPeriod.objects.filter(
                parent_period__in=period_ids
            ).values_list(
                'id', flat=True
            ))
        if period_ids.union(children) == period_ids:
            break
        period_ids = period_ids.union(children)

    updates = IndicatorPeriodData.objects\
        .select_related(
            'period', 'period__indicator',
            'period__indicator__result',
            'period__indicator__result__project',
            'user',
            'approved_by'
        )\
        .prefetch_related('period__indicator__result__project__locations__country')\
        .filter(status=IndicatorPeriodData.STATUS_PENDING_CODE, period__in=period_ids)

    periods = {}
    indicators = {}
    results = {}
    projects = {}
    pending_updates = []
    for update in updates.all():
        pending_update = IndicatorPeriodDataFrameworkSerializer(update).data
        pending_update.update({
            'period': update.period.id,
            'indicator': update.period.indicator.id,
            'result': update.period.indicator.result.id,
            'project': update.period.indicator.result.project.id,
        })
        pending_updates.append(pending_update)
        period = update.period
        if period.id in periods:
            continue
        periods[period.id] = {
            'id': period.id,
            'period_start': period.period_start,
            'period_end': period.period_end,
            'locked': period.locked,
            'project': period.indicator.result.project.id
        }
        indicator = period.indicator
        if indicator.id in indicators:
            continue
        indicators[indicator.id] = {'id': indicator.id, 'title': indicator.title}
        result = indicator.result
        if result.id in results:
            continue
        results[result.id] = {'id': result.id, 'title': result.title}
        project = result.project
        if project.id in projects:
            continue
        projects[project.id] = {
            'id': project.id,
            'title': project.title,
            'countries': [loc.country.iso_code for loc in project.locations.all() if loc.country]
        }

    pending_updates_view = []
    for update in pending_updates:
        u = update.copy()
        u.update({
            'period': periods[u['period']],
            'indicator': indicators[u['indicator']],
            'result': results[u['result']],
            'project': projects[u['project']],
        })
        pending_updates_view.append(u)

    data = {
        'periods': [
            {
                'id': p['id'],
                'period_start': p['period_start'],
                'period_end': p['period_end'],
                'locked': p['locked'],
                'project': projects[p['project']]
            }
            for p in periods.values()
        ],
        'pending_updates': pending_updates_view
    }
    return Response(data)
