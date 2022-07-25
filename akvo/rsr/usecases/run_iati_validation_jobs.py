# -*- coding: utf-8 -*-
# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import json
import logging

from datetime import datetime, timedelta
from dataclasses import dataclass
from lxml import etree
from typing import List, Tuple, Dict, Optional

from django.conf import settings
from django.db import transaction
from django.db.models import QuerySet, Q
from django.utils.timezone import now

from akvo.iati.iati_validator import IATIValidatorAPI, IATIValidationResult, IATIValidatorException, IATIValidatorTimeoutException
from akvo.iati.checks.iati_checks import IatiChecks
from akvo.iati.exports.iati_export import IatiXML
from akvo.iati.exports.iati_org_export import IatiOrgXML
from akvo.rsr.models import Project, Organisation, IatiActivityValidationJob, IatiOrganisationValidationJob, IatiCheck
from akvo.utils import rsr_send_mail

logger = logging.getLogger(__name__)

VALIDATOR_TIMEOUT = 30  # seconds
VALIDATOR_MAX_ATTEMPTS = getattr(settings, 'IATI_VALIDATOR_MAX_ATTEMPTS', 3)
validator = IATIValidatorAPI(getattr(settings, 'IATI_VALIDATOR_SUBSCRIPTION_KEY', ''), VALIDATOR_TIMEOUT)


@dataclass(frozen=True)
class RequestRate:
    count: int
    period: timedelta


class IATIValidatorRateLimiter:

    def __init__(self, short_term: RequestRate, long_term: RequestRate):
        self.short_term = short_term
        self.long_term = long_term

    def is_allowed(self) -> bool:
        if not self._apply_rate(self.long_term):
            return False
        if not self._apply_rate(self.short_term, regulate=True):
            return False
        return True

    def _apply_rate(self, rate: RequestRate, regulate: bool = False) -> bool:
        if rate.count == 0 or rate.period.total_seconds() == 0:
            return True
        finished_at = now() - rate.period
        count, latest = self._get_finished_jobs_summary(finished_at)
        if count >= rate.count:
            return False
        if not regulate:
            return True
        # Spread the request evenly in the given time period
        spacing = timedelta(seconds=rate.period.total_seconds() / rate.count)
        if latest and latest >= now() - spacing:
            return False
        return True

    def _get_finished_jobs_summary(self, finished_at: datetime) -> Tuple[int, Optional[datetime]]:
        activity_jobs = IatiActivityValidationJob.objects.filter(finished_at__gt=finished_at)
        organisation_jobs = IatiOrganisationValidationJob.objects.filter(finished_at__gt=finished_at)
        job_count = activity_jobs.count() + organisation_jobs.count()
        datetimes = [j.finished_at for j in [
            activity_jobs.order_by('-finished_at').first(),
            organisation_jobs.order_by('-finished_at').first()
        ] if j]
        latest = max(datetimes) if datetimes else None
        return (job_count, latest)


rate_limiter = IATIValidatorRateLimiter(
    short_term=RequestRate(
        count=getattr(settings, 'IATI_VALIDATOR_RATE_LIMIT_COUNT', 0),
        period=getattr(settings, 'IATI_VALIDATOR_RATE_LIMIT_PERIOD', timedelta(seconds=0))
    ),
    long_term=RequestRate(
        count=getattr(settings, 'IATI_VALIDATOR_QUOTA_COUNT', 0),
        period=getattr(settings, 'IATI_VALIDATOR_QUOTA_PERIOD', timedelta(seconds=0))
    )
)


def run_iati_activity_validation_job(scheduled_at: datetime = now()):
    if not rate_limiter.is_allowed():
        return
    pending_jobs = get_pending_activity_jobs(scheduled_at)
    if not pending_jobs.exists():
        return
    job = pending_jobs.first()
    project = job.project
    check_result = run_internal_project_validator(project)
    job.mark_started()
    try:
        validator_result = validator.validate(get_iati_activity_xml_doc(project))
        job.mark_finished()
        process_activity_validation_results(project, validator_result, check_result)
    except IATIValidatorTimeoutException:
        pass  # retry on next round
    except IATIValidatorException:
        logger.exception(f'Failed to run IATI validator for project: {project.title}')


def get_pending_activity_jobs(scheduled_at: datetime) -> QuerySet:
    # Add 10 seconds to avoid race conditions for the failed jobs
    timeout_at = now() - timedelta(seconds=VALIDATOR_TIMEOUT + 10)
    return IatiActivityValidationJob.objects\
        .select_related('project')\
        .filter(scheduled_at__lte=scheduled_at, finished_at__isnull=True)\
        .exclude(Q(attempts__gte=VALIDATOR_MAX_ATTEMPTS) | Q(started_at__gte=timeout_at))


@dataclass(frozen=True)
class CheckResult:
    error_count: int
    warning_count: int
    data: List[Tuple[str, str]]


def run_internal_project_validator(project: Project):
    iati_checks = IatiChecks(project)
    _, check_result = iati_checks.perform_checks()
    error_count = len([status for (status, _) in check_result if status == 'error'])
    warning_count = len([status for (status, _) in check_result if status == 'warning'])
    result = CheckResult(error_count=error_count, warning_count=warning_count, data=check_result)
    _persist_internal_project_validator_result(project, result)
    return result


def _persist_internal_project_validator_result(project: Project, result: CheckResult):
    status_codes = {
        'warning': 2,
        'error': 3
    }
    checks = [
        IatiCheck(project=project, status=status_codes[status], description=description)
        for (status, description) in result.data if status in status_codes
    ]
    with transaction.atomic():
        # Remove old IATI checks
        project.iati_checks.all().delete()
        # Save new checks to DB
        IatiCheck.objects.bulk_create(checks)


def process_activity_validation_results(project: Project, validator_result: IATIValidationResult, check_result: CheckResult):
    if check_result.error_count == validator_result.error_count:
        return
    message = f'Inconsistent IATI activity validation results for project: {project.title}\n'\
        f'IATI validator: {validator_result.error_count} errors, {validator_result.warning_count} warnings\n'\
        f'Internal validator: {check_result.error_count} errors, {check_result.warning_count} warnings'
    logger.info(message)
    email_recipients = getattr(settings, 'IATI_ACTIVITY_VALIDATION_ERROR_RECIPIENTS', [])
    if not email_recipients:
        return
    attachments = [{
        'filename': 'iati-validator-api-result.json',
        'content': json.dumps(validator_result.data, indent=2),
        'mimetype': 'application/json'
    }, {
        'filename': 'rsr-custom-validator-result.json',
        'content': json.dumps(check_result.data, indent=2),
        'mimetype': 'application/json'
    }]
    rsr_send_mail(
        email_recipients,
        subject='iati_validation/activity_error_subject.txt',
        message='iati_validation/activity_error_message.txt',
        msg_context={'project': project, 'api_result': validator_result, 'rsr_result': check_result},
        attachments=attachments
    )


def get_iati_activity_xml_doc(project: Project) -> bytes:
    return etree.tostring(etree.ElementTree(IatiXML([project]).iati_activities))


def run_iati_organisation_validation_job(scheduled_at: datetime = now()):
    if not rate_limiter.is_allowed():
        return
    pending_jobs = get_pending_organisation_jobs(scheduled_at)
    if not pending_jobs.exists():
        return
    job = pending_jobs.first()
    organisation = job.organisation
    job.mark_started()
    try:
        validator_result = validator.validate(get_iati_organisation_xml_doc(organisation))
        job.mark_finished()
        process_organisation_validation_results(organisation, validator_result)
    except IATIValidatorTimeoutException:
        pass  # retry on next round
    except IATIValidatorException:
        logger.exception(f'Failed to run IATI validator for organisation: {organisation.name}')


def get_pending_organisation_jobs(scheduled_at: datetime = now()):
    # Add 10 seconds to avoid race conditions for the failed jobs
    timeout_at = now() - timedelta(seconds=VALIDATOR_TIMEOUT + 10)
    return IatiOrganisationValidationJob.objects\
        .select_related('organisation')\
        .filter(scheduled_at__lte=scheduled_at, finished_at__isnull=True)\
        .exclude(Q(attempts__gte=VALIDATOR_MAX_ATTEMPTS) | Q(started_at__gte=timeout_at))


def process_organisation_validation_results(organisation: Organisation, validator_result: IATIValidationResult):
    if validator_result.error_count == 0 and validator_result.warning_count == 0:
        return
    message = f'IATI validation error for organisation: {organisation.name}\n'\
        f'errors: {validator_result.error_count}\n'\
        f'warnings: {validator_result.warning_count}'
    logger.info(message)
    email_recipients = getattr(settings, 'IATI_ORGANISATION_VALIDATION_ERROR_RECIPIENTS', [])
    if not email_recipients:
        return
    attachments = [{
        'filename': 'iati-validator-api-result.json',
        'content': json.dumps(validator_result.data, indent=2),
        'mimetype': 'application/json'
    }]
    rsr_send_mail(
        email_recipients,
        subject='iati_validation/organisation_error_subject.txt',
        message='iati_validation/organisation_error_message.txt',
        msg_context={'organisation': organisation, 'result': validator_result},
        attachments=attachments
    )


def get_iati_organisation_xml_doc(organisation: Organisation, context: Dict[str, str] = {}) -> bytes:
    return etree.tostring(etree.ElementTree(IatiOrgXML([organisation], context).iati_organisations))
