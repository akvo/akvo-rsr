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
from akvo.rsr.models import (BudgetItemLabel, Country, Keyword,
                             Organisation, Project, OrganisationIndicatorLabel)
from akvo.utils import DjangoModel

from collections import namedtuple

from django.apps import apps
from django.core.exceptions import ValidationError
from django.db.models import (BooleanField, DateField, DecimalField, EmailField,
                              ForeignKey, ManyToManyField, NullBooleanField, PositiveIntegerField,
                              PositiveSmallIntegerField, URLField)
from django.utils.translation import ugettext_lazy as _


def add_error(errors, message, field_name):
    """Appends a new error to the errors list."""
    if isinstance(message, BaseException):
        message = str(message)
    errors.append(
        {'name': field_name,
         'error': message.capitalize()}
    )
    return errors


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
                    e = '%s' % _('It is not allowed to use a comma, use a period to denote '
                                 'decimals.')
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
