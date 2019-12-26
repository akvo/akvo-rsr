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
        (LINK_AKVOPEDIA, _('Akvopedia entry')),
        (LINK_EXTRNAL, _('External link')),
    )

    kind = ValidXMLCharField(_('kind'), max_length=1, choices=LINK_KINDS, default='E')
    url = models.URLField(
        _('link url'),
        help_text=_('Enter the link to an external website you wish to redirect to from your '
                    'project page. The URL should start with \'http://\' or \'https://\'.')
    )
    caption = ValidXMLCharField(
        _('link caption'), max_length=50, blank=True, help_text=_('Enter a name for the link.')
    )
    project = models.ForeignKey('Project', verbose_name=_('project'), related_name='links')

    def __str__(self):
        if self.url and self.caption:
            return self.show_link()
        elif self.caption:
            return self.caption
        else:
            return '%s' % _('No link specified')

    def show_link(self):
        caption = (
            self.caption
            if self.caption else
            (self.url if len(self.url) < 30 else self.url[:27] + '...')
        )
        return '<a href="%s" target="_blank">%s</a>' % (self.url, caption,)

    class Meta:
        app_label = 'rsr'
        verbose_name = _('link')
        verbose_name_plural = _('links')
        ordering = ('pk',)
