from django.core import management
from django.core import mail
from django.urls import reverse
from parameterized import parameterized
from akvo.rsr.tests.base import BaseTestCase
from akvo.rsr.models import EmailReportJob, Country
from akvo.rsr.views.py_reports import (
    program_overview_pdf_report,
    program_overview_excel_report,
    program_period_labels_overview_pdf_report,
    results_indicators_with_map_pdf_reports,
    nuffic_country_level_map_report,
)


class SendReportViaEmailTestCase(BaseTestCase):

    def setUp(self):
        super().setUp()
        self.program = self.create_program('Test program')
        self.user = self.create_user('test@akvo.org', 'password', is_admin=True)
        Country.objects.get_or_create(iso_code='nl')
        self.c.login(username=self.user.email, password='password')
        mail.outbox = []

    def test_add_job(self):
        response = self.c.get(reverse('py-reports-program-overview', args=(self.program.id,)))
        self.assertEqual(202, response.status_code)
        self.assertEqual(1, EmailReportJob.objects.count())
        job = EmailReportJob.objects.first()
        self.assertEqual(program_overview_pdf_report.REPORT_NAME, job.report)

    @parameterized.expand([
        ('py-reports-program-overview', '', program_overview_pdf_report.REPORT_NAME),
        ('py-reports-program-overview-table', '', program_overview_excel_report.REPORT_NAME),
        ('py-reports-program-period-labels-overview', '', program_period_labels_overview_pdf_report.REPORT_NAME),
        ('py-reports-organisation-projects-results-indicators-map-overview', 'country=nl', results_indicators_with_map_pdf_reports.ORG_PROJECTS_REPORT_NAME),
        ('py-reports-nuffic-country-level-report', 'country=nl', nuffic_country_level_map_report.REPORT_NAME),
    ])
    def test_send_report_via_email(self, url_name, query_params, report_name):
        self.c.get(f"{reverse(url_name, args=(self.program.id,))}?{query_params}")
        job = EmailReportJob.objects.first()
        self.assertEqual(report_name, job.report)
        self.assertEqual(1, EmailReportJob.objects.filter(finished_at__isnull=True).count())

        management.call_command('send_report_via_email')

        self.assertEqual(0, EmailReportJob.objects.filter(finished_at__isnull=True).count())
        msg = mail.outbox[0]
        self.assertEqual([self.user.email], msg.to)