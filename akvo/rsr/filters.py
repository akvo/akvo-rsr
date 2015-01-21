# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.
See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""


import django_filters
from .models import Project, Organisation, Category, FocusArea, ProjectUpdate
from .iso3166 import CONTINENTS

ANY_CHOICE = (('', 'All'), )


def remove_empty_querydict_items(request_get):
    # querydicts are immutable
    getvars = request_get.copy()
    for k, v in getvars.items():
        if not v:
            getvars.pop(k, None)
    return getvars


class ProjectFilter(django_filters.FilterSet):
    category =  django_filters.ChoiceFilter(
        choices=([('', 'All')] +
                 list(Category.objects.all().values_list('id', 'name',
                                                         flat=False)) ),
        label='category',
        name='categories__id')

    continent = django_filters.ChoiceFilter(
        choices=ANY_CHOICE + CONTINENTS,
        label='location',
        name='primary_location__country__continent_code')

    # Focus areas
    focus_area = django_filters.ChoiceFilter(
        choices=([('', 'All')] +
                 list(FocusArea.objects.all().values_list('id', 'name',
                                                          flat=False))[1:]),
        label='focus area',
        name='categories__focus_area__id',
        initial='All')

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
        fields = ['status', 'continent', 'organisation', 'category',
                  'focus_area', 'title', ]


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
