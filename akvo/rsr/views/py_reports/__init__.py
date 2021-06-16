# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

import os

from django.http import HttpResponse
from django.template.loader import render_to_string

from .utils import make_pdf_response
from .project_results_indicators_excel_report import \
    render_report as render_project_results_indicators_excel_report
from .project_updates_excel_report import render_report as render_project_updates_excel_report
from .results_indicators_with_map_pdf_reports import (
    render_project_results_indicators_overview,
    render_project_results_indicators_map_overview,
    render_organisation_projects_results_indicators_map_overview
)
from .kickstart_word_report import render_report as render_kickstart_report
from .eutf_narrative_word_report import render_report as render_eutf_narrative_word_report
from .organisation_data_quality_overview_report import \
    render_report as render_organisation_data_quality_overview
from .eutf_org_results_table_excel_report import \
    render_report as render_eutf_org_results_table_excel_report
from .eutf_project_results_table_excel_report import \
    render_report as render_eutf_project_results_table_excel_report
from .results_indicators_excel_report import \
    render_report as render_results_indicators_excel_report
from .organisation_projects_overview_report import \
    render_report as render_org_projects_overview_report
from .program_overview_excel_report import render_report as render_program_overview_excel_report
from .program_overview_pdf_report import render_report as render_program_overview_pdf_report
from .program_period_labels_overview_pdf_report import render_program_period_lables_overview
from .nuffic_country_level_map_report import \
    render_country_level_report as render_nuffic_country_level_report
from .wcaro_smq_excel_report import render_report as render_wcaro_smq_excel_report


def check(request):
    is_reports_container = os.getenv('IS_REPORTS_CONTAINER', '').strip()
    is_requesting_pdf = request.GET.get('pdf', None)

    if not is_requesting_pdf:
        return HttpResponse('OK' if is_reports_container else '')

    return utils.make_pdf_response(
        render_to_string('reports/checkz.html', {'is_reports_container': is_reports_container}),
        filename='test-report.pdf'
    )


__all__ = [
    'check',
    'render_project_results_indicators_map_overview',
    'render_organisation_projects_results_indicators_map_overview',
    'render_project_results_indicators_excel_report',
    'render_project_updates_excel_report',
    'render_kickstart_report',
    'render_eutf_narrative_word_report',
    'render_organisation_data_quality_overview',
    'render_eutf_org_results_table_excel_report',
    'render_eutf_project_results_table_excel_report',
    'render_results_indicators_excel_report',
    'render_org_projects_overview_report',
    'render_program_overview_excel_report',
    'render_program_overview_pdf_report',
    'render_program_period_lables_overview'
    'render_nuffic_country_level_report',
]
