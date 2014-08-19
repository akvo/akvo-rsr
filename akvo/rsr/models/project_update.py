# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


import oembed

from datetime import datetime, timedelta

from django.conf import settings
from django.contrib.auth.models import User
from django.db import models
from django.utils.safestring import mark_safe
from django.utils.translation import ugettext_lazy as _

from django_counter.models import ViewCounter

from sorl.thumbnail.fields import ImageWithThumbnailsField

from akvo.rsr.fields import ValidXMLCharField, ValidXMLTextField
from akvo.rsr.mixins import TimestampsMixin
from akvo.utils import rsr_image_path, to_gmt

from .models_utils import UPDATE_METHODS


class ProjectUpdate(TimestampsMixin, models.Model):
    def image_path(instance, file_name):
        "Create a path like 'db/project/<update.project.id>/update/<update.id>/image_name.ext'"
        path = 'db/project/%d/update/%%(instance_pk)s/%%(file_name)s' % instance.project.pk
        return rsr_image_path(instance, file_name, path)

    project = models.ForeignKey('Project', related_name='project_updates', verbose_name=_(u'project'))
    user = models.ForeignKey(User, verbose_name=_(u'user'))
    title = ValidXMLCharField(_(u'title'), max_length=50, db_index=True, help_text=_(u'50 characters'))
    text = ValidXMLTextField(_(u'text'), blank=True)
    language = ValidXMLCharField(max_length=2, choices=settings.LANGUAGES, default='en', help_text=u'The language of the update')
    primary_location = models.ForeignKey('ProjectUpdateLocation', null=True, blank=True, on_delete=models.SET_NULL)
    photo = ImageWithThumbnailsField(
        _(u'photo'),
        blank=True,
        upload_to=image_path,
        thumbnail={'size': (300, 225), 'options': ('autocrop', 'sharpen', )},
        help_text=_(u'The image should have 4:3 height:width ratio for best displaying result'),
    )
    photo_caption = ValidXMLCharField(_(u'photo caption'), blank=True, max_length=75, help_text=_(u'75 characters'))
    photo_credit = ValidXMLCharField(_(u'photo credit'), blank=True, max_length=25, help_text=_(u'25 characters'))
    video = models.URLField(_(u'video URL'), blank=True, help_text=_(u'Supported providers: Blip, Vimeo, YouTube'))
    video_caption = ValidXMLCharField(_(u'video caption'), blank=True, max_length=75, help_text=_(u'75 characters'))
    video_credit = ValidXMLCharField(_(u'video credit'), blank=True, max_length=25, help_text=_(u'25 characters'))
    update_method = ValidXMLCharField(_(u'update method'), blank=True, max_length=1, choices=UPDATE_METHODS, db_index=True, default='W')
    user_agent = ValidXMLCharField(_(u'user agent'), blank=True, max_length=200, default='')
    uuid = ValidXMLCharField(_(u'uuid'), blank=True, max_length=40, default='', db_index=True,
        help_text=_(u'Universally unique ID set by creating user agent'))
    
    notes = ValidXMLTextField(verbose_name=_("Notes and comments"), blank=True, default='')

    class Meta:
        app_label = 'rsr'
        get_latest_by = "created_at"
        verbose_name = _(u'project update')
        verbose_name_plural = _(u'project updates')
        ordering = ['-id', ]

    def img(self, value=''):
        try:
            return self.photo.thumbnail_tag
        except:
            return value
    img.allow_tags = True

    def get_video_thumbnail_url(self, url=''):
        if self.video:
            try:
                data = oembed.site.embed(self.video).get_data()
                url = data.get('thumbnail_url', '')
            except:
                pass
        return url

    def get_video_oembed(self, html=''):
        """Render OEmbed HTML for the given video URL.
        This is to workaround a but between Django 1.4 and djangoembed template tags.
        A full solution is required."""
        if self.video:
            try:
                data = oembed.site.embed(self.video).get_data()
                html = data.get('html', '')
                # Add 'rel=0' to the video link for not showing related Youtube videos
                if "youtube" in html:
                    html = html.replace("feature=oembed", "feature=oembed&rel=0")
            except:
                pass
        return mark_safe(html)

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
        return ('update_main', (), {'project_id': self.project.pk, 'update_id': self.pk})

    def __unicode__(self):
        return u'Project update for %(project_name)s' % {'project_name': self.project.title}
