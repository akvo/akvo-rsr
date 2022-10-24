from typing import List, Tuple
from dataclasses import dataclass
from django.db import transaction
from akvo.iati.checks.iati_checks import IatiChecks
from akvo.rsr.models import Project, IatiCheck


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
    persist_internal_project_validator_result(project, result)
    return result


def persist_internal_project_validator_result(project: Project, result: CheckResult):
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
