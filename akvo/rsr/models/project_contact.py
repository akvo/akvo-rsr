# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.db import models
from django.utils.translation import ugettext_lazy as _

from ..fields import ValidXMLCharField

from akvo.codelists.models import ContactType
from akvo.codelists.store.default_codelists import CONTACT_TYPE
from akvo.utils import codelist_choices, codelist_value


class ProjectContact(models.Model):
    project = models.ForeignKey('Project', verbose_name=_(u'project'), related_name='contacts')
    type = ValidXMLCharField(
        _(u'contact type'), blank=True, max_length=1, choices=codelist_choices(CONTACT_TYPE),
        help_text=_(u'What types of enquiries this contact person is best-placed to handle.')
    )
    person_name = ValidXMLCharField(
        _(u'contact name'), blank=True, max_length=100,
        help_text=_(u'Please enter the name of the contact person for this project.')
    )
    email = models.EmailField(_(u'contact email'), blank=True)
    job_title = ValidXMLCharField(
        _(u'job title'), max_length=100, blank=True,
        help_text=_(u'Job title of the contact person.')
    )
    organisation = ValidXMLCharField(
        _(u'contact organisation'), blank=True, max_length=100,
        help_text=_(u'The organisation that the contact person works for.')
    )
    telephone = ValidXMLCharField(
        _(u'contact phone number'), blank=True, max_length=30,
        help_text=_(u'Contact number for the contact person. Avoid giving personal contact '
                    u'details.')
    )
    mailing_address = ValidXMLCharField(
        _(u'contact address'), max_length=255, blank=True,
        help_text=_(u'Address of the contact person. Avoid giving personal contact details.')
    )
    state = ValidXMLCharField(_(u'state'), blank=True, max_length=100,
                              help_text=_(u'(100 characters)'))
    country = models.ForeignKey('Country', blank=True, null=True, verbose_name=_(u'country'),
                                related_name='contacts')
    department = ValidXMLCharField(_(u'department'), blank=True, max_length=100)
    website = models.URLField(
        _(u'contact website'), blank=True,
        help_text=_(u'The contact web address, if available. The web address should start with '
                    u'\'http://\' or \'https://\'.')
    )

    def iati_type(self):
        return codelist_value(ContactType, self, 'type')

    def iati_type_unicode(self):
        return str(self.iati_type())

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'contact')
        verbose_name_plural = _(u'contacts')
        ordering = ('id',)

    def __unicode__(self):
        return self.person_name if self.person_name else u'%s' % _(u'No contact name specified')
