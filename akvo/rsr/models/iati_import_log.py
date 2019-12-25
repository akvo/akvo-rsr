# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from collections import namedtuple

from django.contrib.admin.models import ADDITION, CHANGE, DELETION
from django.core import urlresolvers
from django.db import models
from django.utils.translation import ugettext as _

from akvo.rsr.fields import ValidXMLTextField, ValidXMLCharField

assert ADDITION == 1, 'django.contrib.admin.models.ADDITION is not equal to 1 any more. Chaos awaits'
assert CHANGE == 2, 'django.contrib.admin.models.CHANGE is not equal to 2 any more. Chaos awaits'
assert DELETION == 3, 'django.contrib.admin.models.DELETION is not equal to 3 any more. Chaos awaits'

IatiImportLogCollector = namedtuple('IatiImportLogCollector',
                                    [
                                        'iati_import_job',
                                        'project',
                                        'activity',
                                        'message_type',
                                        'tag',
                                        'model',
                                        'field',
                                        'text',
                                        'created_at',
                                    ]
                                    )

LogEntryType = namedtuple(
    'LogEntryType',
    [
        'ACTION_CREATE',
        'ACTION_UPDATE',
        'ACTION_DELETE',
        'STATUS_PENDING',
        'STATUS_RETRIEVING',
        'STATUS_IN_PROGRESS',
        'STATUS_COMPLETED',
        'STATUS_CANCELLED',
        'STATUS_NO_CHANGES',
        'INFORMATIONAL',
        'CRITICAL_ERROR',
        'VALUE_NOT_SAVED',
        'VALUE_PARTLY_SAVED',
    ]
)
LOG_ENTRY_TYPE = LogEntryType(
    ACTION_CREATE=ADDITION,
    ACTION_UPDATE=CHANGE,
    ACTION_DELETE=DELETION,
    STATUS_PENDING=10,
    STATUS_RETRIEVING=11,
    STATUS_IN_PROGRESS=12,
    STATUS_COMPLETED=13,
    STATUS_CANCELLED=14,
    STATUS_NO_CHANGES=15,
    INFORMATIONAL=20,
    VALUE_NOT_SAVED=21,
    VALUE_PARTLY_SAVED=22,
    CRITICAL_ERROR=30,
)

MESSAGE_TYPE_LABELS = (
    _(u'create action'),
    _(u'update action'),
    _(u'delete action'),
    _(u'status pending'),
    _(u'status retrieving'),
    _(u'status in progress'),
    _(u'status complete'),
    _(u'status cancelled'),
    _(u'status no changes'),
    _(u'information'),
    _(u'critical error'),
    _(u'value not saved'),
    _(u'value partly saved'),
)


class IatiImportLog(models.Model):
    """
    IatiImportLog log the progress of an import.

    Fields:
    iati_import_job: FK to the job we are logging for
    project: the project the log is for, if applicable
    iati_activity_import: FK to the IatiActivityImport, if applicable
    message_type: logging is used both for "high" and "low" levels of logging, this is indicated by
                  the MESSAGE_TYPE_CODES
    tag: the IATI XML tag the log entry refers to, if applicable
    model: the model the log entry refers to, if applicable
    field: the model field the log entry refers to, if applicable
    text: log entry free text
    created_at: timestamp field
    """
    MESSAGE_TYPE_CODES = zip(LOG_ENTRY_TYPE, MESSAGE_TYPE_LABELS)

    iati_import_job = models.ForeignKey(
        'IatiImportJob', verbose_name=_(u'iati import'), related_name='iati_import_logs'
    )
    project = models.ForeignKey('Project', verbose_name=_(u'project'),
                                related_name='iati_project_import_logs',
                                blank=True, null=True, on_delete=models.SET_NULL)
    iati_activity_import = models.ForeignKey('IatiActivityImport', verbose_name=_(u'activity'),
                                             blank=True, null=True,)
    message_type = models.PositiveSmallIntegerField(
        verbose_name=_(u'type of message'), choices=MESSAGE_TYPE_CODES,
        default=LOG_ENTRY_TYPE.CRITICAL_ERROR)
    tag = ValidXMLCharField(_(u'xml tag'), max_length=100, default='',)
    model = ValidXMLCharField(_(u'model'), max_length=255, default='',)
    field = ValidXMLCharField(_(u'field'), max_length=100, default='',)
    text = ValidXMLTextField(_(u'text'))
    created_at = models.DateTimeField(db_index=True, editable=False)

    def __unicode__(self):
        return u'{} (ID: {}): {}'.format(self.iati_import_job.iati_import.label,
                                         self.iati_import_job.iati_import.pk, self.text)
        # return u'Iati Import Log ID: {}'.format(self.pk)

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'IATI import log')
        verbose_name_plural = _(u'IATI import logs')
        ordering = ('created_at',)

    def model_field(self):
        "Concatenate name of the model and the field. Used in the admin list display"
        def get_model_name(model_string):
            name = model_string.split('.')[-1][:-2]
            if not name:
                return model_string
            return name

        if self.model:
            model_name = get_model_name(self.model)
            if self.field:
                return '{}.{}'.format(model_name, self.field)
            else:
                return model_name
        else:
            return self.field

    def show_message_type(self):
        return dict([x for x in self.MESSAGE_TYPE_CODES])[self.message_type]

    def activity_admin_url(self):
        """ Returns a link to the admin change view of the IatiActivityImport object associated with
            this log entry
        """
        return u'<a href="{}">{}</a>'.format(
            urlresolvers.reverse(
                'admin:rsr_iatiactivityimport_change', args=(self.iati_activity_import.pk,)),
            self.iati_activity_import.__unicode__())

    activity_admin_url.allow_tags = True
    activity_admin_url.short_description = "IATI activity import"

    def iati_import_job_admin_url(self):
        """ Returns a link to the admin change view of the IatiImportJob object associated with this
            log entry
        """
        return u'<a href="{}">{}</a>'.format(
            urlresolvers.reverse(
                'admin:rsr_iatiimportjob_change', args=(self.iati_import_job.pk,)),
            self.iati_import_job.__unicode__())

    iati_import_job_admin_url.allow_tags = True
    iati_import_job_admin_url.short_description = "IATI import job"
