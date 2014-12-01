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

from .models import Organisation, Project

class CheckboxMultipleChoiceField(MultipleChoiceField):
    widget = widgets.CheckboxSelectMultiple


class ProjectFilter(django_filters.FilterSet):
    class Meta:
        model = Project
        fields = ['primary_location__country__continent']

    def __init__(self, *args, **kwargs):
        super(ProjectFilter, self).__init__(*args, **kwargs)
        # self.filters['primary_location__country__continent'].extra.update(
        #     {'empty_label': 'All Continents'})


class ProjectFilterSet(django_filters.FilterSet):
    def filter_by_org(qs, org):
        if org:
            projs = org.published_projects().values_list('id', flat=True)
            return qs.filter(pk__in=projs)
        else:
            return qs

    def filter_by_project_title(qs, what):
        if what:
            bits = what.strip().split(' ')
            if len(bits) == 1 and bits[0].isdigit():
                query = Q(id__exact=int(bits[0]))
                return qs.filter(query)
            query = Q(title__icontains=bits[0]) | Q(subtitle__icontains=bits[0])
            if len(bits) > 1:
                for bit in bits[1:]:
                    query2 = Q(title__icontains=bit) | Q(subtitle__icontains=bit)
                    query = query & query2
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
    status          = django_filters.ChoiceFilter(choices=Project.STATUSES, action=filter_by_status)
    budget_total    = django_filters.RangeFilter(action=filter_by_budget_range)
    currency        = django_filters.ChoiceFilter()

    def __init__(self, *args, **kwargs):
        request = kwargs.pop('request', None)
        super(ProjectFilterSet, self).__init__(*args, **kwargs)
        projects = kwargs.pop('queryset', None)

        self.filters['title'].field.widget.input_type = 'search'
        self.filters['title'].field.widget.attrs = {'results': '5', 'autosave': 'project_search', 'placeholder': _(u'Project title or subtitle')}

        choices = [('', _(u'All continents'))]
        choices.extend(list(CONTINENTS))
        self.filters['continent'].extra.update({'choices': choices})

        # The request is sent when the call is made from a partner site view
        if request:
            partner_site = request.partner_site
            organisation = partner_site.organisation

            # Countries
            countries = projects.countries()
            self.filters['locations__country'].extra.update({'queryset': countries})
            self.filters['locations__country'].extra.update({'empty_label': _(u'Active countries')})

            # Continents
            continents = [('', _(u'Active continents'))]
            choices = []
            for country in countries:
                if not country.continent_code in [code[0] for code in choices]:
                    choices.append((country.continent_code, _(country.continent)))
            continents.extend(sorted(choices))
            self.filters['continent'].extra.update({'choices': continents})

            # Partners (always show all partners)
            organisations = Organisation.objects.all()
            self.filters['organisation'].extra.update({'empty_label': _(u'All partners')})


            # TODO: Filter the partners of projects. Organisation.partners() is too slow at the moment.
            # if partner_site.partner_projects and partner_site.keywords == 0:
            #     organisations = organisation.partners()
            #     self.filters['organisation'].extra.update({'empty_label': _(u'Active partners')})
            # else:
            #     organisations = Organisation.objects.all()
            #     self.filters['organisation'].extra.update({'empty_label': _(u'All partners')})

        # No request (no partner site)
        else:
            organisations = Organisation.objects.all()
            self.filters['locations__country'].extra.update({'empty_label': _(u'All countries')})
            self.filters['organisation'].extra.update({'empty_label': _(u'All organisations')})

        self.filters['organisation'].extra.update({'queryset': organisations})

        self.filters['andor'].field_class = BooleanField
        self.filters['status'].field_class = CheckboxMultipleChoiceField

        choices = [('', '---------')]
        choices.extend(list(Project.CURRENCY_CHOICES))
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
