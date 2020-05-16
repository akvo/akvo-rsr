# -*- coding: utf-8 -*-

"""Akvo RSR is covered by the GNU Affero General Public License.

See more details in the license.txt file located at the root folder of the
Akvo RSR module. For additional details on the GNU license please
see < http://www.gnu.org/licenses/agpl.html >.
"""

from akvo.rsr.models import Project, IndicatorPeriod
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.template.loader import render_to_string

from . import utils


EUTF_ORG_ID = 3394


class EUTFProjectProxy(utils.ProjectProxy):
    def __init__(self, project, results={}):
        super().__init__(project, results)
        self._custom_fields = None

    @property
    def contact_person(self):
        contact = self.contacts.first()
        return contact.person_name if contact else ''

    @property
    def actual_start_year(self):
        return str(self.date_start_actual.year) if self.date_start_actual else ''

    @property
    def planned_end_year(self):
        return str(self.date_end_planned.year) if self.date_end_planned else ''

    @property
    def cofunding_partners(self):
        return self.funding_partnerships().exclude(organisation__id=EUTF_ORG_ID)

    @property
    def eutf_funding_amount(self):
        eutf = self.funding_partnerships().filter(organisation__id=EUTF_ORG_ID).first()
        return '€{:,}'.format(eutf.funding_amount) if eutf else ''

    @property
    def cf_relationship_with_beneficiaries(self):
        return self.get_custom_field('Relationship with beneficiaries')

    @property
    def cf_synergies_with_other_actions(self):
        return self.get_custom_field('Synergies with other actions')

    @property
    def cf_cooperation_with_contracting_authority(self):
        return self.get_custom_field('Cooperation with contracting authority')

    @property
    def cf_eu_visibility(self):
        return self.get_custom_field('EU visibility')

    @property
    def cf_additional_comments(self):
        return self.get_custom_field('Additional comments')

    @property
    def cf_sustainability(self):
        return self.get_custom_field('Sustainability')

    @property
    def cf_executive_summary_of_the_action(self):
        return self.get_custom_field('Executive summary of the action')

    @property
    def cf_cross_cutting_issues(self):
        return self.get_custom_field('Cross-cutting issues')

    @property
    def cf_monitoring_evaluation(self):
        return self.get_custom_field('Monitoring & evaluation')

    @property
    def cf_learning_from_the_action(self):
        return self.get_custom_field('Learning from the action')

    @property
    def cf_list_of_materials_produced(self):
        return self.get_custom_field('List of materials produced')

    @property
    def cf_relationship_with_state_authorities(self):
        return self.get_custom_field('Relationship with State authorities')

    @property
    def cf_list_of_contracts(self):
        return self.get_custom_field('List of contracts')

    @property
    def cf_relationship_with_other_organisations(self):
        return self.get_custom_field('Relationship with other organisations')

    @property
    def cf_results_and_activities(self):
        return self.get_custom_field('Results and activities')

    def get_custom_field(self, name):
        if self._custom_fields is None:
            self._custom_fields = {f.name: f.value for f in self.custom_fields.all()}
        return self._custom_fields.get(name, '')


def build_view_object(project):
    periods = IndicatorPeriod.objects\
        .select_related('indicator', 'indicator__result', 'indicator__result__project')\
        .filter(indicator__result__project=project)

    if not periods.count():
        return EUTFProjectProxy(project)

    return utils.make_project_proxies(periods, EUTFProjectProxy)[0]


@login_required
def render_report(request, project_id):
    project = get_object_or_404(Project, pk=project_id)

    project_view = build_view_object(project)

    html = render_to_string('reports/eutf-narrative.html', context={
        'project': project_view,
        'log_frame': []
    })

    return HttpResponse(html)
