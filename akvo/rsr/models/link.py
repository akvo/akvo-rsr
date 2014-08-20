# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.db import models
from django.utils.translation import ugettext_lazy as _

from akvo.rsr.fields import ValidXMLCharField
from akvo.rsr.iati.codelists import codelists_v104 as codelists


class Link(models.Model):
    LINK_AKVOPEDIA = 'A'
    LINK_EXTRNAL = 'E'
    LINK_KINDS = (
        (LINK_AKVOPEDIA, _(u'Akvopedia entry')),
        (LINK_EXTRNAL, _(u'External link')),
    )

    kind = ValidXMLCharField(_(u'kind'), max_length=1, choices=LINK_KINDS)
    url = models.URLField(_(u'URL'))
    caption = ValidXMLCharField(_(u'caption'), max_length=50)
    project = models.ForeignKey('Project', verbose_name=u'project', related_name='links')

    # Extra IATI fields
    credit = ValidXMLCharField(_(u'credit'), blank=True, max_length=50, help_text=_(u'(max 50 characters)'))
    format = ValidXMLCharField(
        _(u'format'), max_length=100, blank=True, choices=[[x, x] for (x, y) in codelists.FILE_FORMAT]
    )
    category = ValidXMLCharField(
        _(u'category'), max_length=3, blank=True, choices=[code[:2] for code in codelists.DOCUMENT_CATEGORY]
    )
    language = ValidXMLCharField(_(u'language'), max_length=2, blank=True, choices=codelists.LANGUAGE)

    def __unicode__(self):
        return self.url

    def show_link(self):
        return u'<a href="%s">%s</a>' % (self.url, self.caption,)

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'link')
        verbose_name_plural = _(u'links')