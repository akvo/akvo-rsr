# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import ugettext_lazy as _

from ..fields import ValidXMLCharField

from akvo.codelists.models import DocumentCategory, FileFormat, Language
from akvo.codelists.store.default_codelists import DOCUMENT_CATEGORY, FILE_FORMAT, LANGUAGE
from akvo.utils import codelist_choices, codelist_value


def document_path(self, filename):
    return 'db/project/%s/document/%s' % (str(self.project.pk), filename)


class ProjectDocument(models.Model):
    project = models.ForeignKey('Project', related_name='documents', verbose_name=_('project'))
    url = models.URLField(
        _('document url'), blank=True,
        help_text=_('Enter the online location of your document. The URL should start with '
                    '\'http://\' or \'https://\'.')
    )
    document = models.FileField(
        _('document'), blank=True, upload_to=document_path,
        help_text=_('You can upload a document to your project. To upload multiple documents, '
                    'press the \'Add another document\' link.<br>'
                    'These documents will be stored on the RSR server and will be '
                    'publicly available for users to download and view to gain further insight in '
                    'the project activities.')
    )
    format = ValidXMLCharField(
        _('document format'), max_length=75, blank=True, choices=codelist_choices(FILE_FORMAT),
        help_text=_('This provides the code for the Internet Media Type ("MIME type") of the '
                    'document, and includes pdf, msword, rtf, xml, csv, etc. For a list of '
                    'commonly used MIME types, visit this link: '
                    '<a href="http://www.sitepoint.com/web-foundations/mime-types-summary-list/" '
                    'target="_blank">http://www.sitepoint.com/web-foundations/'
                    'mime-types-summary-list/</a>.')
    )
    title = ValidXMLCharField(
        _('document title'), max_length=100, blank=True, default=_('Untitled document'),
        help_text=_('Enter the title of your document.')
    )
    title_language = ValidXMLCharField(
        _('title language'), max_length=2, blank=True, choices=codelist_choices(LANGUAGE),
        help_text=_('Select the language of the document title.')
    )
    language = ValidXMLCharField(
        _('document language'), max_length=2, blank=True, choices=codelist_choices(LANGUAGE),
        help_text=_('Select the language that the document is written in.')
    )
    document_date = models.DateField(
        _('document date'), null=True, blank=True,
        help_text=_('Enter the date (DD/MM/YYYY) to be used for the production or publishing date '
                    'of the relevant document to identify the specific document version.')
    )

    def __str__(self):
        return self.show_link()

    def clean(self):
        # Check if the user has at least uploaded a document or indicated an URL.
        if not (self.url or self.document or self.title):
            raise ValidationError(
                _('It is required to have at least a title, an uploaded document or indicate an '
                  'URL.')
            )

        # Check for non-unicode characters
        if self.document:
            self.document.name = self.document.name.encode('ascii', 'ignore')

    def document_show_link(self):
        if self.document:
            return '<a href="{0}">{1}</a>'.format(self.document.url, self.document.url)
        return ''

    def show_link(self):
        title = self.title if self.title else '%s' % _('Untitled document')
        if self.url:
            return '<a href="{0}">{1}</a>'.format(self.url, title)
        elif self.document:
            return '<a href="{0}">{1}</a>'.format(self.document.url, title)
        else:
            return title

    def iati_format(self):
        return codelist_value(FileFormat, self, 'format')

    def iati_format_unicode(self):
        return str(self.iati_format())

    def iati_language(self):
        return codelist_value(Language, self, 'language')

    def iati_language_unicode(self):
        return str(self.iati_language())

    def iati_title_language(self):
        return codelist_value(Language, self, 'title_language')

    def iati_title_language_unicode(self):
        return str(self.iati_title_language())

    class Meta:
        app_label = 'rsr'
        verbose_name = _('project document')
        verbose_name_plural = _('project documents')
        ordering = ['-id', ]


class ProjectDocumentCategory(models.Model):
    document = models.ForeignKey(ProjectDocument, related_name='categories',
                                 verbose_name=_('document'))
    category = ValidXMLCharField(_('document category'), max_length=3, blank=True,
                                 choices=codelist_choices(DOCUMENT_CATEGORY),
                                 help_text=_('The description of the type of content contained '
                                             'within the document.'))

    class Meta:
        app_label = 'rsr'
        verbose_name = _('project document category')
        verbose_name_plural = _('project document categories')
        ordering = ['-id', ]

    def __str__(self):
        if self.category:
            try:
                return self.iati_category().name
            except AttributeError:
                return self.iati_category()
        else:
            return '%s' % _('No category specified')

    def iati_category(self):
        return codelist_value(DocumentCategory, self, 'category')

    def iati_category_unicode(self):
        return str(self.iati_category())
