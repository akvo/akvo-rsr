import os

from django.db import models
from django.utils.translation import gettext_lazy as _


class CronJobMixin(models.Model):
    class Status(models.TextChoices):
        SCHEDULED = 'SCHEDULED', _('Scheduled')
        RUNNING = 'RUNNING', _('Running')
        FINISHED = 'FINISHED', _('Finished')
        FAILED = 'FAILED', _('Failed')
        MAXXED = 'MAXXED', _('Max attempts reached')

    status = models.CharField(
        max_length=15,
        choices=Status.choices,
        default=Status.SCHEDULED,
    )
    attempts = models.IntegerField(default=0)
    pid = models.PositiveIntegerField(null=True)
    updated_at = models.DateTimeField(auto_now=True)

    def mark_running(self):
        self.status = self.Status.RUNNING
        self.pid = os.getpid()
        self.save()

    def mark_finished(self):
        self.status = self.Status.FINISHED
        self.pid = None
        self.attempts = self.attempts + 1
        self.save()

    def mark_scheduled(self):
        self.status = self.Status.SCHEDULED
        self.pid = None
        self.save()

    def mark_failed(self):
        self.status = self.Status.FAILED
        self.attempts = self.attempts + 1
        self.pid = None
        self.save()

    def mark_maxxed(self):
        self.status = self.Status.MAXXED
        self.pid = None
        self.save()

    class Meta:
        abstract = True
