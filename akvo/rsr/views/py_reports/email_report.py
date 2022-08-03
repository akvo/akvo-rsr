import logging

from datetime import timedelta
from django.db.models import Q
from django.utils.timezone import now
from akvo.rsr.models import EmailReportJob

from .program_overview_pdf_report import email_report as handle_program_overview_pdf_report
from .program_overview_excel_report import send_report as handle_program_overview_excel_report

TIMEOUT = timedelta(minutes=30)
MAX_ATTEMPTS = 3
HANDLER = {
    'program_overview_pdf_report': handle_program_overview_pdf_report,
    'program_overview_excel_report': handle_program_overview_excel_report,
}

logger = logging.getLogger(__name__)


def run_job():
    pending_jobs = _get_pending_jobs()
    if not pending_jobs.exists():
        return
    job = pending_jobs.first()
    job.mark_started()
    try:
        handler = _get_report_handler(job.report)
        if handler:
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


def _get_report_handler(report):
    return HANDLER[report] if report in HANDLER else None
