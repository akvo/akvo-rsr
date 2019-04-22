# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.db.models import Q
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from akvo.rsr.models import Report, ReportFormat, Project, RelatedProject
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
def project_reports(request, project_pk):

    def project_ancestry(project):
        ancestors = Project.objects.filter(pk=project.pk)
        ancestry_count = 1
        while True:
            ancestors = Project.objects.filter(
                related_projects__related_project__in=ancestors,
                related_projects__relation=RelatedProject.PROJECT_RELATION_CHILD
            ) | Project.objects.filter(
                related_to_projects__project__in=ancestors,
                related_to_projects__relation=RelatedProject.PROJECT_RELATION_PARENT
            ) | ancestors
            if ancestors.distinct().count() > ancestry_count:
                ancestry_count = ancestors.distinct().count()
            else:
                return ancestors.distinct()

    project = get_object_or_404(Project, pk=project_pk)
    reports = Report.objects.prefetch_related(
        'formats', 'organisations', 'projects',
    ).filter(url__icontains='project')

    user = request.user
    is_admin = user.is_active and (user.is_superuser or user.is_admin)

    if not is_admin:
        approved_orgs = (
            user.approved_organisations() if not user.is_anonymous() else []
        )
        reports = reports.filter(
            Q(organisations=None) | Q(organisations__in=approved_orgs)
        )

        project_ancestors = (
            project_ancestry(project) if user.has_perm('rsr.view_project', project) else []
        )
        reports = reports.filter(
            Q(projects=None) | Q(projects__in=project_ancestors)
        )

    serializer = ReportSerializer(reports.distinct(), many=True)
    return Response(serializer.data)
