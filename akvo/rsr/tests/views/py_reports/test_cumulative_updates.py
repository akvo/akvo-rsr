from abc import ABC, abstractmethod
from datetime import date
from akvo.codelists.store.default_codelists import RESULT_TYPE_OUTPUT
from akvo.rsr.models import Partnership, Project
from akvo.rsr.tests.base import BaseTestCase
from akvo.rsr.tests.utils import ProjectFixtureBuilder
from akvo.rsr.views.py_reports import (
    results_indicators_with_map_pdf_reports,
    results_indicators_excel_report,
    kickstart_word_report,
    eutf_org_results_table_excel_report,
    program_overview_pdf_report,
    program_period_labels_overview_pdf_report,
    project_results_indicators_excel_report,
    program_overview_excel_report,
    utils,
)


class CumulativeTestMixin:
    PERIOD_1_START = date(2010, 1, 1)
    PERIOD_1_END = date(2010, 12, 31)
    PERIOD_2_START = date(2011, 1, 1)
    PERIOD_2_END = date(2011, 12, 31)
    PERIOD_3_START = date(2012, 1, 1)
    PERIOD_3_END = date(2012, 12, 31)
    DISAGGREGATION_CATEGORY = 'Gender'
    DISAGGREGATION_TYPE_1 = 'Male'
    DISAGGREGATION_TYPE_2 = 'Female'

    def setup_project(self, reporting_org=None, contributors=None):
        builder = ProjectFixtureBuilder().with_period_labels(
            ['label #1', 'label #2', 'label #3']
        ).with_disaggregations({
            self.DISAGGREGATION_CATEGORY: [
                self.DISAGGREGATION_TYPE_1,
                self.DISAGGREGATION_TYPE_2,
            ]
        }).with_results([{
            'title': 'Result #1',
            'type': RESULT_TYPE_OUTPUT,
            'indicators': [{
                'title': 'Indicator #1',
                'cumulative': True,
                'periods': [
                    {'period_start': self.PERIOD_1_START, 'period_end': self.PERIOD_1_END, 'label': 'label #1'},
                    {'period_start': self.PERIOD_2_START, 'period_end': self.PERIOD_2_END, 'label': 'label #2'},
                    {'period_start': self.PERIOD_3_START, 'period_end': self.PERIOD_3_END, 'label': 'label #3'},
                ]
            }]
        }])
        if reporting_org:
            builder.with_partner(reporting_org, Partnership.IATI_REPORTING_ORGANISATION)
        if contributors:
            builder.with_contributors(contributors)
        return builder.build()

    def populate_project_updates_data(self, project):
        user1 = BaseTestCase.create_user('test1@akvo.org', 'password', is_admin=True)
        user2 = BaseTestCase.create_user('test2@akvo.org', 'password', is_admin=True)

        period1 = project.get_period(period_start=self.PERIOD_1_START)
        period1.add_update(user=user1, value=1, disaggregations={
            self.DISAGGREGATION_CATEGORY: {
                self.DISAGGREGATION_TYPE_1: {'value': 1},
            }
        })
        period1.add_update(user=user1, value=2, disaggregations={
            self.DISAGGREGATION_CATEGORY: {
                self.DISAGGREGATION_TYPE_1: {'value': 1},
                self.DISAGGREGATION_TYPE_2: {'value': 1},
            }
        })
        period1.add_update(user=user2, value=2, disaggregations={
            self.DISAGGREGATION_CATEGORY: {
                self.DISAGGREGATION_TYPE_2: {'value': 2},
            }
        })

        period2 = project.get_period(period_start=self.PERIOD_2_START)
        period2.add_update(user=user2, value=3, disaggregations={
            self.DISAGGREGATION_CATEGORY: {
                self.DISAGGREGATION_TYPE_1: {'value': 1},
                self.DISAGGREGATION_TYPE_2: {'value': 2},
            }
        })
        period2.add_update(user=user2, value=4, disaggregations={
            self.DISAGGREGATION_CATEGORY: {
                self.DISAGGREGATION_TYPE_1: {'value': 2},
                self.DISAGGREGATION_TYPE_2: {'value': 2},
            }
        })

        period3 = project.get_period(period_start=self.PERIOD_3_START)
        period3.add_update(user=user1, value=3, disaggregations={
            self.DISAGGREGATION_CATEGORY: {
                self.DISAGGREGATION_TYPE_1: {'value': 1},
                self.DISAGGREGATION_TYPE_2: {'value': 2},
            }
        })
        period3.add_update(user=user2, value=5, disaggregations={
            self.DISAGGREGATION_CATEGORY: {
                self.DISAGGREGATION_TYPE_1: {'value': 3},
                self.DISAGGREGATION_TYPE_2: {'value': 2},
            }
        })


class ObjectReaderCumulativeUpdateBaseTestCase(CumulativeTestMixin, ABC):

    @abstractmethod
    def make_project_view(self, project: Project) -> utils.ProjectProxy:
        pass

    def setUp(self):
        super().setUp()
        org = self.create_organisation('Akvo')
        self.project = self.setup_project(reporting_org=org)
        self.populate_project_updates_data(self.project)
        self.project_view = self.make_project_view(self.project.object)

    def get_period_view_started_at(self, date):
        periods = [p for p in self.project_view.results[0].indicators[0].periods if p.period_start == date]
        return periods[0] if periods else None

    def test_period2(self):
        period2 = self.get_period_view_started_at(self.PERIOD_2_START)
        self.assertEqual(6, period2.actual_value)
        self.assertEqual(3, period2.get_disaggregation_of(self.DISAGGREGATION_CATEGORY, self.DISAGGREGATION_TYPE_1))
        self.assertEqual(3, period2.get_disaggregation_of(self.DISAGGREGATION_CATEGORY, self.DISAGGREGATION_TYPE_2))

    def test_period3(self):
        period3 = self.get_period_view_started_at(self.PERIOD_3_START)
        self.assertEqual(8, period3.actual_value)
        self.assertEqual(4, period3.get_disaggregation_of(self.DISAGGREGATION_CATEGORY, self.DISAGGREGATION_TYPE_1))
        self.assertEqual(4, period3.get_disaggregation_of(self.DISAGGREGATION_CATEGORY, self.DISAGGREGATION_TYPE_2))

    def test_indicator_disaggregations(self):
        disaggregations = self.project_view.results[0].indicators[0].disaggregations
        self.assertEqual(4, disaggregations[self.DISAGGREGATION_CATEGORY][self.DISAGGREGATION_TYPE_1]['value'])
        self.assertEqual(4, disaggregations[self.DISAGGREGATION_CATEGORY][self.DISAGGREGATION_TYPE_2]['value'])


class ResultsIndicatorsWithMapPdfReportsTestCase(ObjectReaderCumulativeUpdateBaseTestCase, BaseTestCase):
    def make_project_view(self, project: Project) -> utils.ProjectProxy:
        return results_indicators_with_map_pdf_reports.build_view_object(project, self.PERIOD_2_START, self.PERIOD_3_END)


class ResultsIndicatorsExcelReportTestCase(ObjectReaderCumulativeUpdateBaseTestCase, BaseTestCase):
    def make_project_view(self, project: Project) -> utils.ProjectProxy:
        return results_indicators_excel_report.build_view_object(project.reporting_org)[0]


class KickstartWordReportTestCase(ObjectReaderCumulativeUpdateBaseTestCase, BaseTestCase):
    def make_project_view(self, project: Project) -> utils.ProjectProxy:
        return kickstart_word_report.build_view_object(project, self.PERIOD_2_START, self.PERIOD_3_END)


class EutfOrgResultsTableExcelReportTestCase(ObjectReaderCumulativeUpdateBaseTestCase, BaseTestCase):
    def make_project_view(self, project: Project) -> utils.ProjectProxy:
        return eutf_org_results_table_excel_report.build_view_object(project.reporting_org)[0]


class ProgramOverviewPdfReportTestBase(ObjectReaderCumulativeUpdateBaseTestCase, BaseTestCase):
    def make_project_view(self, project: Project) -> utils.ProjectProxy:
        return program_overview_pdf_report.build_view_object(project, self.PERIOD_2_START, self.PERIOD_3_END)


class ProgramPeriodLabelsOverviewPdfReportTestCase(ObjectReaderCumulativeUpdateBaseTestCase, BaseTestCase):
    def make_project_view(self, project: Project) -> utils.ProjectProxy:
        return program_period_labels_overview_pdf_report.build_view_object(project)

    def get_period_view_started_at(self, date):
        periods = [p for p in self.project_view.results[0].indicators[0].labeled_periods if p.period.period_start == date]
        return periods[0] if periods else None


class ResultsFrameworkDataclassesTestMixin(CumulativeTestMixin):
    def get_period_started_at(self, date):
        periods = [p for p in self.result.indicators[0].periods if p.period_start == date]
        return periods[0] if periods else None


class ProjectResultsIndicatorsExcelReportTestCase(ResultsFrameworkDataclassesTestMixin, BaseTestCase):

    def setUp(self):
        super().setUp()
        self.project = self.setup_project()
        self.populate_project_updates_data(self.project)
        self.result = project_results_indicators_excel_report.get_results_framework(self.project.object, self.PERIOD_2_START, self.PERIOD_3_END)[0]

    def test_period2(self):
        period2 = self.get_period_started_at(self.PERIOD_2_START)
        self.assertEqual(6, period2.actual_value)
        self.assertEqual(3, period2.get_aggregated_disaggregation_value(self.DISAGGREGATION_CATEGORY, self.DISAGGREGATION_TYPE_1))
        self.assertEqual(3, period2.get_aggregated_disaggregation_value(self.DISAGGREGATION_CATEGORY, self.DISAGGREGATION_TYPE_2))

    def test_period3(self):
        period3 = self.get_period_started_at(self.PERIOD_3_START)
        self.assertEqual(8, period3.actual_value)
        self.assertEqual(4, period3.get_aggregated_disaggregation_value(self.DISAGGREGATION_CATEGORY, self.DISAGGREGATION_TYPE_1))
        self.assertEqual(4, period3.get_aggregated_disaggregation_value(self.DISAGGREGATION_CATEGORY, self.DISAGGREGATION_TYPE_2))


class ProgramOverviewExcelReportTestCase(ResultsFrameworkDataclassesTestMixin, BaseTestCase):
    CONTRIBUTOR_1 = 'Contrib #1'
    CONTRIBUTOR_2 = 'Contrib #2'

    def setUp(self):
        super().setUp()
        self.lead_project = self.setup_project(contributors=[
            {'title': self.CONTRIBUTOR_1},
            {'title': self.CONTRIBUTOR_2}
        ])
        contrib1_project = self.lead_project.get_contributor(title='Contrib #1')
        contrib2_project = self.lead_project.get_contributor(title='Contrib #2')
        contrib1_period1 = contrib1_project.get_period(period_start=self.PERIOD_1_START)
        contrib1_period2 = contrib1_project.get_period(period_start=self.PERIOD_2_START)
        contrib2_period1 = contrib2_project.get_period(period_start=self.PERIOD_1_START)
        contrib2_period2 = contrib2_project.get_period(period_start=self.PERIOD_2_START)
        user1 = self.create_user('test1@akvo.org', 'password', is_admin=True)
        user2 = self.create_user('test2@akvo.org', 'password', is_admin=True)

        contrib1_period1.add_update(user=user1, value=1, disaggregations={
            self.DISAGGREGATION_CATEGORY: {
                self.DISAGGREGATION_TYPE_1: {'value': 1},
                self.DISAGGREGATION_TYPE_2: {'value': 0},
            }
        })
        contrib1_period2.add_update(user=user2, value=1, disaggregations={
            self.DISAGGREGATION_CATEGORY: {
                self.DISAGGREGATION_TYPE_1: {'value': 0},
                self.DISAGGREGATION_TYPE_2: {'value': 1},
            }
        })

        contrib2_period1.add_update(user=user1, value=1, disaggregations={
            self.DISAGGREGATION_CATEGORY: {
                self.DISAGGREGATION_TYPE_1: {'value': 0},
                self.DISAGGREGATION_TYPE_2: {'value': 1},
            }
        })
        contrib2_period2.add_update(user=user1, value=2, disaggregations={
            self.DISAGGREGATION_CATEGORY: {
                self.DISAGGREGATION_TYPE_1: {'value': 1},
                self.DISAGGREGATION_TYPE_2: {'value': 1},
            }
        })
        self.result = program_overview_excel_report.get_results_framework(self.lead_project.object)[0]

    def get_period_contributor(self, period, project_title):
        contribs = [c for c in period.contributors if c.project.title == project_title]
        return contribs[0] if contribs else None

    def test_period1(self):
        lead_period1 = self.get_period_started_at(self.PERIOD_1_START)
        contrib1 = self.get_period_contributor(lead_period1, self.CONTRIBUTOR_1)
        contrib2 = self.get_period_contributor(lead_period1, self.CONTRIBUTOR_2)
        self.assertEqual(2, lead_period1.aggregated_value)
        self.assertEqual(1, lead_period1.get_aggregated_disaggregation_value(self.DISAGGREGATION_CATEGORY, self.DISAGGREGATION_TYPE_1))
        self.assertEqual(1, lead_period1.get_aggregated_disaggregation_value(self.DISAGGREGATION_CATEGORY, self.DISAGGREGATION_TYPE_2))
        self.assertEqual(1, contrib1.actual_value)
        self.assertEqual(1, contrib1.get_disaggregation_value(self.DISAGGREGATION_CATEGORY, self.DISAGGREGATION_TYPE_1))
        self.assertEqual(0, contrib1.get_disaggregation_value(self.DISAGGREGATION_CATEGORY, self.DISAGGREGATION_TYPE_2))
        self.assertEqual(1, contrib2.actual_value)
        self.assertEqual(0, contrib2.get_disaggregation_value(self.DISAGGREGATION_CATEGORY, self.DISAGGREGATION_TYPE_1))
        self.assertEqual(1, contrib2.get_disaggregation_value(self.DISAGGREGATION_CATEGORY, self.DISAGGREGATION_TYPE_2))

    def test_period2(self):
        lead_period2 = self.get_period_started_at(self.PERIOD_2_START)
        contrib1 = self.get_period_contributor(lead_period2, self.CONTRIBUTOR_1)
        contrib2 = self.get_period_contributor(lead_period2, self.CONTRIBUTOR_2)
        self.assertEqual(4, lead_period2.aggregated_value)
        self.assertEqual(2, lead_period2.get_aggregated_disaggregation_value(self.DISAGGREGATION_CATEGORY, self.DISAGGREGATION_TYPE_1))
        self.assertEqual(2, lead_period2.get_aggregated_disaggregation_value(self.DISAGGREGATION_CATEGORY, self.DISAGGREGATION_TYPE_2))
        self.assertEqual(2, contrib1.actual_value)
        self.assertEqual(1, contrib1.get_disaggregation_value(self.DISAGGREGATION_CATEGORY, self.DISAGGREGATION_TYPE_1))
        self.assertEqual(1, contrib1.get_disaggregation_value(self.DISAGGREGATION_CATEGORY, self.DISAGGREGATION_TYPE_2))
        self.assertEqual(2, contrib2.actual_value)
        self.assertEqual(1, contrib2.get_disaggregation_value(self.DISAGGREGATION_CATEGORY, self.DISAGGREGATION_TYPE_1))
        self.assertEqual(1, contrib2.get_disaggregation_value(self.DISAGGREGATION_CATEGORY, self.DISAGGREGATION_TYPE_2))
