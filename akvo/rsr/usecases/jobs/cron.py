import psutil

from akvo.rsr.models.cron_job import CronJobMixin


def is_job_dead(job: CronJobMixin):
    if not (pid := job.pid):
        return False
    return not psutil.pid_exists(pid) and job.status == job.Status.RUNNING
