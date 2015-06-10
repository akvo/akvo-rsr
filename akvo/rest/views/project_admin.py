# -*- coding: utf-8 -*-
"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from akvo.rsr.models import Project
import datetime

from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def project_admin_step1(request, pk=None):
    project = Project.objects.get(pk=pk)
    user = request.user

    if not user.has_perm('rsr.change_project', project):
        # TODO: Return proper 403
        raise PermissionDenied

    data = request.POST

    # Title
    # title = data.get('projectTitle', '')
    project.title = data['projectTitle']
    project.save(update_fields=["title"])

    # Subtitle
    project.subtitle = data['projectSubTitle']
    project.save(update_fields=["subtitle"])

    # IATI Identifier
    project.iati_activity_id = data['iatiId']
    project.save(update_fields=["iati_activity_id"])

    # Status
    project.status = data['projectStatus']
    project.save(update_fields=["status"])

    # Start date (planned)
    date_start_planned = data['eventFromPlanned']
    project.date_start_planned = date_start_planned if date_start_planned else None
    project.save(update_fields=["date_start_planned"])

    # Start date (actual)
    date_start_actual = data['eventFromActual']
    project.date_start_actual = date_start_actual if date_start_actual else None
    project.save(update_fields=["date_start_actual"])

    # End date (planned)
    date_end_planned = data['eventEndPlanned']
    project.date_end_planned = date_end_planned if date_end_planned else None
    project.save(update_fields=["date_end_planned"])

    # End date (actual)
    date_end_actual = data['eventEndActual']
    project.date_end_actual = date_end_actual if date_end_actual else None
    project.save(update_fields=["date_end_actual"])

    # Language
    project.language = data['projectLanguage']
    project.save(update_fields=["language"])

    # Currency
    project.currency = data['projectCurrency']
    project.save(update_fields=["currency"])

    # Hierarchy
    hierarchy = data.get('projectHierarchy', '')
    project.hierarchy = int(hierarchy) if hierarchy else None
    project.save(update_fields=["hierarchy"])

    # Default aid type
    project.default_aid_type = data['defaultAidType']
    project.save(update_fields=["default_aid_type"])

    # Default flow type
    project.default_flow_type = data['defaultFlowType']
    project.save(update_fields=["default_flow_type"])

    # Default tied status
    project.default_tied_status = data['defaultTiedStatus']
    project.save(update_fields=["default_tied_status"])

    # Default collaboration type
    project.collaboration_type = data['collaborationType']
    project.save(update_fields=["collaboration_type"])

    # Default finance type
    project.default_finance_type = data['defaultFinanceType']
    project.save(update_fields=["default_finance_type"])

    # TODO: Related projects

    return Response({'status': 'title updated'})
