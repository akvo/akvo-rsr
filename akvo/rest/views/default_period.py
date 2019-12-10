# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.core.exceptions import PermissionDenied
from django.db import transaction
from django.http import Http404
from rest_framework.decorators import api_view
from rest_framework.response import Response

from akvo.rsr.models import DefaultPeriod, Project
from ..serializers import DefaultPeriodSerializer
from ..viewsets import PublicProjectViewSet


class DefaultPeriodViewSet(PublicProjectViewSet):
    queryset = DefaultPeriod.objects.all().select_related('parent')
    serializer_class = DefaultPeriodSerializer


@api_view(['GET', 'POST'])
def project_default_periods(request, project_pk):
    user = request.user
    try:
        project = Project.objects.get(id=project_pk)
    except Project.DoesNotExist:
        raise Http404

    if not user.has_perm('rsr.change_project', project):
        raise PermissionDenied

    fields = 'period_start', 'period_end'
    periods = project.default_periods.values_list(*fields)
    if request.method == 'POST':
        existing_periods = set(map(tuple, periods))
        new_periods = {
            (period['period_start'], period['period_end'])
            for period in request.data.get('periods', [])
        }
        with transaction.atomic():
            # Delete periods
            for period_start, period_end in (existing_periods - new_periods):
                DefaultPeriod.objects.filter(
                    project=project, period_start=period_start, period_end=period_end).delete()
            # Create new periods
            created = [
                DefaultPeriod(project=project, period_start=period_start, period_end=period_end)
                for (period_start, period_end) in (new_periods - existing_periods)
            ]
            DefaultPeriod.objects.bulk_create(created)
        periods = project.default_periods.values_list(*fields)

    response = {
        'periods': [
            {'period_start': start.strftime('%Y-%m-%d'), 'period_end': end.strftime('%Y-%m-%d')}
            for (start, end) in periods
        ],
        'project': project_pk
    }
    return Response(response, status=201)
