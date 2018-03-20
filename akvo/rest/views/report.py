# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.db.models import Q
from rest_framework.decorators import api_view
from rest_framework.response import Response

from akvo.rsr.models import Report, ReportFormat
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
