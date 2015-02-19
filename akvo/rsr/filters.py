# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.
See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""


import django_filters

from .models import Project, Organisation, Category, ProjectUpdate
from .iso3166 import CONTINENTS
from .m49 import M49_CODES, M49_HIERARCHY

from akvo.codelists.models import SectorCategory
from akvo.utils import codelist_choices

ANY_CHOICE = (('', 'All'), )


def sectors():
    sectors_list = []
    for sector in codelist_choices(SectorCategory):
        if Project.objects.filter(sectors__sector_code=sector[0]):
            sectors_list.append(sector)
    return sectors_list


def remove_empty_querydict_items(request_get):
    # querydicts are immutable
    getvars = request_get.copy()
    for k, v in getvars.items():
        if not v:
            getvars.pop(k, None)
    return getvars


def convert_m49(queryset, value):
    if not value:
        return queryset

    list_of_countries = []
    current_list = M49_HIERARCHY[int(value)]
    while len(current_list) > 0:
        element = current_list.pop(0)
        if isinstance(element, basestring):
            list_of_countries.append(element.lower())
        else:
            current_list = M49_HIERARCHY[int(element)] + current_list

    return Project.objects.filter(primary_location__country__iso_code__in=list_of_countries)


class ProjectFilter(django_filters.FilterSet):
    category = django_filters.ChoiceFilter(
        choices=([('', 'All')] +
                 list(Category.objects.all().values_list('id', 'name',
                                                         flat=False)) ),
        label='category',
        name='categories__id')

    location = django_filters.ChoiceFilter(
        choices=M49_CODES,
        label='location',
        action=convert_m49)

    sector = django_filters.ChoiceFilter(
        initial='All',
        choices=([('', 'All')] + sectors()),
        label='sector',
        name='sectors__sector_code')

    status = django_filters.ChoiceFilter(
        initial='All',
        label='status',
        choices=ANY_CHOICE + Project.STATUSES)

    title = django_filters.CharFilter(
        lookup_type='icontains',
        label='Search',
        name='title')

    def get_orgs():
        orgs = list(Organisation.objects.all().values_list('id', 'name',
                                                           flat=False))
        return ([('', 'All')] + orgs)

    organisation = django_filters.ChoiceFilter(
        choices=get_orgs(),
        label='partner',
        name='partners__id')

    class Meta:
        model = Project
        fields = ['status', 'location', 'organisation', 'category',
                  'sector', 'title', ]


class ProjectUpdateFilter(django_filters.FilterSet):

    continent = django_filters.ChoiceFilter(
        choices=ANY_CHOICE + CONTINENTS,
        label='location',
        name='primary_location__country__continent_code')

    title = django_filters.CharFilter(
        lookup_type='icontains',
        label='Search',
        name='title')

    class Meta:
        model = ProjectUpdate
        fields = ['continent', 'title', ]


class OrganisationFilter(django_filters.FilterSet):

    continent = django_filters.ChoiceFilter(
        choices=ANY_CHOICE + CONTINENTS,
        label='location',
        name='primary_location__country__continent_code')

    name = django_filters.CharFilter(
        lookup_type='icontains',
        label='Search',
        name='name')

    class Meta:
        model = ProjectUpdate
        fields = ['continent', 'name', ]
