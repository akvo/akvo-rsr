# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import ugettext_lazy as _

from ..fields import ValidXMLCharField

from akvo.codelists.models import Country, DocumentCategory, Language
from akvo.codelists.store.codelists_v202 import COUNTRY, DOCUMENT_CATEGORY, FILE_FORMAT, LANGUAGE
from akvo.utils import codelist_choices, codelist_value


def document_path(self, filename):
    return 'db/org/%s/document/%s' % (str(self.organisation.pk), filename)


class OrganisationDocument(models.Model):
    organisation = models.ForeignKey(
        'Organisation', related_name='documents', verbose_name=_(u'organisation')
    )
    url = models.URLField(
        _(u'document url'), blank=True,
        help_text=_(u'Enter the online location of your document. The URL should start with '
                    u'\'http://\' or \'https://\'.')
    )
    document = models.FileField(
        _(u'document'), blank=True, upload_to=document_path,
        help_text=_(u'You can upload a document to your organisation. These documents will be '
                    u'stored on the RSR server and will be publicly available for users to '
                    u'download and view to gain further insight in the organisation.')
    )
    format = ValidXMLCharField(
        _(u'document format'), max_length=75, blank=True, choices=codelist_choices(FILE_FORMAT),
        help_text=_(u'This provides the code for the Internet Media Type ("MIME type") of the '
                    u'document, and includes pdf, msword, rtf, xml, csv, etc.')
    )
    title = ValidXMLCharField(
        _(u'document title'), max_length=100, blank=True,
        help_text=_(u'Enter the title of your document.')
    )
    title_language = ValidXMLCharField(
        _(u'title language'), max_length=2, blank=True, choices=codelist_choices(LANGUAGE),
        help_text=_(u'Select the language of the document title.')
    )
    language = ValidXMLCharField(
        _(u'document language'), max_length=2, blank=True, choices=codelist_choices(LANGUAGE),
        help_text=_(u'Select the language that the document is written in.')
    )
    document_date = models.DateField(
        _(u'document date'), null=True, blank=True,
        help_text=_(u'Enter the date (DD/MM/YYYY) to be used for the production or publishing date '
                    u'of the relevant document to identify the specific document version.')
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

    def iati_language(self):
        return codelist_value(Language, self, 'language')

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'organisation document')
        verbose_name_plural = _(u'organisation documents')
        ordering = ['-id', ]


class OrganisationDocumentCategory(models.Model):
    document = models.ForeignKey(OrganisationDocument, related_name='categories',
                                 verbose_name=_(u'document'))
    category = ValidXMLCharField(_(u'document category'), max_length=3, blank=True,
                                 choices=codelist_choices(DOCUMENT_CATEGORY),
                                 help_text=_(u'The description of the type of content contained '
                                             u'within the document.'))

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'document category')
        verbose_name_plural = _(u'document categories')
        ordering = ['-id', ]

    def __unicode__(self):
        if self.category:
            try:
                return self.iati_category().name
            except AttributeError:
                return self.iati_category()
        else:
            return '%s' % _(u'No category specified')

    def iati_category(self):
        return codelist_value(DocumentCategory, self, 'category')


class OrganisationDocumentCountry(models.Model):
    document = models.ForeignKey(OrganisationDocument, related_name='countries',
                                 verbose_name=_(u'document'))
    country = ValidXMLCharField(
        _(u'recipient country'), blank=True, max_length=2, choices=codelist_choices(COUNTRY, show_code=False),
        help_text=_(u'This identifies the country which concerns the organisation document.')
    )
    text = ValidXMLCharField(
        _(u'description'), blank=True, max_length=100,
        help_text=_(u'Optionally enter a short description.')
    )

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'document country')
        verbose_name_plural = _(u'document countries')
        ordering = ['-id', ]

    def __unicode__(self):
        if self.country:
            try:
                return self.iati_country().name
            except AttributeError:
                return self.iati_country()
        else:
            return '%s' % _(u'No country specified')

    def iati_country(self):
        return codelist_value(Country, self, 'country')
