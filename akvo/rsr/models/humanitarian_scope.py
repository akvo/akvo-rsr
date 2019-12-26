# -*- coding: utf-8 -*-

# Akvo Reporting is covered by the GNU Affero General Public License.
# See more details in the license.txt file located at the root folder of the Akvo RSR module.
# For additional details on the GNU license please see < http://www.gnu.org/licenses/agpl.html >.

from akvo.rsr.fields import ValidXMLCharField
from akvo.codelists.models import HumanitarianScopeType, HumanitarianScopeVocabulary
from akvo.codelists.store.default_codelists import (HUMANITARIAN_SCOPE_TYPE,
                                                    HUMANITARIAN_SCOPE_VOCABULARY)
from akvo.utils import codelist_choices, codelist_value

from django.db import models
from django.utils.translation import ugettext_lazy as _


class HumanitarianScope(models.Model):
    project = models.ForeignKey('Project', verbose_name=_('project'),
                                related_name='humanitarian_scopes')
    code = ValidXMLCharField(
        _('humanitarian scope code'), blank=True, max_length=25,
        help_text=_('A code for the event or action from the vocabulary specified. More '
                    'information on the vocabularies can be found here: '
                    '<a href="http://glidenumber.net/glide/public/search/search.jsp" '
                    'target="_blank">Glide</a> and '
                    '<a href="http://fts.unocha.org/docs/IATICodelist_HS2-1.csv" '
                    'target="_blank">Humanitarian plan</a>.'))
    type = ValidXMLCharField(
        _('humanitarian scope type'), blank=True, max_length=1,
        choices=codelist_choices(HUMANITARIAN_SCOPE_TYPE),
        help_text=_('The type of event or action being classified. See the '
                    '<a href="http://iatistandard.org/202/codelists/HumanitarianScopeType/" '
                    'target="_blank">IATI codelist</a>.'))
    vocabulary = ValidXMLCharField(
        _('humanitarian scope vocabulary'), blank=True, max_length=3,
        choices=codelist_choices(HUMANITARIAN_SCOPE_VOCABULARY),
        help_text=_('A recognised vocabulary of terms classifying the event or action. See the '
                    '<a href="http://iatistandard.org/202/codelists/HumanitarianScopeVocabulary/" '
                    'target="_blank">IATI codelist</a>.'))
    vocabulary_uri = ValidXMLCharField(
        _('humanitarian scope vocabulary URI'), blank=True, max_length=1000,
        help_text=_('If the vocabulary is 99 (reporting organisation), the URI where this '
                    'internal vocabulary is defined.'))
    text = ValidXMLCharField(_('humanitarian scope description'), blank=True, max_length=1000,
                             help_text=_('Optionally enter a description.'))

    class Meta:
        app_label = 'rsr'
        verbose_name = _('humanitarian scope')
        verbose_name_plural = _('humanitarian scopes')
        ordering = ('pk',)

    def __unicode__(self):
        if self.text:
            return self.text
        elif self.code:
            return self.code
        else:
            return ''

    def iati_type(self):
        return codelist_value(HumanitarianScopeType, self, 'type')

    def iati_type_unicode(self):
        return str(self.iati_type())

    def iati_vocabulary(self):
        return codelist_value(HumanitarianScopeVocabulary, self, 'vocabulary')

    def iati_vocabulary_unicode(self):
        return str(self.iati_vocabulary())
