# -*- coding: utf-8 -*-
"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from akvo.rsr.models import Country, Link, Project, ProjectContact, ProjectDocument, RelatedProject

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
                    errors.append({'name': 'related-project-project-' + str(rp.pk), 'error': error})

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
                                        or data['contact-country-' + contact_id]
                                        or data['contact-state-' + contact_id]):
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

                contact_state_key = 'contact-state-' + contact_id
                errors = save_field(
                    contact, 'state', contact_state_key, data[contact_state_key], errors
                )

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
    files = request.FILES
    errors = []
    new_objects = []
    new_image = None

    if not files and 'photo' not in data.keys():
        errors = save_field(
            project, 'current_image_caption', 'photoCaption', data['photoCaption'], errors
        )
        errors = save_field(
            project, 'current_image_credit', 'photoCredit', data['photoCredit'], errors
        )

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
def project_admin_step6(request, pk=None):
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
        for key in data.keys():
            if 'document-url-' in key:
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
            # if not errors:
            #     new_image = get_thumbnail(
            #         project.current_image, '250x250', format="PNG", upscale=True
            #     ).url

    return Response(
        {
            'errors': errors,
            'new_objects': new_objects,
        }
    )
