# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import django_filters
import sys

from django.db.models.query_utils import Q
from django.forms import widgets, BooleanField
from django.forms.fields import MultipleChoiceField
from django.utils.translation import ugettext_lazy as _

from akvo.rsr.iso3166 import CONTINENTS

from akvo.rsr.models import (
    Organisation, Project, STATUSES, CURRENCY_CHOICES,
)

class CheckboxMultipleChoiceField(MultipleChoiceField):
    widget = widgets.CheckboxSelectMultiple


class ProjectFilterSet(django_filters.FilterSet):
    def filter_by_org(qs, org):
        if org:
            projs = org.published_projects().values_list('id', flat=True)
            return qs.filter(pk__in=projs)
        else:
            return qs

    def filter_by_project_title(qs, what):
        if what:
            if qs.filter_and:
                bits = what.split(' ')
                query = Q(title__icontains=bits[0])
                query = query&Q(subtitle__icontains=bits[0])
                if len(bits) > 1:
                    for bit in bits[1:]:
                        query = query&Q(title__icontains=bit)
                        query = query&Q(subtitle__icontains=bit)
                return qs.filter(query)
            else:
                bits = what.split(' ')
                query = Q(title__icontains=bits[0])
                query = query|Q(subtitle__icontains=bits[0])
                if len(bits) > 1:
                    for bit in bits[1:]:
                        query = query|Q(title__icontains=bit)
                        query = query|Q(subtitle__icontains=bit)
                return qs.filter(query)
        return qs

    def filter_by_status(qs, what):
        if what:
            q = Q(pk=0)
            for bit in what:
                q |= Q(status=bit)
            qs = qs.filter(q)
        return qs

    def filter_andor(qs, what):
        qs.filter_and = what
        return qs

    def check_test(cond):
        if cond == u'on':
            return True
        return False

    def filter_by_budget_range(qs, what):
        if what:
            return qs.filter(**{'total_budget__range': (int(what.start) if what.start else 0, int(what.stop) if what.stop else sys.maxint)})
        return qs

    title           = django_filters.CharFilter(action=filter_by_project_title)
    andor           = django_filters.BooleanFilter(widget=widgets.CheckboxInput(check_test=check_test), action=filter_andor, label=_(u'All words'))
    continent       = django_filters.ChoiceFilter(name='locations__country__continent_code')
    organisation    = django_filters.ModelChoiceFilter(name='name', action=filter_by_org,)
    status          = django_filters.ChoiceFilter(choices=STATUSES, action=filter_by_status)
    budget_total    = django_filters.RangeFilter(action=filter_by_budget_range)
    currency        = django_filters.ChoiceFilter()

    def __init__(self, *args, **kwargs):
        organisation_id = kwargs.pop('organisation_id', None)
        super(ProjectFilterSet, self).__init__(*args, **kwargs)

        self.filters['title'].field.widget.input_type = 'search'
        self.filters['title'].field.widget.attrs = {'results': '5', 'autosave': 'project_search', 'placeholder': _(u'Project title or subtitle')}
        
        choices = [('', _(u'All continents'))]
        choices.extend(list(CONTINENTS))
        self.filters['continent'].extra.update({'choices': choices})

        self.filters['locations__country'].extra.update({'empty_label': _(u'All countries')})

        if organisation_id:
            qs = Organisation.objects.get(pk=organisation_id).partners()
            self.filters['organisation'].extra.update({'empty_label': _(u'All partners')})
        else:
            qs = Organisation.objects.all()
            self.filters['organisation'].extra.update({'empty_label': _(u'All organisations')})
        self.filters['organisation'].extra.update({'queryset': qs})

        self.filters['andor'].field_class = BooleanField
        self.filters['status'].field_class = CheckboxMultipleChoiceField

        choices = [('', '---------')]
        choices.extend(list(CURRENCY_CHOICES))
        self.filters['currency'].extra.update({'choices': choices})

    class Meta:
        model = Project
        fields = ['organisation', 'andor', 'title', 'locations__country', 'continent', 'status', 'budget_total', 'currency', 'categories',]

def remove_empty_querydict_items(request_get):
    #querydicts are immutable
    getvars = request_get.copy()
    for k, v in getvars.items():
        if not v:
            getvars.pop(k, None)
    return getvars
