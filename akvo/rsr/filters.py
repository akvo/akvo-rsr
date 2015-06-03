# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.
See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""


import django_filters

from copy import deepcopy

from .models import Project, Organisation, Category, ProjectUpdate
from .m49 import M49_CODES, M49_HIERARCHY

from akvo.codelists.store.codelists_v201 import SECTOR_CATEGORY
from akvo.utils import codelist_choices

from django.utils.translation import ugettext_lazy as _

ANY_CHOICE = (('', _('All')), )


def sectors():
    sectors_list = []
    for sector in codelist_choices(SECTOR_CATEGORY):
        if Project.objects.filter(sectors__sector_code=sector[0]):
            sectors_list.append(sector)
    return sectors_list


def get_orgs():
    orgs = list(Organisation.objects.all().values_list('id', 'name', flat=False))
    return [('', _('All'))] + orgs


def remove_empty_querydict_items(request_get):
    # querydicts are immutable
    getvars = request_get.copy()
    for k, v in getvars.items():
        if not v:
            getvars.pop(k, None)
    return getvars


def walk(node):
    """Walks the m49 tree and return countires"""

    if isinstance(node, basestring):
        return [node.lower()]
    elif isinstance(node, int):
        return walk(deepcopy(M49_HIERARCHY)[node])
    else:
        if node:
            return (walk(node.pop()) + walk(node))
        else:
            return []


def filter_m49(queryset, value):
    """Filters countries from the m49 list"""
    if not value:
        return queryset
    countries = walk(deepcopy(M49_HIERARCHY)[int(value)])
    return queryset.filter(primary_location__country__iso_code__in=countries)


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
        action=filter_m49
    )

    sector = django_filters.ChoiceFilter(
        initial=_('All'),
        choices=([('', _('All'))] + sectors()),
        label=_(u'sector'),
        name='sectors__sector_code')

    status = django_filters.ChoiceFilter(
        initial=_('All'),
        label=_(u'status'),
        choices=ANY_CHOICE + Project.STATUSES)

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
        fields = ['status', 'location', 'organisation', 'category',
                  'sector', 'title', ]


class ProjectUpdateFilter(django_filters.FilterSet):

    location = django_filters.ChoiceFilter(
        choices=M49_CODES,
        label=_(u'location'),
        action=filter_m49)

    partner = django_filters.ChoiceFilter(
        choices=get_orgs(),
        label=_(u'organisation'),
        name='project__partners__id')

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
        fields = ['location', 'partner', 'sector', 'title', ]


class OrganisationFilter(django_filters.FilterSet):

    location = django_filters.ChoiceFilter(
        choices=M49_CODES,
        label=_(u'location'),
        action=filter_m49)

    name = django_filters.CharFilter(
        lookup_type='icontains',
        label=_(u'Search'),
        name='name')

    class Meta:
        model = ProjectUpdate
        fields = ['location', 'name', ]
