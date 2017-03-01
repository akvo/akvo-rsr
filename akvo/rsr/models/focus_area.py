# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.db import models
from django.utils.translation import ugettext_lazy as _

from sorl.thumbnail.fields import ImageField

from akvo.utils import rsr_image_path

from ..fields import ValidXMLCharField, ValidXMLTextField

from .project import Project


def image_path(instance, file_name):
    return rsr_image_path(instance, file_name, 'db/focus_area/%(file_name)s')


class FocusArea(models.Model):
    name = ValidXMLCharField(
        _(u'focus area name'), max_length=50,
        help_text=_(
            u'The name of the focus area. This will show as the title of the focus area project '
            u'listing page. (30 characters).'
        )
    )
    slug = models.SlugField(
        _(u'slug'), max_length=50, db_index=True,
        help_text=_(
            u'Enter the "slug" i.e. a short word or hyphenated-words. This will be used in the '
            u'URL of the focus area project listing page. (20 characters, only lower case letters, '
            u'numbers, hyphen and underscore allowed.).'
        )
    )
    description = ValidXMLTextField(
        _(u'description'), max_length=500,
        help_text=_(u'Enter the text that will appear on the focus area project listing page. '
                    u'(500 characters).')
    )
    image = ImageField(_(u'focus area image'),
                       upload_to=image_path,
                       help_text=_(u'The image that will appear on the focus area project '
                                   u'listing page.'),
                       )
    link_to = models.URLField(
        _(u'accordion link'),
        max_length=200,
        blank=True,
        help_text=_(
            _(u'Where the link in the accordion for the focus area points if other than the '
              u'focus area project listing.')
        )
    )

    @models.permalink
    def get_absolute_url(self):
        return ('project-directory', ())

    def projects(self):
        'return all projects that "belong" to the FA through the Categories it links to'
        return Project.objects.filter(categories__in=self.categories.all())

    def __unicode__(self):
        return self.name

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'focus area')
        verbose_name_plural = _(u'focus areas')
        ordering = ['name', ]
