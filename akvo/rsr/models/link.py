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
    url = models.URLField(
        _(u'link url'), blank=True,
        help_text=_(u'Enter the link to an external website you wish to redirect to from your '
                    u'project page. The URL should start with \'http://\' or \'https://\'.')
    )
    caption = ValidXMLCharField(
        _(u'link caption'), max_length=50, blank=True, help_text=_(u'Enter a name for the link.')
    )
    project = models.ForeignKey('Project', verbose_name=_(u'project'), related_name='links')

    def __unicode__(self):
        if self.url and self.caption:
            return self.show_link()
        elif self.caption:
            return self.caption
        else:
            return u'%s' % _(u'No link specified')

    def show_link(self):
        caption = (
            self.caption
            if self.caption else
            (self.url if len(self.url) < 30 else self.url[:27] + '...')
        )
        return u'<a href="%s" target="_blank">%s</a>' % (self.url, caption,)

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'link')
        verbose_name_plural = _(u'links')
