# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.http import Http404
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from akvo.rsr.models import Report, ReportFormat, Project, ProjectHierarchy, IndicatorPeriod, Country, Organisation
from ..serializers import ReportSerializer, ReportFormatSerializer, CountrySerializer
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
    try:
        organisation = program.projecthierarchy.organisation
    except ProjectHierarchy.DoesNotExist:
        raise Http404('Program not found.')

    user = request.user
    if not user.has_perm('rsr.view_project', program):
        return Response('Request not allowed', status=status.HTTP_403_FORBIDDEN)

    queryset = Report.objects.prefetch_related('formats', 'organisations')\
        .filter(url__icontains='{program}')\
        .filter(Q(organisations=None) | Q(organisations=organisation))
    serializer = ReportSerializer(queryset.distinct(), many=True)
    result = []
    for r in serializer.data:
        r['url'] = r['url'].replace('{organisation}', str(organisation.id))
        result.append(r)

    return Response({'results': result})


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
    return Response({'results': serializer.data})


@api_view(['GET'])
def program_reports_period_dates(request, program_pk):
    """A view for displaying periods start and end dates of program"""

    country = request.GET.get('country', '').strip()

    if not country:
        program = get_object_or_404(Project, pk=program_pk)
        periods = IndicatorPeriod.objects.filter(indicator__result__project=program)
    else:
        country = get_object_or_404(Country, iso_code=country)
        project_hierarchy = get_object_or_404(ProjectHierarchy, root_project=program_pk)
        organisation = get_object_or_404(Organisation, pk=project_hierarchy.organisation.id)
        projects = organisation.all_projects().filter(primary_location__country=country)
        periods = IndicatorPeriod.objects.filter(indicator__result__project__in=projects)

    dates = sorted({(p.period_start, p.period_end) for p in periods if p.period_start and p.period_end}, key=lambda x: x)

    return Response(dates)


@api_view(['GET'])
def project_reports_period_dates(reques, project_pk):
    """A view for displaying periods start and end dates of project"""

    project = get_object_or_404(Project, pk=project_pk)
    periods = IndicatorPeriod.objects.filter(indicator__result__project=project)
    dates = sorted(
        {(p.period_start, p.period_end) for p in periods if p.period_start and p.period_end}
    )

    return Response(dates)


@api_view(['GET'])
def program_reports_countries(request, program_pk):
    program = get_object_or_404(Project, pk=program_pk)
    project_ids = program.descendants().values_list('id', flat=True)
    countries = Country.objects.filter(projectlocation__project__in=project_ids).distinct()
    serializer = CountrySerializer(countries, many=True)
    return Response(serializer.data)
