# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.



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
        return 'update-main', (), {'project_id': self.project_id, 'update_id': self.pk}

    def __unicode__(self):
        return _(u'Project update for %(project_name)s') % {'project_name': self.project.title}
