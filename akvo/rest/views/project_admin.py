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


def save_field(project, field, form_field, form_data, errors):
    setattr(project, field, form_data)

    try:
        project.save(update_fields=[field])
    except Exception as e:
        errors.append({'name': form_field, 'error': str(e).capitalize()})

    return errors


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def project_admin_step1(request, pk=None):
    project = Project.objects.get(pk=pk)
    user = request.user

    if not user.has_perm('rsr.change_project', project):
        return HttpResponseForbidden()

    data = request.POST
    errors = []
    new_objects = []

    errors = save_field(project, 'title', 'projectTitle', data['projectTitle'], errors)
    errors = save_field(project, 'subtitle', 'projectSubTitle', data['projectSubTitle'], errors)
    errors = save_field(project, 'iati_activity_id', 'iatiId', data['iatiId'], errors)
    errors = save_field(project, 'status', 'projectStatus', data['projectStatus'], errors)

    date_start_planned = data['eventFromPlanned'] if data['eventFromPlanned'] else None
    errors = save_field(
        project, 'date_start_planned', 'eventFromPlanned', date_start_planned, errors
    )

    date_start_actual = data['eventFromActual'] if data['eventFromActual'] else None
    errors = save_field(project, 'date_start_actual', 'eventFromActual', date_start_actual, errors)

    date_end_planned = data['eventEndPlanned'] if data['eventEndPlanned'] else None
    errors = save_field(project, 'date_end_planned', 'eventEndPlanned', date_end_planned, errors)

    date_end_actual = data['eventEndActual'] if data['eventEndActual'] else None
    errors = save_field(project, 'date_end_actual', 'eventEndActual', date_end_actual, errors)

    errors = save_field(project, 'language', 'projectLanguage', data['projectLanguage'], errors)
    errors = save_field(project, 'currency', 'projectCurrency', data['projectCurrency'], errors)

    hierarchy = data['projectHierarchy'] if data['projectHierarchy'] else None
    errors = save_field(project, 'hierarchy', 'projectHierarchy', hierarchy, errors)

    errors = save_field(
        project, 'default_aid_type', 'defaultAidType', data['defaultAidType'], errors
    )
    errors = save_field(
        project, 'default_flow_type', 'defaultFlowType', data['defaultFlowType'], errors
    )
    errors = save_field(
        project, 'default_tied_status', 'defaultTiedStatus', data['defaultTiedStatus'], errors
    )
    errors = save_field(
        project, 'collaboration_type', 'collaborationType', data['collaborationType'], errors
    )
    errors = save_field(
        project, 'default_finance_type', 'defaultFinanceType', data['defaultFinanceType'], errors
    )

    # Related projects
    for key in data.keys():
        if 'related-project-project-' in key:
            rp = None
            rp_id = key.split('-', 3)[3]

            if 'add' in rp_id and (data['related-project-iati-identifier-' + rp_id]
                                   or data['related-project-relation-' + rp_id]):
                rp = RelatedProject.objects.create(project=project)
                new_objects.append(
                    {
                        'old_id': 'add-' + rp_id[-1],
                        'new_id': str(rp.pk),
                        'div_id': 'related_project-add-' + rp_id[-1],
                    }
                )
            elif not 'add' in rp_id:
                try:
                    rp = RelatedProject.objects.get(pk=int(rp_id))
                except Exception as e:
                    error = str(e).capitalize()
                    errors.append({'name': key, 'error': error})

            if rp:
                # TODO: Related project

                rp_iati_id_key = 'related-project-iati-identifier-' + rp_id
                errors = save_field(
                    rp, 'related_iati_id', rp_iati_id_key, data[rp_iati_id_key], errors
                )

                rp_relation_key = 'related-project-relation-' + rp_id
                errors = save_field(rp, 'relation', rp_relation_key, data[rp_relation_key], errors)

    return Response(
        {
            'errors': errors,
            'new_objects': new_objects,
        }
    )


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def project_admin_step4(request, pk=None):
    project = Project.objects.get(pk=pk)
    user = request.user

    if not user.has_perm('rsr.change_project', project):
        return HttpResponseForbidden()

    data = request.POST
    errors = []
    new_objects = []

    errors = save_field(project, 'project_plan_summary', 'summary', data['summary'], errors)
    errors = save_field(project, 'background', 'background', data['background'], errors)
    errors = save_field(
        project, 'current_status', 'currentSituation', data['currentSituation'], errors
    )
    errors = save_field(project, 'project_plan_summary', 'projectPlan', data['projectPlan'], errors)
    errors = save_field(project, 'target_group', 'targetGroup', data['targetGroup'], errors)
    errors = save_field(project, 'sustainability', 'sustainability', data['sustainability'], errors)
    errors = save_field(project, 'goals_overview', 'goalsOverview', data['goalsOverview'], errors)

    return Response({
            'errors': errors,
            'new_objects': new_objects,
        }
    )
