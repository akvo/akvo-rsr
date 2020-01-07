# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

from django import template
from django.db import models
from django.db.models import QuerySet
from django.apps import apps

from akvo.rsr.models import ProjectEditorValidation

register = template.Library()
VALIDATION_CACHE = {}


def retrieve_model(obj):
    """
    Retrieves the model from 'obj', which can be either a Django Object or a string.
    """
    return apps.get_model('rsr', obj.split('.')[0]) if isinstance(obj, basestring) else type(obj)


def retrieve_id(obj):
    """
    Retrieves the id from 'obj', which can be either a Django Object or a string.
    """
    if not isinstance(obj, basestring):
        try:
            return obj.id
        except AttributeError:
            return obj.project.id
    else:
        return "{0}_{1}".format(obj.split('.')[1], "new-0")


def get_validations():
    """ Populate the VALIDATION_CACHE and return it."""

    if VALIDATION_CACHE.get('CACHE_VALID', False):
        return VALIDATION_CACHE

    fields = ('validation', 'action', 'validation_set__pk')
    for name, action, validation_set in ProjectEditorValidation.objects.values_list(*fields):
        if action == ProjectEditorValidation.MANDATORY_ACTION:
            action = 'mandatory'
        elif action == ProjectEditorValidation.HIDDEN_ACTION:
            action = 'hidden'

        names = name.split('||')
        for name in names:
            indication = VALIDATION_CACHE.get(name, '')
            indication += ' {0}-{1} '.format(action, validation_set)

            if action == 'mandatory' and len(names) > 1:
                other_names = set(names) - {name}
                for or_name in other_names:
                    indication += 'mandatory-{0}-or-{1} '.format(
                        validation_set, or_name.split('.')[1]
                    )

            VALIDATION_CACHE[name] = indication.strip()

    VALIDATION_CACHE['CACHE_VALID'] = True

    return VALIDATION_CACHE


def invalidate_validation_cache():
    global VALIDATION_CACHE
    VALIDATION_CACHE = {}

    return VALIDATION_CACHE


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


def get_field_value(obj, field):
    if isinstance(obj, basestring):
        return ''
    else:
        field_value = getattr(obj, field)
        if hasattr(field_value, 'pk'):
            return field_value.pk
        elif hasattr(field_value, 'url'):
            return field_value.url
        elif field_value is True:
            return '1'
        elif field_value is False:
            return '2'
        elif field_value in [0, 0.]:
            return '0'
        else:
            return field_value or ''


@register.assignment_tag(takes_context=True)
def date_value_with_default(context, project, obj, field):
    """
    Returns the period_start or period_end value for the IndicatorPeriod of a single period
    hierarchy
    Also return the masquerade_date to be used to show the project start or end date
    respectively instead of the period dates

    If there is no hierarchy or the fields are not the ones above return the field value
    """
    new_period = isinstance(obj, basestring) and obj.split('.')[0] == 'IndicatorPeriod'
    if (context.get('hierarchy_name') and field in ['period_start', 'period_end'] and (
            new_period or obj.__class__.__name__ == 'IndicatorPeriod'
    )):

        # Set masquerade value using project dates
        project_date_field = 0 if field == 'period_start' else 1
        masquerade_date = project.project_dates()[project_date_field]
        # If the project has no date, use the relevant hierarchy date
        if not masquerade_date:
            masquerade_date = context[field]
        return {'value': context[field], 'masquerade_date': masquerade_date,
                'new_period': 'true' if new_period else 'false'}
    else:
        return {'value': get_field_value(obj, field), 'masquerade_date ': None}


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
    return get_field_value(obj, field)


@register.filter
def choices(obj, field):
    """
    Retrieves the choices of a given object's field and the IDs of the choices

    :returns [((1, "Core Activity"), (2, "Sub Activity"), (3, "Lower Sub Activity")), [1, 2, 3]]
    """

    def first_items_list(iterable):
        return [item[0] for item in iterable]

    def values_list_of(model, *fields):
        if isinstance(model, QuerySet):
            objects = model
        else:
            objects = apps.get_model('rsr', model).objects.all()
        return objects.values_list(*fields)

    def choices_and_ids(model, *fields):
        choices_list = values_list_of(model, *fields)
        return [
            choices_list,
            first_items_list(choices_list)
        ]

    model = retrieve_model(obj)
    model_field = model._meta.get_field(field)

    if not isinstance(model_field, models.ForeignKey):
        return [model_field.choices, first_items_list(model_field.choices)]

    elif isinstance(obj, apps.get_model('rsr', 'BudgetItem')) or \
            (isinstance(obj, basestring) and 'BudgetItem' in obj):
        # The ForeignKey field on budget items is the budget item labels
        return choices_and_ids('budgetitemlabel', 'id', 'label')

    elif isinstance(obj, apps.get_model('rsr', 'ProjectLocation')) or \
            (isinstance(obj, basestring) and 'ProjectLocation' in obj):
        # The ForeignKey field on locations is the countries
        return choices_and_ids('country', 'id', 'name')

    elif isinstance(obj, apps.get_model('rsr', 'IndicatorLabel')) or \
            (isinstance(obj, basestring) and 'IndicatorLabel' in obj):

        if isinstance(obj, basestring) and 'IndicatorLabel' in obj:
            # String looking like: u'IndicatorLabel.5577_22634_19197', 5577 is the project ID
            project_pk = obj.split('.')[1].split('_')[0]
            project = apps.get_model('rsr', 'Project').objects.get(pk=project_pk)
        else:
            project = obj.indicator.result.project
        return choices_and_ids(project.indicator_labels(), 'id', 'label')


@register.filter
def manytomany_value(obj):
    """
    Retrieves the id of a given object's field.

    :returns ((1, "Akvo/Chum"), (2, "Yep"))
    """
    return '' if isinstance(obj, basestring) else obj.pk


@register.assignment_tag
def manytomany_choices(obj, field, filter_field=None, filter_value=None):
    """
    Retrieves the choices of a given object's Model. All objects of the Model are returned unless
    filter_field and filter_value are supplied

    :returns ((1, "Akvo/Chum"), (2, "Yep"))
    """
    if filter_field:
        kwargs = {}
        kwargs[filter_field] = filter_value
        return retrieve_model(obj).objects.filter(**kwargs).values_list('id', field)
    else:
        return retrieve_model(obj).objects.all().values_list('id', field)


@register.filter
def mandatory_or_hidden(validations, field):
    """
    Retrieves the mandatory and hidden fields for project editor validations.

    :returns A string of the form mandatory-{validation ID} and/or hidden-{validation_ID}
    """

    if '.' in field:
        # Model fields like 'rsr_relatedproject.12.relation'
        field_name_list = field.split('.')
        new_field_name = '.'.join([field_name_list[0], field_name_list[1]])

    else:
        # Full models like 'rsr_relatedproject'
        new_field_name = field

    indication = get_validations().get(new_field_name, '')

    # XXX: Not sure why exactly 'rsr_project.current_image' needs to be special
    # cased, but this code just retains the behavior of the older code.
    if field == 'rsr_project.current_image':
        indication = ' '.join(
            [x for x in indication.split() if not x.startswith('mandatory')]
        )

    return indication


@register.filter
def can_import_results(user, project):
    """Return True if the user can import results in the given project."""
    return user.can_import_results(project)
