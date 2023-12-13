# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

from dataclasses import dataclass, field
from datetime import date, datetime
from decimal import Decimal
from typing import Dict, Generator, Generic, List, Optional, Set, Tuple, TypeVar, Union
from dateutil.relativedelta import relativedelta
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404
from django.template.loader import render_to_string

from akvo.rsr import dataclasses as dc
from akvo.rsr.models import Project, User
from akvo.rsr.models.result.utils import calculate_percentage
from akvo.rsr.staticmap import get_staticmap_url, Coordinate, Size
from akvo.utils import ensure_decimal

from . import utils, program_utils

REPORT_NAME = 'program_overview_pdf_report'


@login_required
def add_email_report_job(request, program_id):
    program = get_object_or_404(Project, pk=program_id)
    payload = {
        'program_id': program.id,
        'period_start': request.GET.get('period_start', '').strip(),
        'period_end': request.GET.get('period_end', '').strip(),
        'report_label': 'Program overview',
    }
    recipient = request.user.email
    return utils.make_async_email_report_task(handle_email_report, payload, recipient, REPORT_NAME)


def handle_email_report(params, recipient):
    now = datetime.today()
    program = Project.objects.prefetch_related('results').get(pk=params['program_id'])
    user = User.objects.get(email=recipient)
    start_date = utils.parse_date(params.get('period_start', ''), datetime(1900, 1, 1))
    if not start_date:
        start_date = datetime(1900, 1, 1)
    end_date = utils.parse_date(params.get('period_end', ''), datetime(2999, 12, 31))
    if not end_date:
        end_date = (datetime.today() + relativedelta(years=10))
    html = render_report(program, start_date, end_date)
    filename = '{}-program-{}-overview.pdf'.format(now.strftime('%Y%m%d%H%M%S'), program.id)
    utils.save_pdf_and_send_email(html, user, filename)


def render_report(program: Project, start_date: datetime, end_date: datetime):
    results = program_utils.get_results_framework(program, start_date, end_date)
    locations = get_locations(results)
    coordinates = [
        Coordinate(loc.latitude, loc.longitude)
        for loc in locations
        if loc and loc.latitude and loc.longitude
    ]
    return render_to_string(
        "reports/program-overview.html",
        context={
            "program": program,
            "staticmap": get_staticmap_url(coordinates, Size(900, 600)),
            "start_date": start_date,
            "end_date": end_date,
            "contributor_level_map": get_contributor_projects_levels(results),
            "quantitative_results": get_quantitative_view_data(results),
            "qualitative_results": get_qualitative_view_data(results),
        },
    )


@dataclass
class QualitativeUpdateView:
    created_at: Optional[datetime]
    user: Optional[dc.UserData]
    narrative: str


@dataclass
class QualitativeContributionView:
    level: int
    project: str
    country: str
    updates: List[QualitativeUpdateView] = field(default_factory=list)


@dataclass(frozen=True)
class QuantitativeContributionView:
    level: int
    project: str
    country: str
    value: Decimal
    percentage: Decimal
    disaggregations: Dict[str, Dict[str, Decimal]] = field(default_factory=dict)


T = TypeVar("T", QuantitativeContributionView, QualitativeContributionView)


@dataclass(frozen=True)
class PeriodView(Generic[T]):
    period_start: Optional[date]
    period_end: Optional[date]
    countries_count: int
    actual_value: Optional[Union[Decimal, int]] = None
    contributors: List[T] = field(default_factory=list)
    disaggregations: Dict[str, Dict[str, Decimal]] = field(default_factory=dict)


@dataclass(frozen=True)
class IndicatorView(Generic[T]):
    title: str
    periods: List[PeriodView[T]] = field(default_factory=list)


@dataclass(frozen=True)
class ResultView(Generic[T]):
    title: str
    iati_type_name: str
    indicators: List[IndicatorView[T]] = field(default_factory=list)


def get_quantitative_view_data(
    results: List[dc.ResultData],
) -> List[ResultView[QuantitativeContributionView]]:
    result_views = []
    for result in dc.filter_results_by_indicator_type(
        dc.IndicatorType.Quantitative, results
    ):
        indicator_views = []
        for indicator in result.indicators:
            period_views = []
            for period in indicator.periods:
                contributors = [
                    c
                    for c in traverse_quantitative_contributor_view(
                        period, period.contributors
                    )
                ]
                period_view = PeriodView(
                    period_start=period.period_start,
                    period_end=period.period_end,
                    countries_count=len(set(c.country for c in contributors)),
                    actual_value=period.actual_value,
                    contributors=contributors,
                )
                for d in period.aggregated_disaggregations:
                    period_view.disaggregations.setdefault(d.category, dict())
                    period_view.disaggregations[d.category][d.type] = ensure_decimal(
                        period.get_aggregated_disaggregation_value(d.category, d.type)
                    )
                period_views.append(period_view)
            indicator_views.append(
                IndicatorView(
                    title=indicator.title,
                    periods=period_views,
                )
            )
        result_views.append(
            ResultView(
                title=result.title,
                iati_type_name=result.iati_type_name,
                indicators=indicator_views,
            )
        )
    return result_views


def traverse_quantitative_contributor_view(
    period: dc.PeriodData, contributors: List[dc.ContributorData], level=1
) -> Generator[QuantitativeContributionView, None, None]:
    for contributor in contributors:
        if not contributor.has_contributions:
            continue
        project = contributor.project
        project_title = project.title if project else ""
        location = project.location if project else None
        country = location.country if location else None
        country_name = country.name if country else ""

        view = QuantitativeContributionView(
            level=level,
            project=project_title,
            country=country_name,
            value=ensure_decimal(contributor.actual_value),
            percentage=calculate_percentage(
                contributor.actual_value, period.actual_value
            ),
        )
        for d in contributor.disaggregations:
            view.disaggregations.setdefault(d.category, dict())
            view.disaggregations[d.category][d.type] = ensure_decimal(
                contributor.get_disaggregation_value(d.category, d.type)
            )
        yield view
        yield from traverse_quantitative_contributor_view(
            period, contributor.contributors, level + 1
        )


def get_qualitative_view_data(
    results: List[dc.ResultData],
) -> List[ResultView[QualitativeContributionView]]:
    result_views = []
    for result in dc.filter_results_by_indicator_type(
        dc.IndicatorType.Qualitative, results
    ):
        indicator_views = []
        for indicator in result.indicators:
            period_views = []
            for period in indicator.periods:
                contributors = [
                    c
                    for c in traverse_qualitative_contributor_view(period.contributors)
                ]
                period_view = PeriodView(
                    period_start=period.period_start,
                    period_end=period.period_end,
                    countries_count=len(set(c.country for c in contributors)),
                    contributors=contributors,
                )
                period_views.append(period_view)
            indicator_views.append(
                IndicatorView(
                    title=indicator.title,
                    periods=period_views,
                )
            )
        result_views.append(
            ResultView(
                title=result.title,
                iati_type_name=result.iati_type_name,
                indicators=indicator_views,
            )
        )
    return result_views


def traverse_qualitative_contributor_view(
    contributors: List[dc.ContributorData], level=1
) -> Generator[QualitativeContributionView, None, None]:
    for contributor in contributors:
        if not contributor.has_contributions:
            continue
        project = contributor.project
        project_title = project.title if project else ""
        location = project.location if project else None
        country = location.country if location else None
        country_name = country.name if country else ""

        updates = [
            QualitativeUpdateView(
                created_at=u.created_at, user=u.user, narrative=u.narrative
            )
            for u in contributor.approved_updates
        ]
        if updates:
            yield QualitativeContributionView(
                level=level,
                project=project_title,
                country=country_name,
                updates=updates,
            )
        yield from traverse_qualitative_contributor_view(
            contributor.contributors, level + 1
        )


def get_contributor_projects_levels(
    results: List[dc.ResultData],
) -> Dict[int, Set[dc.ContributorProjectData]]:
    level_map = dict()
    for result in results:
        for indicator in result.indicators:
            for period in indicator.periods:
                for level, project in traverse_contributor_project_levels(
                    period.contributors
                ):
                    if level not in level_map:
                        level_map[level] = set()
                    level_map[level].add(project)
    return level_map


def traverse_contributor_project_levels(
    contributors: List[dc.ContributorData], level=1
) -> Generator[Tuple[int, dc.ContributorProjectData], None, None]:
    for contributor in contributors:
        if not contributor.project:
            continue
        if not contributor.has_contributions:
            continue
        yield level, contributor.project
        yield from traverse_contributor_project_levels(
            contributor.contributors, level + 1
        )


def get_locations(results: List[dc.ResultData]) -> Set[dc.LocationData]:
    locations = set()
    for result in results:
        for indicator in result.indicators:
            for period in indicator.periods:
                locations.update(period.locations)
    return locations
