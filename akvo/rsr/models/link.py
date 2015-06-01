# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.db import models
from django.utils.translation import ugettext_lazy as _

from ..fields import ValidXMLCharField


class Link(models.Model):
    LINK_AKVOPEDIA = 'A'
    LINK_EXTRNAL = 'E'
    LINK_KINDS = (
        (LINK_AKVOPEDIA, _(u'Akvopedia entry')),
        (LINK_EXTRNAL, _(u'External link')),
    )

    kind = ValidXMLCharField(_(u'kind'), max_length=1, choices=LINK_KINDS, default='E')
    url = models.URLField(_(u'URL'), blank=True)
    caption = ValidXMLCharField(_(u'caption'), max_length=50, blank=True)
    project = models.ForeignKey('Project', verbose_name=_(u'project'), related_name='links')

    def __unicode__(self):
        return self.url

    def show_link(self):
        return u'<a href="%s">%s</a>' % (self.url, self.caption,)

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'link')
        verbose_name_plural = _(u'links')
