import math
import tablib
from dataclasses import dataclass, field
from decimal import Decimal
from typing import List, Optional
from django.conf import settings
from django.db.models import Q
from akvo.rsr.models import Project, IndicatorPeriod
from akvo.rsr.models.result.utils import QUANTITATIVE
from akvo.rsr.usecases.period_update_aggregation import calculate_period_actual_value
from akvo.utils import ensure_decimal, rsr_send_mail

DECIMAL_TOLERANCE = 0.0001


@dataclass(frozen=True)
class FailureItem:
    period: IndicatorPeriod
    expected_value: Decimal


@dataclass
class AuditResult:
    success: int = 0
    failures: List[FailureItem] = field(default_factory=list)

    def increment_success(self):
        self.success += 1

    def add_failure(self, failure: FailureItem):
        self.failures.append(failure)

    @property
    def failure_count(self):
        return len(self.failures)

    @property
    def total_count(self):
        return self.success + self.failure_count


def audit_period_aggregation(period: IndicatorPeriod, result: Optional[AuditResult] = None) -> AuditResult:
    result = result or AuditResult()
    value, *_ = calculate_period_actual_value(period)
    if math.isclose(ensure_decimal(period.actual_value), value, abs_tol=DECIMAL_TOLERANCE):
        result.increment_success()
    elif period.indicator.is_cumulative() and not period.approved_updates.exists():
        # carried-over value in the cumulative period is not saved until the actual update for that period is approved
        result.increment_success()
    else:
        result.add_failure(FailureItem(period=period, expected_value=value))
    for child_period in period.child_periods.all():
        audit_period_aggregation(child_period, result)
    return result


def audit_project_aggregation(project: Project, send_mail=True):
    running_quantitative_periods = IndicatorPeriod.objects\
        .filter(indicator__result__project=project, indicator__type=QUANTITATIVE)\
        .exclude(Q(actual_value__isnull=True) | Q(actual_value__exact=''))
    result = AuditResult()
    for period in running_quantitative_periods:
        audit_period_aggregation(period, result)
    _process_audit_result(project, result, send_mail)
    return result


def _process_audit_result(project: Project, result: AuditResult, send_mail):
    print(f"Audited {result.total_count} periods, {result.failure_count} errors found")
    if not result.failures:
        return
    failure_report = _create_failure_report(result)
    email_recipients = getattr(settings, 'PROJECT_AGGREGATION_ERROR_RECIPIENTS', [])
    if email_recipients and send_mail:
        content = f"The following aggregation problem were detected\n\n{failure_report.export('tsv')}"
        attachments = [{
            'filename': 'aggregation_errors.tsv',
            'content': content,
            'mimetype': 'text/tab-separated-values'
        }]
        rsr_send_mail(
            email_recipients,
            subject='audit_aggregation/subject.txt',
            message='audit_aggregation/message.txt',
            msg_context={'project': project, 'result': result},
            attachments=attachments
        )
    print(failure_report.export('tsv'))


def _create_failure_report(result):
    dataset = tablib.Dataset()
    dataset.headers = [
        'Project',
        'Result',
        'Indicator',
        'Period',
        'Current value',
        'Expected value',
    ]
    for item in result.failures:
        period = item.period
        indicator = period.indicator
        result = indicator.result
        project = result.project
        dataset.append([
            f"{project.title} (ID: {project.id})",
            result.title,
            indicator.title,
            str(period),
            period.actual_value,
            str(item.expected_value),
        ])
    return dataset
