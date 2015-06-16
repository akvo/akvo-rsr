# -*- coding: utf-8 -*-
"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from akvo.rsr.models import Project, RelatedProject

from django.http import HttpResponseForbidden

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def project_admin_step1(request, pk=None):
    project = Project.objects.get(pk=pk)
    user = request.user

    if not user.has_perm('rsr.change_project', project):
        return HttpResponseForbidden()

    data = request.POST
    errors = []

    # Title
    project.title = data['projectTitle']
    try:
        project.save(update_fields=["title"])
    except Exception as e:
        error = str(e).capitalize()
        errors.append({'name': 'projectTitle', 'error': error})

    # Subtitle
    project.subtitle = data['projectSubTitle']
    try:
        project.save(update_fields=["subtitle"])
    except Exception as e:
        error = str(e).capitalize()
        errors.append({'name': 'projectSubTitle', 'error': error})

    # IATI Identifier
    project.iati_activity_id = data['iatiId']
    try:
        project.save(update_fields=["iati_activity_id"])
    except Exception as e:
        error = str(e).capitalize()
        errors.append({'name': 'iatiId', 'error': error})

    # Status
    project.status = data['projectStatus']
    try:
        project.save(update_fields=["status"])
    except Exception as e:
        error = str(e).capitalize()
        errors.append({'name': 'projectStatus', 'error': error})

    # Start date (planned)
    date_start_planned = data['eventFromPlanned']
    project.date_start_planned = date_start_planned if date_start_planned else None
    try:
        project.save(update_fields=["date_start_planned"])
    except Exception as e:
        error = str(e).capitalize()
        errors.append({'name': 'eventFromPlanned', 'error': error})

    # Start date (actual)
    date_start_actual = data['eventFromActual']
    project.date_start_actual = date_start_actual if date_start_actual else None
    try:
        project.save(update_fields=["date_start_actual"])
    except Exception as e:
        error = str(e).capitalize()
        errors.append({'name': 'eventFromActual', 'error': error})

    # End date (planned)
    date_end_planned = data['eventEndPlanned']
    project.date_end_planned = date_end_planned if date_end_planned else None
    try:
        project.save(update_fields=["date_end_planned"])
    except Exception as e:
        error = str(e).capitalize()
        errors.append({'name': 'eventEndPlanned', 'error': error})

    # End date (actual)
    date_end_actual = data['eventEndActual']
    project.date_end_actual = date_end_actual if date_end_actual else None
    try:
        project.save(update_fields=["date_end_actual"])
    except Exception as e:
        error = str(e).capitalize()
        errors.append({'name': 'eventEndActual', 'error': error})

    # Language
    project.language = data['projectLanguage']
    try:
        project.save(update_fields=["language"])
    except Exception as e:
        error = str(e).capitalize()
        errors.append({'name': 'projectLanguage', 'error': error})

    # Currency
    project.currency = data['projectCurrency']
    try:
        project.save(update_fields=["currency"])
    except Exception as e:
        error = str(e).capitalize()
        errors.append({'name': 'projectCurrency', 'error': error})

    # Hierarchy
    hierarchy = data['projectHierarchy']
    project.hierarchy = int(hierarchy) if hierarchy else None
    try:
        project.save(update_fields=["hierarchy"])
    except Exception as e:
        error = str(e).capitalize()
        errors.append({'name': 'projectHierarchy', 'error': error})

    # Default aid type
    project.default_aid_type = data['defaultAidType']
    try:
        project.save(update_fields=["default_aid_type"])
    except Exception as e:
        error = str(e).capitalize()
        errors.append({'name': 'defaultAidType', 'error': error})

    # Default flow type
    project.default_flow_type = data['defaultFlowType']
    try:
        project.save(update_fields=["default_flow_type"])
    except Exception as e:
        error = str(e).capitalize()
        errors.append({'name': 'defaultFlowType', 'error': error})

    # Default tied status
    project.default_tied_status = data['defaultTiedStatus']
    try:
        project.save(update_fields=["default_tied_status"])
    except Exception as e:
        error = str(e).capitalize()
        errors.append({'name': 'defaultTiedStatus', 'error': error})

    # Default collaboration type
    project.collaboration_type = data['collaborationType']
    try:
        project.save(update_fields=["collaboration_type"])
    except Exception as e:
        error = str(e).capitalize()
        errors.append({'name': 'collaborationType', 'error': error})

    # Default finance type
    project.default_finance_type = data['defaultFinanceType']
    try:
        project.save(update_fields=["default_finance_type"])
    except Exception as e:
        error = str(e).capitalize()
        errors.append({'name': 'defaultFinanceType', 'error': error})

    # Related projects
    for key in data.keys():
        if 'related-project-project-' in key:
            rp = None
            rp_id = key.split('-', 3)[3]

            if 'add' in rp_id:
                rp = RelatedProject.objects.create(project=project)
            else:
                try:
                    rp = RelatedProject.objects.get(pk=int(rp_id))
                except Exception as e:
                    error = str(e).capitalize()
                    errors.append({'name': key, 'error': error})

            if rp:
                # TODO: Related project

                # Related project IATI identifier
                rp_iati_id_key = 'related-project-iati-identifier-' + rp_id
                rp.related_iati_id = data[rp_iati_id_key]
                try:
                    rp.save(update_fields=["related_iati_id"])
                except Exception as e:
                    error = str(e).capitalize()
                    errors.append({'name': rp_iati_id_key, 'error': error})

                # Related project relation
                rp_relation_key = 'related-project-relation-' + rp_id
                rp.relation = data[rp_relation_key]
                try:
                    rp.save(update_fields=["relation"])
                except Exception as e:
                    error = str(e).capitalize()
                    errors.append({'name': rp_relation_key, 'error': error})

    return Response({'errors': errors})
