import logging

from datetime import timedelta
from django.db.models import Q
from django.utils.timezone import now
from akvo.rsr.models import EmailReportJob

from . import (
    program_overview_pdf_report,
    program_overview_excel_report,
    program_period_labels_overview_pdf_report,
    results_indicators_with_map_pdf_reports,
    nuffic_country_level_map_report,
)

TIMEOUT = timedelta(minutes=30)
MAX_ATTEMPTS = 3
HANDLER = {
    program_overview_pdf_report.REPORT_NAME: program_overview_pdf_report.handle_email_report,
    program_overview_excel_report.REPORT_NAME: program_overview_excel_report.handle_email_report,
    program_period_labels_overview_pdf_report.REPORT_NAME: program_period_labels_overview_pdf_report.handle_email_report,
    results_indicators_with_map_pdf_reports.ORG_PROJECTS_REPORT_NAME: results_indicators_with_map_pdf_reports.handle_org_projects_email_report,
    nuffic_country_level_map_report.REPORT_NAME: nuffic_country_level_map_report.handle_email_report,
}

logger = logging.getLogger(__name__)


def run_job():
    pending_jobs = _get_pending_jobs()
    if not pending_jobs.exists():
        return
    job = pending_jobs.first()
    job.mark_started()
    try:
        handler = HANDLER.get(job.report, None)
        if handler:
            logger.info("Handling job %s for report %s with %s", job.id, job.report)
            handler(job.payload, job.recipient)
        job.mark_finished()
    except Exception:
        logger.exception(f'Failed to genereate report {job.report} for {job.recipient}')


def _get_pending_jobs():
    started_timeout = now() - TIMEOUT
    return EmailReportJob.objects\
        .order_by('created_at')\
        .filter(finished_at__isnull=True)\
        .exclude(Q(attempts__gte=MAX_ATTEMPTS) | Q(started_at__gte=started_timeout))
