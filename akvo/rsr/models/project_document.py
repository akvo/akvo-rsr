# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import ugettext_lazy as _

from ..fields import ValidXMLCharField

from akvo.codelists.models import DocumentCategory, Language
from akvo.utils import codelist_choices, codelist_value


def document_path(self, filename):
    return 'db/project/%s/document/%s' % (str(self.project.pk), filename)


class ProjectDocument(models.Model):
    project = models.ForeignKey('Project', related_name='documents', verbose_name=_(u'project'))
    url = models.URLField(
        _(u'url'), blank=True,
        help_text=_(u'You can indicate an URL of a document of the project. These documents will allow users to '
                    u'download and view to gain further insight in the project activities.')
    )
    document = models.FileField(
        _(u'document'), blank=True, upload_to=document_path,
        help_text=_(u'You can upload a document to your project. To upload multiple documents, press the \'Add '
                    u'another Project Document\' link.<br>'
                    u'These documents will be stored on the RSR server and will be '
                    u'publicly available for users to download and view to gain further insight in the project '
                    u'activities.')
    )
    format = ValidXMLCharField(
        _(u'format'), max_length=75, blank=True,
        help_text=_(u'Indicate the IATI format code of the document. <a '
                    u'href="http://iatistandard.org/codelists/FileFormat/" target="_blank">Full list of IATI '
                    u'format codes</a>')
    )
    title = ValidXMLCharField(
        _(u'title'), max_length=100, blank=True, help_text=_(u'Indicate the document title. (100 characters)')
    )
    title_language = ValidXMLCharField(
        _(u'title language'), max_length=2, blank=True, choices=codelist_choices(Language),
        help_text=_(u'Select the language of the document title.')
    )
    category = ValidXMLCharField(
        _(u'category'), max_length=3, blank=True,
        choices=codelist_choices(DocumentCategory),
        help_text=_(u'Select a document category.')
    )
    language = ValidXMLCharField(
        _(u'language'), max_length=2, blank=True, choices=codelist_choices(Language),
        help_text=_(u'Select the language that the document is written in.')
    )

    def __unicode__(self):
        return self.title

    def clean(self):
        # Check if the user has at least uploaded a document or indicated an URL.
        if not (self.url or self.document):
            raise ValidationError(u'It is required to upload a document or indicate an URL.')

        # Check for non-unicode characters
        if self.document:
            self.document.name = self.document.name.encode('ascii','ignore')

    def show_link(self):
        title = self.title if self.title else u'Untitled document'
        if self.url:
            return u'<a href="%s">%s</a>' % (self.url, title,)
        else:
            return u'<a href="%s">%s</a>' % (self.document.url, title,)

    def iati_category(self):
        return codelist_value(DocumentCategory, self, 'category')

    def iati_language(self):
        return codelist_value(Language, self, 'language')

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'project document')
        verbose_name_plural = _(u'project documents')
        ordering = ['-id', ]

