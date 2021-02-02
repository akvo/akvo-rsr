# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from decimal import Decimal

from django.apps import apps
from akvo.utils import rsr_image_path

PERCENTAGE_MEASURE = '2'
QUANTITATIVE = 1
QUALITATIVE = 2


def calculate_percentage(numerator, denominator):
    denominator = Decimal(denominator)
    if denominator == 0:
        return 0
    return round(Decimal(numerator) * 100 / Decimal(denominator), 2)


def image_path(instance, file_name):
    """
    Create a path like 'db/indicator_period/<period.id>/data_photo/<data.id>/image_name.ext'.

    :param instance; an IndicatorPeriodData instance
    :param file_name; the name of the file that is to be stored
    """
    path = 'db/indicator_period/%d/data_photo/%%(instance_pk)s/%%(file_name)s' % instance.period.pk
    return rsr_image_path(instance, file_name, path)


def file_path(instance, file_name):
    """
    Create a path like 'db/indicator_period/<period.id>/data_file/<data.id>/image_name.ext'.

    :param instance; an IndicatorPeriodData instance
    :param file_name; the name of the file that is to be stored
    """
    path = 'db/indicator_period/%d/data_file/%%(instance_pk)s/%%(file_name)s' % instance.period.pk
    return rsr_image_path(instance, file_name, path)


class MultipleUpdateError(Exception):
    pass


def purge_dimension_name_relations(dimension_name):
    for dv in dimension_name.dimension_values.all():
        purge_dimension_value_relations(dv)
        dv.delete()


def purge_dimension_value_relations(dimension_value):
    Disaggregation = apps.get_model('rsr', 'Disaggregation')
    DisaggregationTarget = apps.get_model('rsr', 'DisaggregationTarget')
    IndicatorDisaggregationTarget = apps.get_model('rsr', 'IndicatorDisaggregationTarget')

    hierarchy = get_dimension_value_hierarchy_flatlist(dimension_value)
    disaggregations = Disaggregation.objects.filter(dimension_value__in=hierarchy)
    disaggregation_targets = DisaggregationTarget.objects.filter(dimension_value__in=hierarchy)
    indicator_disaggregation_targets = IndicatorDisaggregationTarget.objects.filter(dimension_value__in=hierarchy)

    disaggregations.delete()
    disaggregation_targets.delete()
    indicator_disaggregation_targets.delete()


def get_dimension_value_hierarchy_flatlist(obj):
    IndicatorDimensionValue = apps.get_model('rsr', 'IndicatorDimensionValue')
    family = {obj.id}
    while True:
        children = set(IndicatorDimensionValue.objects.filter(parent_dimension_value__in=family).values_list('id', flat=True))
        if family.union(children) == family:
            break
        family = family.union(children)

    return IndicatorDimensionValue.objects.filter(pk__in=family)
