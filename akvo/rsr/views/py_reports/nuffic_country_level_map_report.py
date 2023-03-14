# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

from akvo.rsr.models import Project, Country, IndicatorPeriod
from akvo.rsr.staticmap import get_staticmap_url, Coordinate, Size
from akvo.utils import to_bool
from datetime import datetime
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.http import HttpResponseBadRequest
from django.shortcuts import get_object_or_404
from django.template.loader import render_to_string

from . import utils

REPORT_NAME = 'nuffic_country_level_map_report'


@login_required
def add_email_report_job(request, program_id):
    program = get_object_or_404(Project, pk=program_id)
    country = request.GET.get('country', '').strip()
    if not country:
        return HttpResponseBadRequest('Please provide the country code!')
    show_comment = request.GET.get('comment', '').strip()
    start_date = request.GET.get('period_start', '').strip()
    end_date = request.GET.get('period_end', '').strip()
    payload = {
        'program_id': program.id,
        'country': country,
        'show_comment': show_comment,
        'start_date': start_date,
        'end_date': end_date,
    }
    recipient = request.user.email

    return utils.make_async_email_report_task(handle_email_report, payload, recipient, REPORT_NAME)


def handle_email_report(params, recipient):
    country = params.get('country')
    show_comment = to_bool(params.get('comment', ''))
    start_date = utils.parse_date(params.get('period_start', ''), datetime(1900, 1, 1))
    end_date = utils.parse_date(params.get('period_end', ''), datetime(2999, 12, 31))

    country = Country.objects.get(iso_code=country)
    program = Project.objects.get(pk=params['program_id'])

    project_ids = program.descendants()\
        .exclude(pk=program.id)\
        .exclude(Q(title__icontains='test') | Q(subtitle__icontains='test'))\
        .values_list('id', flat=True)
    projects_in_country = Project.objects\
        .filter(id__in=project_ids, locations__country=country)\
        .distinct()
    coordinates = [
        Coordinate(location.latitude, location.longitude)
        for project in projects_in_country
        for location in project.locations.all()
        if location.country == country
    ]

    now = datetime.today()

    html = render_to_string('reports/nuffic-country-level-report.html', context={
        'title': 'Country level report for projects in {}'.format(country.name),
        'staticmap': get_staticmap_url(coordinates, Size(900, 600), zoom=11),
        'projects': build_view_objects(projects_in_country, start_date, end_date),
        'show_comment': show_comment,
        'today': now.strftime('%d-%b-%Y'),
    })

    filename = '{}-{}-country-report.pdf'.format(now.strftime('%Y%b%d'), country.iso_code)

    return utils.send_pdf_report(html, recipient, filename)


def build_view_objects(projects, start_date=None, end_date=None):
    results_qs = IndicatorPeriod.objects\
        .select_related('indicator', 'indicator__result')\
        .prefetch_related('disaggregations')\
        .filter(id__in=get_chosen_results_period_ids())
    narratives_qs = IndicatorPeriod.objects\
        .select_related('indicator')\
        .filter(id__in=get_chosen_narrative_period_ids())
    if start_date and end_date:
        results_qs = results_qs.filter(
            Q(period_start__isnull=True) | Q(period_start__gte=start_date),
            Q(period_end__isnull=True) | Q(period_end__lte=end_date)
        )
        narratives_qs = narratives_qs.filter(
            Q(period_start__isnull=True) | Q(period_start__gte=start_date),
            Q(period_end__isnull=True) | Q(period_end__lte=end_date)
        )
    return [build_view_object(p, results_qs, narratives_qs) for p in projects]


def build_view_object(project, results_qs, narratives_qs):
    periods = results_qs.filter(indicator__result__project=project)
    results = arrange_periods_to_results(periods)
    narratives = narratives_qs.filter(indicator__result__project=project)
    return ProjectProxy(project, results, narratives)


def get_root_periods_ids_from_chosen_results():
    chosen_results = [30115, 30187]
    return IndicatorPeriod.objects.filter(indicator__result__in=chosen_results)\
        .values_list('id', flat=True)


def get_root_periods_ids_from_chosen_narrative_indicator():
    chosen_indicators = [101858]
    return IndicatorPeriod.objects.filter(indicator__in=chosen_indicators)\
        .values_list('id', flat=True)


def arrange_periods_to_results(periods):
    results = {}
    for period in periods:
        indicator = period.indicator
        result = indicator.result
        if result.id not in results:
            results[result.id] = {'item': result, 'indicators': {}}
        if indicator.id not in results[result.id]['indicators']:
            results[result.id]['indicators'][indicator.id] = {'item': indicator, 'periods': []}
        results[result.id]['indicators'][indicator.id]['periods'].append(period)

    return results


def get_chosen_results_period_ids():
    return get_period_hierarchy_flatlist(get_root_periods_ids_from_chosen_results())


def get_chosen_narrative_period_ids():
    return get_period_hierarchy_flatlist(get_root_periods_ids_from_chosen_narrative_indicator())


def get_period_hierarchy_flatlist(root_period_ids):
    family = set(root_period_ids)
    while True:
        children = set(
            IndicatorPeriod.objects.filter(
                parent_period__in=family
            ).values_list(
                'id', flat=True
            ))
        if family.union(children) == family:
            break
        family = family.union(children)
    return family


class ProjectProxy(utils.ProjectProxy):
    def __init__(self, project, results={}, narratives=[]):
        super().__init__(project, results)
        self._narratives = []
        for n in narratives:
            self._narratives.append(utils.PeriodProxy(n, n.indicator))

    @property
    def narratives(self):
        return self._narratives
