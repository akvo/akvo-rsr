# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.db import models
from django.utils.translation import ugettext_lazy as _

from ..fields import ValidXMLCharField

from akvo.codelists.models import ContactType
from akvo.codelists.store.codelists_v201 import CONTACT_TYPE
from akvo.utils import codelist_choices, codelist_value


class ProjectContact(models.Model):
    project = models.ForeignKey('Project', verbose_name=_(u'project'), related_name='contacts')
    type = ValidXMLCharField(_(u'type'), blank=True, max_length=1,
                             choices=codelist_choices(CONTACT_TYPE))
    person_name = ValidXMLCharField(
        _(u'name'), blank=True, max_length=100,
        help_text=_(u'This should be a contact person for the project. (100 characters)')
    )
    email = models.EmailField(
        _(u'email'), blank=True,
        help_text=_(u'This should be the email address for the contact person of the project.')
    )
    job_title = ValidXMLCharField(
        _(u'job title'), max_length=100, blank=True, help_text=_(u'Job title of the contact. '
                                                                 u'(100 characters)')
    )
    organisation = ValidXMLCharField(
        _(u'organisation'), blank=True, max_length=100,
        help_text=_(u'The organisation that the contact person works for - this may differ from '
                    u'the reporting organisation of the project. (100 characters)')
    )
    telephone = ValidXMLCharField(
        _(u'telephone'), blank=True, max_length=30,
        help_text=_(u'Contact number for the contact. (30 characters)'))
    mailing_address = ValidXMLCharField(
        _(u'address'), max_length=255, blank=True, help_text=_(u'Address of the contact. '
                                                               u'(255 characters)')
    )
    state = ValidXMLCharField(_(u'state'), blank=True, max_length=100,
                              help_text=_(u'(100 characters)'))
    country = models.ForeignKey('Country', blank=True, null=True, verbose_name=_(u'country'),
                                related_name='contacts')
    department = ValidXMLCharField(_(u'department'), blank=True, max_length=100,
                                   help_text=_(u'(100 characters)'))
    website = models.URLField(_(u'website'), blank=True)

    def iati_type(self):
        return codelist_value(ContactType, self, 'type')

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'contact')
        verbose_name_plural = _(u'contacts')

    def __unicode__(self):
        return self.person_name if self.person_name else _(u'No contact name specified')
