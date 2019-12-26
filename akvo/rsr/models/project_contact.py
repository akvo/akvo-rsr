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
    project = models.ForeignKey('Project', verbose_name=_('project'), related_name='contacts')
    type = ValidXMLCharField(
        _('contact type'), blank=True, max_length=1, choices=codelist_choices(CONTACT_TYPE),
        help_text=_('What types of enquiries this contact person is best-placed to handle.')
    )
    person_name = ValidXMLCharField(
        _('contact name'), blank=True, max_length=100,
        help_text=_('Please enter the name of the contact person for this project.')
    )
    email = models.EmailField(_('contact email'), blank=True)
    job_title = ValidXMLCharField(
        _('job title'), max_length=100, blank=True,
        help_text=_('Job title of the contact person.')
    )
    organisation = ValidXMLCharField(
        _('contact organisation'), blank=True, max_length=100,
        help_text=_('The organisation that the contact person works for.')
    )
    telephone = ValidXMLCharField(
        _('contact phone number'), blank=True, max_length=30,
        help_text=_('Contact number for the contact person. Avoid giving personal contact '
                    'details.')
    )
    mailing_address = ValidXMLCharField(
        _('contact address'), max_length=255, blank=True,
        help_text=_('Address of the contact person. Avoid giving personal contact details.')
    )
    state = ValidXMLCharField(_('state'), blank=True, max_length=100,
                              help_text=_('(100 characters)'))
    country = models.ForeignKey('Country', blank=True, null=True, verbose_name=_('country'),
                                related_name='contacts')
    department = ValidXMLCharField(_('department'), blank=True, max_length=100)
    website = models.URLField(
        _('contact website'), blank=True,
        help_text=_('The contact web address, if available. The web address should start with '
                    '\'http://\' or \'https://\'.')
    )

    def iati_type(self):
        return codelist_value(ContactType, self, 'type')

    def iati_type_unicode(self):
        return str(self.iati_type())

    class Meta:
        app_label = 'rsr'
        verbose_name = _('contact')
        verbose_name_plural = _('contacts')
        ordering = ('id',)

    def __str__(self):
        return self.person_name if self.person_name else '%s' % _('No contact name specified')
