# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.
See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""


import django_filters

from copy import deepcopy
from django.utils.translation import ugettext_lazy as _
from akvo.codelists.store.codelists_v202 import ACTIVITY_STATUS, SECTOR_CATEGORY
from akvo.utils import codelist_choices
from .models import (Category, Organisation, OrganisationLocation, Project,
                     ProjectLocation, ProjectUpdate, ProjectUpdateLocation)
from .m49 import M49_CODES, M49_HIERARCHY

ANY_CHOICE = (('', _('All')), )


def sectors():
    sectors_list = []
    for sector in codelist_choices(SECTOR_CATEGORY):
        sectors_list.append(sector)
    return sectors_list


def get_orgs():
    orgs = list(Organisation.objects.all().values_list(
                'id', 'name', flat=False))
    return [('', _('All'))] + orgs


def remove_empty_querydict_items(request_get):
    # querydicts are immutable
    getvars = request_get.copy()
    for k, v in getvars.items():
        if not v:
            getvars.pop(k, None)
    return getvars


def walk(node):
    """Walks the m49 tree and return countries"""

    if isinstance(node, basestring):
        return [node, ]
    elif isinstance(node, int):
        return walk(deepcopy(M49_HIERARCHY)[node])
    else:
        if node:
            return (walk(node.pop()) + walk(node))
        else:
            return []


def filter_m49(queryset, value):
    """Filters countries from the m49 list, for projects."""
    if not value:
        return queryset
    countries = walk(deepcopy(M49_HIERARCHY)[int(value)])
    return queryset.filter(recipient_countries__country__in=countries)


def filter_m49_orgs(queryset, value):
    """Filters countries from the m49 list, for projects."""
    if not value:
        return queryset
    countries = walk(deepcopy(M49_HIERARCHY)[int(value)])
    return queryset.filter(locations__iati_country__in=countries)


def get_id_for_iso(i):
    """From an iso_code e.g. 'SE' get the identifier."""
    i = [k for k, v in M49_HIERARCHY.iteritems() if i in v]
    if not i:
        return None
    else:
        return i.pop()


def get_locations(location, locations):
    """Based on one location (country or group as Europe) get all the"""
    l = get_id_for_iso(location)
    if isinstance(l, basestring):
        return locations
    elif l is 1:
        return locations
    elif l is None:
        return locations
    else:
        locations.append(l)
        return get_locations(l, locations)


def location_choices(qs):
    """From a queryset get possible location filter choices"""

    if qs.model is Project:
        location_model = ProjectLocation
    elif qs.model is ProjectUpdate:
        location_model = ProjectUpdateLocation
    elif qs.model is Organisation:
        location_model = OrganisationLocation

    locations_qs = location_model.objects.filter(
        location_target__in=qs).order_by('country__id').distinct('country__id')

    locations = []
    for location in locations_qs:
        if location.country:
            country = get_id_for_iso(location.country.iso_code.upper())
            locations.append(country)
            locations.extend(get_locations(country, []))

    choices = [tup for tup in M49_CODES if any(
        unicode(i) in tup for i in locations)]
    return [M49_CODES[0]] + choices  # Add the world to the choices


def build_choices(qs):
    """Build choices from queryset and add an All option"""
    return [('', _('All'))] + list(qs.values_list('id', 'name', flat=False))


class ProjectFilter(django_filters.FilterSet):

    category = django_filters.ChoiceFilter(
        choices=([('', _('All'))] +
                 list(Category.objects.all().values_list('id', 'name',
                                                         flat=False))),
        label=_(u'category'),
        name='categories__id')

    location = django_filters.ChoiceFilter(
        choices=M49_CODES,
        label=_(u'location'),
        action=filter_m49)

    sector = django_filters.ChoiceFilter(
        initial=_('All'),
        choices=([('', _('All'))] + sectors()),
        label=_(u'sector'),
        name='sectors__sector_code')

    status = django_filters.ChoiceFilter(
        initial=_('All'),
        label=_(u'status'),
        choices=ANY_CHOICE + Project.STATUSES)

    iati_status = django_filters.ChoiceFilter(
        initial=_('All'),
        label=_(u'status'),
        choices=([('', _('All'))] + codelist_choices(ACTIVITY_STATUS, False)))

    title = django_filters.CharFilter(
        lookup_type='icontains',
        label=_(u'Search'),
        name='title')

    organisation = django_filters.ChoiceFilter(
        choices=get_orgs(),
        label=_(u'organisation'),
        name='partners__id')

    class Meta:
        model = Project
        fields = ['status', 'iati_status', 'location', 'organisation', 'category',
                  'sector', 'title', ]


class ProjectUpdateFilter(django_filters.FilterSet):

    partner = django_filters.ChoiceFilter(
        choices=get_orgs(),
        label=_(u'organisation'),
        name='user__organisations__id')

    sector = django_filters.ChoiceFilter(
        initial=_('All'),
        choices=([('', _('All'))] + sectors()),
        label=_(u'sector'),
        name='project__sectors__sector_code')

    title = django_filters.CharFilter(
        lookup_type='icontains',
        label=_(u'Search'),
        name='title')

    class Meta:
        model = ProjectUpdate
        fields = ['partner', 'sector', 'title', ]


class OrganisationFilter(django_filters.FilterSet):

    location = django_filters.ChoiceFilter(
        choices=M49_CODES,
        label=_(u'location'),
        action=filter_m49_orgs)

    name = django_filters.CharFilter(
        lookup_type='icontains',
        label=_(u'Search'),
        name='name')

    class Meta:
        model = ProjectUpdate
        fields = ['location', 'name', ]
