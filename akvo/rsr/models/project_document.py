# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.db import models
from django.utils.translation import ugettext_lazy as _

from ..fields import ValidXMLCharField
from ..iati.codelists import codelists_v104 as codelists


class ProjectDocument(models.Model):
    project = models.ForeignKey('Project', related_name='documents', verbose_name=_(u'project'))
    url = models.URLField(_(u'url'))
    format = ValidXMLCharField(_(u'format'), max_length=75, blank=True)
    title = ValidXMLCharField(_(u'title'), max_length=100, blank=True)
    title_language = ValidXMLCharField(_(u'title language'), max_length=2, blank=True, choices=codelists.LANGUAGE)
    category = ValidXMLCharField(
        _(u'title language'),
        max_length=3, blank=True, choices=[codelist[:2] for codelist in codelists.DOCUMENT_CATEGORY]
    )
    language = ValidXMLCharField(_(u'language'), max_length=2, blank=True, choices=codelists.LANGUAGE)

    def __unicode__(self):
        return self.title

    def show_link(self):
        return u'<a href="%s">%s</a>' % (self.url, self.title,)

    def iati_category(self):
        return dict([codelist[:2] for codelist in codelists.DOCUMENT_CATEGORY])[self.category]

    def iati_language(self):
        return dict(codelists.LANGUAGE)[self.language]

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'project document')
        verbose_name_plural = _(u'project documents')
        ordering = ['-id', ]

