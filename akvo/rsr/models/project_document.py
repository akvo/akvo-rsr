# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import ugettext_lazy as _

from ..fields import ValidXMLCharField

from akvo.codelists.models import DocumentCategory, Language
from akvo.codelists.store.codelists_v201 import DOCUMENT_CATEGORY, FILE_FORMAT, LANGUAGE
from akvo.utils import codelist_choices, codelist_value


def document_path(self, filename):
    return 'db/project/%s/document/%s' % (str(self.project.pk), filename)


class ProjectDocument(models.Model):
    project = models.ForeignKey('Project', related_name='documents', verbose_name=_(u'project'))
    url = models.URLField(
        _(u'document url'), blank=True,
        help_text=_(u'Enter the online location of your document. The URL should start with '
                    u'\'http://\' or \'https://\'.')
    )
    document = models.FileField(
        _(u'document'), blank=True, upload_to=document_path,
        help_text=_(u'You can upload a document to your project. To upload multiple documents, '
                    u'press the \'Add another document\' link.<br>'
                    u'These documents will be stored on the RSR server and will be '
                    u'publicly available for users to download and view to gain further insight in '
                    u'the project activities.')
    )
    format = ValidXMLCharField(
        _(u'document format'), max_length=75, blank=True, choices=codelist_choices(FILE_FORMAT),
        help_text=_(u'This provides the code for the Internet Media Type ("MIME type") of the '
                    u'document, and includes pdf, msword, rtf, xml, csv, etc. For a list of '
                    u'commonly used MIME types, visit this link: '
                    u'<a href="http://www.sitepoint.com/web-foundations/mime-types-summary-list/" '
                    u'target="_blank">http://www.sitepoint.com/web-foundations/'
                    u'mime-types-summary-list/</a>.')
    )
    title = ValidXMLCharField(
        _(u'document title'), max_length=100, blank=True,
        help_text=_(u'Enter the title of your document.')
    )
    title_language = ValidXMLCharField(
        _(u'title language'), max_length=2, blank=True, choices=codelist_choices(LANGUAGE),
        help_text=_(u'Select the language of the document title.')
    )
    category = ValidXMLCharField(
        _(u'document category'), max_length=3, blank=True,
        choices=codelist_choices(DOCUMENT_CATEGORY),
        help_text=_(u'The description of the type of content contained within the document.')
    )
    language = ValidXMLCharField(
        _(u'document language'), max_length=2, blank=True, choices=codelist_choices(LANGUAGE),
        help_text=_(u'Select the language that the document is written in.')
    )

    def __unicode__(self):
        return self.show_link()

    def clean(self):
        # Check if the user has at least uploaded a document or indicated an URL.
        if not (self.url or self.document or self.title):
            raise ValidationError(
                _(u'It is required to have at least a title, an uploaded document or indicate an '
                  u'URL.')
            )

        # Check for non-unicode characters
        if self.document:
            self.document.name = self.document.name.encode('ascii','ignore')

    def show_link(self):
        title = self.title if self.title else u'%s' % _(u'Untitled document')
        if self.url:
            return u'<a href="%s">%s</a>' % (self.url, title,)
        elif self.document:
            return u'<a href="%s">%s</a>' % (self.document.url, title,)
        else:
            return title

    def iati_category(self):
        return codelist_value(DocumentCategory, self, 'category')

    def iati_language(self):
        return codelist_value(Language, self, 'language')

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'project document')
        verbose_name_plural = _(u'project documents')
        ordering = ['-id', ]

