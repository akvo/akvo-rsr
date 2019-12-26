# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

import datetime

from django.conf import settings
from django.db import models
from django.utils.translation import ugettext_lazy as _
from embed_video.fields import EmbedVideoField
from sorl.thumbnail.fields import ImageField

from akvo.utils import rsr_image_path, to_gmt
from ..fields import ValidXMLCharField, ValidXMLTextField
from ..mixins import TimestampsMixin


def image_path(instance, file_name):
    """Create a path like 'db/project/<update.project.id>/update/<update.id>/image_name.ext'"""
    path = 'db/project/%d/update/%%(instance_pk)s/%%(file_name)s' % instance.project.pk
    return rsr_image_path(instance, file_name, path)


class ProjectUpdate(TimestampsMixin, models.Model):
    UPDATE_METHODS = (
        ('W', _('web')),
        ('E', _('e-mail')),
        ('S', _('SMS')),
        ('M', _('mobile')),
    )

    project = models.ForeignKey('Project', related_name='project_updates',
                                verbose_name=_('project'))
    user = models.ForeignKey(settings.AUTH_USER_MODEL, verbose_name=_('user'))
    title = ValidXMLCharField(_('title'), max_length=80, db_index=True,
                              help_text=_('80 characters'))
    text = ValidXMLTextField(_('text'), blank=True)
    language = ValidXMLCharField(max_length=2, choices=settings.LANGUAGES, default='en',
                                 help_text=_('The language of the update'))
    event_date = models.DateField(help_text=_('The date of the corresponding event'),
                                  verbose_name=_('event date'),
                                  default=datetime.date.today,
                                  blank=True,
                                  db_index=True)
    primary_location = models.ForeignKey('ProjectUpdateLocation', null=True, blank=True,
                                         on_delete=models.SET_NULL)
    photo = ImageField(_('photo'), blank=True, upload_to=image_path,
                       help_text=_('The image should have 4:3 height:width ratio for best '
                                   'displaying result'))
    photo_caption = ValidXMLCharField(_('photo caption'), blank=True, max_length=75,
                                      help_text=_('75 characters'))
    photo_credit = ValidXMLCharField(_('photo credit'), blank=True, max_length=75,
                                     help_text=_('75 characters'))
    video = EmbedVideoField(_('video URL'), blank=True,
                            help_text=_('Supported providers: YouTube and Vimeo'))
    video_caption = ValidXMLCharField(_('video caption'), blank=True, max_length=75,
                                      help_text=_('75 characters'))
    video_credit = ValidXMLCharField(_('video credit'), blank=True, max_length=75,
                                     help_text=_('75 characters'))
    update_method = ValidXMLCharField(_('update method'), blank=True, max_length=1,
                                      choices=UPDATE_METHODS, db_index=True, default='W')
    user_agent = ValidXMLCharField(_('user agent'), blank=True, max_length=200, default='')
    uuid = ValidXMLCharField(_('uuid'), blank=True, max_length=40, default='', db_index=True,
                             help_text=_('Universally unique ID set by creating user agent'))
    notes = ValidXMLTextField(verbose_name=_("Notes and comments"), blank=True, default='')

    class Meta:
        app_label = 'rsr'
        get_latest_by = 'event_date'
        verbose_name = _('project update')
        verbose_name_plural = _('project updates')
        ordering = ['-event_date', '-id']

    def img(self, value=''):
        try:
            return self.photo.thumbnail_tag
        except Exception:
            return value
    img.allow_tags = True

    @property
    def time_gmt(self):
        return to_gmt(self.created_at)

    @property
    def time_last_updated_gmt(self):
        return to_gmt(self.last_modified_at)

    @models.permalink
    def get_absolute_url(self):
        return 'update-main', (), {'project_id': self.project_id, 'update_id': self.pk}

    @property
    def edited(self):
        """Edited status for an update.

        An update is considered as edited only if it was edited after 1 minute
        of posting it.

        """
        return (self.last_modified_at - self.created_at).total_seconds() > 60

    def __unicode__(self):
        return _('Project update for %(project_name)s') % {'project_name': self.project.title}
