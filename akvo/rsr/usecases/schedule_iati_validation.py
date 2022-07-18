# -*- coding: utf-8 -*-
# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from datetime import datetime, timedelta
from django.utils.timezone import now
from akvo.rsr.models import Project, Organisation, IatiActivityValidationJob, IatiOrganisationValidationJob
from typing import Optional

DEFAULT_SCHEDULE_DELAY_TIME = timedelta(minutes=15)


def schedule_iati_activity_validation(project: Project, schedule_at: Optional[datetime] = None):
    scheduled_at = schedule_at if schedule_at else now() + DEFAULT_SCHEDULE_DELAY_TIME
    pending_jobs = IatiActivityValidationJob.objects.filter(project=project, started_at=None)
    if pending_jobs.exists():
        job = pending_jobs.first()
        job.scheduled_at = scheduled_at
        job.save(update_fields=['scheduled_at'])
    else:
        IatiActivityValidationJob.objects.create(project=project, scheduled_at=scheduled_at)


def schedule_iati_organisation_validation(organisation: Organisation, schedule_at: Optional[datetime] = None):
    scheduled_at = schedule_at if schedule_at else now() + DEFAULT_SCHEDULE_DELAY_TIME
    pending_jobs = IatiOrganisationValidationJob.objects.filter(organisation=organisation, started_at=None)
    if pending_jobs.exists():
        job = pending_jobs.first()
        job.scheduled_at = scheduled_at
        job.save(update_fields=['scheduled_at'])
    else:
        IatiOrganisationValidationJob.objects.create(organisation=organisation, scheduled_at=scheduled_at)
