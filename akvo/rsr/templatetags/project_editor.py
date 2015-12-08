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

RSR_MANDATORY = [
    "rsr_project.title",
    "rsr_project.subtitle",
    "rsr_project.status",
    "rsr_project.date_start_planned",
    "rsr_project.current_image",
    "rsr_project.project_plan_summary",
    "rsr_project.goals_overview",
    "rsr_partnership.organisation",
    "rsr_partnership.iati_organisation_role",
    "rsr_partnership.funding_amount",
    "rsr_budgetitem.label",
    "rsr_budgetitem.other_extra",
    "rsr_budgetitem.amount",
    "rsr_projectlocation.latitude",
    "rsr_projectlocation.longitude",
    "rsr_projectlocation.country",
]


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
def obj_id(obj):
    """
    Generates the field's ID for a given model's field.

    :returns "1234" or "1234_new-0"
    """
    return "{0}".format(retrieve_id(obj))


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
def field_model_name(obj):
    """
    Retrieves the field's model name, and makes first character uppercase.

    :returns "Related project"
    """
    return retrieve_model(obj)._meta.verbose_name.capitalize()


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
        # default = retrieve_model(obj)._meta.get_field(field).default
        # return default if default != NOT_PROVIDED else ''
        return ''
    else:
        field_value = getattr(obj, field)
        if hasattr(field_value, 'pk'):
            return field_value.pk
        elif hasattr(field_value, 'url'):
            return field_value.url
        else:
            return field_value or ''


@register.filter
def choices(obj, field):
    """
    Retrieves the choices of a given object's field.

    :returns ((1, "Core Activity"), (2, "Sub Activity"), (3, "Lower Sub Activity"))
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


@register.filter
def manytomany_value(obj):
    """
    Retrieves the id of a given object's field.

    :returns ((1, "Akvo/Chum"), (2, "Yep"))
    """
    return '' if isinstance(obj, basestring) else obj.pk


@register.filter
def manytomany_choices(obj, field):
    """
    Retrieves the choices of a given object's Model. All objects of that Model should be displayed.

    :returns ((1, "Akvo/Chum"), (2, "Yep"))
    """
    return retrieve_model(obj).objects.all().values_list('id', field)


@register.filter
def mandatory(obj, args):
    """
    Retrieves the mandatory fields for project editor validations.
    Args is a comma separated list of field name (e.g. "title") and project id (e.g. "1234").

    :returns "mandatory-rsr mandatory-custom"
    """
    field, project_id = args.split(',')

    model_field = "{0}.{1}".format(retrieve_model(obj)._meta.db_table, field)
    validations = get_model('rsr', 'Project').objects.get(pk=project_id).validations.all()
    mandatory_indications = ''

    for validation_set in validations:
        for rule in validation_set.validations.filter(action=1):
            if model_field in rule.validation:
                mandatory_indications += 'mandatory-{0} '.format(str(validation_set.pk))

    return mandatory_indications
