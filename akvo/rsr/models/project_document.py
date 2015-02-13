# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.db import models
from django.utils.translation import ugettext_lazy as _

from ..fields import ValidXMLCharField

from akvo.codelists.models import DocumentCategory, Language
from akvo.utils import codelist_choices, codelist_value


class ProjectDocument(models.Model):
    project = models.ForeignKey('Project', related_name='documents', verbose_name=_(u'project'))
    url = models.URLField(_(u'url'))
    format = ValidXMLCharField(_(u'format'), max_length=75, blank=True)
    title = ValidXMLCharField(_(u'title'), max_length=100, blank=True)
    title_language = ValidXMLCharField(_(u'title language'), max_length=2, blank=True,
                                       choices=codelist_choices(Language))
    category = ValidXMLCharField(_(u'title language'), max_length=3, blank=True,
                                 choices=codelist_choices(DocumentCategory))
    language = ValidXMLCharField(_(u'language'), max_length=2, blank=True, choices=codelist_choices(Language))

    def __unicode__(self):
        return self.title

    def show_link(self):
        return u'<a href="%s">%s</a>' % (self.url, self.title,)

    def iati_category(self):
        return codelist_value(DocumentCategory, self, 'category')

    def iati_language(self):
        return codelist_value(Language, self, 'language')

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'project document')
        verbose_name_plural = _(u'project documents')
        ordering = ['-id', ]

