# -*- coding: utf-8 -*-
"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from akvo.rsr.models import (AdministrativeLocation, BudgetItem, BudgetItemLabel, Country,
                             CountryBudgetItem, Indicator, IndicatorPeriod, Link, Organisation,
                             Partnership, PlannedDisbursement, PolicyMarker, Project,
                             ProjectCondition, ProjectContact, ProjectCustomField, ProjectDocument,
                             ProjectLocation, RecipientCountry, RecipientRegion, RelatedProject,
                             Result, Sector, Transaction, TransactionSector)

from decimal import Decimal
from django.http import HttpResponseForbidden

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from sorl.thumbnail import get_thumbnail


def save_field(project, field, form_field, form_data, errors):
    setattr(project, field, form_data)

    try:
        project.save(update_fields=[field])
    except Exception as e:
        errors.append({'name': form_field, 'error': str(e).capitalize()})

    return errors


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def project_admin_delete_document(request, project_pk=None, document_pk=None):
    project = Project.objects.get(pk=project_pk)
    document = ProjectDocument.objects.get(pk=document_pk)
    user = request.user

    if not user.has_perm('rsr.change_project', project):
        return HttpResponseForbidden()

    errors = save_field(document, 'document', 'document-document-' + str(document_pk), '', [])

    return Response({'errors': errors})


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def project_admin_delete_photo(request, pk=None):
    project = Project.objects.get(pk=pk)
    user = request.user

    if not user.has_perm('rsr.change_project', project):
        return HttpResponseForbidden()

    errors = save_field(project, 'current_image', 'photo', '', [])

    return Response({'errors': errors})


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def project_admin_step1(request, pk=None):
    project = Project.objects.get(pk=pk)
    user = request.user

    if not user.has_perm('rsr.change_project', project):
        return HttpResponseForbidden()

    data = request.POST
    files = request.FILES
    errors = []
    new_objects = []
    new_image = None

    if not files and 'photo' not in data.keys():
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

        hierarchy = data['projectHierarchy'] if data['projectHierarchy'] else None
        errors = save_field(project, 'hierarchy', 'projectHierarchy', hierarchy, errors)

        errors = save_field(
            project, 'current_image_caption', 'photoCaption', data['photoCaption'], errors
        )
        errors = save_field(
            project, 'current_image_credit', 'photoCredit', data['photoCredit'], errors
        )

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
            if 'value-related-project-project-' in key:
                rp = None
                rp_id = key.split('-', 4)[4]

                if 'add' in rp_id and (data['value-related-project-project-' + rp_id]
                                       or data['related-project-iati-identifier-' + rp_id]
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
                    rp_project = 'value-related-project-project-' + rp_id
                    try:
                        rp_rp = Project.objects.get(pk=data[rp_project]) if data[rp_project] else None
                        errors = save_field(
                            rp, 'related_project', 'related-project-project-' + str(rp.pk), rp_rp,
                            errors
                        )
                    except Exception as e:
                        error = str(e).capitalize()
                        errors.append(
                            {'name': 'related-project-project-' + str(rp.pk), 'error': error}
                        )

                    rp_iati_id_key = 'related-project-iati-identifier-' + rp_id
                    errors = save_field(
                        rp, 'related_iati_id', rp_iati_id_key, data[rp_iati_id_key], errors
                    )

                    rp_relation_key = 'related-project-relation-' + rp_id
                    errors = save_field(
                        rp, 'relation', rp_relation_key, data[rp_relation_key], errors
                    )

                    if new_objects and new_objects[-1]['new_id'] == str(rp.pk):
                        new_objects[-1]['unicode'] = rp.__unicode__()

            # Custom fields
            elif 'custom-field-' in key:
                cf = None
                custom_field_id = key.split('-', 2)[2]

                try:
                    cf = ProjectCustomField.objects.get(pk=int(custom_field_id))
                except Exception as e:
                    error = str(e).capitalize()
                    errors.append({'name': key, 'error': error})

                errors = save_field(cf, 'value', key, data[key], errors)

    elif 'photo' in files.keys():
        errors = save_field(project, 'current_image', 'photo', files['photo'], errors)
        if not errors:
            new_image = get_thumbnail(
                project.current_image, '250x250', format="PNG", upscale=True
            ).url

    return Response(
        {
            'errors': errors,
            'new_objects': new_objects,
            'new_image': new_image,
        }
    )


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def project_admin_step2(request, pk=None):
    project = Project.objects.get(pk=pk)
    user = request.user

    if not user.has_perm('rsr.change_project', project):
        return HttpResponseForbidden()

    data = request.POST
    errors = []
    new_objects = []

    # Contacts
    for key in data.keys():
        if 'contact-type-' in key:
            contact = None
            contact_id = key.split('-', 2)[2]

            if 'add' in contact_id and (data['contact-type-' + contact_id]
                                        or data['contact-name-' + contact_id]
                                        or data['contact-email-' + contact_id]
                                        or data['contact-job-title-' + contact_id]
                                        or data['contact-organisation-' + contact_id]
                                        or data['contact-phone-' + contact_id]
                                        or data['contact-address-' + contact_id]
                                        or data['contact-website-' + contact_id]
                                        or data['contact-department-' + contact_id]
                                        or data['contact-country-' + contact_id]):
                contact = ProjectContact.objects.create(project=project)
                new_objects.append(
                    {
                        'old_id': 'add-' + contact_id[-1],
                        'new_id': str(contact.pk),
                        'div_id': 'project_contact-add-' + contact_id[-1],
                    }
                )
            elif not 'add' in contact_id:
                try:
                    contact = ProjectContact.objects.get(pk=int(contact_id))
                except Exception as e:
                    error = str(e).capitalize()
                    errors.append({'name': key, 'error': error})

            if contact:
                contact_type_key = 'contact-type-' + contact_id
                errors = save_field(
                    contact, 'type', contact_type_key, data[contact_type_key], errors
                )

                contact_name_key = 'contact-name-' + contact_id
                errors = save_field(
                    contact, 'person_name', contact_name_key, data[contact_name_key], errors
                )

                contact_email_key = 'contact-email-' + contact_id
                errors = save_field(
                    contact, 'email', contact_email_key, data[contact_email_key], errors
                )

                contact_job_title_key = 'contact-job-title-' + contact_id
                errors = save_field(
                    contact, 'job_title', contact_job_title_key, data[contact_job_title_key], errors
                )

                contact_organisation_key = 'contact-organisation-' + contact_id
                errors = save_field(
                    contact, 'organisation', contact_organisation_key,
                    data[contact_organisation_key], errors
                )

                contact_phone_key = 'contact-phone-' + contact_id
                errors = save_field(
                    contact, 'telephone', contact_phone_key, data[contact_phone_key], errors
                )

                contact_address_key = 'contact-address-' + contact_id
                errors = save_field(
                    contact, 'mailing_address', contact_address_key, data[contact_address_key],
                    errors
                )

                contact_website_key = 'contact-website-' + contact_id
                errors = save_field(
                    contact, 'website', contact_website_key, data[contact_website_key], errors
                )

                contact_department_key = 'contact-department-' + contact_id
                errors = save_field(
                    contact, 'department', contact_department_key, data[contact_department_key],
                    errors
                )

                contact_country_key = 'contact-country-' + contact_id
                if data[contact_country_key]:
                    country = Country.objects.get(pk=int(data[contact_country_key]))
                else:
                    country = None
                errors = save_field(contact, 'country', contact_country_key, country, errors)

        # Custom fields
        elif 'custom-field-' in key:
            cf = None
            custom_field_id = key.split('-', 2)[2]

            try:
                cf = ProjectCustomField.objects.get(pk=int(custom_field_id))
            except Exception as e:
                error = str(e).capitalize()
                errors.append({'name': key, 'error': error})

            errors = save_field(cf, 'value', key, data[key], errors)

    return Response({
            'errors': errors,
            'new_objects': new_objects,
        }
    )


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def project_admin_step3(request, pk=None):
    project = Project.objects.get(pk=pk)
    user = request.user

    if not user.has_perm('rsr.change_project', project):
        return HttpResponseForbidden()

    data = request.POST
    errors = []
    new_objects = []

    try:
        reporting_org = Organisation.objects.get(
            pk=data['value-reportingOrganisation']
        ) if data['value-reportingOrganisation'] else None
        errors = save_field(project, 'sync_owner', 'reportingOrganisation', reporting_org, errors)
    except Exception as e:
        error = str(e).capitalize()
        errors.append({'name': 'reportingOrganisation', 'error': error})

    sec_reporter = True if 'secondaryReporter' in data.keys() else False
    errors = save_field(
        project, 'sync_owner_secondary_reporter', 'secondaryReporter', sec_reporter, errors
    )

    # Partners
    for key in data.keys():
        if 'value-partner-' in key:
            partner = None
            partner_id = key.split('-', 2)[2]

            if 'add' in partner_id and (data['partner-' + partner_id]
                                        or data['partner-type-' + partner_id]):
                partner = Partnership.objects.create(project=project)
                new_objects.append(
                    {
                        'old_id': 'add-' + partner_id[-1],
                        'new_id': str(partner.pk),
                        'div_id': 'partnership-add-' + partner_id[-1],
                    }
                )
            elif not 'add' in partner_id:
                try:
                    partner = Partnership.objects.get(pk=int(partner_id))
                except Exception as e:
                    error = str(e).capitalize()
                    errors.append({'name': key, 'error': error})

            if partner:
                partner_key = 'value-partner-' + partner_id

                try:
                    partner_organisation = Organisation.objects.get(
                        pk=data[partner_key]
                    ) if data[partner_key] else None
                    errors = save_field(
                        partner, 'organisation', 'partner-' + partner_id, partner_organisation,
                        errors
                    )
                except Exception as e:
                    error = str(e).capitalize()
                    errors.append({'name': 'partner-' + partner_id, 'error': error})

                partner_type_key = 'partner-type-' + partner_id
                errors = save_field(
                    partner, 'partner_type', partner_type_key, data[partner_type_key], errors
                )

                partner_funding_key = 'funding-amount-' + partner_id
                try:
                    funding_amount = Decimal(
                        data[partner_funding_key]
                    ) if data[partner_funding_key] else None
                    errors = save_field(
                        partner, 'funding_amount', partner_funding_key, funding_amount, errors
                    )
                except Exception as e:
                    error = str(e).capitalize()
                    errors.append({'name': partner_funding_key, 'error': error})

        # Custom fields
        elif 'custom-field-' in key:
            cf = None
            custom_field_id = key.split('-', 2)[2]

            try:
                cf = ProjectCustomField.objects.get(pk=int(custom_field_id))
            except Exception as e:
                error = str(e).capitalize()
                errors.append({'name': key, 'error': error})

            errors = save_field(cf, 'value', key, data[key], errors)

    return Response({
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
    errors = save_field(project, 'project_plan', 'projectPlan', data['projectPlan'], errors)
    errors = save_field(project, 'target_group', 'targetGroup', data['targetGroup'], errors)
    errors = save_field(project, 'sustainability', 'sustainability', data['sustainability'], errors)
    errors = save_field(project, 'goals_overview', 'goalsOverview', data['goalsOverview'], errors)

    # Custom fields
    for key in data.keys():
        if 'custom-field-' in key:
            cf = None
            custom_field_id = key.split('-', 2)[2]

            try:
                cf = ProjectCustomField.objects.get(pk=int(custom_field_id))
            except Exception as e:
                error = str(e).capitalize()
                errors.append({'name': key, 'error': error})

            errors = save_field(cf, 'value', key, data[key], errors)

    return Response({
            'errors': errors,
            'new_objects': new_objects,
        }
    )


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def project_admin_step5(request, pk=None):
    project = Project.objects.get(pk=pk)
    user = request.user

    if not user.has_perm('rsr.change_project', project):
        return HttpResponseForbidden()

    data = request.POST
    errors = []
    new_objects = []

    if data['level'] == '1':
        # Conditions
        for key in data.keys():
            if 'condition-type-' in key:
                condition = None
                condition_id = key.split('-', 2)[2]

                if 'add' in condition_id and (data['condition-type-' + condition_id]
                                              or data['condition-text-' + condition_id]):

                    condition = ProjectCondition.objects.create(project=project)
                    new_objects.append(
                        {
                            'old_id': condition_id,
                            'new_id': str(condition.pk),
                            'div_id': 'project_condition-' + condition_id,
                        }
                    )
                elif not 'add' in condition_id:
                    try:
                        condition = ProjectCondition.objects.get(pk=int(condition_id))
                    except Exception as e:
                        error = str(e).capitalize()
                        errors.append({'name': key, 'error': error})

                if condition:
                    cond_type_key = 'condition-type-' + condition_id
                    errors = save_field(
                        condition, 'type', cond_type_key, data[cond_type_key], errors
                    )

                    cond_text_key = 'condition-text-' + condition_id
                    errors = save_field(
                        condition, 'text', cond_text_key, data[cond_text_key], errors
                    )

            # Results
            elif 'result-title-' in key:
                result = None
                result_id = key.split('-', 2)[2]

                if 'add' in result_id and (data['result-title-' + result_id]
                                           or data['result-type-' + result_id]
                                           or data['result-description-' + result_id]):

                    result = Result.objects.create(project=project)
                    new_objects.append(
                        {
                            'old_id': result_id,
                            'new_id': str(result.pk),
                            'div_id': 'result-' + result_id,
                        }
                    )
                elif not 'add' in result_id:
                    try:
                        result = Result.objects.get(pk=int(result_id))
                    except Exception as e:
                        error = str(e).capitalize()
                        errors.append({'name': key, 'error': error})

                    new_objects.append(
                        {
                            'old_id': str(result.pk),
                            'new_id': str(result.pk),
                            'div_id': 'result-' + str(result.pk),
                        }
                    )

                if result:
                    res_title_key = 'result-title-' + result_id
                    errors = save_field(result, 'title', res_title_key, data[res_title_key], errors)

                    res_type_key = 'result-type-' + result_id
                    errors = save_field(result, 'type', res_type_key, data[res_type_key], errors)

                    res_as_key = 'result-aggregation-status-' + result_id
                    res_as = data[res_as_key] if data[res_as_key] else None
                    errors = save_field(result, 'aggregation_status', res_as_key, res_as, errors)

                    res_desc_key = 'result-description-' + result_id
                    errors = save_field(
                        result, 'description', res_desc_key, data[res_desc_key], errors
                    )

            # Custom fields
            elif 'custom-field-' in key:
                cf = None
                custom_field_id = key.split('-', 2)[2]

                try:
                    cf = ProjectCustomField.objects.get(pk=int(custom_field_id))
                except Exception as e:
                    error = str(e).capitalize()
                    errors.append({'name': key, 'error': error})

                errors = save_field(cf, 'value', key, data[key], errors)

    if data['level'] == '2':
        # Indicators
        for key in data.keys():
            if 'indicator-title-' in key:
                indicator = None
                ind_res_id = key.split('-', 2)[2]

                if 'add' in ind_res_id and (data['indicator-title-' + ind_res_id]
                                            or data['indicator-measure-' + ind_res_id]
                                            or data['indicator-ascending-' + ind_res_id]
                                            or data['indicator-description-' + ind_res_id]
                                            or data['indicator-baseline-value-' + ind_res_id]
                                            or data['indicator-baseline-comment-' + ind_res_id]
                                            or data['indicator-baseline-year-' + ind_res_id]):

                    ind_res_id_list = ind_res_id.split('-')
                    result_id = ind_res_id_list.pop()

                    try:
                        result = Result.objects.get(pk=str(result_id))
                        indicator = Indicator.objects.create(result=result)
                    except Exception as e:
                        error = str(e).capitalize()
                        errors.append({'name': 'indicator-title-' + ind_res_id,
                                       'error': error})

                    new_objects.append(
                        {
                            'old_id': ind_res_id,
                            'new_id': str(indicator.pk),
                            'div_id': 'indicator-' + ind_res_id,
                        }
                    )

                elif not 'add' in ind_res_id:
                    try:
                        indicator = Indicator.objects.get(pk=int(ind_res_id))
                    except Exception as e:
                        error = str(e).capitalize()
                        errors.append({'name': key, 'error': error})

                    new_objects.append(
                        {
                            'old_id': str(indicator.pk),
                            'new_id': str(indicator.pk),
                            'div_id': 'indicator-' + str(indicator.pk),
                        }
                    )

                if indicator:
                    ind_title_key = 'indicator-title-' + ind_res_id
                    errors = save_field(
                        indicator, 'title', ind_title_key, data[ind_title_key], errors
                    )

                    ind_meas_key = 'indicator-measure-' + ind_res_id
                    errors = save_field(
                        indicator, 'measure', ind_meas_key, data[ind_meas_key], errors
                    )

                    ind_asc_key = 'indicator-ascending-' + ind_res_id
                    ind_asc = data[ind_asc_key] if data[ind_asc_key] else None
                    errors = save_field(indicator, 'ascending', ind_asc_key, ind_asc, errors)

                    ind_desc_key = 'indicator-description-' + ind_res_id
                    errors = save_field(
                        indicator, 'description', ind_desc_key, data[ind_desc_key], errors
                    )

                    ind_baseval_key = 'indicator-baseline-value-' + ind_res_id
                    errors = save_field(
                        indicator, 'baseline_value', ind_baseval_key, data[ind_baseval_key], errors
                    )

                    ind_basecom_key = 'indicator-baseline-comment-' + ind_res_id
                    errors = save_field(
                        indicator, 'baseline_comment', ind_basecom_key, data[ind_basecom_key],
                        errors
                    )

                    ind_baseyear_key = 'indicator-baseline-year-' + ind_res_id
                    ind_baseyear = data[ind_baseyear_key] if data[ind_baseyear_key] else None
                    errors = save_field(
                        indicator, 'baseline_year', ind_basecom_key, ind_baseyear, errors
                    )

    if data['level'] == '3':
        # Indicator periods
        for key in data.keys():
            if 'indicator-period-target-value-comment-' in key:
                ip = None
                ip_ind_id = key.split('-', 5)[5]

                if 'add' in ip_ind_id and (data['indicator-period-start-' + ip_ind_id]
                                           or data['indicator-period-end-' + ip_ind_id]
                                           or data['indicator-period-target-value-' + ip_ind_id]
                                           or data['indicator-period-target-value-comment-' + ip_ind_id]
                                           or data['indicator-period-actual-value-' + ip_ind_id]
                                           or data['indicator-period-actual-value-comment-' + ip_ind_id]):

                    ip_ind_id_list = ip_ind_id.split('-')
                    indicator_id = ip_ind_id_list.pop()

                    try:
                        indicator = Indicator.objects.get(pk=str(indicator_id))
                        ip = IndicatorPeriod.objects.create(indicator=indicator)
                    except Exception as e:
                        error = str(e).capitalize()
                        errors.append({'name': 'indicator-period-start-' + ip_ind_id,
                                       'error': error})

                    new_objects.append(
                        {
                            'old_id': ip_ind_id,
                            'new_id': str(ip.pk),
                            'div_id': 'indicator_period-' + ip_ind_id,
                        }
                    )

                elif not 'add' in ip_ind_id:
                    try:
                        ip = IndicatorPeriod.objects.get(pk=int(ip_ind_id))
                    except Exception as e:
                        error = str(e).capitalize()
                        errors.append({'name': key, 'error': error})

                    new_objects.append(
                        {
                            'old_id': str(ip.pk),
                            'new_id': str(ip.pk),
                            'div_id': 'indicator_period-' + str(ip.pk),
                        }
                    )

                if ip:
                    ip_pstart_key = 'indicator-period-start-' + ip_ind_id
                    ip_pstart = data[ip_pstart_key] if data[ip_pstart_key] else None
                    errors = save_field(ip, 'period_start', ip_pstart_key, ip_pstart, errors)

                    ip_pend_key = 'indicator-period-end-' + ip_ind_id
                    ip_pend = data[ip_pend_key] if data[ip_pend_key] else None
                    errors = save_field(ip, 'period_end', ip_pend_key, ip_pend, errors)

                    ip_target_key = 'indicator-period-target-value-' + ip_ind_id
                    errors = save_field(
                        ip, 'target_value', ip_target_key, data[ip_target_key], errors
                    )

                    ip_tarcom_key = 'indicator-period-target-value-comment-' + ip_ind_id
                    errors = save_field(
                        ip, 'target_comment', ip_tarcom_key, data[ip_tarcom_key], errors
                    )

                    ip_actual_key = 'indicator-period-actual-value-' + ip_ind_id
                    errors = save_field(
                        ip, 'actual_value', ip_actual_key, data[ip_actual_key], errors
                    )

                    ip_actcom_key = 'indicator-period-actual-value-comment-' + ip_ind_id
                    errors = save_field(
                        ip, 'actual_comment', ip_actcom_key, data[ip_actcom_key], errors
                    )

    return Response(
        {
            'errors': errors,
            'new_objects': new_objects,
        }
    )


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def project_admin_step6(request, pk=None):
    project = Project.objects.get(pk=pk)
    user = request.user

    if not user.has_perm('rsr.change_project', project):
        return HttpResponseForbidden()

    data = request.POST
    errors = []
    new_objects = []

    if data['level'] == '1':

        try:
            capital_spend_percentage = Decimal(
                data['capital-spend-percentage']
            ) if data['capital-spend-percentage'] else None
            errors = save_field(
                project, 'capital_spend_percentage', 'capital-spend-percentage',
                capital_spend_percentage, errors
            )
        except Exception as e:
            error = str(e).capitalize()
            errors.append({'name': 'capital-spend-percentage', 'error': error})

        errors = save_field(
            project, 'country_budget_vocabulary', 'country-budget-vocabulary',
            data['country-budget-vocabulary'], errors
        )

        errors = save_field(project, 'currency', 'projectCurrency', data['projectCurrency'], errors)

        donate_button = True if 'donateButton' in data.keys() else False
        errors = save_field(project, 'donate_button', 'donateButton', donate_button, errors)

        # Budget items
        for key in data.keys():
            if 'budget-item-type-' in key:
                budget = None
                budget_id = key.split('-', 3)[3]

                if 'add' in budget_id and (data['budget-item-value-' + budget_id]
                                           or data['budget-item-type-' + budget_id]
                                           or data['budget-item-other-' + budget_id]
                                           or data['budget-item-label-' + budget_id]
                                           or data['budget-item-value-date-' + budget_id]
                                           or data['budget-item-period-start-' + budget_id]
                                           or data['budget-item-period-end-' + budget_id]):

                    budget = BudgetItem.objects.create(project=project)
                    new_objects.append(
                        {
                            'old_id': budget_id,
                            'new_id': str(budget.pk),
                            'div_id': 'budget_item-' + budget_id,
                        }
                    )
                elif not 'add' in budget_id:
                    try:
                        budget = BudgetItem.objects.get(pk=int(budget_id))
                    except Exception as e:
                        error = str(e).capitalize()
                        errors.append({'name': key, 'error': error})

                if budget:
                    try:
                        budget_amount = Decimal(
                            data['budget-item-value-' + budget_id]
                        ) if data['budget-item-value-' + budget_id] else None
                        errors = save_field(
                            budget, 'amount', 'budget-item-value-' + budget_id, budget_amount, errors
                        )
                    except Exception as e:
                        error = str(e).capitalize()
                        errors.append({'name': 'budget-item-value-' + budget_id, 'error': error})

                    budget_type_key = 'budget-item-type-' + budget_id
                    errors = save_field(
                        budget, 'type', budget_type_key, data[budget_type_key], errors
                    )

                    budget_other_key = 'budget-item-other-' + budget_id
                    errors = save_field(
                        budget, 'other_extra', budget_other_key, data[budget_other_key], errors
                    )

                    budget_label_key = 'budget-item-label-' + budget_id
                    try:
                        budget_label = BudgetItemLabel.objects.get(
                            pk=int(data[budget_label_key])
                        ) if data[budget_label_key] else None
                        errors = save_field(
                            budget, 'label', budget_label_key, budget_label, errors
                        )
                    except Exception as e:
                        error = str(e).capitalize()
                        errors.append({'name': budget_label_key, 'error': error})

                    budget_valdate_key = 'budget-item-value-date-' + budget_id
                    budget_value_date = data[budget_valdate_key] if data[budget_valdate_key] else None
                    errors = save_field(
                        budget, 'value_date', budget_valdate_key, budget_value_date, errors
                    )

                    budget_pstart_key = 'budget-item-period-start-' + budget_id
                    budget_pstart = data[budget_pstart_key] if data[budget_pstart_key] else None
                    errors = save_field(
                        budget, 'period_start', budget_pstart_key, budget_pstart, errors
                    )

                    budget_pend_key = 'budget-item-period-end-' + budget_id
                    budget_pend = data[budget_pend_key] if data[budget_pend_key] else None
                    errors = save_field(
                        budget, 'period_end', budget_pend_key, budget_pend, errors
                    )

            # Country budget items
            elif 'country-budget-item-' in key:
                cbi = None
                cbi_id = key.split('-', 3)[3]

                if 'add' in cbi_id and (data['country-budget-item-' + cbi_id]
                                        or data['country-budget-description-' + cbi_id]
                                        or data['country-budget-percentage-' + cbi_id]):

                    cbi = CountryBudgetItem.objects.create(project=project)
                    new_objects.append(
                        {
                            'old_id': cbi_id,
                            'new_id': str(cbi.pk),
                            'div_id': 'country_budget_item-' + cbi_id,
                        }
                    )
                elif not 'add' in cbi_id:
                    try:
                        cbi = CountryBudgetItem.objects.get(pk=int(cbi_id))
                    except Exception as e:
                        error = str(e).capitalize()
                        errors.append({'name': key, 'error': error})

                if cbi:
                    cbi_key = 'country-budget-item-' + cbi_id
                    errors = save_field(cbi, 'code', cbi_key, data[cbi_key], errors)

                    cbi_desc_key = 'country-budget-description-' + cbi_id
                    errors = save_field(cbi, 'description', cbi_desc_key, data[cbi_desc_key], errors)

                    cbi_perc_key = 'country-budget-percentage-' + cbi_id
                    try:
                        cbi_perc = Decimal(data[cbi_perc_key]) if data[cbi_perc_key] else None
                        errors = save_field(cbi, 'percentage', cbi_perc_key, cbi_perc, errors)
                    except Exception as e:
                        error = str(e).capitalize()
                        errors.append({'name': cbi_perc_key, 'error': error})

            # Transactions
            elif 'transaction-value-date-' in key:
                trans = None
                trans_id = key.split('-', 3)[3]

                if 'add' in trans_id and (
                    data['transaction-value-' + trans_id]
                    or data['transaction-date-' + trans_id]
                    or data['transaction-value-date-' + trans_id]
                    or data['transaction-reference-' + trans_id]
                    or data['transaction-description-' + trans_id]
                    or data['transaction-provider-org-' + trans_id]
                    or data['transaction-provider-org-activity-' + trans_id]
                    or data['transaction-receiver-org-' + trans_id]
                    or data['transaction-receiver-org-activity-' + trans_id]
                    or data['transaction-aid-type-' + trans_id]
                    or data['transaction-disbursement-channel-' + trans_id]
                    or data['transaction-finance-type-' + trans_id]
                    or data['transaction-flow-type-' + trans_id]
                    or data['transaction-tied-status-' + trans_id]
                    or data['transaction-recipient-country-' + trans_id]
                    or data['transaction-recipient-region-' + trans_id]
                    or data['transaction-recipient-region-vocabulary-' + trans_id]):

                    trans = Transaction.objects.create(project=project)
                    new_objects.append(
                        {
                            'old_id': trans_id,
                            'new_id': str(trans.pk),
                            'div_id': 'transaction-' + trans_id,
                        }
                    )
                elif not 'add' in trans_id:
                    try:
                        trans = Transaction.objects.get(pk=int(trans_id))
                    except Exception as e:
                        error = str(e).capitalize()
                        errors.append({'name': key, 'error': error})

                    new_objects.append(
                        {
                            'old_id': str(trans.pk),
                            'new_id': str(trans.pk),
                            'div_id': 'transaction-' + str(trans.pk),
                        }
                    )

                if trans:
                    trans_value_key = 'transaction-value-' + trans_id
                    try:
                        trans_value = Decimal(data[trans_value_key]) if data[trans_value_key] else None
                        errors = save_field(trans, 'value', trans_value_key, trans_value, errors)
                    except Exception as e:
                        error = str(e).capitalize()
                        errors.append({'name': trans_value_key, 'error': error})

                    trans_date_key = 'transaction-date-' + trans_id
                    trans_date = data[trans_date_key] if data[trans_date_key] else None
                    errors = save_field(trans, 'transaction_date', trans_date_key, trans_date, errors)

                    trans_valdate_key = 'transaction-value-date-' + trans_id
                    trans_valdate = data[trans_valdate_key] if data[trans_valdate_key] else None
                    errors = save_field(trans, 'value_date', trans_valdate_key, trans_valdate, errors)

                    trans_ref_key = 'transaction-reference-' + trans_id
                    errors = save_field(trans, 'reference', trans_ref_key, data[trans_ref_key], errors)

                    trans_desc_key = 'transaction-description-' + trans_id
                    errors = save_field(
                        trans, 'description', trans_desc_key, data[trans_desc_key], errors
                    )

                    trans_provorg_key = 'value-transaction-provider-org-' + trans_id
                    try:
                        provider_org = Organisation.objects.get(
                            pk=data[trans_provorg_key]
                        ) if data[trans_provorg_key] else None
                        errors = save_field(
                            trans, 'provider_organisation', 'transaction-provider-org-' + trans_id,
                            provider_org, errors
                        )
                    except Exception as e:
                        error = str(e).capitalize()
                        errors.append({'name': 'transaction-provider-org-' + trans_id,
                                       'error': error})

                    trans_provorg_act_key = 'transaction-provider-org-activity-' + trans_id
                    errors = save_field(
                        trans, 'provider_organisation_activity', trans_provorg_act_key,
                        data[trans_provorg_act_key], errors
                    )

                    trans_recorg_key = 'value-transaction-receiver-org-' + trans_id
                    try:
                        receiver_org = Organisation.objects.get(
                            pk=data[trans_recorg_key]
                        ) if data[trans_recorg_key] else None
                        errors = save_field(
                            trans, 'receiver_organisation', 'transaction-receiver-org-' + trans_id,
                            receiver_org, errors
                        )
                    except Exception as e:
                        error = str(e).capitalize()
                        errors.append({'name': 'transaction-receiver-org-' + trans_id,
                                       'error': error})

                    trans_recorg_act_key = 'transaction-receiver-org-activity-' + trans_id
                    errors = save_field(
                        trans, 'receiver_organisation_activity', trans_recorg_act_key,
                        data[trans_recorg_act_key], errors
                    )

                    trans_aid_key = 'transaction-aid-type-' + trans_id
                    errors = save_field(trans, 'aid_type', trans_aid_key, data[trans_aid_key], errors)

                    trans_disb_key = 'transaction-disbursement-channel-' + trans_id
                    errors = save_field(
                        trans, 'disbursement_channel', trans_disb_key, data[trans_disb_key], errors
                    )

                    trans_fin_key = 'transaction-finance-type-' + trans_id
                    errors = save_field(
                        trans, 'finance_type', trans_fin_key, data[trans_fin_key], errors
                    )

                    trans_flow_key = 'transaction-flow-type-' + trans_id
                    errors = save_field(
                        trans, 'flow_type', trans_flow_key, data[trans_flow_key], errors
                    )

                    trans_tied_key = 'transaction-tied-status-' + trans_id
                    errors = save_field(
                        trans, 'tied_status', trans_tied_key, data[trans_tied_key], errors
                    )

                    trans_country_key = 'transaction-recipient-country-' + trans_id
                    errors = save_field(
                        trans, 'recipient_country', trans_country_key, data[trans_country_key], errors
                    )

                    trans_region_key = 'transaction-recipient-region-' + trans_id
                    errors = save_field(
                        trans, 'recipient_region', trans_region_key, data[trans_region_key], errors
                    )

                    trans_regvoc_key = 'transaction-recipient-region-vocabulary-' + trans_id
                    errors = save_field(
                        trans, 'recipient_region_vocabulary', trans_regvoc_key, data[trans_regvoc_key],
                        errors
                    )

            # Planned disbursements
            elif 'planned-disbursement-type-' in key:
                pd = None
                pd_id = key.split('-', 3)[3]

                if 'add' in pd_id and (data['planned-disbursement-value-' + pd_id]
                                       or data['planned-disbursement-value-date-' + pd_id]
                                       or data['planned-disbursement-type-' + pd_id]
                                       or data['planned-disbursement-period-start-' + pd_id]
                                       or data['planned-disbursement-period-end-' + pd_id]):

                    pd = PlannedDisbursement.objects.create(project=project)
                    new_objects.append(
                        {
                            'old_id': pd_id,
                            'new_id': str(pd.pk),
                            'div_id': 'planned_disbursement-' + pd_id,
                        }
                    )
                elif not 'add' in pd_id:
                    try:
                        pd = PlannedDisbursement.objects.get(pk=int(pd_id))
                    except Exception as e:
                        error = str(e).capitalize()
                        errors.append({'name': key, 'error': error})

                if pd:
                    pd_value_key = 'planned-disbursement-value-' + pd_id
                    try:
                        pd_value = Decimal(data[pd_value_key]) if data[pd_value_key] else None
                        errors = save_field(pd, 'value', pd_value_key, pd_value, errors)
                    except Exception as e:
                        error = str(e).capitalize()
                        errors.append({'name': pd_value_key, 'error': error})

                    pd_valdat_key = 'planned-disbursement-value-date-' + pd_id
                    pd_valdat = data[pd_valdat_key] if data[pd_valdat_key] else None
                    errors = save_field(pd, 'value_date', pd_valdat_key, pd_valdat, errors)

                    pd_type_key = 'planned-disbursement-type-' + pd_id
                    errors = save_field(pd, 'type', pd_type_key, data[pd_type_key], errors)

                    pd_pstart_key = 'planned-disbursement-period-start-' + pd_id
                    pd_pstart = data[pd_pstart_key] if data[pd_pstart_key] else None
                    errors = save_field(pd, 'period_start', pd_pstart_key, pd_pstart, errors)

                    pd_pend_key = 'planned-disbursement-period-end-' + pd_id
                    pd_pend = data[pd_pend_key] if data[pd_pend_key] else None
                    errors = save_field(pd, 'period_end', pd_pend_key, pd_pend, errors)

            # Custom fields
            elif 'custom-field-' in key:
                cf = None
                custom_field_id = key.split('-', 2)[2]

                try:
                    cf = ProjectCustomField.objects.get(pk=int(custom_field_id))
                except Exception as e:
                    error = str(e).capitalize()
                    errors.append({'name': key, 'error': error})

                errors = save_field(cf, 'value', key, data[key], errors)

    elif data['level'] == '2':
        # Transaction sectors
        for key in data.keys():
            if 'transaction-sector-vocabulary-' in key:
                sector = None
                sector_trans_id = key.split('-', 3)[3]

                if 'add' in sector_trans_id \
                        and (data['transaction-sector-' + sector_trans_id]
                             or data['transaction-sector-vocabulary-' + sector_trans_id]
                             or data['transaction-sector-description-' + sector_trans_id]):

                    sector_trans_id_list = sector_trans_id.split('-')
                    trans_id = sector_trans_id_list.pop()

                    try:
                        trans = Transaction.objects.get(pk=str(trans_id))
                        sector = TransactionSector.objects.create(transaction=trans)
                    except Exception as e:
                        error = str(e).capitalize()
                        errors.append({'name': 'transaction-sector-' + sector_trans_id,
                                       'error': error})

                    new_objects.append(
                        {
                            'old_id': sector_trans_id,
                            'new_id': str(sector.pk),
                            'div_id': 'transaction_sector-' + sector_trans_id,
                        }
                    )

                elif not 'add' in sector_trans_id:
                    try:
                        sector = TransactionSector.objects.get(pk=int(sector_trans_id))
                    except Exception as e:
                        error = str(e).capitalize()
                        errors.append({'name': key, 'error': error})

                if sector:
                    trans_sector_key = 'transaction-sector-' + sector_trans_id
                    errors = save_field(
                        sector, 'code', trans_sector_key, data[trans_sector_key], errors
                    )

                    sector_voc_key = 'transaction-sector-vocabulary-' + sector_trans_id
                    errors = save_field(
                        sector, 'vocabulary', sector_voc_key, data[sector_voc_key], errors
                    )

                    sector_desc_key = 'transaction-sector-description-' + sector_trans_id
                    errors = save_field(
                        sector, 'text', sector_desc_key, data[sector_desc_key], errors
                    )

    return Response(
        {
            'errors': errors,
            'new_objects': new_objects,
            'total_budget': "{:,}".format(int(project.budget)),
        }
    )


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def project_admin_step7(request, pk=None):
    project = Project.objects.get(pk=pk)
    user = request.user

    if not user.has_perm('rsr.change_project', project):
        return HttpResponseForbidden()

    data = request.POST
    errors = []
    new_objects = []

    if data['level'] == '1':

        errors = save_field(project, 'project_scope', 'scope', data['scope'], errors)

        # Recipient countries
        for key in data.keys():
            if 'recipient-country-percentage-' in key:
                rc = None
                rc_id = key.split('-', 3)[3]

                if 'add' in rc_id and (data['recipient-country-' + rc_id]
                                       or data['recipient-country-percentage-' + rc_id]
                                       or data['recipient-country-description-' + rc_id]):
                    rc = RecipientCountry.objects.create(project=project)
                    new_objects.append(
                        {
                            'old_id': 'add-' + rc_id[-1],
                            'new_id': str(rc.pk),
                            'div_id': 'recipient_country-add-' + rc_id[-1],
                        }
                    )
                elif not 'add' in rc_id:
                    try:
                        rc = RecipientCountry.objects.get(pk=int(rc_id))
                    except Exception as e:
                        error = str(e).capitalize()
                        errors.append({'name': key, 'error': error})

                if rc:
                    recipient_country_key = 'recipient-country-' + rc_id
                    errors = save_field(
                        rc, 'country', recipient_country_key, data[recipient_country_key], errors
                    )

                    rc_percentage_key = 'recipient-country-percentage-' + rc_id
                    try:
                        rc_percentage = Decimal(
                            data[rc_percentage_key]
                        ) if data[rc_percentage_key] else None
                        errors = save_field(
                            rc, 'percentage', rc_percentage_key, rc_percentage, errors
                        )
                    except Exception as e:
                        error = str(e).capitalize()
                        errors.append({'name': rc_percentage_key, 'error': error})

                    rc_description_key = 'recipient-country-description-' + rc_id
                    errors = save_field(
                        rc, 'text', rc_description_key, data[rc_description_key], errors
                    )

            # Recipient regions
            elif 'recipient-region-percentage-' in key:
                rr = None
                rr_id = key.split('-', 3)[3]

                if 'add' in rr_id and (data['recipient-region-' + rr_id]
                                       or data['recipient-region-percentage-' + rr_id]
                                       or data['recipient-region-description-' + rr_id]
                                       or data['recipient-region-vocabulary-' + rr_id]):
                    rr = RecipientRegion.objects.create(project=project)
                    new_objects.append(
                        {
                            'old_id': 'add-' + rr_id[-1],
                            'new_id': str(rr.pk),
                            'div_id': 'recipient_region-add-' + rr_id[-1],
                        }
                    )
                elif not 'add' in rr_id:
                    try:
                        rr = RecipientRegion.objects.get(pk=int(rr_id))
                    except Exception as e:
                        error = str(e).capitalize()
                        errors.append({'name': key, 'error': error})

                if rr:
                    recipient_region_key = 'recipient-region-' + rr_id
                    errors = save_field(
                        rr, 'region', recipient_region_key, data[recipient_region_key], errors
                    )

                    rr_percentage_key = 'recipient-region-percentage-' + rr_id
                    try:
                        rr_percentage = Decimal(
                            data[rr_percentage_key]
                        ) if data[rr_percentage_key] else None
                        errors = save_field(
                            rr, 'percentage', rr_percentage_key, rr_percentage, errors
                        )
                    except Exception as e:
                        error = str(e).capitalize()
                        errors.append({'name': rr_percentage_key, 'error': error})

                    rr_description_key = 'recipient-region-description-' + rr_id
                    errors = save_field(
                        rr, 'text', rr_description_key, data[rr_description_key], errors
                    )

                    rr_vocabulary_key = 'recipient-region-vocabulary-' + rr_id
                    errors = save_field(
                        rr, 'region_vocabulary', rr_vocabulary_key, data[rr_vocabulary_key], errors
                    )

            # Locations
            elif 'location-latitude-' in key:
                loc = None
                loc_id = key.split('-', 2)[2]

                if 'add' in loc_id and (data['location-latitude-' + loc_id]
                                        or data['location-longitude-' + loc_id]
                                        or data['location-country-' + loc_id]
                                        or data['location-city-' + loc_id]
                                        or data['location-postal-code-' + loc_id]
                                        or data['location-state-' + loc_id]
                                        or data['location-address1-' + loc_id]
                                        or data['location-address2-' + loc_id]
                                        or data['location-reference-' + loc_id]
                                        or data['location-code-' + loc_id]
                                        or data['location-description-' + loc_id]
                                        or data['location-activity-description-' + loc_id]
                                        or data['location-exactness-' + loc_id]
                                        or data['location-reach-' + loc_id]
                                        or data['location-class-' + loc_id]
                                        or data['location-feature-designation-' + loc_id]):
                    loc = ProjectLocation.objects.create(location_target=project)
                    new_objects.append(
                        {
                            'old_id': 'add-' + loc_id[-1],
                            'new_id': str(loc.pk),
                            'div_id': 'project_location-add-' + loc_id[-1],
                        }
                    )
                elif not 'add' in loc_id:
                    try:
                        loc = ProjectLocation.objects.get(pk=int(loc_id))
                    except Exception as e:
                        error = str(e).capitalize()
                        errors.append({'name': key, 'error': error})

                    new_objects.append(
                        {
                            'old_id': str(loc.pk),
                            'new_id': str(loc.pk),
                            'div_id': 'project_location-' + str(loc.pk),
                        }
                    )

                if loc:
                    loc_latitude_key = 'location-latitude-' + loc_id
                    try:
                        loc_latitude = Decimal(
                            data[loc_latitude_key]
                        ) if data[loc_latitude_key] else None
                        errors = save_field(
                            loc, 'latitude', loc_latitude_key, loc_latitude, errors
                        )
                    except Exception as e:
                        error = str(e).capitalize()
                        errors.append({'name': loc_latitude_key, 'error': error})

                    loc_longitude_key = 'location-longitude-' + loc_id
                    try:
                        loc_longitude = Decimal(
                            data[loc_longitude_key]
                        ) if data[loc_longitude_key] else None
                        errors = save_field(
                            loc, 'longitude', loc_longitude_key, loc_longitude, errors
                        )
                    except Exception as e:
                        error = str(e).capitalize()
                        errors.append({'name': loc_longitude_key, 'error': error})

                    loc_country_key = 'location-country-' + loc_id
                    try:
                        location_country = Country.objects.get(
                            pk=int(data[loc_country_key])
                        ) if data[loc_country_key] else None
                        errors = save_field(loc, 'country', loc_country_key, location_country, errors)
                    except Exception as e:
                        error = str(e).capitalize()
                        errors.append({'name': loc_country_key, 'error': error})

                    loc_city_key = 'location-city-' + loc_id
                    errors = save_field(loc, 'city', loc_city_key, data[loc_city_key], errors)

                    loc_postal_code_key = 'location-postal-code-' + loc_id
                    errors = save_field(
                        loc, 'postcode', loc_postal_code_key, data[loc_postal_code_key], errors
                    )

                    loc_state_key = 'location-state-' + loc_id
                    errors = save_field(loc, 'state', loc_state_key, data[loc_state_key], errors)

                    loc_addr1_key = 'location-address1-' + loc_id
                    errors = save_field(loc, 'address_1', loc_addr1_key, data[loc_addr1_key], errors)

                    loc_addr2_key = 'location-address2-' + loc_id
                    errors = save_field(loc, 'address_2', loc_addr2_key, data[loc_addr2_key], errors)

                    loc_ref_key = 'location-reference-' + loc_id
                    errors = save_field(loc, 'reference', loc_ref_key, data[loc_ref_key], errors)

                    loc_code_key = 'location-code-' + loc_id
                    errors = save_field(loc, 'location_code', loc_code_key, data[loc_code_key], errors)

                    loc_descr_key = 'location-description-' + loc_id
                    errors = save_field(loc, 'description', loc_descr_key, data[loc_descr_key], errors)

                    loc_actdescr_key = 'location-activity-description-' + loc_id
                    errors = save_field(
                        loc, 'activity_description', loc_actdescr_key, data[loc_actdescr_key], errors
                    )

                    loc_exac_key = 'location-exactness-' + loc_id
                    errors = save_field(loc, 'exactness', loc_exac_key, data[loc_exac_key], errors)

                    loc_reach_key = 'location-reach-' + loc_id
                    errors = save_field(
                        loc, 'location_reach', loc_reach_key, data[loc_reach_key], errors
                    )

                    loc_class_key = 'location-class-' + loc_id
                    errors = save_field(
                        loc, 'location_class', loc_class_key, data[loc_class_key], errors
                    )

                    loc_fd_key = 'location-feature-designation-' + loc_id
                    errors = save_field(
                        loc, 'feature_designation', loc_fd_key, data[loc_fd_key], errors
                    )

            # Custom fields
            elif 'custom-field-' in key:
                cf = None
                custom_field_id = key.split('-', 2)[2]

                try:
                    cf = ProjectCustomField.objects.get(pk=int(custom_field_id))
                except Exception as e:
                    error = str(e).capitalize()
                    errors.append({'name': key, 'error': error})

                errors = save_field(cf, 'value', key, data[key], errors)

    elif data['level'] == '2':
        # Location administratives
        for key in data.keys():
            if 'location-administrative-code-' in key:
                admin = None
                admin_loc_id = key.split('-', 3)[3]

                if 'add' in admin_loc_id \
                        and (data['location-administrative-code-' + admin_loc_id]
                             or data['location-administrative-vocabulary-' + admin_loc_id]
                             or data['location-administrative-level-' + admin_loc_id]):

                    admin_loc_id_list = admin_loc_id.split('-')
                    loc_id = admin_loc_id_list.pop()

                    try:
                        loc = ProjectLocation.objects.get(pk=str(loc_id))
                        admin = AdministrativeLocation.objects.create(location=loc)
                    except Exception as e:
                        error = str(e).capitalize()
                        errors.append({'name': 'location-administrative-code-' + admin_loc_id,
                                       'error': error})

                    new_objects.append(
                        {
                            'old_id': admin_loc_id,
                            'new_id': str(admin.pk),
                            'div_id': 'administrative_location-' + admin_loc_id,
                        }
                    )

                elif not 'add' in admin_loc_id:
                    try:
                        admin = AdministrativeLocation.objects.get(pk=int(admin_loc_id))
                    except Exception as e:
                        error = str(e).capitalize()
                        errors.append({'name': key, 'error': error})

                if admin:
                    admin_code_key = 'location-administrative-code-' + admin_loc_id
                    errors = save_field(
                        admin, 'code', admin_code_key, data[admin_code_key], errors
                    )

                    admin_voc_key = 'location-administrative-vocabulary-' + admin_loc_id
                    errors = save_field(
                        admin, 'vocabulary', admin_voc_key, data[admin_voc_key], errors
                    )

                    admin_level_key = 'location-administrative-level-' + admin_loc_id
                    try:
                        admin_level = int(data[admin_level_key]) if data[admin_level_key] else None
                        errors = save_field(
                            admin, 'level', admin_level_key, admin_level, errors
                        )
                    except Exception as e:
                        error = str(e).capitalize()
                        errors.append({'name': admin_level_key, 'error': error})

    return Response({
            'errors': errors,
            'new_objects': new_objects,
        }
    )


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def project_admin_step8(request, pk=None):
    project = Project.objects.get(pk=pk)
    user = request.user

    if not user.has_perm('rsr.change_project', project):
        return HttpResponseForbidden()

    data = request.POST
    errors = []
    new_objects = []

    # Sectors
    for key in data.keys():
        if 'sector-code-' in key:
            sector = None
            sector_id = key.split('-', 2)[2]

            if 'add' in sector_id and (data['sector-code-' + sector_id]
                                       or data['sector-percentage-' + sector_id]
                                       or data['sector-vocabulary-' + sector_id]
                                       or data['sector-description-' + sector_id]):
                sector = Sector.objects.create(project=project)
                new_objects.append(
                    {
                        'old_id': sector_id,
                        'new_id': str(sector.pk),
                        'div_id': 'sector-' + sector_id,
                    }
                )
            elif not 'add' in sector_id:
                try:
                    sector = Sector.objects.get(pk=int(sector_id))
                except Exception as e:
                    error = str(e).capitalize()
                    errors.append({'name': key, 'error': error})

            if sector:
                sector_code_key = 'sector-code-' + sector_id
                errors = save_field(
                    sector, 'sector_code', sector_code_key, data[sector_code_key], errors
                )

                sector_perc_key = 'sector-percentage-' + sector_id
                try:
                    sector_percentage = Decimal(
                        data[sector_perc_key]
                    ) if data[sector_perc_key] else None
                    errors = save_field(
                        sector, 'percentage', sector_perc_key, sector_percentage, errors
                    )
                except Exception as e:
                    error = str(e).capitalize()
                    errors.append({'name': sector_perc_key, 'error': error})

                sector_voc_key = 'sector-vocabulary-' + sector_id
                errors = save_field(
                    sector, 'vocabulary', sector_voc_key, data[sector_voc_key], errors
                )

                sector_desc_key = 'sector-description-' + sector_id
                errors = save_field(
                    sector, 'text', sector_desc_key, data[sector_desc_key], errors
                )

        # Policy markers
        elif 'policy-marker-significance-' in key:
            pm = None
            pm_id = key.split('-', 3)[3]

            if 'add' in pm_id and (data['policy-marker-' + pm_id]
                                   or data['policy-marker-significance-' + pm_id]
                                   or data['policy-marker-vocabulary-' + pm_id]
                                   or data['policy-marker-description-' + pm_id]):
                pm = PolicyMarker.objects.create(project=project)
                new_objects.append(
                    {
                        'old_id': pm_id,
                        'new_id': str(pm.pk),
                        'div_id': 'policy_marker-' + pm_id,
                    }
                )
            elif not 'add' in pm_id:
                try:
                    pm = PolicyMarker.objects.get(pk=int(pm_id))
                except Exception as e:
                    error = str(e).capitalize()
                    errors.append({'name': key, 'error': error})

            if pm:
                policy_marker_key = 'policy-marker-' + pm_id
                errors = save_field(
                    pm, 'policy_marker', policy_marker_key, data[policy_marker_key], errors
                )

                pm_sign_key = 'policy-marker-significance-' + pm_id
                errors = save_field(
                    pm, 'significance', pm_sign_key, data[pm_sign_key], errors
                )

                pm_voc_key = 'policy-marker-vocabulary-' + pm_id
                errors = save_field(
                    pm, 'vocabulary', pm_voc_key, data[pm_voc_key], errors
                )

                pm_desc_key = 'policy-marker-description-' + pm_id
                errors = save_field(
                    pm, 'description', pm_desc_key, data[pm_desc_key], errors
                )

        # Custom fields
        elif 'custom-field-' in key:
            cf = None
            custom_field_id = key.split('-', 2)[2]

            try:
                cf = ProjectCustomField.objects.get(pk=int(custom_field_id))
            except Exception as e:
                error = str(e).capitalize()
                errors.append({'name': key, 'error': error})

            errors = save_field(cf, 'value', key, data[key], errors)

    return Response({
            'errors': errors,
            'new_objects': new_objects,
        }
    )


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def project_admin_step9(request, pk=None):
    project = Project.objects.get(pk=pk)
    user = request.user

    if not user.has_perm('rsr.change_project', project):
        return HttpResponseForbidden()

    data = request.POST
    files = request.FILES
    errors = []
    new_objects = []

    if not files and not any(data_key.startswith('document-document-') for data_key in data.keys()):
        # Links
        for key in data.keys():
            if 'link-type-' in key:
                link = None
                link_id = key.split('-', 2)[2]

                if 'add' in link_id and (data['link-type-' + link_id]
                                         or data['link-url-' + link_id]
                                         or data['link-caption-' + link_id]):
                    link = Link.objects.create(project=project)
                    new_objects.append(
                        {
                            'old_id': 'add-' + link_id[-1],
                            'new_id': str(link.pk),
                            'div_id': 'link-add-' + link_id[-1],
                        }
                    )
                elif not 'add' in link_id:
                    try:
                        link = Link.objects.get(pk=int(link_id))
                    except Exception as e:
                        error = str(e).capitalize()
                        errors.append({'name': key, 'error': error})

                if link:
                    link_type_key = 'link-type-' + link_id
                    errors = save_field(link, 'kind', link_type_key, data[link_type_key], errors)

                    link_url_key = 'link-url-' + link_id
                    errors = save_field(link, 'url', link_url_key, data[link_url_key], errors)

                    link_caption_key = 'link-caption-' + link_id
                    errors = save_field(
                        link, 'caption', link_caption_key, data[link_caption_key], errors
                    )

            # Documents
            elif 'document-url-' in key:
                document = None
                document_id = key.split('-', 2)[2]

                if 'add' in document_id and (data['document-url-' + document_id]
                                             or data['document-title-' + document_id]
                                             or data['document-format-' + document_id]
                                             or data['document-category-' + document_id]
                                             or data['document-language-' + document_id]):
                    document = ProjectDocument.objects.create(project=project)
                    new_objects.append(
                        {
                            'old_id': 'add-' + document_id[-1],
                            'new_id': str(document.pk),
                            'div_id': 'project_document-add-' + document_id[-1],
                        }
                    )
                elif not 'add' in document_id:
                    try:
                        document = ProjectDocument.objects.get(pk=int(document_id))
                    except Exception as e:
                        error = str(e).capitalize()
                        errors.append({'name': key, 'error': error})

                if document:
                    document_url_key = 'document-url-' + document_id
                    errors = save_field(
                        document, 'url', document_url_key, data[document_url_key], errors
                    )

                    document_title_key = 'document-title-' + document_id
                    errors = save_field(
                        document, 'title', document_title_key, data[document_title_key], errors
                    )

                    document_format_key = 'document-format-' + document_id
                    errors = save_field(
                        document, 'format', document_format_key, data[document_format_key], errors
                    )

                    document_category_key = 'document-category-' + document_id
                    errors = save_field(
                        document, 'category', document_category_key, data[document_category_key],
                        errors
                    )

                    document_language_key = 'document-language-' + document_id
                    errors = save_field(
                        document, 'language', document_language_key, data[document_language_key],
                        errors
                    )

            # Custom fields
            elif 'custom-field-' in key:
                cf = None
                custom_field_id = key.split('-', 2)[2]

                try:
                    cf = ProjectCustomField.objects.get(pk=int(custom_field_id))
                except Exception as e:
                    error = str(e).capitalize()
                    errors.append({'name': key, 'error': error})

                errors = save_field(cf, 'value', key, data[key], errors)

    elif any(file_key.startswith('document-document-') for file_key in files.keys()):
        for key in files.keys():
            document = None
            document_id = key.split('-', 2)[2]

            if 'add' in document_id:
                document = ProjectDocument.objects.create(project=project)
                new_objects.append(
                    {
                        'old_id': 'add-' + document_id[-1],
                        'new_id': str(document.pk),
                        'div_id': 'project_document-add-' + document_id[-1],
                    }
                )
            elif not 'add' in document_id:
                try:
                    document = ProjectDocument.objects.get(pk=int(document_id))
                except Exception as e:
                    error = str(e).capitalize()
                    errors.append({'name': key, 'error': error})

            document_document_key = 'document-document-' + document_id
            errors = save_field(
                document, 'document', document_document_key, files[document_document_key], errors
            )
            # TODO: replace document right after saving

            # if not errors:
            #     new_image = get_thumbnail(
            #         project.current_image, '250x250', format="PNG", upscale=True
            #     ).url

    return Response({
            'errors': errors,
            'new_objects': new_objects,
        }
    )


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def project_admin_step10(request, pk=None):
    project = Project.objects.get(pk=pk)
    user = request.user

    if not user.has_perm('rsr.change_project', project):
        return HttpResponseForbidden()

    data = request.POST
    errors = []
    new_objects = []

    errors = save_field(project, 'notes', 'projectComments', data['projectComments'], errors)

    for key in data.keys():
        # Custom fields
        if 'custom-field-' in key:
            cf = None
            custom_field_id = key.split('-', 2)[2]

            try:
                cf = ProjectCustomField.objects.get(pk=int(custom_field_id))
            except Exception as e:
                error = str(e).capitalize()
                errors.append({'name': key, 'error': error})

            errors = save_field(cf, 'value', key, data[key], errors)

    return Response({
            'errors': errors,
            'new_objects': new_objects,
        }
    )
