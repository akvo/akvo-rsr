# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from datetime import datetime, timedelta
from decimal import Decimal

from django.conf import settings
from django.db import models
from django.utils.translation import ugettext_lazy as _

from django_counter.models import ViewCounter

from sorl.thumbnail.fields import ImageField
from embed_video.fields import EmbedVideoField

from akvo.utils import rsr_image_path, to_gmt

from ..fields import ValidXMLCharField, ValidXMLTextField
from ..mixins import TimestampsMixin


def image_path(instance, file_name):
    """Create a path like 'db/project/<update.project.id>/update/<update.id>/image_name.ext'"""
    path = 'db/project/%d/update/%%(instance_pk)s/%%(file_name)s' % instance.project.pk
    return rsr_image_path(instance, file_name, path)


class ProjectUpdate(TimestampsMixin, models.Model):
    UPDATE_METHODS = (
        ('W', _(u'web')),
        ('E', _(u'e-mail')),
        ('S', _(u'SMS')),
        ('M', _(u'mobile')),
    )

    project = models.ForeignKey('Project', related_name='project_updates',
                                verbose_name=_(u'project'))
    user = models.ForeignKey(settings.AUTH_USER_MODEL, verbose_name=_(u'user'))
    title = ValidXMLCharField(_(u'title'), max_length=80, db_index=True,
                              help_text=_(u'80 characters'))
    text = ValidXMLTextField(_(u'text'), blank=True)
    language = ValidXMLCharField(max_length=2, choices=settings.LANGUAGES, default='en',
                                 help_text=_(u'The language of the update'))
    primary_location = models.ForeignKey('ProjectUpdateLocation', null=True, blank=True,
                                         on_delete=models.SET_NULL)
    photo = ImageField(_(u'photo'), blank=True, upload_to=image_path,
                       help_text=_(u'The image should have 4:3 height:width ratio for best '
                                   u'displaying result'))
    photo_caption = ValidXMLCharField(_(u'photo caption'), blank=True, max_length=75,
                                      help_text=_(u'75 characters'))
    photo_credit = ValidXMLCharField(_(u'photo credit'), blank=True, max_length=75,
                                     help_text=_(u'75 characters'))
    video = EmbedVideoField(_(u'video URL'), blank=True,
                            help_text=_(u'Supported providers: YouTube and Vimeo'))
    video_caption = ValidXMLCharField(_(u'video caption'), blank=True, max_length=75,
                                      help_text=_(u'75 characters'))
    video_credit = ValidXMLCharField(_(u'video credit'), blank=True, max_length=75,
                                     help_text=_(u'75 characters'))
    update_method = ValidXMLCharField(_(u'update method'), blank=True, max_length=1,
                                      choices=UPDATE_METHODS, db_index=True, default='W')
    user_agent = ValidXMLCharField(_(u'user agent'), blank=True, max_length=200, default='')
    uuid = ValidXMLCharField(_(u'uuid'), blank=True, max_length=40, default='', db_index=True,
                             help_text=_(u'Universally unique ID set by creating user agent'))
    notes = ValidXMLTextField(verbose_name=_(u"Notes and comments"), blank=True, default='')

    # Indicator updates
    indicator_period = models.ForeignKey('IndicatorPeriod', related_name='updates',
                                         verbose_name=_(u'indicator period'), blank=True, null=True)
    period_update = models.DecimalField(_(u'period update'), blank=True, null=True, max_digits=14,
                                        decimal_places=2)

    class Meta:
        app_label = 'rsr'
        get_latest_by = "created_at"
        verbose_name = _(u'project update')
        verbose_name_plural = _(u'project updates')
        ordering = ['-id', ]

    def save(self, *args, **kwargs):
        if self.indicator_period and self.period_update:
            if not self.pk:
                # Newly created update to indicator period.
                # Update the indicator period's actual value.
                self.indicator_period.actual_value = str(Decimal(self.period.actual_value) +
                                                         Decimal(self.period_update))
                self.indicator_period.save()
            else:
                # Update to already existing indicator period.
                # Check if values have been changed.
                orig_update = ProjectUpdate.objects.get(pk=self.pk)
                if orig_update.indicator_period != self.indicator_period:
                    # Indicator period has changed.
                    # Substract value from old period, and add new value to new period.
                    orig_update.indicator_period.actual_value = str(
                        Decimal(orig_update.indicator_period.actual_value) -
                        Decimal(orig_update.indicator_period.period_update)
                    )
                    orig_update.save()

                    self.indicator_period.actual_value = str(Decimal(self.period.actual_value) +
                                                             Decimal(self.period_update))
                    self.indicator_period.save()

                elif orig_update.period_update != self.period_update:
                    # Indicator value has changed.
                    # Substract old value from period, and add new value to it.
                    self.indicator_period.actual_value = str(Decimal(self.indicator_period.actual_value) -
                                                             Decimal(orig_update.period_update) +
                                                             Decimal(self.period_update))

        super(ProjectUpdate, self).save(*args, **kwargs)

    def img(self, value=''):
        try:
            return self.photo.thumbnail_tag
        except:
            return value
    img.allow_tags = True

    def edit_window_has_expired(self):
        """Determine whether or not update timeout window has expired.
        The timeout is controlled by settings.PROJECT_UPDATE_TIMEOUT and
        defaults to 30 minutes.
        """
        return (datetime.now() - self.created_at) > self.edit_timeout

    @property
    def expires_at(self):
        return to_gmt(self.created_at + self.edit_timeout)

    @property
    def edit_timeout(self):
        timeout_minutes = getattr(settings, 'PROJECT_UPDATE_TIMEOUT', 30)
        return timedelta(minutes=timeout_minutes)

    @property
    def edit_time_remaining(self):
        return self.edit_timeout - self.created_at

    @property
    def time_gmt(self):
        return to_gmt(self.created_at)

    @property
    def time_last_updated_gmt(self):
        return to_gmt(self.last_modified_at)

    @property
    def view_count(self):
        counter = ViewCounter.objects.get_for_object(self)
        return counter.count or 0

    @models.permalink
    def get_absolute_url(self):
        return 'update-main', (), {'project_id': self.project.pk, 'update_id': self.pk}

    def __unicode__(self):
        return _(u'Project update for %(project_name)s') % {'project_name': self.project.title}
