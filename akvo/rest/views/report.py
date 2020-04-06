# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from akvo.rsr.models import Report, ReportFormat, Project, ProjectHierarchy
from ..serializers import ReportSerializer, ReportFormatSerializer
from ..viewsets import BaseRSRViewSet


class ReportViewSet(BaseRSRViewSet):
    """Viewset providing Result data."""

    queryset = Report.objects.prefetch_related(
        'organisations',
        'formats',
    )
    serializer_class = ReportSerializer

    def get_queryset(self):
        """
        Allow custom filter for sync_owner, since this field has been replaced by the
        reporting org partnership.
        """
        reports = super(ReportViewSet, self).get_queryset()
        user = self.request.user
        is_admin = user.is_active and (user.is_superuser or user.is_admin)
        if not is_admin:
            # Show only those reports that the user is allowed to see
            approved_orgs = user.approved_organisations() if not user.is_anonymous() else []
            reports = reports.filter(
                Q(organisations=None) | Q(organisations__in=approved_orgs)
            ).distinct()
        return reports


@api_view(['GET'])
def report_formats(request):
    """
    A view for displaying all report format information.
    """
    return Response({
        'count': ReportFormat.objects.all().count(),
        'results': [ReportFormatSerializer(f).data for f in ReportFormat.objects.all()],
    })


@api_view(['GET'])
def organisation_reports(request):
    queryset = Report.objects.prefetch_related('organisations', 'formats')\
        .filter(url__icontains='{organisation}')\
        .exclude(url__icontains='program=true')

    user = request.user
    is_admin = user.is_active and (user.is_superuser or user.is_admin)
    if not is_admin:
        # Show only those reports that the user is allowed to see
        approved_orgs = user.approved_organisations() if not user.is_anonymous() else []
        queryset = queryset.filter(
            Q(organisations=None) | Q(organisations__in=approved_orgs)
        ).distinct()

    serializer = ReportSerializer(queryset.distinct(), many=True)
    return Response({'results': serializer.data})


@api_view(['GET'])
def program_reports(request, program_pk):
    """
    A view for displaying reports tagged with program parameter and owned by
    program's organisation.
    """
    program = get_object_or_404(Project, pk=program_pk)
    user = request.user
    try:
        organisation = program.projecthierarchy.organisation
    except ProjectHierarchy.DoesNotExist:
        return Response({'organisation': None, 'reports': []})

    if not user.has_perm('rsr.view_project', program):
        return Response('Request not allowed', status=status.HTTP_403_FORBIDDEN)

    queryset = Report.objects.prefetch_related('formats', 'organisations')\
        .filter(url__icontains='{organisation}')\
        .filter(url__icontains='program=true')\
        .filter(organisations=organisation)
    serializer = ReportSerializer(queryset.distinct(), many=True)

    return Response({
        'results': serializer.data
    })


@api_view(['GET'])
def project_reports(request, project_pk):
    """A view for displaying project specific reports."""

    project = get_object_or_404(Project, pk=project_pk)
    reports = Report.objects.prefetch_related('formats', 'organisations')\
                            .filter(url__icontains='{project}')

    user = request.user
    if not user.has_perm('rsr.view_project', project):
        return Response('Request not allowed', status=status.HTTP_403_FORBIDDEN)

    is_admin = user.is_active and (user.is_superuser or user.is_admin)

    if not is_admin:
        partners_org = project.partner_organisation_pks()
        reports = reports.filter(
            Q(organisations=None) | Q(organisations__in=partners_org)
        )

    serializer = ReportSerializer(reports.distinct(), many=True)
    return Response(serializer.data)
