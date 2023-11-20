from django.core import mail
from django.urls import reverse
from django_q.models import OrmQ
from django_q.signing import SignedPackage
from parameterized import parameterized
from akvo.rsr.tests.base import BaseTestCase
from akvo.rsr.models import Country
from akvo.rsr.views.py_reports import (
    results_indicators_excel_report,
    program_overview_pdf_report,
    program_overview_excel_report,
    program_period_labels_overview_pdf_report,
    results_indicators_with_map_pdf_reports,
    nuffic_country_level_map_report,
    eutf_org_results_table_excel_report,
)


class SendReportViaEmailTestCase(BaseTestCase):

    def setUp(self):
        super().setUp()
        self.org = self.create_organisation('Acme');
        self.program = self.create_program('Test program')
        self.user = self.create_user('test@akvo.org', 'password', is_admin=True)
        Country.objects.get_or_create(iso_code='nl')
        self.c.login(username=self.user.email, password='password')
        mail.outbox = []

    @parameterized.expand([
        (
            'py-reports-program-overview-table', '',
            program_overview_excel_report.REPORT_NAME,
            program_overview_excel_report.handle_email_report,
        ),
        (
            'py-reports-program-overview', '',
            program_overview_pdf_report.REPORT_NAME,
            program_overview_pdf_report.handle_email_report,
        ),
        (
            'py-reports-program-period-labels-overview', '',
            program_period_labels_overview_pdf_report.REPORT_NAME,
            program_period_labels_overview_pdf_report.handle_email_report,
        ),
        (
            'py-reports-organisation-projects-results-indicators-map-overview', 'country=nl',
            results_indicators_with_map_pdf_reports.ORG_PROJECTS_REPORT_NAME,
            results_indicators_with_map_pdf_reports.handle_org_projects_email_report,
        ),
        (
            'py-reports-nuffic-country-level-report', 'country=nl',
            nuffic_country_level_map_report.REPORT_NAME,
            nuffic_country_level_map_report.handle_email_report,
        ),
        (
            'py-reports-organisation-eutf-results-indicators-table', '',
            eutf_org_results_table_excel_report.REPORT_NAME,
            eutf_org_results_table_excel_report.handle_email_report,
        ),
    ])
    def test_send_program_reports_via_djangoq_email(self, url_name, query_params, report_name, email_handler):
        self.c.get(f"{reverse(url_name, args=(self.program.id,))}?{query_params}")

        # Check that the task was enqueued with django-q
        enqueued_task = OrmQ.objects.first()
        self.assertIsNotNone(enqueued_task)
        task_dict = SignedPackage.loads(enqueued_task.payload)
        self.assertEquals(task_dict.get("name"), report_name)

        # And with the correct program
        task_args = task_dict.get("args")
        params_arg = next(iter(task_args), {})
        self.assertEquals(self.program.id, params_arg.get("program_id"),
                          msg="The expected program ID isn't present in the task's first argument")

        # Emulate executing the task without going through django-q
        # There's currently no easy way to do so
        f = task_dict.get("func")
        self.assertEqual(f, email_handler)
        f(*task_dict.get("args"), **task_dict.get("kwargs"))

        # Ensure an email was sent out
        msg = mail.outbox[0]
        self.assertEqual([self.user.email], msg.to)


    @parameterized.expand([
        (
            'py-reports-organisation-results-indicators-table', '',
            results_indicators_excel_report.REPORT_NAME,
            results_indicators_excel_report.handle_email_report,
        ),
    ])
    def test_send_org_reports_via_djangoq_email(self, url_name, query_params, report_name, email_handler):
        self.c.get(f"{reverse(url_name, args=(self.org.id,))}?{query_params}")

        # Check that the task was enqueued with django-q
        enqueued_task = OrmQ.objects.first()
        self.assertIsNotNone(enqueued_task)
        task_dict = SignedPackage.loads(enqueued_task.payload)
        self.assertEquals(task_dict.get("name"), report_name)

        # And with the correct program
        task_args = task_dict.get("args")
        params_arg = next(iter(task_args), {})
        self.assertEquals(self.org.id, params_arg.get("org_id"),
                          msg="The expected organisation ID isn't present in the task's first argument")

        # Emulate executing the task without going through django-q
        # There's currently no easy way to do so
        f = task_dict.get("func")
        self.assertEqual(f, email_handler)
        f(*task_dict.get("args"), **task_dict.get("kwargs"))

        # Ensure an email was sent out
        msg = mail.outbox[0]
        self.assertEqual([self.user.email], msg.to)
