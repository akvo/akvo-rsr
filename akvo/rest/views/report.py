# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.db.models import Q
from rest_framework.decorators import api_view
from rest_framework.response import Response

from akvo.rsr.models import Report, ReportFormat
from ..serializers import ReportSerializer, ReportFormatSerializer


@api_view(['GET'])
def reports(request):
    """
    A view for displaying all report information, sorted by title.
    """

    user = request.user
    is_admin = user.is_active and (user.is_superuser or user.is_admin)
    reports = Report.objects.all()
    if not is_admin:
        # Show only those reports that the user is allowed to see
        reports = reports.filter(
            Q(organisations=None) | Q(organisations__in=user.approved_organisations())
        ).distinct()

    # FIXME: Use a viewset instead?
    return Response({
        'count': reports.count(),
        'results': [ReportSerializer(r).data for r in reports.order_by('title')],
    })


@api_view(['GET'])
def report_formats(request):
    """
    A view for displaying all report format information.
    """
    return Response({
        'count': ReportFormat.objects.all().count(),
        'results': [ReportFormatSerializer(f).data for f in ReportFormat.objects.all()],
    })
