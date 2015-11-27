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

from akvo.rsr.fields import (LatitudeField, LongitudeField, ProjectLimitedTextField,
                             ValidXMLCharField, ValidXMLTextField)

import datetime
import decimal

from django.db.models import (get_model, BooleanField, DateField, DecimalField, EmailField,
                              ForeignKey, ManyToManyField, NullBooleanField, PositiveIntegerField,
                              PositiveSmallIntegerField, URLField)
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
    ('iati_activity_id', 'iatiId', 'none'),
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

PARTNER_FIELDS = (
    ('organisation', 'value-partner-', 'related-object'),
    ('iati_organisation_role', 'partner-role-', 'integer'),
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

SECTION_FIVE_FIELDS = (
    ('is_impact_project', 'impactProject', 'boolean'),
)

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
ORGANISATION_LOGO_FIELD = ('logo', 'logo', 'none')

## Special mappings for related objects ##

RELATED_OBJECTS_MAPPING = {
    Indicator: (Result, 'result'),
    IndicatorPeriod: (Indicator, 'indicator'),
    TransactionSector: (Transaction, 'transaction'),
    ProjectLocation: (Project, 'location_target'),
    AdministrativeLocation: (ProjectLocation, 'location')
}


def add_error(errors, message, field_name):
    errors.append({'name': field_name, 'error': str(message).capitalize()})
    return errors


def save_field(obj, field, form_field, form_data, orig_data, errors, changes):
    obj_data = getattr(obj, field)

    if form_field[:6] == 'value-':
        form_field = form_field[6:]

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
        field_data = True if orig_data == '1' else False if orig_data == '2' else None

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
                if not (fields[1] == 'photo' or 'document-document-' in fields[1]):
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


def split_key(key):
    """
    Helper function for splitting the keys of the form data. Key input will be a string like
    'rsr_relatedproject.relation.1234_new-0' and it will return a tuple as such:

    ('rsr', 'relatedproject'), 'relation', ('1234', 'new-0')
    """
    key_info = key.split('.')
    return key_info[0].split('_'), key_info[1], key_info[2].split('_')


def pre_process_data(key, data, errors):
    """
    Pre-process the data. Needed to transform some of the form data to usable data in the Django
    models. Returns the processed data and any errors that have occurred so far.
    """
    # Retrieve field information first
    model, field, obj_id = split_key(key)
    Model = get_model(model[0], model[1])
    model_field = Model._meta.get_field(field)

    # Text data does not need pre-processing
    if isinstance(model_field, (EmailField, ProjectLimitedTextField, URLField, ValidXMLCharField,
                                ValidXMLTextField)):
        return data, errors

    # Dates should be converted to a datetime object, or None if empty
    if isinstance(model_field, DateField):
        if data:
            try:
                return datetime.datetime.strptime(data, "%d/%m/%Y").strftime("%Y-%m-%d"), errors
            except ValueError as e:
                errors = add_error(errors, e, key)
                return None, errors
        else:
            return None, errors

    # Integers should be converted to an integer
    if isinstance(model_field, (PositiveIntegerField, PositiveSmallIntegerField)):
        if data:
            try:
                return int(data), errors
            except ValueError as e:
                errors = add_error(errors, e, key)
                return None, errors
        else:
            return None, errors

    # Decimals should be converted to a decimal
    if isinstance(model_field, DecimalField):
        if data:
            try:
                return decimal.Decimal(data), errors
            except decimal.InvalidOperation as e:
                if ',' in data:
                    # Specific error message for commas
                    e = u'%s' % _(u'It is not allowed to use a comma, use a period to denote '
                                  u'decimals.')
                errors = add_error(errors, e, key)
                return None, errors
        else:
            return None, errors

    # Latitude and longitude should be converted to a float
    if isinstance(model_field, (LatitudeField, LongitudeField)):
        if data:
            try:
                return float(data), errors
            except ValueError as e:
                errors = add_error(errors, e, key)
                return None, errors
        else:
            return None, errors

    # Booleans should be converted to True or False
    if isinstance(model_field, BooleanField):
        return (True, errors) if data == '1' else (False, errors)

    # Booleans should be converted to True, False or None
    if isinstance(model_field, NullBooleanField):
        if data == '1':
            return True, errors
        elif data == '2':
            return False, errors
        else:
            return None, errors

    # In case of a foreign key, we first check if this is a project or organisation foreign key.
    # Then the data should be converted to the related object.
    if isinstance(model_field, ForeignKey):
        if data:
            try:
                if 'project' in field:
                    return Project.objects.get(pk=int(data)), errors
                elif 'organisation' in field:
                    return Organisation.objects.get(pk=int(data)), errors
                elif 'label' in field:
                    return BudgetItemLabel.objects.get(pk=int(data)), errors
                elif 'country' in field:
                    return Country.objects.get(pk=int(data)), errors
            except (Project.DoesNotExist, Organisation.DoesNotExist, BudgetItemLabel.DoesNotExist,
                    Country.DoesNotExist) as e:
                errors = add_error(errors, e, key)
                return None, errors
        else:
            return None, errors

    # Keywords is the only ManyToManyField
    if isinstance(model_field, ManyToManyField):
        try:
            return Keyword.objects.get(pk=int(data))
        except Exception as e:
            errors = add_error(errors, e, key)
            return None, errors


def add_changes(changes, obj, field, field_name, orig_data):
    if not obj in [change[0] for change in changes]:
        changes.append([obj, [(field, field_name, orig_data)]])
    else:
        for change in changes:
            if obj == change[0]:
                change[1].append((field, field_name, orig_data))
                break
    return changes


def update_object(Model, obj_id, field, obj_data, field_name, orig_data, changes, errors):
    """Update an existing object."""
    try:
        obj = Model.objects.get(pk=obj_id)
        setattr(obj, field, obj_data)
        # if isinstance(Model, Project):
        obj.full_clean(exclude=['primary_location',
                                'primary_organisation',
                                'last_update'])
        # else:
        #     obj.full_clean()
        obj.save(update_fields=[field])
        changes = add_changes(changes, obj, field, field_name, orig_data)

    except Exception as e:
        if field in dict(e).keys():
            errors = add_error(errors, str(dict(e)[field][0]), field_name)
        else:
            errors = add_error(errors, e, field_name)

    return changes, errors


def create_object(Model, kwargs, field, field_name, orig_data, changes, errors, rel_objects,
                  related_obj_id):
    """Create a new object."""
    try:
        obj = Model.objects.create(**kwargs)
        obj.full_clean()
        changes = add_changes(changes, obj, field, field_name, orig_data)
        rel_objects[related_obj_id] = obj.pk

    except Exception as e:
        if field in dict(e).keys():
            errors = add_error(errors, str(dict(e)[field][0]), field_name)
        else:
            errors = add_error(errors, e, field_name)

    return changes, errors, rel_objects


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def project_editor(request, pk=None):
    """The main API call for saving any data entered in the project editor."""

    # Retrieve project and user information, and check user permissions to edit the project
    project = Project.objects.get(pk=pk)
    user = request.user

    if not user.has_perm('rsr.change_project', project):
        return HttpResponseForbidden()

    # Retrieve form data and set default values
    data = request.POST.copy()
    errors, changes, rel_objects = [], [], {}

    # Run through the form data 3 times to be sure that all nested objects will be created.
    #
    # Keys like this are possible: 'rsr_indicatorperiod.period_start.1234_new-0_new-0_new-0'
    # Meaning that there is a new indicator period (the last id is 'new-0'), with a new indicator
    # (second last id is also 'new-0'), with a new result (second id is also 'new-0'), on an
    # existing project (project id is '1234').
    # So this script runs 3 times, the first time it is at least able to connect the result to the
    # project and create a result id, which will be stored in rel_objects. The second time it will
    # definitely be able to create the indicator id, etc.
    #
    # In the end, rel_objects will could look like this:
    # {'rsr_result.1234_new-0': 12, 'rsr_indicator.1234_new-0_new-0': 34, etc.}

    for i in range(3):
        for key in data.keys():
            # The keys in form data are of format "rsr_project.title.1234".
            # Separated by .'s, the data contains the model name, field name and object id list
            model, field, id_list = split_key(key)

            # We pre-process the data first. E.g. dates will be converted to datetime objects
            obj_data, errors = pre_process_data(key, data[key], errors)

            # Retrieve the model
            Model = get_model(model[0], model[1])

            if len(id_list) == 1:
                # Already existing object, update it
                changes, errors = update_object(
                    Model, id_list[0], field, obj_data, key, data[key], changes, errors
                )
                data.pop(key, None)

            else:
                # New object, with potentially a new parent as well
                related_obj_id = model[0] + '_' + model[1] + '.' + '_'.join(id_list)
                parent_id = '_'.join(id_list[:-1])

                if not 'new' in parent_id:
                    # New object, but parent is already existing
                    parent_obj_id = id_list[-2]

                    if related_obj_id not in rel_objects.keys():
                        # Related object has not yet been created (not added to rel_objects dict)
                        kwargs = dict()
                        kwargs[field] = obj_data

                        if Model in RELATED_OBJECTS_MAPPING.keys():
                            # Special mapping needed
                            RelatedModel, related_field = RELATED_OBJECTS_MAPPING[Model]
                            kwargs[related_field] = RelatedModel.objects.get(pk=parent_obj_id)
                        else:
                            # Project is the related object
                            kwargs['project'] = Project.objects.get(pk=parent_obj_id)

                        # Add field data, create new object and add new id to rel_objects dict
                        kwargs[field] = obj_data
                        changes, errors, rel_objects = create_object(
                            Model, kwargs, field, key, data[key], changes, errors, rel_objects,
                            related_obj_id
                        )
                        data.pop(key, None)
                    else:
                        # Object was already created earlier in this script, update object
                        changes, errors = update_object(
                            Model, rel_objects[related_obj_id], field, obj_data, key, data[key],
                            changes, errors
                        )
                        data.pop(key, None)

                else:
                    # New object, and parent is also new according to the key. However, it is
                    # possible that the parent was already created earlier in the script. So we
                    # first check if parent object was already created earlier.

                    RelatedModel, related_field = RELATED_OBJECTS_MAPPING[Model]
                    if RelatedModel._meta.db_table + '.' + parent_id in rel_objects.keys():
                        # Parent object has already been created, fetch new parent object id
                        parent_obj_id = rel_objects[RelatedModel._meta.db_table + '.' + parent_id]

                        if related_obj_id not in rel_objects.keys():
                            # Related object itself has not yet been created yet
                            kwargs = dict()
                            kwargs[field] = obj_data

                            if Model in RELATED_OBJECTS_MAPPING.keys():
                                # Special mapping needed
                                RelatedModel, related_field = RELATED_OBJECTS_MAPPING[Model]
                                kwargs[related_field] = RelatedModel.objects.get(pk=parent_obj_id)
                            else:
                                # Project is the related object
                                kwargs['project'] = Project.objects.get(pk=parent_obj_id)

                            # Add field data, create new object and add new id to rel_objects dict
                            kwargs[field] = obj_data
                            changes, errors, rel_objects = create_object(
                                Model, kwargs, field, key, data[key], changes, errors, rel_objects,
                                related_obj_id
                            )

                            data.pop(key, None)
                        else:
                            # Related object itself has also been created earlier, update it
                            changes, errors = update_object(
                                Model, rel_objects[related_obj_id], field, obj_data, key, data[key],
                                changes, errors
                            )
                            data.pop(key, None)

                    else:
                        # Parent object has not been created yet. We can't create the underlying
                        # object without knowing to which parent it should be linked. Therefore the
                        # key is not popped from the data, and this object will be
                        # saved in one of the next iterations.
                        continue

        if not data:
            # If there are no more keys in data, we have processed all fields and no more iterations
            # are needed.
            break


    #     # Custom fields
    #     elif 'custom-field-' in key:
    #         cf_id = key.split('-', 2)[2]
    #
    #         cf, errors, rel_objects, new_object = check_related_object(
    #             cf_id, 'custom_field', ProjectCustomField, (CUSTOM_FIELD,),
    #             {'project': project}, data, errors, rel_objects
    #         )
    #
    #         errors, changes = process_field(cf, data, CUSTOM_FIELD, errors, changes, cf_id)
    #
    # # Log changes
    # field_changes = log_changes(changes, user, project)

    changes = log_changes(changes, user, project)

    return Response(
        {
            'changes': changes,
            'errors': errors,
            'rel_objects': [rel_objects],
            'need_saving': [data],
        }
    )

@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def project_editor_import_results(request, project_pk=None):
    project = Project.objects.get(pk=project_pk)
    user = request.user

    if not user.is_superuser:
        return HttpResponseForbidden()

    status_code, message = project.import_results()

    return Response({'code': status_code, 'message': message})

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
def project_editor_upload_photo(request, pk=None):
    project = Project.objects.get(pk=pk)
    user = request.user

    new_image = None

    if not user.has_perm('rsr.change_project', project):
        return HttpResponseForbidden()

    errors, changes = process_field(project, request.FILES, CURRENT_IMAGE_FIELD, [], [])
    log_changes(changes, user, project)

    if not errors:
        new_image = get_thumbnail(
            project.current_image, '250x250', format="PNG", upscale=True
        ).url

    return Response(
        {
            'errors': errors,
            'new_image': new_image
        }
    )

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
def project_editor_organisation_logo(request, pk=None):
    org = Organisation.objects.get(pk=pk)
    user = request.user

    if not user.has_perm('rsr.change_organisation', org):
        return HttpResponseForbidden()

    files = request.FILES
    logo = None
    errors = []

    if 'logo' in files.keys():
        errors, changes = process_field(org, files, ORGANISATION_LOGO_FIELD, errors, [])

        if not errors:
            logo = get_thumbnail(
                org.logo, '250x250', format="PNG", upscale=True
            ).url

    return Response(
        {
            'errors': errors,
            'logo': logo,
        }
    )
