# -*- coding: utf-8 -*-
"""
Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the Akvo RSR module.
For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.
"""

from django import template
from django.conf import settings
from decimal import Decimal, ROUND_HALF_UP

register = template.Library()

DECIMAL_PLACES = getattr(settings, 'DECIMALS_DECIMAL_PLACES', 2)


@register.filter
def get_item(dictionary, key):
    """Enable lookup in dicts."""
    return dictionary.get(key)


# http://stackoverflow.com/questions/250357/smart-truncate-in-python
@register.filter("smart_truncate")
def smart_truncate(content, length=100, suffix='...'):
    if len(content) <= length:
        return content
    else:
        return content[:length].rsplit(' ', 1)[0] + suffix


@register.filter
def round(value, decimal_places=DECIMAL_PLACES):
    try:
        value = Decimal(str(value))
    except Exception:
        return u''
    if settings.DECIMALS_DEBUG:
        decimal_result = value.quantize(Decimal(10) ** -decimal_places)
        return decimal_result
    else:
        decimal_result = value.quantize(Decimal(10), ROUND_HALF_UP)
        return 0 if decimal_result <= 0 else decimal_result


round.is_safe = True


@register.filter
def countries_list(obj):
    """ return a list of the countries of all locations of an object.
    currently works for Project and Organisation """
    return obj.locations.values_list('country__name', flat=True)


@register.filter
def continents_list(obj):
    """return a list of the continents of all locations of an object"
    currently works for Project and Organisation """
    return obj.locations.values_list('country__continent', flat=True)


@register.filter
def rsr_sorted_set(iterable):
    """ create a set of the iterable to eliminate duplicates
    then make a list of the set and sort it
    used with countries_list and continents_list
    """
    set_list = sorted(frozenset(iterable))
    return set_list


@register.filter
def load_partnerships_and_orgs(project):
    return project.partnerships.prefetch_related('organisation').all()
