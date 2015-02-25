# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.
See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

from ..filters import remove_empty_querydict_items, OrganisationFilter
from ..models import Organisation
from ...utils import pagination, filter_query_string

from django.shortcuts import get_object_or_404, render
from django.template import RequestContext


def directory(request):
    qs = remove_empty_querydict_items(request.GET)
    if request.rsr_page:
        organisations = RequestContext(request)['projects_qs'].all_partners()
    else:
        organisations = Organisation.objects.all()
    f = OrganisationFilter(qs, queryset=organisations)

    # Instead of true or false, adhere to bootstrap3 class names to simplify
    show_filters = "in"
    available_filters = ['continent', ]
    if frozenset(qs.keys()).isdisjoint(available_filters):
        show_filters = ""

    page = request.GET.get('page')
    page, paginator, page_range = pagination(page, f.qs.distinct(), 10)

    context = {
        'orgs_count': f.qs.distinct().count(),
        'filter': f,
        'page': page,
        'paginator': paginator,
        'page_range': page_range,
        'show_filters': show_filters,
        'q': filter_query_string(qs)
        }
    return render(request, 'organisation_directory.html', context)


def main(request, organisation_id):
    context = {'organisation': get_object_or_404(Organisation, pk=organisation_id)}
    return render(request, 'organisation_main.html', context)
