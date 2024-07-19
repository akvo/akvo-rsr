# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from akvo.iati.exports.iati_export import IatiXML
from akvo.rsr.fields import ValidXMLCharField
from akvo.rsr.mixins import TimestampsMixin

from datetime import datetime

from django.db import models, transaction
from django.conf import settings
from django.utils.translation import gettext_lazy as _


def file_path(self, filename):
    return 'db/organisation/%s/iati/%s' % (str(self.reporting_organisation.pk), filename)


class IatiExport(TimestampsMixin):
    STATUS_PENDING = 1
    STATUS_IN_PROGRESS = 2
    STATUS_COMPLETED = 3
    STATUS_CANCELLED = 4
    STATUS_CODE = {
        STATUS_PENDING: _('pending'),
        STATUS_IN_PROGRESS: _('in progress'),
        STATUS_COMPLETED: _('completed'),
        STATUS_CANCELLED: _('cancelled')
    }

    reporting_organisation = models.ForeignKey(
        'Organisation', on_delete=models.CASCADE, verbose_name=_('reporting organisation'), related_name='iati_exports'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, verbose_name=_('user'), related_name='iati_exports'
    )
    projects = models.ManyToManyField('Project', verbose_name=_('projects'))
    version = ValidXMLCharField(_('version'), max_length=4, default='2.03')
    status = models.PositiveSmallIntegerField(_('status'), default=STATUS_PENDING)
    iati_file = models.FileField(_('IATI file'), blank=True, upload_to=file_path)
    latest = models.BooleanField(_('latest'), default=False)

    class Meta:
        app_label = 'rsr'
        verbose_name = _('IATI export')
        verbose_name_plural = _('IATI exports')
        ordering = ('id',)

    def __str__(self):
        if self.reporting_organisation and self.reporting_organisation.name:
            return '%s %s' % (_('IATI export for'), self.reporting_organisation.name)
        else:
            return '%s' % _('IATI export for unknown organisation')

    @property
    def is_latest(self):
        return self.latest

    @is_latest.setter
    def is_latest(self, latest):
        if not latest:
            self.latest = False
            self.save(update_fields=['latest'])
            return

        with transaction.atomic():
            # Set all other exports to not be latest
            latest_exports = IatiExport.objects.filter(
                latest=True, reporting_organisation=self.reporting_organisation)
            latest_exports.update(latest=False)
            # Set current export to be latest
            self.latest = True
            self.save(update_fields=['latest'])

    def show_status(self):
        if self.status not in self.STATUS_CODE:
            return _('unknown status')
        else:
            return self.STATUS_CODE[self.status].title()

    def update_status(self, status_code):
        """
        Update the status of this IATI export.

        :param status_code; Integer in self.STATUS_CODE keys
        """
        self.status = status_code
        self.save(update_fields=['status'])

    def update_iati_file(self, iati_file):
        """
        Update the IATI file of this IATI export.

        :param iati_file; File object
        """
        self.iati_file = iati_file
        self.save(update_fields=['iati_file'])

    def create_iati_file(self):
        """
        Create an IATI XML file.
        """
        self.update_status(self.STATUS_IN_PROGRESS)

        # Retrieve all projects
        projects = self.projects.all()
        if projects:
            try:
                # Generate and save the IATI file
                iati_xml = IatiXML(projects, self.version, self)
                self.update_iati_file(iati_xml.save_file(
                    str(self.reporting_organisation.pk),
                    datetime.utcnow().strftime("%Y%m%d-%H%M%S") + '.xml')
                )

                self.update_status(self.STATUS_COMPLETED)
                self.is_latest = True
            except Exception:
                self.update_status(self.STATUS_CANCELLED)
        else:
            self.update_status(self.STATUS_CANCELLED)

    def processed_projects(self):
        """
        Find the number of processed projects of this IATI export. Generally, for completed
        exports, this number will be the same as the number of total projects.
        """
        return self.iati_activity_exports.filter(status=self.STATUS_IN_PROGRESS).count()
