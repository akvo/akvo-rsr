# -*- coding: utf-8 -*-
"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

import datetime
import decimal

from akvo.rsr.fields import (LatitudeField, LongitudeField,
                             ProjectLimitedTextField, ValidXMLCharField,
                             ValidXMLTextField)
from akvo.rsr.models import (AdministrativeLocation, BudgetItemLabel, Country,
                             CrsAdd, CrsAddOtherFlag, Fss, FssForecast,
                             Indicator, IndicatorLabel,
                             IndicatorPeriod, IndicatorReference,
                             IndicatorPeriodActualLocation,
                             IndicatorPeriodTargetLocation, Keyword,
                             Organisation, Project, OrganisationIndicatorLabel,
                             ProjectDocument, ProjectDocumentCategory, ProjectLocation,
                             Result, Transaction, TransactionSector)
from akvo.rsr.models.result.indicator_dimension import (
    IndicatorDimensionName, IndicatorDimensionValue
)
from akvo.utils import DjangoModel

from collections import namedtuple

from django.apps import apps
from django.contrib.admin.models import LogEntry, CHANGE
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import MultipleObjectsReturned, ValidationError
from django.db.models import (BooleanField, DateField, DecimalField, EmailField,
                              ForeignKey, ManyToManyField, NullBooleanField, PositiveIntegerField,
                              PositiveSmallIntegerField, URLField)
from django.utils.translation import ugettext_lazy as _


RELATED_OBJECTS_MAPPING = {
    # Special mapping for related objects without a 'project' field
    Indicator: (Result, 'result'),
    IndicatorLabel: (Indicator, 'indicator'),
    IndicatorPeriod: (Indicator, 'indicator'),
    IndicatorReference: (Indicator, 'indicator'),
    IndicatorDimensionValue: (IndicatorDimensionName, 'name'),
    IndicatorPeriodActualLocation: (IndicatorPeriod, 'period'),
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
    # NOTE: Add the models to related objects mapping, if they depend on other
    # models. Keyword is only related to the project.
    IndicatorDimensionName: 'dimension_names',
}


def add_error(errors, message, field_name):
    """Appends a new error to the errors list."""
    if isinstance(message, BaseException):
        message = message.message
    errors.append(
        {'name': field_name,
         'error': message.encode('utf8').capitalize()}
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
    'rsr_relatedproject.relation.1234_new-0' and it will return a KeyInfo namedtuple
    """
    KeyParts = namedtuple('KeyParts', 'model, field, ids')

    key_parts = KeyParts._make(key.split('.'))
    return KeyParts._make([
        DjangoModel._make([key_parts.model] + key_parts.model.split('_')),
        key_parts.field,
        key_parts.ids.split('_')
    ])


def pre_process_data(key, data, errors):
    """
    Pre-process the data. Needed to transform some of the form data to usable data in the Django
    models. Returns the processed data and any errors that have occurred so far.
    """
    # Retrieve field information first
    try:
        key_parts = split_key(key)
    except TypeError:
        return data, errors

    Model = apps.get_model(key_parts.model.app, key_parts.model.model_name)
    model_field = Model._meta.get_field(key_parts.field)

    # Text data does not need pre-processing
    if isinstance(model_field, (EmailField, ProjectLimitedTextField, URLField, ValidXMLCharField,
                                ValidXMLTextField)):
        return data.strip(), errors

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
                if 'project' in key_parts.field:
                    return Project.objects.get(pk=int(data)), errors
                if 'organisation' in key_parts.field:
                    return Organisation.objects.get(pk=int(data)), errors
                if key_parts.model.model_name == 'indicatorlabel' and key_parts.field == 'label':
                    return OrganisationIndicatorLabel.objects.get(pk=int(data)), errors
                if key_parts.model.model_name == 'budgetitem' and key_parts.field == 'label':
                    return BudgetItemLabel.objects.get(pk=int(data)), errors
                if 'country' in key_parts.field:
                    return Country.objects.get(pk=int(data)), errors
                return None, errors
            except (Project.DoesNotExist, Organisation.DoesNotExist, BudgetItemLabel.DoesNotExist,
                    Country.DoesNotExist, OrganisationIndicatorLabel.DoesNotExist) as e:
                errors = add_error(errors, e, key)
                return None, errors
        else:
            return None, errors

    # Keywords is the only ManyToManyField
    if isinstance(model_field, ManyToManyField):
        try:
            return Keyword.objects.get(pk=int(data)), errors
        except Exception as e:
            errors = add_error(errors, e, key)
            return None, errors

    return data, errors


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
        'indicatorperiodactuallocation': 'indicator_period_actual_location',
        'indicatorperiodtargetlocation': 'indicator_period_target_location',
        'indicatorreference': 'indicator_reference',
        'indicatordimension': 'indicator_dimension',
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

    for key in rel_objects:
        # First retrieve the unicode and create a new dict including the unicode
        db_table, old_key = key.split('.')
        Model = apps.get_model(db_table.split('_')[0], db_table.split('_')[1])
        unicode = Model.objects.get(pk=int(rel_objects[key])).__unicode__()
        new_dict_response = {
            'new_id': rel_objects[key],
            'unicode': unicode
        }

        # remove the 'rsr_' part (e.g. a key can be 'rsr_relatedproject') and look up the db_table
        # in the mapping, or take the default otherwise
        db_table = db_table[4:]
        if db_table in model_to_api:
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
    if obj not in [change[0] for change in changes]:
        # Object not yet in changes list
        changes.append([obj, [[field, field_name, orig_data]]])
    else:
        # Object in changes list, look it up and append the new changes
        for change in changes:
            if obj == change[0]:
                change[1].append([field, field_name, orig_data])
                break
    return changes


def handle_validation_error(e, fields, field_names, errors):
    validation_error_dict = dict(e)
    for field, field_name in zip(fields, field_names):
        if field in validation_error_dict:
            # Since we save the object per field, display the (first) error
            # of this field on the field itself.
            errors = add_error(errors, str(validation_error_dict[field][0]), field_name)
            validation_error_dict.pop(field)

    if validation_error_dict:
        for key, value in validation_error_dict.items():
            # Somewhere else in the model a validation error occurred (or a
            # combination of fields). We display this nonetheless and do
            # not save the field.
            field, field_name = fields[0], field_names[0]
            # Guess the correct field_name and display the error
            actual_field_name = field_name.replace('.{}.'.format(field), '.{}.'.format(key))
            errors = add_error(errors, str(value[0]), actual_field_name)


def update_object(Model, obj_id, fields, field_names, values, changes, errors,
                  rel_objects, related_obj_id):
    """Update an existing object.

    Take a list of fields and corresponding values, and update the object. The
    following steps are performed to do the update:

    1. Try to retrieve the object.

    2. Pre-process the data, ignore fields that have obviously incorrect data
    (wrong type and cannot be typecasted, etc.)

    3. Set the attributes corresponding to the fields with the supplied values

    4. Perform object and field validations

    5. Return the changes and errors

    """

    # Try to retrieve object with specified ID
    try:
        # Retrieve object and set new value of field
        obj = Model.objects.get(pk=int(obj_id))
    except (Model.DoesNotExist, ValueError) as e:
        # If object does not exist or 'obj_id' is not an integer, add an error
        # and do not process the object
        for field_name in field_names:
            errors = add_error(errors, str(e), field_name)
        return changes, errors, rel_objects

    # Set all the attributes with specified values
    for i, (field, field_name, value) in enumerate(zip(fields, field_names, values)):
        obj_data, errors = pre_process_data(field_name, value, errors)
        if field_name in [error['name'] for error in errors]:
            fields.pop(i)
            continue
        setattr(obj, field, obj_data)

    try:
        # The object has been retrieved, perform validations
        obj.full_clean(exclude=['primary_location',
                                'primary_organisation',
                                'last_update'])
    except ValidationError as e:
        handle_validation_error(e, fields, field_names, errors)
    except Exception as e:
        for field_name in field_names:
            # Just in case any other error will occur, this will also be
            # displayed underneath the field in the project editor.
            errors = add_error(errors, str(e), field_name)
    else:
        update_fields = fields
        # if the object has a last_modified_at field, include it in the update
        if hasattr(obj, 'last_modified_at'):
            update_fields = fields + ['last_modified_at']

        # No validation errors. Save the field and append the changes to the
        # changes list. In case of a non-Project object, add the object to the
        # related objects list, so that the ID will be replaced (in case of a
        # new object) and the unicode will be replaced.
        obj.save(update_fields=update_fields)
        for field, field_name, value in zip(fields, field_names, values):
            changes = add_changes(changes, obj, field, field_name, value)

        if not (related_obj_id in rel_objects or isinstance(obj, Project)):
            rel_objects[related_obj_id] = obj.pk

    return changes, errors, rel_objects


def update_m2m_object(project, Model, obj_id, field, orig_data, field_name, changes, errors,
                      rel_objects, related_obj_id):

    m2m_relation = getattr(project, MANY_TO_MANY_FIELDS[Model])

    # We pre-process the data first. E.g. dates will be converted to datetime objects
    obj_data, errors = pre_process_data(field_name, orig_data, errors)
    if field_name in [error['name'] for error in errors]:
        return

    try:
        m2m_object = Model.objects.get(pk=int(obj_data))
        if obj_id is not None:
            # If there already was an appointed object in the many to many relation,
            # remove the old object first
            old_m2m_object = Model.objects.get(pk=int(obj_id))
            if old_m2m_object in m2m_relation.all():
                m2m_relation.remove(old_m2m_object)
        # Add the new many to many object to the project
        m2m_relation.add(m2m_object)
        changes = add_changes(changes, m2m_object, field, field_name, obj_data)
        if related_obj_id not in rel_objects:
            rel_objects[related_obj_id] = obj_data

    except Model.DoesNotExist as e:
        errors = add_error(errors, str(e), field_name)


def create_object(Model, kwargs, fields, field_names, values, changes, errors, rel_objects,
                  related_obj_id):
    """Create a new object.

    Either an error can occur while creating the object, or during the
    full_clean() function. In any case, catch the error and display it in the
    project editor.

    """
    try:
        # Retrieve the object with the new value and perform validations.
        obj = Model.objects.create(**kwargs)
        obj.full_clean()
    except ValidationError as e:
        handle_validation_error(e, fields, field_names, errors)
        obj.delete()
    except MultipleObjectsReturned:
        # Multiple reporting organisations are not allowed and will raise a MultipleObjectsReturned
        # exception. In this case, display a nice error message and delete the created partnership.
        for field_name in field_names:
            message = unicode(_(u'There can be only one reporting organisation'))
            # FIXME: Not sure what the field name should be here...
            errors = add_error(errors, str(message), field_name)
        obj.delete()
    except Exception as e:
        # Just in case any other error will occur, this will also be displayed
        # underneath the field in the project editor.
        for field_name in field_names:
            errors = add_error(errors, str(e), field_name)
    else:
        # No validation errors. Save the field and append the changes to the changes list.
        # Add the object to the related objects list, so that the ID and unicode will be replaced.
        for field, field_name, value in zip(fields, field_names, values):
            changes = add_changes(changes, obj, field, field_name, value)
        rel_objects[related_obj_id] = obj.pk

    return changes, errors, rel_objects


def create_related_object(parent_obj_id, Model, fields, field_names, values, changes, errors,
                          rel_objects, related_obj_id):
    """Create a related object

    Create a related object with all the values for all the fields. It is
    called only once per object for each save in the project editor.

    Related objects are created "fully", and never need to be updated post
    creation, in a single project editor save.

    """

    # Related object has not yet been created (not added to rel_objects dict)
    kwargs = dict()

    if Model in RELATED_OBJECTS_MAPPING:
        # Special mapping needed
        RelatedModel, related_field = RELATED_OBJECTS_MAPPING[Model]
        kwargs[related_field] = RelatedModel.objects.get(pk=parent_obj_id)
    else:
        # Project is the related object
        kwargs['project'] = Project.objects.get(pk=parent_obj_id)

    # Set all the attributes with specified values
    for field, field_name, value in zip(fields, field_names, values):
        obj_data, errors = pre_process_data(field_name, value, errors)
        if field_name in [error['name'] for error in errors]:
            continue
        # Add field data, create new object and add new id to rel_objects dict
        kwargs[field] = obj_data

    changes, errors, rel_objects = create_object(
        Model, kwargs, fields, field_names, values, changes, errors, rel_objects,
        related_obj_id
    )

    return changes, errors, rel_objects


def group_data_by_objects(data):
    """Group form data by objects (based on model and id)"""
    grouped_data = {}
    for key, value in data.items():
        key_parts = split_key(key)
        group_key = (key_parts.model.model_name,) + tuple(key_parts.ids)
        grouped_data.setdefault(group_key, []).append((key, value, key_parts))
    return grouped_data


def group_get_all_fields(grouped_data, key_parts):
    group_key = (key_parts.model.model_name,) + tuple(key_parts.ids)
    update_data = grouped_data[group_key]
    keys = [key for key, _, _ in update_data]
    values = [value for _, value, _ in update_data]
    fields = [key_part.field for _, _, key_part in update_data]
    return fields, values, keys


def sort_keys(x):
    """Compute a level at which the model corresponding to the key occurs.

    This function is used to sort keys in the data such that the objects higher
    in the hierarchy appear before the objects that depend on them.

    For example, Project -> Result -> Indicator, IndicatorPeriod

    The level is computed based on the number of steps we can take in the
    RELATED_OBJECTS_MAPPING hierarchy before we reach the Project.

    """
    key_parts = split_key(x)
    Model = apps.get_model(key_parts.model.app, key_parts.model.model_name)
    level = 1
    while Model in RELATED_OBJECTS_MAPPING:
        level += 1
        Model, _ = RELATED_OBJECTS_MAPPING[Model]

    if Model in MANY_TO_MANY_FIELDS:
        # Always create objects in the many to many fields at the very end!
        level += 10
    elif Model != Project:
        level += 1

    return (level, key_parts.ids)


def get_parent_model_id(Model, parent_id, rel_objects, ParentModel=None):
    if ParentModel is None:
        ParentModel, _ = RELATED_OBJECTS_MAPPING[Model]
    parent_obj_rel_obj_key = ParentModel._meta.db_table + '.' + parent_id
    if parent_obj_rel_obj_key in rel_objects:
        parent_obj_id = rel_objects[parent_obj_rel_obj_key]
    else:
        parent_obj_id = None
    return parent_obj_id


def create_or_update_objects_from_data(project, data):
    errors, changes, rel_objects = [], [], {}

    # Keys like this are possible:
    # 'rsr_indicatorperiod.period_start.1234_new-0_new-0_new-0' Meaning that
    # there is a new indicator period (the last id is 'new-0'), with a new
    # indicator (second last id is also 'new-0'), with a new result (second id
    # is also 'new-0'), on an existing project (project id is '1234'). We sort
    # the keys in such a way that the result appears before the indicator which
    # appears before the indicatorperiod. This ensures that objects higher in
    # the hierarchy, which lower objects depend on, are created first.

    grouped_data = group_data_by_objects(data)
    sorted_keys = sorted(data.keys(), key=sort_keys)

    for key in sorted_keys:

        # When saving all fields on an object, a bunch of fields are
        # removed together. This may cause some keys to not be present,
        # when iterating over the sorted keys.
        if key not in data:
            continue

        # The keys in form data are of format "rsr_project.title.1234".
        # Separated by .'s, the data contains the model name, field name and object id list
        key_parts = split_key(key)

        # Retrieve the model and related object ID (e.g. rsr_project.1234)
        Model = apps.get_model(key_parts.model.app, key_parts.model.model_name)
        related_obj_id = ''.join(
            [key_parts.model.table_name, '.', '_'.join(key_parts.ids)]
        )

        if Model == Keyword:
            # This field is a many to many field, which need special handling
            obj_id = None if len(key_parts.ids) != 1 else key_parts.ids[0]
            update_m2m_object(
                project, Model, obj_id, key_parts.field, data[key], key, changes, errors,
                rel_objects, related_obj_id
            )
            data.pop(key, None)

        elif Model == IndicatorDimensionName and len(key_parts.ids) > 2:
            obj_id = None if len(key_parts.ids) != 1 else key_parts.ids[0]
            indicator_id = key_parts.ids[2]
            if indicator_id.startswith('new'):
                parent_id = '_'.join(key_parts.ids[:-1])
                indicator_id = get_parent_model_id(Model, parent_id, rel_objects, Indicator)
            indicator = Indicator.objects.get(pk=int(indicator_id))
            update_m2m_object(
                indicator, Model, obj_id, key_parts.field, data[key], key, changes, errors,
                rel_objects, related_obj_id
            )
            data.pop(key, None)

        elif len(key_parts.ids) == 1:
            # Already existing object, update it
            fields, values, keys = group_get_all_fields(grouped_data, key_parts)
            changes, errors, rel_objects = update_object(
                Model, key_parts.ids[0], fields, keys, values, changes, errors, rel_objects,
                related_obj_id
            )
            for key in keys:
                data.pop(key, None)

        else:
            # New object, with potentially a new parent as well
            parent_id = '_'.join(key_parts.ids[:-1])

            if 'new' not in parent_id:
                # New object, but parent is already existing
                parent_obj_id = key_parts.ids[-2]

            else:
                # New object, and parent are new according to the key.
                # However, it is possible that the parent was already
                # created earlier in the script. So we also check if
                # the parent object was already created earlier.
                parent_obj_id = get_parent_model_id(Model, parent_id, rel_objects)

            if parent_obj_id is not None:
                fields, values, keys = group_get_all_fields(grouped_data, key_parts)
                create_related_object(
                    parent_obj_id, Model, fields, keys, values, changes, errors, rel_objects,
                    related_obj_id
                )
                for key in keys:
                    data.pop(key, None)

            else:
                # Parent object has not been created yet.
                # We should never get to this state!
                raise RuntimeError('There was a problem walking the hierarchy of objects')

    return errors, changes, rel_objects
