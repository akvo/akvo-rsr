# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

from django import template
from django.db import models
from django.db.models import get_model
from django.db.models.fields import NOT_PROVIDED

register = template.Library()


def retrieve_model(obj):
    """
    Retrieves the model from 'obj', which can be either a Django Object or a string.
    """
    return get_model('rsr', obj.split('.')[0]) if isinstance(obj, basestring) else type(obj)


def retrieve_id(obj):
    """
    Retrieves the id from 'obj', which can be either a Django Object or a string.
    """
    if not isinstance(obj, basestring):
        return obj.id
    else:
        return "{0}_{1}".format(obj.split('.')[1], "new-0")

@register.filter
def field_id(obj, field):
    """
    Generates the field's ID for a given model's field.

    :returns "rsr_project.title.1234"
    """
    return "{0}.{1}.{2}".format(
        retrieve_model(obj)._meta.db_table,
        field,
        retrieve_id(obj)
    )

@register.filter
def field_class(obj, field):
    """
    Similar to field_id(), but without the ID and a - to separate the fields. This is needed to
    identify the class of a typeahead field.

    :returns "rsr_relatedproject-related_project"
    """
    return "{0}-{1}".format(
        retrieve_model(obj)._meta.db_table,
        field
    )

@register.filter
def field_class_id(obj, field):
    """
    Similar to field_id(), but without the ID and a - to separate the fields. This is needed to
    identify the class of a typeahead field.

    :returns "rsr_relatedproject-related_project"
    """
    return "{0}-{1}-{2}".format(
        retrieve_model(obj)._meta.db_table,
        field,
        retrieve_id(obj)
    )

@register.filter
def field_name(obj, field):
    """
    Retrieves the field's name for a given model's field, and makes first character uppercase. Also
    taking into account that 'IATI' should always be in uppercase.

    :returns "Project title"
    """
    def check_iati_in_name(name):
        """Checks whether IATI is in the field name and capitalises that part."""
        return name.replace('iati', 'IATI').replace('Iati', 'IATI')

    return check_iati_in_name(retrieve_model(obj)._meta.get_field(field).verbose_name.capitalize())

@register.filter
def help_text(obj, field):
    """
    Retrieves the help text for a given model's field.

    :returns "If you are reporting multiple levels of projects in RSR, you can specify whether
    this is a core, sub, or lower sub activity here."
    """
    return retrieve_model(obj)._meta.get_field(field).help_text

@register.filter
def max_length(obj, field):
    """
    Retrieves the max length of a given model's field.

    :returns 100
    """
    return retrieve_model(obj)._meta.get_field(field).max_length

@register.filter
def value(obj, field):
    """
    Retrieves the value of a given object's field.

    In case the object is a string, the supplied model and field are retrieved, and
    the default value of the field returned, or an empty string if no default is specified.

    In case the object is a Django object, the value of that object is retrieved.
    If the object is a related object (e.g. ForeignKey), the primary key of the related object
    is returned.

    :returns "Project title"
    :returns 1234 (in case of related object)
    """
    if isinstance(obj, basestring):
        default = retrieve_model(obj)._meta.get_field(field).default
        return default if default != NOT_PROVIDED else ''
    else:
        default = getattr(obj, field)
        return default or '' if not hasattr(default, 'pk') else default.pk

@register.filter
def choices(obj, field):
    """
    Retrieves the choices of a given object's field.

    :returns ((1, "Core Activity"), (2, "Sub Activity), (3, "Lower Sub Activity"))
    """
    model_field = retrieve_model(obj)._meta.get_field(field)
    if not isinstance(model_field, models.ForeignKey):
        return model_field.choices
    elif isinstance(obj, get_model('rsr', 'BudgetItem')) or \
            (isinstance(obj, basestring) and 'BudgetItem' in obj):
        # The ForeignKey field on budget items is the budget item labels
        return get_model('rsr', 'budgetitemlabel').objects.all().values_list('id', 'label')
    elif isinstance(obj, get_model('rsr', 'ProjectLocation')) or \
            (isinstance(obj, basestring) and 'ProjectLocation' in obj):
        # The ForeignKey field on locations is the countries
        return get_model('rsr', 'country').objects.all().values_list('id', 'name')
