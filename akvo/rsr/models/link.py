# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.db import models
from django.utils.translation import ugettext_lazy as _

from ..fields import ValidXMLCharField
from ..iati.codelists import codelists_v104 as codelists


class Link(models.Model):
    LINK_AKVOPEDIA = 'A'
    LINK_EXTERNAL = 'E'
    LINK_KINDS = (
        (LINK_AKVOPEDIA, _(u'Akvopedia entry')),
        (LINK_EXTERNAL, _(u'External link')),
    )

    def document_path(self, filename):
        return 'db/project/%s/document/%s' % (str(self.project.pk), filename)

    project = models.ForeignKey('Project', verbose_name=u'project', related_name='links')
    url = models.URLField(_(u'URL'), blank=True)
    document = models.FileField(_(u'document'), blank=True, upload_to=document_path)
    language = ValidXMLCharField(_(u'language'), max_length=2, blank=True, choices=codelists.LANGUAGE)
    title = ValidXMLCharField(_(u'title'), max_length=100, blank=True)
    title_language = ValidXMLCharField(_(u'title language'), max_length=2, blank=True, choices=codelists.LANGUAGE)
    format = ValidXMLCharField(_(u'format'), max_length=75, blank=True)
    category = ValidXMLCharField(
        _(u'category'),
        max_length=3, blank=True, choices=[codelist[:2] for codelist in codelists.DOCUMENT_CATEGORY]
    )

    # RSR specific
    kind = ValidXMLCharField(_(u'kind'), max_length=1, choices=LINK_KINDS, default=LINK_EXTERNAL)

    def __unicode__(self):
        return self.url

    def show_link(self):
        return u'<a href="%s">%s</a>' % (self.url, self.title,)

    def iati_category(self):
        return dict([codelist[:2] for codelist in codelists.DOCUMENT_CATEGORY])[self.category] if self.category else ""

    def iati_language(self):
        return dict(codelists.LANGUAGE)[self.language] if self.language else ""

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'link')
        verbose_name_plural = _(u'links')
        ordering = ['project', '-id', ]
