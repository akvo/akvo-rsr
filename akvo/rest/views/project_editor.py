# -*- coding: utf-8 -*-
"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from akvo.rsr.models import (AdministrativeLocation, BudgetItem, BudgetItemLabel, Country,
                             CountryBudgetItem, Indicator, IndicatorPeriod, Keyword, Link,
                             Organisation, Partnership, PlannedDisbursement, PolicyMarker, Project,
                             ProjectCondition, ProjectContact, ProjectCustomField, ProjectDocument,
                             ProjectLocation, RecipientCountry, RecipientRegion, RelatedProject,
                             Result, Sector, Transaction, TransactionSector)

import datetime
import decimal

from django.http import HttpResponseForbidden
from django.contrib.admin.models import LogEntry, CHANGE, ADDITION
from django.contrib.contenttypes.models import ContentType
from django.utils.translation import ugettext_lazy as _

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from sorl.thumbnail import get_thumbnail

## Section 1 ##

SECTION_ONE_FIELDS = (
    ('title', 'projectTitle', 'text'),
    ('subtitle', 'projectSubTitle', 'text'),
    ('iati_activity_id', 'iatiId', 'text'),
    ('status', 'projectStatus', 'text'),
    ('date_start_planned', 'eventFromPlanned', 'date'),
    ('date_end_planned', 'eventEndPlanned', 'date'),
    ('date_start_actual', 'eventFromActual', 'date'),
    ('date_end_actual', 'eventEndActual', 'date'),
    ('language', 'projectLanguage', 'text'),
    ('hierarchy', 'projectHierarchy', 'none'),
    ('current_image_caption', 'photoCaption', 'text'),
    ('current_image_credit', 'photoCredit', 'text'),
    ('currency', 'projectCurrency', 'text'),
    ('default_aid_type', 'defaultAidType', 'text'),
    ('default_flow_type', 'defaultFlowType', 'text'),
    ('default_tied_status', 'defaultTiedStatus', 'text'),
    ('collaboration_type', 'collaborationType', 'text'),
    ('default_finance_type', 'defaultFinanceType', 'text'),
)

CURRENT_IMAGE_FIELD = ('current_image', 'photo', 'none')

RELATED_PROJECT_FIELDS = (
    ('related_project', 'value-related-project-project-', 'related-object'),
    ('related_iati_id', 'related-project-iati-identifier-', 'text'),
    ('relation', 'related-project-relation-', 'text'),
)

## Section 2 ##

PROJECT_CONTACT_FIELDS = (
    ('person_name', 'contact-name-', 'text'),
    ('organisation', 'contact-organisation-', 'text'),
    ('job_title', 'contact-job-title-', 'text'),
    ('type', 'contact-type-', 'text'),
    ('email', 'contact-email-', 'text'),
    ('telephone', 'contact-phone-', 'text'),
    ('mailing_address', 'contact-address-', 'text'),
    ('department', 'contact-department-', 'text'),
    ('website', 'contact-website-', 'text'),
)

## Section 3 ##

SECTION_THREE_FIELDS = (
    ('sync_owner', 'value-reportingOrganisation', 'related-object'),
    ('sync_owner_secondary_reporter', 'secondaryReporter', 'boolean'),
)

PARTNER_FIELDS = (
    ('organisation', 'value-partner-', 'related-object'),
    ('partner_type', 'partner-type-', 'text'),
    ('funding_amount', 'funding-amount-', 'decimal'),
)

## Section 4 ##

SECTION_FOUR_FIELDS = (
    ('project_plan_summary', 'summary', 'text'),
    ('goals_overview', 'goalsOverview', 'text'),
    ('background', 'background', 'text'),
    ('current_status', 'currentSituation', 'text'),
    ('target_group', 'targetGroup', 'text'),
    ('project_plan', 'projectPlan', 'text'),
    ('sustainability', 'sustainability', 'text'),
)

## Section 5 ##

RESULT_FIELDS = (
    ('title', 'result-title-', 'text'),
    ('type', 'result-type-', 'text'),
    ('aggregation_status', 'result-aggregation-status-', 'none-boolean'),
    ('description', 'result-description-', 'text'),
)

INDICATOR_FIELDS = (
    ('title', 'indicator-title-', 'text'),
    ('measure', 'indicator-measure-', 'text'),
    ('ascending', 'indicator-ascending-', 'none-boolean'),
    ('description', 'indicator-description-', 'text'),
    ('baseline_value', 'indicator-baseline-value-', 'text'),
    ('baseline_comment', 'indicator-baseline-comment-', 'text'),
    ('baseline_year', 'indicator-baseline-year-', 'none'),
)

INDICATOR_PERIOD_FIELDS = (
    ('period_start', 'indicator-period-start-', 'date'),
    ('period_end', 'indicator-period-end-', 'date'),
    ('target_value', 'indicator-period-target-value-', 'text'),
    ('target_comment', 'indicator-period-target-value-comment-', 'text'),
    ('actual_value', 'indicator-period-actual-value-', 'text'),
    ('actual_comment', 'indicator-period-actual-value-comment-', 'text'),
)

PROJECT_CONDITION_FIELDS = (
    ('type', 'condition-type-', 'text'),
    ('text', 'condition-text-', 'text'),
)

## Section 6 ##

SECTION_SIX_FIELDS = (
    ('capital_spend_percentage', 'capital-spend-percentage', 'decimal'),
    ('country_budget_vocabulary', 'country-budget-vocabulary', 'text'),
    ('donate_button', 'donateButton', 'boolean'),
)

BUDGET_ITEM_FIELDS = (
    ('amount', 'budget-item-value-', 'decimal'),
    ('type', 'budget-item-type-', 'text'),
    ('other_extra', 'budget-item-other-', 'text'),
    ('label', 'budget-item-label-', 'related-object'),
    ('value_date', 'budget-item-value-date-', 'date'),
    ('period_start', 'budget-item-period-start-', 'date'),
    ('period_end', 'budget-item-period-end-', 'date'),
)

COUNTRY_BUDGET_ITEM_FIELDS = (
    ('code', 'country-budget-item-', 'text'),
    ('description', 'country-budget-description-', 'text'),
    ('percentage', 'country-budget-percentage-', 'decimal'),
)

TRANSACTION_FIELDS = (
    ('transaction_type', 'transaction-type-', 'text'),
    ('value', 'transaction-value-', 'decimal'),
    ('transaction_date', 'transaction-date-', 'date'),
    ('value_date', 'transaction-value-date-', 'date'),
    ('reference', 'transaction-reference-', 'text'),
    ('description', 'transaction-description-', 'text'),
    ('provider_organisation', 'value-transaction-provider-org-', 'related-object'),
    ('provider_organisation_activity', 'transaction-provider-org-activity-', 'text'),
    ('receiver_organisation', 'value-transaction-receiver-org-', 'related-object'),
    ('receiver_organisation_activity', 'transaction-receiver-org-activity-', 'text'),
    ('aid_type', 'transaction-aid-type-', 'text'),
    ('disbursement_channel', 'transaction-disbursement-channel-', 'text'),
    ('finance_type', 'transaction-finance-type-', 'text'),
    ('flow_type', 'transaction-flow-type-', 'text'),
    ('tied_status', 'transaction-tied-status-', 'text'),
    ('recipient_country', 'transaction-recipient-country-', 'text'),
    ('recipient_region', 'transaction-recipient-region-', 'text'),
    ('recipient_region_vocabulary', 'transaction-recipient-region-vocabulary-', 'text'),
)

TRANSACTION_SECTOR_FIELDS = (
    ('code', 'transaction-sector-', 'text'),
    ('vocabulary', 'transaction-sector-vocabulary-', 'text'),
    ('text', 'transaction-sector-description-', 'text'),
)

PLANNED_DISBURSEMENT_FIELDS = (
    ('value', 'planned-disbursement-value-', 'decimal'),
    ('value_date', 'planned-disbursement-value-date-', 'date'),
    ('type', 'planned-disbursement-type-', 'text'),
    ('period_start', 'planned-disbursement-period-start-', 'date'),
    ('period_end', 'planned-disbursement-period-end-', 'date'),
)

## Section 7 ##

SECTION_SEVEN_FIELDS = (
    ('project_scope', 'scope', 'text'),
)

RECIPIENT_COUNTRY_FIELDS = (
    ('country', 'recipient-country-', 'text'),
    ('percentage', 'recipient-country-percentage-', 'decimal'),
    ('text', 'recipient-country-description-', 'text'),
)

RECIPIENT_REGION_FIELDS = (
    ('region', 'recipient-region-', 'text'),
    ('percentage', 'recipient-region-percentage-', 'decimal'),
    ('text', 'recipient-region-description-', 'text'),
    ('region_vocabulary', 'recipient-region-vocabulary-', 'text'),
)

PROJECT_LOCATION_FIELDS = (
    ('latitude', 'location-latitude-', 'decimal'),
    ('longitude', 'location-longitude-', 'decimal'),
    ('country', 'location-country-', 'related-object'),
    ('city', 'location-city-', 'text'),
    ('postcode', 'location-postal-code-', 'text'),
    ('state', 'location-state-', 'text'),
    ('address_1', 'location-address1-', 'text'),
    ('address_2', 'location-address2-', 'text'),
    ('reference', 'location-reference-', 'text'),
    ('location_code', 'location-code-', 'text'),
    ('description', 'location-description-', 'text'),
    ('activity_description', 'location-activity-description-', 'text'),
    ('exactness', 'location-exactness-', 'text'),
    ('location_reach', 'location-reach-', 'text'),
    ('location_class', 'location-class-', 'text'),
    ('feature_designation', 'location-feature-designation-', 'text'),
)

ADMINISTRATIVE_LOCATION_FIELDS = (
    ('code', 'location-administrative-code-', 'text'),
    ('vocabulary', 'location-administrative-vocabulary-', 'text'),
    ('level', 'location-administrative-level-', 'integer'),
)

## Section 8 ##

SECTOR_FIELDS = (
    ('sector_code', 'sector-code-', 'text'),
    ('percentage', 'sector-percentage-', 'decimal'),
    ('vocabulary', 'sector-vocabulary-', 'text'),
)

POLICY_MARKER_FIELDS = (
    ('policy_marker', 'policy-marker-', 'text'),
    ('significance', 'policy-marker-significance-', 'text'),
    ('description', 'policy-marker-description-', 'text'),
)

## Section 9 ##

LINK_FIELDS = (
    ('url', 'link-url-', 'text'),
    ('caption', 'link-caption-', 'text'),
)

PROJECT_DOCUMENT_FIELDS = (
    ('url', 'document-url-', 'text'),
    ('title', 'document-title-', 'text'),
    ('format', 'document-format-', 'text'),
    ('category', 'document-category-', 'text'),
    ('language', 'document-language-', 'text'),
)

PROJECT_DOCUMENT_FIELD = ('document', 'document-document-', 'none')

## Section 10 ##

SECTION_TEN_FIELDS = (
    ('notes', 'projectComments', 'text'),
)

KEYWORD_FIELDS = (
    ('label', 'project-keyword-', 'related-objects')
)

## Custom fields ##

CUSTOM_FIELD = ('value', 'custom-field-', 'text')


def add_error(errors, message, field_name):
    errors.append({'name': field_name, 'error': str(message).capitalize()})
    return errors


def save_field(obj, field, form_field, form_data, orig_data, errors, changes):
    obj_data = getattr(obj, field)

    if isinstance(obj_data, int):
        obj_data = str(obj_data)
    elif isinstance(obj_data, datetime.date):
        obj_data = obj_data.strftime("%Y-%m-%d")

    if obj_data != form_data:
        setattr(obj, field, form_data)
        has_error = False

        try:
            obj.full_clean()
        except Exception as e:
            if field in dict(e).keys():
                has_error = True
                errors = add_error(errors, str(dict(e)[field][0]), form_field)

        if not has_error:
            try:
                obj.save(update_fields=[field])

                if form_field[:6] == 'value-':
                    form_field = form_field[6:]

                if not obj in [change[0] for change in changes]:
                    changes.append([obj, [(field, form_field, orig_data)]])
                else:
                    for change in changes:
                        if obj == change[0]:
                            change[1].append((field, form_field, orig_data))
                            break

            except Exception as e:
                errors = add_error(errors, e, form_field)

    return errors, changes


def process_field(obj, form_data, field, errors, changes, form_obj_id='', rel_obj_type=None):
    field_name = field[1] + form_obj_id
    orig_data = form_data[field_name] if not field[2] == 'boolean' else None

    if field[2] == 'date':
        if orig_data:
            try:
                field_data = datetime.datetime.strptime(orig_data, "%d/%m/%Y").strftime("%Y-%m-%d")
            except ValueError as e:
                errors = add_error(errors, e, field_name)
                field_data = None
        else:
            field_data = None

    elif field[2] == 'integer':
        try:
            field_data = int(orig_data) if orig_data else None
        except ValueError as e:
            errors = add_error(errors, e, field_name)
            field_data = None

    elif field[2] == 'decimal':
        try:
            field_data = decimal.Decimal(orig_data) if orig_data else None
        except decimal.InvalidOperation as e:
            if orig_data and ',' in orig_data:
                # Specific error message for commas
                e = u'%s' % _(u'It is not allowed to use a comma, use a period to denote decimals.')
            errors = add_error(errors, e, field_name)
            field_data = None

    elif field[2] == 'related-object':
        if orig_data:
            try:
                field_data = getattr(getattr(rel_obj_type, 'objects'), 'get')(pk=orig_data)
            except rel_obj_type.DoesNotExist as e:
                errors = add_error(errors, e, field_name)
                field_data = None
        else:
            field_data = None

    elif field[2] == 'boolean':
        field_data = 'True' if field_name in form_data.keys() else 'False'
        orig_data = field_data

    elif field[2] == 'none-boolean':
        field_data = None if orig_data == 'none' else orig_data

    elif field[2] == 'none':
        field_data = orig_data if orig_data else None

    else:
        field_data = orig_data

    return save_field(obj, field[0], field_name, field_data, orig_data, errors, changes)


def check_related_object_data(obj_id, form_data, fields):
    for field in fields:
        if form_data[field[1] + obj_id]:
            return True
    return False


def check_related_object(obj_id, obj_name, obj_type, obj_fields, parent_args, form_data, errors,
                         rel_objects):
    obj = None
    new_object = False

    if 'add' in obj_id and check_related_object_data(obj_id, form_data, obj_fields):
        obj = getattr(getattr(obj_type, 'objects'), 'create')(**parent_args)
        rel_objects.append(
            {
                'old_id': obj_id,
                'new_id': str(obj.pk),
                'div_id': obj_name + '-' + obj_id,
            }
        )

        new_object = True

    elif not 'add' in obj_id:
        try:
            obj = getattr(getattr(obj_type, 'objects'), 'get')(pk=int(obj_id))

            rel_objects.append(
                {
                    'old_id': str(obj.pk),
                    'new_id': str(obj.pk),
                    'div_id': obj_name + '-' + str(obj.pk),
                }
            )
        except Exception as e:
            error = str(e).capitalize()
            errors.append({'name': 'test', 'error': error})

    return obj, errors, rel_objects, new_object


def log_changes(changes, user, project):
    if changes:
        change_message = u''
        first_part = u'%s' % _(u'Project editor, changed: ')

        for obj_changes in changes:
            obj = obj_changes[0]
            fields = [obj_change[0] for obj_change in obj_changes[1]]

            if not isinstance(obj, Project):
                obj_change_message = u''

                for field in fields:
                    obj_change_message += u'%s, ' % field

                LogEntry.objects.log_action(
                    user_id=user.pk,
                    content_type_id=ContentType.objects.get_for_model(obj).pk,
                    object_id=obj.pk,
                    object_repr=obj.__unicode__(),
                    action_flag=CHANGE,
                    change_message=first_part + obj_change_message[:-2] + u'.'
                )

                change_message += u'%s (id: %s): ' % (type(obj)._meta.verbose_name.capitalize(),
                                                      str(obj.pk)) + obj_change_message

            else:
                for field in fields:
                    change_message += u'%s, ' % field

        change_message = change_message[:-2] + u'.'

        LogEntry.objects.log_action(
            user_id=user.pk,
            content_type_id=ContentType.objects.get_for_model(project).pk,
            object_id=project.pk,
            object_repr=project.__unicode__(),
            action_flag=CHANGE,
            change_message=first_part + change_message
        )

        field_changes = []
        for change in changes:
            for fields in change[1]:
                if not ('photo' in fields[1] or 'document-document-' in fields[1]):
                    field_changes.append([fields[1], fields[2]])

        return field_changes

    return []


def log_addition(obj, user):
    change_message = u'%s' % _(u'Project editor, added.')

    LogEntry.objects.log_action(
        user_id=user.pk,
        content_type_id=ContentType.objects.get_for_model(obj).pk,
        object_id=obj.pk,
        object_repr=obj.__unicode__(),
        action_flag=ADDITION,
        change_message=change_message
    )

@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def project_editor_delete_document(request, project_pk=None, document_pk=None):
    project = Project.objects.get(pk=project_pk)
    document = ProjectDocument.objects.get(pk=document_pk)
    user = request.user

    if not user.has_perm('rsr.change_project', project):
        return HttpResponseForbidden()

    errors, changes = save_field(
        document, 'document', 'document-document-' + str(document_pk), '', '', [], []
    )

    if changes:
        change_message = u'%s (id: %s): %s.' % (_(u'Project editor, changed: Project document'),
                                                str(document_pk),
                                                _(u'document'))

        LogEntry.objects.log_action(
            user_id=user.pk,
            content_type_id=ContentType.objects.get_for_model(project).pk,
            object_id=project.pk,
            object_repr=project.__unicode__(),
            action_flag=CHANGE,
            change_message=change_message
        )

        LogEntry.objects.log_action(
            user_id=user.pk,
            content_type_id=ContentType.objects.get_for_model(document).pk,
            object_id=document.pk,
            object_repr=document.__unicode__(),
            action_flag=CHANGE,
            change_message=u'%s' % _(u'Project editor, deleted: document.')
        )

    return Response({'errors': errors})


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def project_editor_delete_photo(request, pk=None):
    project = Project.objects.get(pk=pk)
    user = request.user

    if not user.has_perm('rsr.change_project', project):
        return HttpResponseForbidden()

    errors, changes = save_field(project, 'current_image', 'photo', '', '', [], [])

    if changes:
        change_message = u'%s' % _(u'Project editor, deleted: current_image.')

        LogEntry.objects.log_action(
            user_id=user.pk,
            content_type_id=ContentType.objects.get_for_model(project).pk,
            object_id=project.pk,
            object_repr=project.__unicode__(),
            action_flag=CHANGE,
            change_message=change_message
        )

    return Response({'errors': errors})


@api_view(['DELETE'])
@permission_classes((IsAuthenticated, ))
def project_editor_remove_keyword(request, project_pk=None, keyword_pk=None):
    project = Project.objects.get(pk=project_pk)
    keyword = Keyword.objects.get(pk=keyword_pk)
    user = request.user

    if not user.has_perm('rsr.change_project', project):
        return HttpResponseForbidden()

    if keyword in project.keywords.all():
        project.keywords.remove(keyword)

        change_message = u'%s %s.' % (_(u'Project editor, deleted: keyword'),
                                      keyword.__unicode__())

        LogEntry.objects.log_action(
            user_id=user.pk,
            content_type_id=ContentType.objects.get_for_model(project).pk,
            object_id=project.pk,
            object_repr=project.__unicode__(),
            action_flag=CHANGE,
            change_message=change_message
        )

    return Response({})


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def project_editor_step1(request, pk=None):
    project = Project.objects.get(pk=pk)
    user = request.user

    if not user.has_perm('rsr.change_project', project):
        return HttpResponseForbidden()

    data = request.POST
    files = request.FILES
    errors = []
    changes = []
    rel_objects = []
    new_image = None

    if not files and 'photo' not in data.keys():

        # Project fields
        for field in SECTION_ONE_FIELDS:
            errors, changes = process_field(project, data, field, errors, changes)

        # Related objects
        for key in data.keys():

            # Related projects
            if 'value-related-project-project-' in key:
                rp_id = key.split('-', 4)[4]

                rp, errors, rel_objects, new_object = check_related_object(
                    rp_id, 'related_project', RelatedProject, RELATED_PROJECT_FIELDS,
                    {'project': project}, data, errors, rel_objects
                )

                if new_object:
                    log_addition(rp, user)

                if rp:
                    for field in RELATED_PROJECT_FIELDS:
                        if field[0] == 'related_project':
                            errors, changes = process_field(
                                rp, data, field, errors, changes, rp_id, Project
                            )
                        else:
                            errors, changes = process_field(rp, data, field, errors, changes, rp_id)

                    if rel_objects and rel_objects[-1]['new_id'] == str(rp.pk):
                        rel_objects[-1]['unicode'] = rp.__unicode__()

            # Custom fields
            elif 'custom-field-' in key:
                cf_id = key.split('-', 2)[2]

                cf, errors, rel_objects, new_object = check_related_object(
                    cf_id, 'custom_field', ProjectCustomField, (CUSTOM_FIELD,),
                    {'project': project}, data, errors, rel_objects
                )

                errors, changes = process_field(cf, data, CUSTOM_FIELD, errors, changes, cf_id)

    # Current image
    elif 'photo' in files.keys():
        errors, changes = process_field(project, files, CURRENT_IMAGE_FIELD, errors, changes)

        if not errors:
            new_image = get_thumbnail(
                project.current_image, '250x250', format="PNG", upscale=True
            ).url

    # Log changes
    field_changes = log_changes(changes, user, project)

    return Response(
        {
            'changes': field_changes,
            'errors': errors,
            'rel_objects': rel_objects,
            'new_image': new_image,
        }
    )


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def project_editor_step2(request, pk=None):
    project = Project.objects.get(pk=pk)
    user = request.user

    if not user.has_perm('rsr.change_project', project):
        return HttpResponseForbidden()

    data = request.POST
    errors = []
    changes = []
    rel_objects = []

    # Related objects
    for key in data.keys():

        # Project contacts
        if 'contact-type-' in key:
            contact_id = key.split('-', 2)[2]

            contact, errors, rel_objects, new_object = check_related_object(
                contact_id, 'project_contact', ProjectContact, PROJECT_CONTACT_FIELDS,
                {'project': project}, data, errors, rel_objects
            )

            if new_object:
                log_addition(contact, user)

            if contact:
                for field in PROJECT_CONTACT_FIELDS:
                    if field[0] == 'country':
                        errors, changes = process_field(
                            contact, data, field, errors, changes, contact_id, Country
                        )
                    else:
                        errors, changes = process_field(contact, data, field, errors, changes,
                                                        contact_id)

                if rel_objects and rel_objects[-1]['new_id'] == str(contact.pk):
                    rel_objects[-1]['unicode'] = contact.__unicode__()

        # Custom fields
        elif 'custom-field-' in key:
            cf_id = key.split('-', 2)[2]

            cf, errors, rel_objects, new_object = check_related_object(
                cf_id, 'custom_field', ProjectCustomField, (CUSTOM_FIELD,), {'project': project},
                data, errors, rel_objects
            )

            errors, changes = process_field(cf, data, CUSTOM_FIELD, errors, changes, cf_id)

    # Log changes
    field_changes = log_changes(changes, user, project)

    return Response(
        {
            'changes': field_changes,
            'errors': errors,
            'rel_objects': rel_objects,
        }
    )


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def project_editor_step3(request, pk=None):
    project = Project.objects.get(pk=pk)
    user = request.user

    if not user.has_perm('rsr.change_project', project):
        return HttpResponseForbidden()

    data = request.POST
    errors = []
    changes = []
    rel_objects = []

    # Project fields
    for field in SECTION_THREE_FIELDS:
        if field[0] == 'sync_owner':
            errors, changes = process_field(project, data, field, errors, changes, '', Organisation)
        else:
            errors, changes = process_field(project, data, field, errors, changes)

    # Related objects
    for key in data.keys():

        # Participating organisations
        if 'value-partner-' in key:
            partner_id = key.split('-', 2)[2]

            partner, errors, rel_objects, new_object = check_related_object(
                partner_id, 'partnership', Partnership, PARTNER_FIELDS, {'project': project}, data,
                errors, rel_objects
            )

            if new_object:
                log_addition(partner, user)

            if partner:
                for field in PARTNER_FIELDS:
                    if field[0] == 'organisation':
                        errors, changes = process_field(
                            partner, data, field, errors, changes, partner_id, Organisation
                        )
                    else:
                        errors, changes = process_field(partner, data, field, errors, changes,
                                                        partner_id)

                if rel_objects and rel_objects[-1]['new_id'] == str(partner.pk):
                    rel_objects[-1]['unicode'] = partner.__unicode__()

        # Custom fields
        elif 'custom-field-' in key:
            cf_id = key.split('-', 2)[2]

            cf, errors, rel_objects, new_object = check_related_object(
                cf_id, 'custom_field', ProjectCustomField, (CUSTOM_FIELD,), {'project': project},
                data, errors, rel_objects
            )

            errors, changes = process_field(cf, data, CUSTOM_FIELD, errors, changes, cf_id)

    # Log changes
    field_changes = log_changes(changes, user, project)

    return Response(
        {
            'changes': field_changes,
            'errors': errors,
            'rel_objects': rel_objects,
        }
    )


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def project_editor_step4(request, pk=None):
    project = Project.objects.get(pk=pk)
    user = request.user

    if not user.has_perm('rsr.change_project', project):
        return HttpResponseForbidden()

    data = request.POST
    errors = []
    changes = []
    rel_objects = []

    # Project fields
    for field in SECTION_FOUR_FIELDS:
        errors, changes = process_field(project, data, field, errors, changes)

    # Related objects
    for key in data.keys():

        # Custom fields
        if 'custom-field-' in key:
            cf_id = key.split('-', 2)[2]

            cf, errors, rel_objects, new_object = check_related_object(
                cf_id, 'custom_field', ProjectCustomField, (CUSTOM_FIELD,), {'project': project},
                data, errors, rel_objects
            )

            errors, changes = process_field(cf, data, CUSTOM_FIELD, errors, changes, cf_id)

    # Log changes
    field_changes = log_changes(changes, user, project)

    return Response(
        {
            'changes': field_changes,
            'errors': errors,
            'rel_objects': rel_objects,
        }
    )


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def project_editor_step5(request, pk=None):
    project = Project.objects.get(pk=pk)
    user = request.user

    if not user.has_perm('rsr.change_project', project):
        return HttpResponseForbidden()

    data = request.POST
    errors = []
    changes = []
    rel_objects = []

    if data['level'] == '1':

        # Related objects
        for key in data.keys():

            # Results
            if 'result-title-' in key:
                result_id = key.split('-', 2)[2]

                result, errors, rel_objects, new_object = check_related_object(
                    result_id, 'result', Result, RESULT_FIELDS, {'project': project}, data, errors,
                    rel_objects
                )

                if new_object:
                    log_addition(result, user)

                if result:
                    for field in RESULT_FIELDS:
                        errors, changes = process_field(result, data, field, errors, changes,
                                                        result_id)

                    if rel_objects and rel_objects[-1]['new_id'] == str(result.pk):
                        rel_objects[-1]['unicode'] = result.__unicode__()

            # Project Conditions
            elif 'condition-type-' in key:
                condition_id = key.split('-', 2)[2]

                condition, errors, rel_objects, new_object = check_related_object(
                    condition_id, 'project_condition', ProjectCondition, PROJECT_CONDITION_FIELDS,
                    {'project': project}, data, errors, rel_objects
                )

                if new_object:
                    log_addition(condition, user)

                if condition:
                    for field in PROJECT_CONDITION_FIELDS:
                        errors, changes = process_field(condition, data, field, errors, changes,
                                                        condition_id)

                    if rel_objects and rel_objects[-1]['new_id'] == str(condition.pk):
                        rel_objects[-1]['unicode'] = condition.__unicode__()

            # Custom fields
            elif 'custom-field-' in key:
                cf_id = key.split('-', 2)[2]

                cf, errors, rel_objects, new_object = check_related_object(
                    cf_id, 'custom_field', ProjectCustomField, (CUSTOM_FIELD,),
                    {'project': project}, data, errors, rel_objects
                )

                errors, changes = process_field(cf, data, CUSTOM_FIELD, errors, changes, cf_id)

    if data['level'] == '2':

        # Related objects
        for key in data.keys():

            # Indicators
            if 'indicator-title-' in key:
                ind_res_id = key.split('-', 2)[2]

                try:
                    if 'add' in ind_res_id and check_related_object_data(ind_res_id, data,
                                                                         INDICATOR_FIELDS):
                        result = Result.objects.get(pk=str(ind_res_id.split('-').pop()))

                        indicator, errors, rel_objects, new_object = check_related_object(
                            ind_res_id, 'indicator', Indicator, INDICATOR_FIELDS,
                            {'result': result}, data, errors, rel_objects
                        )

                    else:
                        indicator, errors, rel_objects, new_object = check_related_object(
                            ind_res_id, 'indicator', Indicator, INDICATOR_FIELDS, None, data,
                            errors, rel_objects
                        )

                    if new_object:
                        log_addition(indicator, user)

                except Exception as e:
                    indicator = None
                    error = str(e).capitalize()
                    errors.append({'name': 'indicator-title-' + ind_res_id,
                                   'error': error})

                if indicator:
                    for field in INDICATOR_FIELDS:
                        errors, changes = process_field(indicator, data, field, errors, changes,
                                                        ind_res_id)

                    if rel_objects and rel_objects[-1]['new_id'] == str(indicator.pk):
                        rel_objects[-1]['unicode'] = indicator.__unicode__()

    if data['level'] == '3':

        # Related objects
        for key in data.keys():

            # Indicator periods
            if 'indicator-period-target-value-comment-' in key:
                ip_ind_id = key.split('-', 5)[5]

                try:
                    if 'add' in ip_ind_id and check_related_object_data(ip_ind_id, data,
                                                                        INDICATOR_PERIOD_FIELDS):
                        indicator = Indicator.objects.get(pk=str(ip_ind_id.split('-').pop()))

                        ip, errors, rel_objects, new_object = check_related_object(
                            ip_ind_id, 'indicator_period', IndicatorPeriod, INDICATOR_PERIOD_FIELDS,
                            {'indicator': indicator}, data, errors, rel_objects
                        )

                    else:
                        ip, errors, rel_objects, new_object = check_related_object(
                            ip_ind_id, 'indicator_period', IndicatorPeriod, INDICATOR_PERIOD_FIELDS,
                            None, data, errors, rel_objects
                        )

                    if new_object:
                        log_addition(ip, user)

                except Exception as e:
                    ip = None
                    error = str(e).capitalize()
                    errors.append({'name': 'indicator-period-start-' + ip_ind_id,
                                   'error': error})

                if ip:
                    for field in INDICATOR_PERIOD_FIELDS:
                        errors, changes = process_field(ip, data, field, errors, changes, ip_ind_id)

                    if rel_objects and rel_objects[-1]['new_id'] == str(ip.pk):
                        rel_objects[-1]['unicode'] = ip.__unicode__()

    # Log changes
    field_changes = log_changes(changes, user, project)

    return Response(
        {
            'changes': field_changes,
            'errors': errors,
            'rel_objects': rel_objects,
        }
    )


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def project_editor_step6(request, pk=None):
    project = Project.objects.get(pk=pk)
    user = request.user

    if not user.has_perm('rsr.change_project', project):
        return HttpResponseForbidden()

    data = request.POST
    errors = []
    changes = []
    rel_objects = []

    if data['level'] == '1':

        # Project fields
        for field in SECTION_SIX_FIELDS:
            errors, changes = process_field(project, data, field, errors, changes)

        # Related objects
        for key in data.keys():

            # Budget items
            if 'budget-item-type-' in key:
                budget_id = key.split('-', 3)[3]

                budget, errors, rel_objects, new_object = check_related_object(
                    budget_id, 'budget_item', BudgetItem, BUDGET_ITEM_FIELDS, {'project': project},
                    data, errors, rel_objects
                )

                if new_object:
                    log_addition(budget, user)

                if budget:
                    for field in BUDGET_ITEM_FIELDS:
                        if field[0] == 'label':
                            errors, changes = process_field(budget, data, field, errors, changes,
                                                            budget_id, BudgetItemLabel)
                        else:
                            errors, changes = process_field(budget, data, field, errors, changes,
                                                            budget_id)

                    if rel_objects and rel_objects[-1]['new_id'] == str(budget.pk):
                        rel_objects[-1]['unicode'] = budget.__unicode__()

            # Country budget items
            elif 'country-budget-item-' in key:
                cbi_id = key.split('-', 3)[3]

                cbi, errors, rel_objects, new_object = check_related_object(
                    cbi_id, 'country_budget_item', CountryBudgetItem, COUNTRY_BUDGET_ITEM_FIELDS,
                    {'project': project}, data, errors, rel_objects
                )

                if new_object:
                    log_addition(cbi, user)

                if cbi:
                    for field in COUNTRY_BUDGET_ITEM_FIELDS:
                        errors, changes = process_field(cbi, data, field, errors, changes, cbi_id)

                    if rel_objects and rel_objects[-1]['new_id'] == str(cbi.pk):
                        rel_objects[-1]['unicode'] = cbi.__unicode__()

            # Transactions
            elif 'transaction-value-date-' in key:
                trans_id = key.split('-', 3)[3]

                trans, errors, rel_objects, new_object = check_related_object(
                    trans_id, 'transaction', Transaction, TRANSACTION_FIELDS, {'project': project},
                    data, errors, rel_objects
                )

                if new_object:
                    log_addition(trans, user)

                if trans:
                    for field in TRANSACTION_FIELDS:
                        if field[0] in ['provider_organisation', 'receiver_organisation']:
                            errors, changes = process_field(trans, data, field, errors, changes,
                                                            trans_id, Organisation)
                        else:
                            errors, changes = process_field(trans, data, field, errors, changes,
                                                            trans_id)

                    if rel_objects and rel_objects[-1]['new_id'] == str(trans.pk):
                        rel_objects[-1]['unicode'] = trans.__unicode__()

            # Planned disbursements
            elif 'planned-disbursement-type-' in key:
                pd_id = key.split('-', 3)[3]

                pd, errors, rel_objects, new_object = check_related_object(
                    pd_id, 'planned_disbursement', PlannedDisbursement, PLANNED_DISBURSEMENT_FIELDS,
                    {'project': project}, data, errors, rel_objects
                )

                if new_object:
                    log_addition(pd, user)

                if pd:
                    for field in PLANNED_DISBURSEMENT_FIELDS:
                        errors, changes = process_field(pd, data, field, errors, changes, pd_id)

                    if rel_objects and rel_objects[-1]['new_id'] == str(pd.pk):
                        rel_objects[-1]['unicode'] = pd.__unicode__()

            # Custom fields
            elif 'custom-field-' in key:
                cf_id = key.split('-', 2)[2]

                cf, errors, rel_objects, new_object = check_related_object(
                    cf_id, 'custom_field', ProjectCustomField, (CUSTOM_FIELD,),
                    {'project': project}, data, errors, rel_objects
                )

                errors, changes = process_field(cf, data, CUSTOM_FIELD, errors, changes, cf_id)

    elif data['level'] == '2':

        # Related objects
        for key in data.keys():

            # Transaction sectors
            if 'transaction-sector-vocabulary-' in key:
                sector_trans_id = key.split('-', 3)[3]

                try:
                    if 'add' in sector_trans_id and \
                            check_related_object_data(sector_trans_id, data,
                                                      TRANSACTION_SECTOR_FIELDS):
                        trans = Transaction.objects.get(pk=str(sector_trans_id.split('-').pop()))

                        sector, errors, rel_objects, new_object = check_related_object(
                            sector_trans_id, 'transaction_sector', TransactionSector,
                            TRANSACTION_SECTOR_FIELDS, {'transaction': trans}, data, errors,
                            rel_objects
                        )

                    else:
                        sector, errors, rel_objects, new_object = check_related_object(
                            sector_trans_id, 'transaction_sector', TransactionSector,
                            TRANSACTION_SECTOR_FIELDS, None, data, errors, rel_objects
                        )

                    if new_object:
                        log_addition(sector, user)

                except Exception as e:
                    sector = None
                    error = str(e).capitalize()
                    errors.append({'name': 'transaction-sector-vocabulary-' + sector_trans_id,
                                   'error': error})

                if sector:
                    for field in TRANSACTION_SECTOR_FIELDS:
                        errors, changes = process_field(sector, data, field, errors, changes,
                                                        sector_trans_id)

                    if rel_objects and rel_objects[-1]['new_id'] == str(sector.pk):
                        rel_objects[-1]['unicode'] = sector.__unicode__()

    # Log changes
    field_changes = log_changes(changes, user, project)

    return Response(
        {
            'changes': field_changes,
            'errors': errors,
            'rel_objects': rel_objects,
            'total_budget': "{:,}".format(int(project.budget)),
        }
    )


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def project_editor_step7(request, pk=None):
    project = Project.objects.get(pk=pk)
    user = request.user

    if not user.has_perm('rsr.change_project', project):
        return HttpResponseForbidden()

    data = request.POST
    errors = []
    changes = []
    rel_objects = []

    if data['level'] == '1':

        # Project fields
        for field in SECTION_SEVEN_FIELDS:
            errors, changes = process_field(project, data, field, errors, changes)

        # Related objects
        for key in data.keys():

            # Recipient countries
            if 'recipient-country-percentage-' in key:
                rc_id = key.split('-', 3)[3]

                rc, errors, rel_objects, new_object = check_related_object(
                    rc_id, 'recipient_country', RecipientCountry, RECIPIENT_COUNTRY_FIELDS,
                    {'project': project}, data, errors, rel_objects
                )

                if new_object:
                    log_addition(rc, user)

                if rc:
                    for field in RECIPIENT_COUNTRY_FIELDS:
                        errors, changes = process_field(rc, data, field, errors, changes, rc_id)

                    if rel_objects and rel_objects[-1]['new_id'] == str(rc.pk):
                        rel_objects[-1]['unicode'] = rc.__unicode__()

            # Recipient regions
            elif 'recipient-region-percentage-' in key:
                rr_id = key.split('-', 3)[3]

                rr, errors, rel_objects, new_object = check_related_object(
                    rr_id, 'recipient_region', RecipientRegion, RECIPIENT_REGION_FIELDS,
                    {'project': project}, data, errors, rel_objects
                )

                if new_object:
                    log_addition(rr, user)

                if rr:
                    for field in RECIPIENT_REGION_FIELDS:
                        errors, changes = process_field(rr, data, field, errors, changes, rr_id)

                    if rel_objects and rel_objects[-1]['new_id'] == str(rr.pk):
                        rel_objects[-1]['unicode'] = rr.__unicode__()

            # Locations
            elif 'location-latitude-' in key:
                loc_id = key.split('-', 2)[2]

                loc, errors, rel_objects, new_object = check_related_object(
                    loc_id, 'project_location', ProjectLocation, PROJECT_LOCATION_FIELDS,
                    {'location_target': project}, data, errors, rel_objects
                )

                if new_object:
                    log_addition(loc, user)

                if loc:
                    for field in PROJECT_LOCATION_FIELDS:
                        if field[0] == 'country':
                            errors, changes = process_field(loc, data, field, errors, changes,
                                                            loc_id, Country)
                        else:
                            errors, changes = process_field(loc, data, field, errors, changes,
                                                            loc_id)

                    if rel_objects and rel_objects[-1]['new_id'] == str(loc.pk):
                        rel_objects[-1]['unicode'] = loc.__unicode__()

            # Custom fields
            elif 'custom-field-' in key:
                cf_id = key.split('-', 2)[2]

                cf, errors, rel_objects, new_object = check_related_object(
                    cf_id, 'custom_field', ProjectCustomField, (CUSTOM_FIELD,),
                    {'project': project}, data, errors, rel_objects
                )

                errors, changes = process_field(cf, data, CUSTOM_FIELD, errors, changes, cf_id)

    elif data['level'] == '2':

        # Related objects
        for key in data.keys():

            # Location administratives
            if 'location-administrative-code-' in key:
                admin_loc_id = key.split('-', 3)[3]

                try:
                    if 'add' in admin_loc_id and \
                            check_related_object_data(admin_loc_id, data,
                                                      ADMINISTRATIVE_LOCATION_FIELDS):
                        loc = ProjectLocation.objects.get(pk=str(admin_loc_id.split('-').pop()))

                        admin, errors, rel_objects, new_object = check_related_object(
                            admin_loc_id, 'administrative_location', AdministrativeLocation,
                            ADMINISTRATIVE_LOCATION_FIELDS, {'location': loc}, data, errors,
                            rel_objects
                        )

                    else:
                        admin, errors, rel_objects, new_object = check_related_object(
                            admin_loc_id, 'administrative_location', AdministrativeLocation,
                            ADMINISTRATIVE_LOCATION_FIELDS, None, data, errors, rel_objects
                        )

                    if new_object:
                        log_addition(admin, user)

                except Exception as e:
                    admin = None
                    error = str(e).capitalize()
                    errors.append({'name': 'location-administrative-code-' + admin_loc_id,
                                   'error': error})

                if admin:
                    for field in ADMINISTRATIVE_LOCATION_FIELDS:
                        errors, changes = process_field(admin, data, field, errors, changes,
                                                        admin_loc_id)

                    if rel_objects and rel_objects[-1]['new_id'] == str(admin.pk):
                        rel_objects[-1]['unicode'] = admin.__unicode__()

    # Log changes
    field_changes = log_changes(changes, user, project)

    return Response(
        {
            'changes': field_changes,
            'errors': errors,
            'rel_objects': rel_objects,
        }
    )


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def project_editor_step8(request, pk=None):
    project = Project.objects.get(pk=pk)
    user = request.user

    if not user.has_perm('rsr.change_project', project):
        return HttpResponseForbidden()

    data = request.POST
    errors = []
    changes = []
    rel_objects = []

    # Related objects
    for key in data.keys():

        # Sectors
        if 'sector-code-' in key:
            sector_id = key.split('-', 2)[2]

            sector, errors, rel_objects, new_object = check_related_object(
                sector_id, 'sector', Sector, SECTOR_FIELDS, {'project': project}, data, errors,
                rel_objects
            )

            if new_object:
                log_addition(sector, user)

            if sector:
                for field in SECTOR_FIELDS:
                    errors, changes = process_field(sector, data, field, errors, changes, sector_id)

                if rel_objects and rel_objects[-1]['new_id'] == str(sector.pk):
                    rel_objects[-1]['unicode'] = sector.__unicode__()

        # Policy markers
        elif 'policy-marker-significance-' in key:
            pm_id = key.split('-', 3)[3]

            pm, errors, rel_objects, new_object = check_related_object(
                pm_id, 'policy_marker', PolicyMarker, POLICY_MARKER_FIELDS, {'project': project},
                data, errors, rel_objects
            )

            if new_object:
                log_addition(pm, user)

            if pm:
                for field in POLICY_MARKER_FIELDS:
                    errors, changes = process_field(pm, data, field, errors, changes, pm_id)

                if rel_objects and rel_objects[-1]['new_id'] == str(pm.pk):
                    rel_objects[-1]['unicode'] = pm.__unicode__()

        # Custom fields
        elif 'custom-field-' in key:
            cf_id = key.split('-', 2)[2]

            cf, errors, rel_objects, new_object = check_related_object(
                cf_id, 'custom_field', ProjectCustomField, (CUSTOM_FIELD,),
                {'project': project}, data, errors, rel_objects
            )

            errors, changes = process_field(cf, data, CUSTOM_FIELD, errors, changes, cf_id)

    # Log changes
    field_changes = log_changes(changes, user, project)

    return Response(
        {
            'changes': field_changes,
            'errors': errors,
            'rel_objects': rel_objects,
        }
    )


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def project_editor_step9(request, pk=None):
    project = Project.objects.get(pk=pk)
    user = request.user

    if not user.has_perm('rsr.change_project', project):
        return HttpResponseForbidden()

    data = request.POST
    files = request.FILES
    errors = []
    changes = []
    rel_objects = []

    if not files and not any(data_key.startswith('document-document-') for data_key in data.keys()):

        # Related objects
        for key in data.keys():

            # Links
            if 'link-url-' in key:
                link_id = key.split('-', 2)[2]

                link, errors, rel_objects, new_object = check_related_object(
                    link_id, 'link', Link, LINK_FIELDS, {'project': project}, data, errors,
                    rel_objects
                )

                if new_object:
                    log_addition(link, user)

                if link:
                    for field in LINK_FIELDS:
                        errors, changes = process_field(link, data, field, errors, changes, link_id)

                    if rel_objects and rel_objects[-1]['new_id'] == str(link.pk):
                        rel_objects[-1]['unicode'] = link.__unicode__()

            # Documents
            elif 'document-url-' in key:
                document_id = key.split('-', 2)[2]

                document, errors, rel_objects, new_object = check_related_object(
                    document_id, 'project_document', ProjectDocument, PROJECT_DOCUMENT_FIELDS,
                    {'project': project}, data, errors, rel_objects
                )

                if new_object:
                    log_addition(document, user)

                if document:
                    for field in PROJECT_DOCUMENT_FIELDS:
                        errors, changes = process_field(document, data, field, errors, changes,
                                                        document_id)

                    if rel_objects and rel_objects[-1]['new_id'] == str(document.pk):
                        rel_objects[-1]['unicode'] = document.__unicode__()

            # Custom fields
            elif 'custom-field-' in key:
                cf_id = key.split('-', 2)[2]

                cf, errors, rel_objects, new_object = check_related_object(
                    cf_id, 'custom_field', ProjectCustomField, (CUSTOM_FIELD,),
                    {'project': project}, data, errors, rel_objects
                )

                errors, changes = process_field(cf, data, CUSTOM_FIELD, errors, changes, cf_id)

    elif any(file_key.startswith('document-document-') for file_key in files.keys()):
        for key in files.keys():
            document_id = key.split('-', 2)[2]

            document, errors, rel_objects, new_object = check_related_object(
                document_id, 'project_document', ProjectDocument, (PROJECT_DOCUMENT_FIELD,),
                {'project': project}, files, errors, rel_objects
            )

            errors, changes = process_field(document, files, PROJECT_DOCUMENT_FIELD, errors,
                                            changes, document_id)

            # TODO: replace document right after saving
            # if not errors:
            #     new_image = get_thumbnail(
            #         project.current_image, '250x250', format="PNG", upscale=True
            #     ).url

    # Log changes
    field_changes = log_changes(changes, user, project)

    return Response(
        {
            'changes': field_changes,
            'errors': errors,
            'rel_objects': rel_objects,
        }
    )


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def project_editor_step10(request, pk=None):
    project = Project.objects.get(pk=pk)
    user = request.user

    if not user.has_perm('rsr.change_project', project):
        return HttpResponseForbidden()

    data = request.POST
    errors = []
    changes = []
    rel_objects = []

    # Project fields
    for field in SECTION_TEN_FIELDS:
        errors, changes = process_field(project, data, field, errors, changes)

    # Related objects
    for key in data.keys():

        # Keywords
        if 'keyword-id-' in key:
            keyword_id = data[key] if data[key] else None
            form_keyword_id = key.split('-', 2)[2]

            if keyword_id:
                try:
                    keyword = Keyword.objects.get(pk=int(keyword_id))

                    if keyword and (str(keyword_id) == form_keyword_id):
                        # Keyword already added to project, and stayed the same
                        rel_objects.append(
                            {
                                'old_id': str(keyword.pk),
                                'new_id': str(keyword.pk),
                                'div_id': 'keyword-' + str(keyword.pk),
                                'unicode': keyword.__unicode__(),
                            }
                        )

                    elif keyword_id and (str(keyword_id) != form_keyword_id):
                        if not 'add' in form_keyword_id:
                            # Keyword changed, delete old keyword
                            old_keyword = Keyword.objects.get(pk=int(form_keyword_id))
                            project.keywords.remove(old_keyword)

                        project.keywords.add(keyword)

                        if not project in [change[0] for change in changes]:
                            changes.append([project, [('keyword', key, str(keyword.pk))]])
                        else:
                            for change in changes:
                                if project == change[0]:
                                    change[1].append(('keyword', key, str(keyword.pk)))

                        rel_objects.append(
                            {
                                'old_id': key.split('-', 2)[2],
                                'new_id': str(keyword.pk),
                                'div_id': 'keyword-' + key.split('-', 2)[2],
                                'unicode': keyword.__unicode__(),
                            }
                        )

                except Exception as e:
                    errors.append({'name': key, 'error': str(e).capitalize()})

        # Custom fields
        if 'custom-field-' in key:
            cf_id = key.split('-', 2)[2]

            cf, errors, rel_objects, new_object = check_related_object(
                cf_id, 'custom_field', ProjectCustomField, (CUSTOM_FIELD,),
                {'project': project}, data, errors, rel_objects
            )

            errors, changes = process_field(cf, data, CUSTOM_FIELD, errors, changes, cf_id)

    # Log changes
    field_changes = log_changes(changes, user, project)

    return Response(
        {
            'changes': field_changes,
            'errors': errors,
            'rel_objects': rel_objects,
        }
    )
