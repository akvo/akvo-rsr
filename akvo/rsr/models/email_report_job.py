from django.db import models
from django.utils.timezone import now


class EmailReportJob(models.Model):
    created_at = models.DateTimeField(null=True, auto_now_add=True, db_index=True, editable=False)
    started_at = models.DateTimeField(null=True)
    finished_at = models.DateTimeField(null=True)
    attempts = models.PositiveSmallIntegerField(default=0)
    report = models.CharField(max_length=100)
    payload = models.JSONField(default=dict)
    recipient = models.EmailField()

    def mark_started(self):
        self.started_at = now()
        self.attempts = self.attempts + 1
        self.save(update_fields=['started_at', 'attempts'])

    def mark_finished(self):
        self.finished_at = now()
        self.save(update_fields=['finished_at'])
