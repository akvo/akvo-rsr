# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from akvo.iati.exports.iati_export import IatiXML
from akvo.rsr.fields import ValidXMLCharField
from akvo.rsr.mixins import TimestampsMixin

from datetime import datetime

from django.db import models
from django.conf import settings
from django.utils.translation import ugettext_lazy as _


def file_path(self, filename):
    return 'db/organisation/%s/iati/%s' % (str(self.reporting_organisation.pk), filename)


STATUS_CODE = {
    1: _(u'pending'),
    2: _(u'in progress'),
    3: _(u'completed'),
    4: _(u'cancelled')
}


class IatiExport(TimestampsMixin, models.Model):
    reporting_organisation = models.ForeignKey(
        'Organisation', verbose_name=_(u'reporting organisation'), related_name='iati_exports'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, verbose_name=_(u'user'), related_name='iati_exports'
    )
    projects = models.ManyToManyField('Project', verbose_name=_(u'projects'))
    version = ValidXMLCharField(_(u'version'), max_length=4, default='2.02')
    status = models.PositiveSmallIntegerField(_(u'status'), default=1)
    iati_file = models.FileField(_(u'IATI file'), blank=True, upload_to=file_path)
    is_public = models.BooleanField(_(u'public'), default=True)

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'IATI export')
        verbose_name_plural = _(u'IATI exports')

    def __unicode__(self):
        if self.reporting_organisation and self.reporting_organisation.get_name:
            return u'%s %s' % (_(u'IATI export for'), self.reporting_organisation.get_name)
        else:
            return u'%s' % _(u'IATI export for unknown organisation')

    def show_status(self):
        if self.status not in STATUS_CODE.keys():
            return _(u'unknown status')
        else:
            return STATUS_CODE[self.status].title()

    def update_status(self, status_code):
        """
        Update the status of this IATI export.

        :param status_code; Integer in STATUS_CODE keys
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
        # Set status to 'In progress'
        self.update_status(2)

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

                # All done, so update the status to 'Completed'
                self.update_status(3)
            except:
                # Something went wrong, so update the status to 'Cancelled'
                self.update_status(4)
        else:
            # No projects, so update the status to 'Cancelled'
            self.update_status(4)

    def processed_projects(self):
        """
        Find the number of processed projects of this IATI export. Generally, for completed
        exports, this number will be the same as the number of total projects.
        """
        return self.iati_activity_exports.filter(status=2).count()
