# -*- coding: utf-8 -*-
"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

import datetime
import decimal
import json

from akvo.rsr.fields import (LatitudeField, LongitudeField, ProjectLimitedTextField,
                             ValidXMLCharField, ValidXMLTextField)
from akvo.rsr.models import (AdministrativeLocation, BudgetItemLabel, Country, CrsAdd,
                             CrsAddOtherFlag, Fss, FssForecast, Indicator, IndicatorPeriod,
                             IndicatorReference, IndicatorPeriodActualDimension,
                             IndicatorPeriodActualLocation, IndicatorPeriodTargetDimension,
                             IndicatorPeriodTargetLocation, Keyword, Organisation, Project,
                             ProjectDocument, ProjectDocumentCategory, ProjectEditorValidationSet,
                             ProjectLocation, Result, Transaction, TransactionSector)

from django.contrib.admin.models import LogEntry, CHANGE, ADDITION
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import MultipleObjectsReturned, ValidationError
from django.db import transaction
from django.db.models import (get_model, BooleanField, DateField, DecimalField, EmailField,
                              ForeignKey, ManyToManyField, NullBooleanField, PositiveIntegerField,
                              PositiveSmallIntegerField, URLField)
from django.http import HttpResponseForbidden
from django.utils.translation import ugettext_lazy as _

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from sorl.thumbnail import get_thumbnail


RELATED_OBJECTS_MAPPING = {
    # Special mapping for related objects without a 'project' field
    Indicator: (Result, 'result'),
    IndicatorPeriod: (Indicator, 'indicator'),
    IndicatorReference: (Indicator, 'indicator'),
    IndicatorPeriodActualDimension: (IndicatorPeriod, 'period'),
    IndicatorPeriodActualLocation: (IndicatorPeriod, 'period'),
    IndicatorPeriodTargetDimension: (IndicatorPeriod, 'period'),
    IndicatorPeriodTargetLocation: (IndicatorPeriod, 'period'),
    TransactionSector: (Transaction, 'transaction'),
    ProjectLocation: (Project, 'location_target'),
    AdministrativeLocation: (ProjectLocation, 'location'),
    ProjectDocumentCategory: (ProjectDocument, 'document'),
    CrsAddOtherFlag: (CrsAdd, 'crs'),
    FssForecast: (Fss, 'fss'),
}

MANY_TO_MANY_FIELDS = {
    # Special mapping for many to many fields
    Keyword: 'keywords',
}


def add_error(errors, message, field_name):
    """Appends a new error to the errors list."""
    errors.append(
        {'name': field_name,
         'error': str(message).capitalize()}
    )
    return errors


def log_changes(changes, user, project):
    """Logs all changes to Django's LogEntry model."""
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


def convert_related_objects(rel_objects):
    """
    Converts related objects (db_table without 'rsr_') to the API endpoint so that it can be used
    in the template.
    """

    model_to_api = {
        'relatedproject': 'related_project',
        'humanitarianscope': 'humanitarian_scope',
        'projectcontact': 'project_contact',
        'indicatorperiod': 'indicator_period',
        'indicatorperiodactualdimension': 'indicator_period_actual_dimension',
        'indicatorperiodactuallocation': 'indicator_period_actual_location',
        'indicatorperiodtargetdimension': 'indicator_period_target_dimension',
        'indicatorperiodtargetlocation': 'indicator_period_target_location',
        'indicatorreference': 'indicator_reference',
        'projectcondition': 'project_condition',
        'budgetitem': 'budget_item',
        'countrybudgetitem': 'country_budget_item',
        'transactionsector': 'transaction_sector',
        'planneddisbursement': 'planned_disbursement',
        'projectlocation': 'project_location',
        'administrativelocation': 'administrative_location',
        'recipientcountry': 'recipient_country',
        'recipientregion': 'recipient_region',
        'policymarker': 'policy_marker',
        'projectdocument': 'project_document',
        'projectdocumentcategory': 'project_document_category',
        'crsadd': 'crs_add',
        'crsaddotherflag': 'crsadd_other_flag',
        'fssforecast': 'fss_forecast',
        'legacydata': 'legacy_data',
    }

    new_rel_objects = []

    for key in rel_objects.keys():
        # First retrieve the unicode and create a new dict including the unicode
        db_table, old_key = key.split('.')
        Model = get_model(db_table.split('_')[0], db_table.split('_')[1])
        unicode = Model.objects.get(pk=int(rel_objects[key])).__unicode__()
        new_dict_response = {
            'new_id': rel_objects[key],
            'unicode': unicode
        }

        # remove the 'rsr_' part (e.g. a key can be 'rsr_relatedproject') and look up the db_table
        # in the mapping, or take the default otherwise
        db_table = db_table[4:]
        if db_table in model_to_api.keys():
            new_dict_response['old_id'] = '{0}.{1}'.format(model_to_api[db_table], old_key)
        else:
            new_dict_response['old_id'] = '{0}.{1}'.format(db_table, old_key)

        new_rel_objects.append(new_dict_response)

    return new_rel_objects


def add_changes(changes, obj, field, field_name, orig_data):
    """
    Add the changes to the changes list in the required format. The changes list contains a list
    per related object, so we need to check if the object is already in the changes list and
    append the new changes to it.
    """
    if not obj in [change[0] for change in changes]:
        # Object not yet in changes list
        changes.append([obj, [[field, field_name, orig_data]]])
    else:
        # Object in changes list, look it up and append the new changes
        for change in changes:
            if obj == change[0]:
                change[1].append([field, field_name, orig_data])
                break
    return changes


def update_object(Model, obj_id, field, obj_data, field_name, orig_data, changes, errors,
                  rel_objects, related_obj_id):
    """
    Update an existing object. First tries to retrieve the object and set the new value of the
    field, then it performs object and field validations and finally returns the changes or errors
    of this process.
    """
    try:
        # Retrieve object and set new value of field
        obj = Model.objects.get(pk=int(obj_id))
        setattr(obj, field, obj_data)
    except (Model.DoesNotExist, ValueError) as e:
        # If object does not exist or 'obj_id' is not an integer, add an error and do not process
        # the object
        errors = add_error(errors, str(e), field_name)
        return changes, errors, rel_objects

    try:
        # The object has been retrieved, perform validations
        obj.full_clean(exclude=['primary_location',
                                'primary_organisation',
                                'last_update'])
    except ValidationError as e:
        if field in dict(e).keys():
            # Since we save the object per field, display the (first) error of this field on the
            # field itself.
            errors = add_error(errors, str(dict(e)[field][0]), field_name)
        else:
            # Somewhere else in the model a validation error occurred (or a combination of fields).
            # We display this nonetheless and do not save the field.
            errors = add_error(errors, str(e), field_name)
    except Exception as e:
        # Just in case any other error will occur, this will also be displayed underneath the field
        # in the project editor.
        errors = add_error(errors, str(e), field_name)
    else:
        # No validation errors. Save the field and append the changes to the changes list.
        # In case of a non-Project object, add the object to the related objects list, so that the
        # ID will be replaced (in case of a new object) and the unicode will be replaced.
        obj.save(update_fields=[field])
        changes = add_changes(changes, obj, field, field_name, orig_data)
        if not (related_obj_id in rel_objects.keys() or isinstance(obj, Project)):
            rel_objects[related_obj_id] = obj.pk
    finally:
        return changes, errors, rel_objects


def create_object(Model, kwargs, field, field_name, orig_data, changes, errors, rel_objects,
                  related_obj_id):
    """
    Create a new object. Either an error can occur while creating the object, or during the
    full_clean() function. In any case, catch the error and display it in the project editor.
    """
    try:
        # Retrieve the object with the new value and perform validations.
        obj = Model.objects.create(**kwargs)
        obj.full_clean()
    except ValidationError as e:
        if field in dict(e).keys():
            # Since we save the object per field, display the (first) error of this field on the
            # field itself.
            errors = add_error(errors, str(dict(e)[field][0]), field_name)
        else:
            # Somewhere else in the model a validation error occurred (or a combination of fields).
            # We display this nonetheless and do not save the field.
            errors = add_error(errors, str(e), field_name)
        obj.delete()
    except MultipleObjectsReturned:
        # Multiple reporting organisations are not allowed and will raise a MultipleObjectsReturned
        # exception. In this case, display a nice error message and delete the created partnership.
        message = unicode(_(u'There can be only one reporting organisation'))
        errors = add_error(errors, str(message), field_name)
        obj.delete()
    except Exception as e:
        # Just in case any other error will occur, this will also be displayed underneath the field
        # in the project editor.
        errors = add_error(errors, str(e), field_name)
    else:
        # No validation errors. Save the field and append the changes to the changes list.
        # Add the object to the related objects list, so that the ID and unicode will be replaced.
        changes = add_changes(changes, obj, field, field_name, orig_data)
        rel_objects[related_obj_id] = obj.pk
    finally:
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

    # Keys like this are possible: 'rsr_indicatorperiod.period_start.1234_new-0_new-0_new-0'
    # Meaning that there is a new indicator period (the last id is 'new-0'), with a new indicator
    # (second last id is also 'new-0'), with a new result (second id is also 'new-0'), on an
    # existing project (project id is '1234').

    # This script runs 4 times if needed, the first time it is at least able to connect the result
    # to the project and create a result id, which will be stored in rel_objects. The second time
    # it will definitely be able to create the indicator id, etc.

    for i in range(4):
        for key in sorted(data.keys()):
            # The keys in form data are of format "rsr_project.title.1234".
            # Separated by .'s, the data contains the model name, field name and object id list
            model, field, id_list = split_key(key)

            # We pre-process the data first. E.g. dates will be converted to datetime objects
            obj_data, errors = pre_process_data(key, data[key], errors)
            if key in [error['name'] for error in errors]:
                data.pop(key, None)
                continue

            # Retrieve the model and related object ID (e.g. rsr_project.1234)
            Model = get_model(model[0], model[1])
            related_obj_id = model[0] + '_' + model[1] + '.' + '_'.join(id_list)

            if Model in MANY_TO_MANY_FIELDS.keys():
                # This field is a many to many field, which need special handling
                m2m_relation = getattr(project, MANY_TO_MANY_FIELDS[Model])
                try:
                    m2m_object = Model.objects.get(pk=int(obj_data))
                    if len(id_list) == 1:
                        # If there already was an appointed object in the many to many relation,
                        # remove the old object first
                        old_m2m_object = Model.objects.get(pk=int(id_list[0]))
                        if old_m2m_object in m2m_relation.all():
                            m2m_relation.remove(old_m2m_object)
                    # Add the new many to many object to the project
                    m2m_relation.add(m2m_object)
                    changes = add_changes(changes, m2m_object, field, key, obj_data)
                    if not related_obj_id in rel_objects.keys():
                        rel_objects[related_obj_id] = obj_data
                except Model.DoesNotExist as e:
                    errors = add_error(errors, str(e), key)
                data.pop(key, None)

            elif len(id_list) == 1:
                # Already existing object, update it
                changes, errors, rel_objects = update_object(
                    Model, id_list[0], field, obj_data, key, data[key], changes, errors,
                    rel_objects, related_obj_id
                )
                data.pop(key, None)

            else:
                # New object, with potentially a new parent as well
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
                        changes, errors, rel_objects = update_object(
                            Model, rel_objects[related_obj_id], field, obj_data, key, data[key],
                            changes, errors, rel_objects, related_obj_id
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
                            changes, errors, rel_objects = update_object(
                                Model, rel_objects[related_obj_id], field, obj_data, key, data[key],
                                changes, errors, rel_objects, related_obj_id
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

    # Update the IATI checks for every save in the editor.
    updated_project = Project.objects.get(pk=pk)
    updated_project.update_iati_checks()

    # Ensure errors are properly encoded
    for error in errors:
        if 'location' in error['name'] and 'Invalid literal' in error['error']:
            error['error'] = 'Only decimal values are accepted.'
        else:
            error['error'] = unicode(error['error'], errors='ignore')

    return Response(
        {
            'changes': log_changes(changes, user, project),
            'errors': errors,
            'rel_objects': convert_related_objects(rel_objects),
            'need_saving': [data],
        }
    )


@api_view(['POST'])
@permission_classes((IsAuthenticated,))
@transaction.atomic
def project_editor_reorder_items(request, project_pk=None):
    """API call to reorder results or indicators"""

    errors, item_list, item_selected, swap_id = [], [], None, -1

    item_type = request.POST.get('item_type', False)
    item_id = request.POST.get('item_id', False)
    item_direction = request.POST.get('item_direction', False)

    if item_type == 'result':
        item_selected = Result.objects.get(id=item_id)
        item_list = Result.objects.filter(project_id=project_pk)
    elif item_type == 'indicator':
        item_selected = Indicator.objects.get(id=item_id)
        item_list = Indicator.objects.filter(result_id=item_selected.result_id)
    else:
        errors += ['Invalid item type']

    if not errors:
        # assign order if it doesn't already exist or is messed up
        if item_list and set(item_list.values_list('order', flat=True)) != set(range(item_list.count())):
            for i, item in enumerate(item_list):
                item.order = i
                item.save()

        if item_type == 'result':
            item_original_order = Result.objects.get(id=item_id).order
        else:
            item_original_order = Indicator.objects.get(id=item_id).order

        if item_direction == 'up' and not item_original_order < 1:
            item_swap = item_list.get(order=item_original_order - 1)
            item_swap.order = item_original_order
            item_swap.save()

            swap_id = item_swap.id

            if item_selected:
                item_selected.order = item_original_order-1
                item_selected.save()

        elif item_direction == 'down' and not item_original_order >= len(item_list) - 1:
            item_swap = item_list.get(order=item_original_order + 1)
            item_swap.order = item_original_order
            item_swap.save()

            swap_id = item_swap.id

            if item_selected:
                item_selected.order = item_original_order + 1
                item_selected.save()

        else:
            errors += ['Unable to reorder the selected item, it may already be at top/bottom of '
                       'list.']

    return Response(
        {
            'errors': errors,
            'swap_id': swap_id,
        }
    )

@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def project_editor_default_periods(request, project_pk=None):
    """API call to set default indicator periods"""

    errors = []

    # FIXME: We are doing a get using indicator_id, cannot have default as False
    indicator_id = request.POST.get('indicator_id', False)
    copy = json.loads(request.POST.get('copy', 'false'))
    set_default = json.loads(request.POST.get('set_default', 'false'))

    default_indicator = Indicator.objects.get(id=indicator_id)

    if set_default:
        default_indicator.default_periods = True
        default_indicator.save()

        # copy to existing indicators if desired
        if copy:
            project = Project.objects.get(pk=project_pk)
            results = Result.objects.filter(project_id=project)
            indicators = Indicator.objects.filter(result_id__in=results)

            default_periods = IndicatorPeriod.objects.filter(indicator_id=default_indicator)

            for indicator in indicators:
                if indicator != default_indicator:
                    for period in default_periods:
                        period.pk = None

                        # Blank all values except id and locked status
                        period.target_value = ''
                        period.target_comment = ''
                        period.actual_value = ''
                        period.actual_comment = ''

                        period.indicator_id = indicator.id
                        period.save()

    else:
        default_indicator.default_periods = False
        default_indicator.save()


    return Response(
        {
            'errors': errors,
        }
    )

@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def project_editor_upload_file(request, pk=None):
    """Special API call for directly uploading a file."""

    project = Project.objects.get(pk=pk)
    user = request.user

    errors, changes, rel_objects, new_file_url = [], [], {}, ''
    field_id = request.POST.copy()['field_id']
    upload_file = request.data['file']

    if not user.has_perm('rsr.change_project', project):
        return HttpResponseForbidden()

    # Retrieve field information first
    model, field, id_list = split_key(field_id)

    # Retrieve the model and related object ID (e.g. rsr_projectdocument.1234_new-0)
    Model = get_model(model[0], model[1])
    related_obj_id = model[0] + '_' + model[1] + '.' + '_'.join(id_list)

    if len(id_list) == 1:
        # Either the photo or an already existing project document
        changes, errors, rel_objects = update_object(
            Model, id_list[0], field, upload_file, field_id, '', changes, errors,
            rel_objects, related_obj_id
        )
    else:
        # A non-existing project document
        kwargs = dict()
        kwargs[field] = upload_file
        kwargs['project'] = project

        # Add field data, create new object and add new id to rel_objects dict
        changes, errors, rel_objects = create_object(
            Model, kwargs, field, field_id, '', changes, errors, rel_objects,
            related_obj_id
        )

    for change in changes:
        # If the file is successfully saved, replace the value with the URL of the new file
        obj = change[0]
        field = change[1][0][0]
        if isinstance(obj, Project):
            change[1][0][2] = get_thumbnail(
                getattr(obj, field), '250x250', format="PNG", upscale=True
            ).url
        else:
            change[1][0][2] = getattr(getattr(obj, field), 'url')

    return Response(
        {
            'errors': errors,
            'changes': log_changes(changes, user, project),
            'rel_objects': convert_related_objects(rel_objects),
        }
    )


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def project_editor_import_results(request, project_pk=None):
    project = Project.objects.get(pk=project_pk)
    user = request.user

    if not (user.is_superuser or user.can_import_results()):
        return HttpResponseForbidden()

    status_code, message = project.import_results()

    return Response({'code': status_code, 'message': message})


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def project_editor_add_validation(request, project_pk=None, validation_pk=None):
    project = Project.objects.get(pk=project_pk)
    validation_set = ProjectEditorValidationSet.objects.get(pk=validation_pk)
    user = request.user

    if not user.has_perm('rsr.change_project', project):
        return HttpResponseForbidden()

    if not validation_set in project.validations.all():
        project.validations.add(validation_set)

        change_message = u'%s %s.' % (_(u'Project editor, added: validation set'),
                                      validation_set.__unicode__())

        LogEntry.objects.log_action(
            user_id=user.pk,
            content_type_id=ContentType.objects.get_for_model(project).pk,
            object_id=project.pk,
            object_repr=project.__unicode__(),
            action_flag=CHANGE,
            change_message=change_message
        )

    return Response({})


@api_view(['DELETE'])
@permission_classes((IsAuthenticated, ))
def project_editor_remove_validation(request, project_pk=None, validation_pk=None):
    project = Project.objects.get(pk=project_pk)
    validation_set = ProjectEditorValidationSet.objects.get(pk=validation_pk)
    user = request.user

    if not user.has_perm('rsr.change_project', project):
        return HttpResponseForbidden()

    if validation_set in project.validations.all():
        project.validations.remove(validation_set)

        change_message = u'%s %s.' % (_(u'Project editor, deleted: validation set'),
                                      validation_set.__unicode__())

        LogEntry.objects.log_action(
            user_id=user.pk,
            content_type_id=ContentType.objects.get_for_model(project).pk,
            object_id=project.pk,
            object_repr=project.__unicode__(),
            action_flag=CHANGE,
            change_message=change_message
        )

    return Response({})


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

    data = request.data
    errors, changes, rel_objects = [], [], {}

    if 'logo' in data.keys():
        changes, errors, rel_objects = update_object(
            Organisation, pk, 'logo', data['logo'], '', '', changes, errors,
            rel_objects, 'rsr_organisation.' + str(pk)
        )

    return Response({'errors': errors})


@api_view(['POST'])
@permission_classes((IsAuthenticated, ))
def log_project_addition(request, project_pk=None):
    project = Project.objects.get(pk=project_pk)
    user = request.user

    if not user.has_perm('rsr.change_project', project):
        return HttpResponseForbidden()

    message = u'%s.' % (_(u'Project editor, added project'))

    LogEntry.objects.log_action(
        user_id=user.pk,
        content_type_id=ContentType.objects.get_for_model(project).pk,
        object_id=project.pk,
        object_repr=project.__unicode__(),
        action_flag=ADDITION,
        change_message=message
    )

    # Perform IATI checks after a project has been created.
    project.update_iati_checks()

    content = {'log_entry': 'added successfully'}
    return Response(content, status=status.HTTP_201_CREATED)
