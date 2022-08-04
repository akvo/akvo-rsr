# -*- coding: utf-8 -*-
# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from django.db import models
from django.utils.timezone import now


class IatiValidationJobMixin(models.Model):
    scheduled_at = models.DateTimeField(help_text='Date and time after which the job is expected to run')
    started_at = models.DateTimeField(null=True, help_text='Date and time when the job is runned')
    finished_at = models.DateTimeField(null=True, help_text='Date and time when the job is done')
    attempts = models.IntegerField(default=0)

    def mark_started(self):
        self.started_at = now()
        self.attempts = self.attempts + 1
        self.save(update_fields=['started_at', 'attempts'])

    def mark_finished(self):
        self.finished_at = now()
        self.save(update_fields=['finished_at'])

    class Meta:
        abstract = True
        ordering = ('scheduled_at',)


class IatiActivityValidationJob(IatiValidationJobMixin):
    project = models.ForeignKey('Project', on_delete=models.CASCADE)

    def __str__(self):
        return f'IatiActivityValidationJob(pk={self.pk}, project={self.project.title})'


class IatiOrganisationValidationJob(IatiValidationJobMixin):
    organisation = models.ForeignKey('Organisation', on_delete=models.CASCADE)

    def __str__(self):
        return f'IatiOrganisationValidationJob(pk={self.pk}, organisation={self.organisation.name})'
