# -*- coding: utf-8 -*-
# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import json
import logging

from datetime import datetime, timedelta

from django.conf import settings
from django.db.models import QuerySet, Q
from django.utils.timezone import now

from akvo.iati.iati_validator import IATIValidatorAPI, IATIValidationResult
from akvo.rsr.models import Project, Organisation, IatiActivityValidationJob, IatiOrganisationValidationJob
from akvo.utils import rsr_send_mail

from .rate_limiter import RequestRate, RateLimiter
from .internal_validator_runner import CheckResult, run_internal_project_validator
from .iati_validation_job_runner import IatiActivityValidationJobRunner, IatiOrganisationValidationJobRunner

VALIDATOR_TIMEOUT = 30  # seconds
VALIDATOR_MAX_ATTEMPTS = getattr(settings, 'IATI_VALIDATOR_MAX_ATTEMPTS', 3)
STARTED_JOB_TIMEOUT = timedelta(seconds=VALIDATOR_TIMEOUT + 10)
validator = IATIValidatorAPI(getattr(settings, 'IATI_VALIDATOR_SUBSCRIPTION_KEY', ''), VALIDATOR_TIMEOUT)
logger = logging.getLogger(__name__)
rate_limiter = RateLimiter([
    RequestRate(
        count=getattr(settings, 'IATI_VALIDATOR_RATE_LIMIT_COUNT', 0),
        period=getattr(settings, 'IATI_VALIDATOR_RATE_LIMIT_PERIOD', timedelta(seconds=0)),
        even_pace=True
    ),
    RequestRate(
        count=getattr(settings, 'IATI_VALIDATOR_QUOTA_COUNT', 0),
        period=getattr(settings, 'IATI_VALIDATOR_QUOTA_PERIOD', timedelta(seconds=0))
    )
])


def run_iati_activity_validation_job(scheduled_at: datetime = now()):
    if not rate_limiter.is_allowed():
        return
    pending_jobs = get_pending_activity_jobs(scheduled_at)
    if not pending_jobs.exists():
        return
    job = pending_jobs.first()
    project = job.project
    check_result = run_internal_project_validator(project)
    job_runner = IatiActivityValidationJobRunner(validator, job)
    validator_result = job_runner.run()
    if not validator_result:
        return
    process_activity_validation_results(project, validator_result, check_result)


def get_pending_jobs(queryset: QuerySet, scheduled_at: datetime) -> QuerySet:
    failed_at = now() - STARTED_JOB_TIMEOUT
    return queryset.filter(
        scheduled_at__lte=scheduled_at,
        finished_at__isnull=True
    ).exclude(
        Q(attempts__gte=VALIDATOR_MAX_ATTEMPTS) | Q(started_at__gte=failed_at)
    )


def get_pending_activity_jobs(scheduled_at: datetime) -> QuerySet:
    return get_pending_jobs(IatiActivityValidationJob.objects.select_related('project'), scheduled_at)


def process_activity_validation_results(project: Project, validator_result: IATIValidationResult, check_result: CheckResult):
    if check_result.error_count == validator_result.error_count:
        return
    email_recipients = getattr(settings, 'IATI_ACTIVITY_VALIDATION_ERROR_RECIPIENTS', [])
    if not email_recipients:
        message = f'Inconsistent IATI activity validation results for project: {project.title}\n'\
            f'IATI validator: {validator_result.error_count} errors, {validator_result.warning_count} warnings\n'\
            f'Internal validator: {check_result.error_count} errors, {check_result.warning_count} warnings'
        logger.info(message)
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


def run_iati_organisation_validation_job(scheduled_at: datetime = now()):
    if not rate_limiter.is_allowed():
        return
    pending_jobs = get_pending_organisation_jobs(scheduled_at)
    if not pending_jobs.exists():
        return
    job = pending_jobs.first()
    organisation = job.organisation
    job_runner = IatiOrganisationValidationJobRunner(validator, job)
    validator_result = job_runner.run()
    if not validator_result:
        return
    process_organisation_validation_results(organisation, validator_result)


def get_pending_organisation_jobs(scheduled_at: datetime = now()):
    return get_pending_jobs(IatiOrganisationValidationJob.objects.select_related('organisation'), scheduled_at)


def process_organisation_validation_results(organisation: Organisation, validator_result: IATIValidationResult):
    if validator_result.error_count == 0 and validator_result.warning_count == 0:
        return
    email_recipients = getattr(settings, 'IATI_ORGANISATION_VALIDATION_ERROR_RECIPIENTS', [])
    if not email_recipients:
        message = f'IATI validation error for organisation: {organisation.name}\n'\
            f'errors: {validator_result.error_count}\n'\
            f'warnings: {validator_result.warning_count}'
        logger.info(message)
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
