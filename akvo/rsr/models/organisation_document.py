# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import ugettext_lazy as _

from ..fields import ValidXMLCharField

from akvo.codelists.models import Country, DocumentCategory, Language
from akvo.codelists.store.default_codelists import COUNTRY, DOCUMENT_CATEGORY, FILE_FORMAT, LANGUAGE
from akvo.utils import codelist_choices, codelist_value


def document_path(self, filename):
    return 'db/org/%s/document/%s' % (str(self.organisation.pk), filename)


class OrganisationDocument(models.Model):
    organisation = models.ForeignKey(
        'Organisation', related_name='documents', verbose_name=_('organisation')
    )
    url = models.URLField(
        _('document url'), blank=True,
        help_text=_('Enter the online location of your document. The URL should start with '
                    '\'http://\' or \'https://\'.')
    )
    document = models.FileField(
        _('document'), blank=True, upload_to=document_path,
        help_text=_('You can upload a document to your organisation. These documents will be '
                    'stored on the RSR server and will be publicly available for users to '
                    'download and view to gain further insight in the organisation.')
    )
    format = ValidXMLCharField(
        _('document format'), max_length=75, blank=True, choices=codelist_choices(FILE_FORMAT),
        help_text=_('This provides the code for the Internet Media Type ("MIME type") of the '
                    'document, and includes pdf, msword, rtf, xml, csv, etc.')
    )
    title = ValidXMLCharField(
        _('document title'), max_length=100, blank=True,
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

    def __unicode__(self):
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

    def show_link(self):
        title = self.title if self.title else '%s' % _('Untitled document')
        if self.url:
            return '<a href="%s">%s</a>' % (self.url, title,)
        elif self.document:
            return '<a href="%s">%s</a>' % (self.document.url, title,)
        else:
            return title

    def iati_language(self):
        return codelist_value(Language, self, 'language')

    def iati_language_unicode(self):
        return str(self.iati_language())

    class Meta:
        app_label = 'rsr'
        verbose_name = _('organisation document')
        verbose_name_plural = _('organisation documents')
        ordering = ['-id', ]


class OrganisationDocumentCategory(models.Model):
    document = models.ForeignKey(OrganisationDocument, related_name='categories',
                                 verbose_name=_('document'))
    category = ValidXMLCharField(_('document category'), max_length=3, blank=True,
                                 choices=codelist_choices(DOCUMENT_CATEGORY),
                                 help_text=_('The description of the type of content contained '
                                             'within the document.'))

    class Meta:
        app_label = 'rsr'
        verbose_name = _('document category')
        verbose_name_plural = _('document categories')
        ordering = ['-id', ]

    def __unicode__(self):
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


class OrganisationDocumentCountry(models.Model):
    document = models.ForeignKey(OrganisationDocument, related_name='countries',
                                 verbose_name=_('document'))
    country = ValidXMLCharField(
        _('recipient country'), blank=True, max_length=2, choices=codelist_choices(COUNTRY, show_code=False),
        help_text=_('This identifies the country which concerns the organisation document.')
    )
    text = ValidXMLCharField(
        _('description'), blank=True, max_length=100,
        help_text=_('Optionally enter a short description.')
    )

    class Meta:
        app_label = 'rsr'
        verbose_name = _('document country')
        verbose_name_plural = _('document countries')
        ordering = ['-id', ]

    def __unicode__(self):
        if self.country:
            try:
                return self.iati_country().name
            except AttributeError:
                return self.iati_country()
        else:
            return '%s' % _('No country specified')

    def iati_country(self):
        return codelist_value(Country, self, 'country')

    def iati_country_unicode(self):
        return str(self.iati_country())
