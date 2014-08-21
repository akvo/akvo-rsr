# -*- coding: utf-8 -*-

# Akvo RSR is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.


from django.db import models
from django.utils.translation import ugettext_lazy as _

from ..fields import ValidXMLCharField
from ..iati.codelists import codelists_v104 as codelists


class ProjectContact(models.Model):
    project = models.ForeignKey('Project', verbose_name=u'project', related_name='contacts')
    type = ValidXMLCharField(_(u'type'), blank=True, max_length=1, choices=codelists.CONTACT_TYPE)
    person_name = ValidXMLCharField(_(u'name'), blank=True, max_length=100, help_text=_('(100 characters)'))
    email = models.EmailField(_(u'email'), blank=True)
    job_title = ValidXMLCharField(_(u'job title'), max_length=100, blank=True, help_text=_('(100 characters)'))
    mailing_address = ValidXMLCharField(
        _(u'mailing address'), max_length=255, blank=True, help_text=_('(255 characters).')
    )
    state = ValidXMLCharField(_(u'state'), blank=True, max_length=100, help_text=_('(100 characters)'))
    country = models.ForeignKey('Country', blank=True, null=True, verbose_name=u'country', related_name='contacts')
    organisation = ValidXMLCharField(_(u'organisation'), blank=True, max_length=100, help_text=_('(100 characters)'))
    telephone = ValidXMLCharField(_(u'telephone'), blank=True, max_length=15)
    website = models.URLField(_(u'website'), blank=True)

    class Meta:
        app_label = 'rsr'
        verbose_name = _(u'contact')
        verbose_name_plural = _(u'contacts')
