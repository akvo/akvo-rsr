# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

from akvo.rsr.models import Project, IndicatorPeriod, ProjectUpdate
from datetime import datetime
from dateutil.relativedelta import relativedelta
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.template.loader import render_to_string

from . import utils


def build_view_object(project, start_date=None, end_date=None):
    periods = IndicatorPeriod.objects\
        .select_related('indicator', 'indicator__result', 'indicator__result__project')\
        .filter(indicator__result__project=project)
    if start_date and end_date:
        periods = periods.filter(
            Q(period_start__isnull=True) | Q(period_start__gte=start_date),
            Q(period_end__isnull=True) | Q(period_end__lte=end_date)
        )

    return utils.make_project_proxies(periods.order_by('-period_start'))[0]


def get_project_updates(project, start_date=None, end_date=None):
    updates = ProjectUpdate.objects.filter(project=project)
    if start_date and end_date:
        updates = updates.filter(event_date__gte=start_date, event_date__lte=end_date)

    return [utils.ProjectUpdateProxy(u) for u in updates.order_by('-created_at')]


def is_empty_value(value):
    if not value:
        return True
    if value == '0':
        return True
    if value == 'N.A.':
        return True


def build_log_frame(project_view):
    data = []
    use_baseline = False
    has_disaggregations = False
    previous_result = ''
    previous_indicator = ''
    for result in project_view.results:
        for indicator in result.indicators:
            if indicator.is_qualitative:
                break
            if not is_empty_value(indicator.baseline_value):
                use_baseline = True
            for period in indicator.periods:
                current_result = ''
                if previous_result != result.title:
                    previous_result = result.title
                    current_result = result.title
                current_indicator = ''
                if previous_indicator != indicator.title:
                    previous_indicator = indicator.title
                    current_indicator = indicator.title
                disaggregations = []
                for d in period.disaggregations.all():
                    disaggregations.append({
                        'label': str(d.dimension_value),
                        'value': d.value
                    })
                if len(disaggregations):
                    has_disaggregations = True
                    print(disaggregations)

                data.append({
                    'result': current_result,
                    'indicator': current_indicator,
                    'baseline_year': indicator.baseline_year if current_indicator != '' else '',
                    'baseline_value': indicator.baseline_value if current_indicator != '' else '',
                    'period_start': period.period_start,
                    'period_end': period.period_end,
                    'target_value': int(period.target_value),
                    'actual_value': int(period.actual_value),
                    'comments': period.actual_comment,
                    'disaggregations': disaggregations,
                })

    return {
        'data': data,
        'use_baseline': use_baseline,
        'has_disaggregations': has_disaggregations,
    }


@login_required
def render_report(request, project_id):
    project = get_object_or_404(Project, pk=project_id)
    start_date = utils.parse_date(request.GET.get('start_date', '').strip(), datetime(1900, 1, 1))
    end_date = utils.parse_date(request.GET.get('end_date', '').strip(), datetime.today() + relativedelta(years=10))

    project_view = build_view_object(project, start_date, end_date)
    project_updates = get_project_updates(project, start_date, end_date)

    html = render_to_string('reports/project-kickstart.html', context={
        'project': project_view,
        'project_updates': project_updates,
        'log_frame': build_log_frame(project_view)
    })

    return HttpResponse(html)
